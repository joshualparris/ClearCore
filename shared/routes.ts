import { z } from "zod";

// Minimal API contract since we are local-first.
// This file is required by the architecture but won't be heavily used for network requests.

export const api = {
  // We can add hydration/sync endpoints here in the future if a backend is added.
};

// Helper required by frontend
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
