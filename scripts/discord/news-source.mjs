import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
export const repositoryRoot = path.resolve(scriptsDirectory, '..', '..');
export const newsSourcePath = path.join(repositoryRoot, 'site', 'src', 'data', 'news.ts');

const requireFromSite = createRequire(path.join(repositoryRoot, 'site', 'package.json'));
const ts = requireFromSite('typescript');

function unwrapExpression(node) {
  let current = node;
  while (
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isParenthesizedExpression(current) ||
    ts.isTypeAssertionExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteralLike(node) || ts.isNumericLiteral(node)) {
    return node.text;
  }
  throw new Error(`Unsupported property name in ${newsSourcePath}.`);
}

function objectProperties(node) {
  const unwrapped = unwrapExpression(node);
  if (!ts.isObjectLiteralExpression(unwrapped)) {
    throw new Error(`Expected an object literal in ${newsSourcePath}.`);
  }

  const values = new Map();
  for (const property of unwrapped.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }
    values.set(propertyName(property.name), property.initializer);
  }
  return values;
}

function readString(properties, name, { optional = false } = {}) {
  const value = properties.get(name);
  if (!value && optional) {
    return undefined;
  }

  const unwrapped = value && unwrapExpression(value);
  if (!unwrapped || !ts.isStringLiteralLike(unwrapped)) {
    throw new Error(`News property "${name}" must be a string literal.`);
  }
  return unwrapped.text.normalize('NFC');
}

function readLocalized(properties, name) {
  const value = properties.get(name);
  if (!value) {
    throw new Error(`News property "${name}" is required.`);
  }
  const localized = objectProperties(value);
  return {
    en: readString(localized, 'en'),
    ko: readString(localized, 'ko'),
    ja: readString(localized, 'ja'),
    'zh-cn': readString(localized, 'zh-cn')
  };
}

function findNewsArray(sourceFile) {
  let newsArray;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'newsItems' && node.initializer) {
      const initializer = unwrapExpression(node.initializer);
      if (ts.isArrayLiteralExpression(initializer)) {
        newsArray = initializer;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  if (!newsArray) {
    throw new Error(`Could not find the newsItems array in ${newsSourcePath}.`);
  }
  return newsArray;
}

export async function loadNewsItems() {
  const sourceText = await fs.readFile(newsSourcePath, 'utf8');
  const sourceFile = ts.createSourceFile(newsSourcePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const newsArray = findNewsArray(sourceFile);
  const items = newsArray.elements.map((element) => {
    const properties = objectProperties(element);
    const type = readString(properties, 'type');
    const item = {
      type,
      slug: readString(properties, 'slug'),
      kind: readString(properties, 'kind'),
      localizedTitle: readLocalized(properties, 'localizedTitle'),
      localizedSummary: readLocalized(properties, 'localizedSummary'),
      publisher: readString(properties, 'publisher'),
      author: readString(properties, 'author', { optional: true }),
      publishedAt: readString(properties, 'publishedAt'),
      sourceUrl: readString(properties, 'sourceUrl', { optional: true }),
      game: readString(properties, 'game', { optional: true }),
      discordChannel: readString(properties, 'discordChannel', { optional: true }),
      version: readString(properties, 'version', { optional: true }),
      platform: readString(properties, 'platform', { optional: true })
    };

    if (type !== 'external' && type !== 'internal') {
      throw new Error(`Unsupported news type "${type}" for ${item.slug}.`);
    }
    if (type === 'external' && !item.sourceUrl) {
      throw new Error(`External news ${item.slug} is missing sourceUrl.`);
    }
    return item;
  });

  const slugs = new Set();
  for (const item of items) {
    if (slugs.has(item.slug)) {
      throw new Error(`Duplicate news slug: ${item.slug}`);
    }
    slugs.add(item.slug);
  }
  return items;
}
