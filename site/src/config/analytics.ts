const configuredEndpoint = import.meta.env.PUBLIC_ANALYTICS_ENDPOINT?.trim() ?? '';

function isValidAnalyticsEndpoint(value: string): boolean {
  if (!value) return false;

  try {
    const url = new URL(value);
    const isLocalDevelopment = import.meta.env.DEV
      && (url.hostname === 'localhost' || url.hostname === '127.0.0.1');
    return url.pathname === '/hit'
      && !url.search
      && !url.hash
      && (url.protocol === 'https:' || (isLocalDevelopment && url.protocol === 'http:'));
  } catch {
    return false;
  }
}

export const analyticsHitEndpoint = isValidAnalyticsEndpoint(configuredEndpoint)
  ? configuredEndpoint
  : null;
