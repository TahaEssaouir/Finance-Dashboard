/**
 * Get the base URL for API calls
 * - In browser: uses relative paths (empty string)
 * - On Vercel SSR: uses VERCEL_URL
 * - Locally: uses localhost:3000
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Browser context - use relative paths
    return "";
  }

  // Server context
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Local development
  return "http://localhost:3000";
}

/**
 * Construct full API URL
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${endpoint}`;
}

/**
 * Fetch with proper error handling and timeout
 */
export async function fetchWithTimeout(
  endpoint: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;
  const url = getApiUrl(endpoint);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
