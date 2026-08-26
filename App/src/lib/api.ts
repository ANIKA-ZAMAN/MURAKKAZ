export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // In browser: use relative path so requests automatically go to https://murakkaz.com/api/...
    return '';
  }
  // Server-side / SSR:
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return raw.replace(/\/api\/?$/, '');
};
