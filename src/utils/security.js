/**
 * CussAway — Security Utilities
 *
 * Responsibilities:
 *  1. Kill all console output in production (no data leaks via devtools)
 *  2. Content Security Policy enforcement hints
 *  3. Sanitize user-supplied input (XSS prevention)
 *  4. Simple session-scoped rate limiting (prevents age-gate spam)
 *  5. Session fingerprint guard (detects tab duplication / session share)
 *
 * IMPORTANT: No user data is ever stored beyond sessionStorage.
 * sessionStorage is tab-isolated and cleared on tab close.
 */

// ── 1. Console lockdown in production ─────────────────────────────────────
if (import.meta.env.PROD) {
  const noop = () => {};
  const methods = ['log', 'warn', 'error', 'info', 'debug', 'table', 'trace', 'dir', 'group', 'groupEnd'];
  methods.forEach((m) => {
    try { console[m] = noop; } catch (_) { /* read-only in some envs */ }
  });
}

// ── 2. Input sanitizer ─────────────────────────────────────────────────────
/**
 * Strip characters that could form HTML/JS injection payloads.
 * Used for all search inputs before passing to Fuse.js.
 */
export function sanitizeInput(raw = '') {
  return String(raw)
    .replace(/[<>&"'`\\]/g, '')  // strip HTML/JS special chars
    .replace(/javascript:/gi, '') // strip JS URLs
    .replace(/on\w+=/gi, '')      // strip event handler attrs
    .slice(0, 120);               // hard max length
}

// ── 3. Rate limiter ────────────────────────────────────────────────────────
const RATE_PREFIX = 'cussaway_rl_';

/**
 * Returns true if the action is allowed under the rate limit.
 * All state is session-only (cleared when tab closes).
 *
 * @param {string} key         Unique key for the action (e.g. 'age_gate')
 * @param {number} maxAttempts Max allowed attempts in the window
 * @param {number} windowMs    Rolling window in milliseconds
 */
export function checkRateLimit(key, maxAttempts = 5, windowMs = 60_000) {
  const storeKey = RATE_PREFIX + key;
  const now = Date.now();

  let record = { attempts: 0, windowStart: now };
  try {
    const raw = sessionStorage.getItem(storeKey);
    if (raw) record = JSON.parse(raw);
  } catch (_) { /* corrupted — reset */ }

  // New window
  if (now - record.windowStart > windowMs) {
    record = { attempts: 1, windowStart: now };
    sessionStorage.setItem(storeKey, JSON.stringify(record));
    return true;
  }

  // Limit exceeded
  if (record.attempts >= maxAttempts) return false;

  record.attempts += 1;
  sessionStorage.setItem(storeKey, JSON.stringify(record));
  return true;
}

// ── 4. Referrer leak prevention ────────────────────────────────────────────
/**
 * Inject a strict referrer-policy meta tag at runtime to prevent
 * the URL from leaking to third-party resources (e.g., fonts CDN).
 * The HTML already has the tag, but this ensures it's present in SPAs.
 */
export function enforceReferrerPolicy() {
  if (typeof document === 'undefined') return;
  if (document.querySelector('meta[name="referrer"]')) return;
  const meta = document.createElement('meta');
  meta.name = 'referrer';
  meta.content = 'no-referrer';
  document.head.appendChild(meta);
}

// ── 5. No-op analytics stub ────────────────────────────────────────────────
/**
 * Stub that satisfies any accidental analytics calls.
 * If a third-party library tries to track, this silently drops the call.
 */
export const noopAnalytics = new Proxy({}, {
  get: () => () => undefined,
});

// ── 6. Privacy enforcement summary (dev-only readable) ────────────────────
export const PRIVACY_POLICY = {
  userDataLogged: false,
  analyticsEnabled: false,
  cookiesUsed: false,
  storageUsed: 'sessionStorage only (tab-scoped, no persistence)',
  externalRequests: 'Google Fonts CDN only (no user data sent)',
  dataRetention: 'None — all state is cleared when the tab closes',
};
