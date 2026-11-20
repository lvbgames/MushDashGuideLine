#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CHANNEL_KEYS,
  WEBHOOK_ENV_BY_CHANNEL,
  buildMediaPublication,
  buildUpdatePublication,
  buildUpdateSample,
  classifyPublication,
  contentHash,
  createDiscordPayload,
  formatDate,
  isExternalMediaItem,
  maskWebhookSecrets,
  sortOldestFirst,
  webhookRequestUrl
} from './discord-format.mjs';
import { loadNewsItems, repositoryRoot } from './news-source.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const statePath = path.join(scriptDirectory, 'discord-publications.json');

function parseArguments(argv) {
  const result = { send: false, channel: 'media', channelProvided: false, approveUpdates: false, output: undefined };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--send') {
      result.send = true;
    } else if (argument === '--approve-updates') {
      result.approveUpdates = true;
    } else if (argument === '--channel') {
      result.channel = argv[++index];
      result.channelProvided = true;
    } else if (argument === '--output') {
      result.output = argv[++index];
    } else if (argument === '--help') {
      result.help = true;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  if (!CHANNEL_KEYS.includes(result.channel)) {
    throw new Error(`--channel must be one of: ${CHANNEL_KEYS.join(', ')}`);
  }
  if (result.send && !result.channelProvided) {
    throw new Error('--send requires one explicit --channel target.');
  }
  if (result.approveUpdates && !result.send) {
    throw new Error('--approve-updates is only valid together with --send.');
  }
  return result;
}

async function loadState() {
  const parsed = JSON.parse(await fs.readFile(statePath, 'utf8'));
  if (parsed?.version !== 1 || !Array.isArray(parsed.publications)) {
    throw new Error('Invalid Discord publication state file.');
  }
  for (const entry of parsed.publications) {
    if (!entry.contentId || !CHANNEL_KEYS.includes(entry.channel) || !entry.messageId || !entry.contentHash || !entry.publishedAt) {
      throw new Error('Discord publication state contains an invalid entry.');
    }
  }
  return parsed;
}

async function saveState(state) {
  const temporaryPath = `${statePath}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
  await fs.rename(temporaryPath, statePath);
}

function selectQueue(newsItems, channel) {
  if (channel === 'media') {
    return sortOldestFirst(newsItems.filter(isExternalMediaItem)).map(buildMediaPublication);
  }
  return sortOldestFirst(newsItems.filter((item) => item.type === 'internal' && item.discordChannel === channel)).map(
    buildUpdatePublication
  );
}

function findSample(newsItems, game) {
  const item = newsItems.find((candidate) => candidate.type === 'internal' && candidate.game === game);
  if (!item) {
    throw new Error(`No current internal ${game} article is available for the sample.`);
  }
  return buildUpdateSample(item, game === 'mushhero' ? 'mushhero_updates' : 'mushdash_updates');
}

function renderPublication(publication, classification, index) {
  const embed = createDiscordPayload(publication).embeds[0];
  const fields = embed.fields.map((field) => `  - ${field.name}: ${field.value}`).join('\n');
  return [
    `### ${String(index + 1).padStart(2, '0')} · ${classification.status}`,
    '',
    `- contentId: \`${publication.contentId}\``,
    `- channel: \`${publication.channel}\``,
    `- date: ${formatDate(publication.date)}`,
    `- title: ${embed.title}`,
    `- description: ${embed.description}`,
    `- source: ${publication.source}`,
    `- category: ${publication.category}`,
    `- URL: ${embed.url}`,
    `- thumbnail: ${embed.thumbnail.url}`,
    `- contentHash: \`${classification.hash}\``,
    '- fields:',
    fields,
    '- allowed_mentions: `{"parse":[]}`'
  ].join('\n');
}

function renderDryRun(queue, state, newsItems, channel) {
  const externalCount = newsItems.filter(isExternalMediaItem).length;
  const internalItems = newsItems.filter((item) => item.type === 'internal');
  const lines = [
    '# Discord Publisher Dry Run',
    '',
    '> DRY RUN — Discord API requests: 0. Webhook environment variables were not read.',
    '',
    `- selected channel: \`${channel}\``,
    `- current News items: ${newsItems.length}`,
    `- external media items: ${externalCount}`,
    `- internal items excluded from media: ${internalItems.length}`,
    `- selected queue items: ${queue.length}`,
    '- queue order: oldest → newest',
    '',
    '## Selected queue',
    ''
  ];
  if (queue.length === 0) {
    lines.push('_No explicitly approved content is queued for this channel._');
  } else {
    queue.forEach((publication, index) => {
      lines.push(renderPublication(publication, classifyPublication(publication, state), index), '');
    });
  }

  lines.push('## Internal content excluded from media', '');
  for (const item of internalItems) {
    lines.push(`- \`${item.slug}\` — ${item.localizedTitle.en} (${item.kind})`);
  }

  lines.push('', '## Update templates — SAMPLE ONLY / NOT FOR SEND', '');
  const samples = [findSample(newsItems, 'mushhero'), findSample(newsItems, 'mushdash')];
  samples.forEach((sample, index) => {
    lines.push(renderPublication(sample, { status: 'SAMPLE ONLY / NOT FOR SEND', hash: contentHash(sample) }, index), '');
  });
  lines.push('_Samples are never added to publication state._', '');
  return `${lines.join('\n')}\n`;
}

function outputPathForReview(value) {
  const resolved = path.resolve(repositoryRoot, value);
  const approvedRoots = [
    path.join(repositoryRoot, 'references', 'reviews'),
    path.join(repositoryRoot, '.tmp-verification')
  ];
  if (!approvedRoots.some((root) => resolved.startsWith(`${root}${path.sep}`))) {
    throw new Error('--output must be inside references/reviews or .tmp-verification.');
  }
  return resolved;
}

function retryDelay(response, bodyText) {
  const header = response.headers.get('retry-after');
  const parsedHeader = Number(header);
  if (Number.isFinite(parsedHeader) && parsedHeader >= 0) {
    return parsedHeader * 1000;
  }
  try {
    const parsedBody = JSON.parse(bodyText);
    const seconds = Number(parsedBody.retry_after);
    return Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : undefined;
  } catch {
    return undefined;
  }
}

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function requestDiscord({ webhookUrl, messageId, payload, method, maximumAttempts = 3 }) {
  const requestUrl = webhookRequestUrl(webhookUrl, { messageId });
  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    let response;
    try {
      response = await fetch(requestUrl, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'error'
      });
    } catch (error) {
      if (attempt === maximumAttempts) {
        throw new Error(`Discord network request failed after ${attempt} attempts: ${maskWebhookSecrets(error.message)}`);
      }
      await sleep(500 * 2 ** (attempt - 1));
      continue;
    }

    const bodyText = await response.text();
    if (response.ok) {
      let message;
      try {
        message = JSON.parse(bodyText);
      } catch {
        throw new Error(`Discord returned HTTP ${response.status} without a valid message response.`);
      }
      if (!/^\d+$/.test(message.id ?? '')) {
        throw new Error(`Discord returned HTTP ${response.status} without a valid message ID.`);
      }
      return { messageId: message.id, httpStatus: response.status };
    }

    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === maximumAttempts) {
      throw new Error(`Discord request failed with HTTP ${response.status}; no publication state was written.`);
    }
    const delay = response.status === 429 ? retryDelay(response, bodyText) : 500 * 2 ** (attempt - 1);
    if (!Number.isFinite(delay) || delay < 0 || delay > 120000) {
      throw new Error(`Discord returned HTTP ${response.status} with an unsafe or missing retry delay.`);
    }
    await sleep(delay);
  }
  throw new Error('Discord request exhausted the bounded retry policy.');
}

function upsertState(state, publication, classification, messageId) {
  const record = {
    contentId: publication.contentId,
    channel: publication.channel,
    messageId,
    contentHash: classification.hash,
    publishedAt: classification.existing?.publishedAt ?? new Date().toISOString()
  };
  const index = state.publications.findIndex(
    (entry) => entry.contentId === publication.contentId && entry.channel === publication.channel
  );
  if (index === -1) {
    state.publications.push(record);
  } else {
    state.publications[index] = record;
  }
}

async function sendQueue(queue, state, channel, approveUpdates) {
  const updateCandidates = queue
    .map((publication) => ({ publication, classification: classifyPublication(publication, state) }))
    .filter(({ classification }) => classification.status === 'UPDATE CANDIDATE');
  if (updateCandidates.length > 0 && !approveUpdates) {
    throw new Error('UPDATE CANDIDATE items require the separate --approve-updates flag before any request is sent.');
  }

  const environmentName = WEBHOOK_ENV_BY_CHANNEL.get(channel);
  const webhookUrl = process.env[environmentName];
  if (!webhookUrl) {
    throw new Error(`Actual send requires the ${environmentName} environment variable.`);
  }

  for (const [queueIndex, publication] of queue.entries()) {
    const classification = classifyPublication(publication, state);
    if (classification.status === 'SKIP') {
      console.log(`[SKIP] ${publication.channel} ${publication.contentId}`);
      continue;
    }
    const isUpdate = classification.status === 'UPDATE CANDIDATE';
    const result = await requestDiscord({
      webhookUrl,
      messageId: isUpdate ? classification.existing.messageId : undefined,
      payload: createDiscordPayload(publication),
      method: isUpdate ? 'PATCH' : 'POST'
    });
    upsertState(state, publication, classification, result.messageId);
    await saveState(state);
    console.log(`[${classification.status}] ${publication.channel} ${publication.contentId} HTTP ${result.httpStatus} message ${result.messageId}`);
    if (queueIndex < queue.length - 1) {
      await sleep(500);
    }
  }
}

function printHelp() {
  console.log('Dry run: node scripts/discord/publish-discord.mjs [--channel media] [--output references/reviews/file.md]');
  console.log('Send one channel: node scripts/discord/publish-discord.mjs --send --channel <channel>');
  console.log('Approved edits only: add --approve-updates after reviewing UPDATE CANDIDATE items.');
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }
  const [newsItems, state] = await Promise.all([loadNewsItems(), loadState()]);
  const queue = selectQueue(newsItems, options.channel);
  if (!options.send) {
    const report = renderDryRun(queue, state, newsItems, options.channel);
    if (options.output) {
      const outputPath = outputPathForReview(options.output);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, report, 'utf8');
      console.log(`Dry-run report written: ${path.relative(repositoryRoot, outputPath)}`);
    } else {
      process.stdout.write(report);
    }
    return;
  }
  await sendQueue(queue, state, options.channel, options.approveUpdates);
}

main().catch((error) => {
  console.error(maskWebhookSecrets(error instanceof Error ? error.message : String(error)));
  process.exitCode = 1;
});
