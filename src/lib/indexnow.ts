/**
 * IndexNow Integration for FurTools
 * Instantly submits new and updated URLs to Bing, Yandex, Seznam, and Naver
 * via the IndexNow protocol.
 */

export const INDEXNOW_KEY = "e8f49a2b7c6d5e1f0a3b8c9d2e4f6a7b";
export const INDEXNOW_HOST = "www.furtools.com";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

export const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export async function submitToIndexNow(urls: string[]): Promise<{
  success: boolean;
  submittedCount: number;
  results: { endpoint: string; status: number; statusText: string }[];
}> {
  if (!urls || urls.length === 0) {
    return { success: false, submittedCount: 0, results: [] };
  }

  // Ensure full canonical URLs
  const formattedUrls = urls.map((u) =>
    u.startsWith("http") ? u : `https://${INDEXNOW_HOST}${u.startsWith("/") ? u : `/${u}`}`
  );

  const payload: IndexNowPayload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: formattedUrls,
  };

  const results = await Promise.all(
    INDEXNOW_ENDPOINTS.map(async (endpoint) => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(payload),
        });
        return {
          endpoint,
          status: res.status,
          statusText: res.status === 200 || res.status === 202 ? "Accepted" : res.statusText,
        };
      } catch (err: any) {
        return {
          endpoint,
          status: 500,
          statusText: err?.message || "Network Error",
        };
      }
    })
  );

  const hasSuccess = results.some((r) => r.status === 200 || r.status === 202);
  return {
    success: hasSuccess,
    submittedCount: formattedUrls.length,
    results,
  };
}
