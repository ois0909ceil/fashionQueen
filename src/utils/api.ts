export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const rawBase = (import.meta.env.VITE_API_BASE_URL ?? '').trim();

  if (!rawBase) {
    return normalizedPath;
  }

  try {
    const parsed = new URL(rawBase);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return normalizedPath;
    }
    const basePath = parsed.pathname.replace(/\/+$/, '');
    return `${parsed.origin}${basePath}${normalizedPath}`;
  } catch {
    return normalizedPath;
  }
}
