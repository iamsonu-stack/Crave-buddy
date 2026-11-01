// In development, Vite proxies /api requests to the Express server.
// For deployment, set VITE_API_URL to your backend origin in frontend/.env.
export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
