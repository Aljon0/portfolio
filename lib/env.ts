/** Used from browser code. Inlined at build time by Next.js. */
export const publicApiUrl: string =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/** Used from server-side code. Inside Docker this resolves to the backend service. */
export const serverApiUrl: string =
  process.env.INTERNAL_API_URL ?? publicApiUrl;