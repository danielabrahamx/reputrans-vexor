# Security Re-Audit - Vexor ZK Portfolio Platform

**Date:** 2026-04-15
**Auditor:** Claude Opus 4.6 (automated re-audit)
**Scope:** Verify all 15 original vulnerabilities are fixed; check for new issues introduced by fixes.

---

## Original Vulnerability Status

| VULN | Status | File(s) | Finding |
|------|--------|---------|---------|
| 01 | PASS | `src/middleware.ts` | Middleware exists, matches `/api/:path*`, validates session cookies (client + admin) via HMAC, returns 401 if unauthenticated. |
| 02 | PASS | `src/app/api/portfolios/route.ts` | Only POST and GET exported. No PATCH, PUT, or DELETE endpoints exist. |
| 03 | PASS | `src/app/api/verify/route.ts` | `checkRateLimit` called (10 req/60s per IP). `getVerifyBackend()` caches the Barretenberg WASM instance across requests with retry-on-failure. |
| 04 | PASS | `src/app/api/portfolios/route.ts` | `grades.length !== 100 \|\| publicInputs.length !== 100` check present at line 28. Rejects with 400. |
| 05 | PASS | `src/app/api/auth/route.ts` | `checkRateLimit("auth:${ip}", 5, 60)` called before PIN validation. Returns 429 with Retry-After header. |
| 06 | PASS | `src/middleware.ts` | Matcher is `/api/:path*` - all API routes including GET `/api/portfolios` require auth. Only `/api/auth` is exempted. |
| 07 | PASS | `src/app/api/portfolios/route.ts` | SHA-256 hash of proof computed, checked via `redis.sismember("proof:hashes", proofHash)`. Duplicate proofs rejected with 409. New hashes stored via `redis.sadd`. |
| 08 | PASS | `src/app/api/verify/route.ts` | `UUID_REGEX` defined as RFC 4122 v4 pattern. `portfolioId` validated against it when provided. Invalid format returns 400. |
| 09 | PASS | `src/app/api/portfolios/route.ts` | `rawFilename.replace(/<[^>]*>/g, "").slice(0, 255)` applied. Type-checked with fallback to `"unknown"`. |
| 10 | PASS | `portfolios/route.ts` + `verify/route.ts` | Both routes validate: `typeof proof === "string"`, `Array.isArray(grades)`, `Array.isArray(publicInputs)`, hex regex `/^[0-9a-f]+$/i`, grade values against `VALID_GRADES` set, publicInputs integers 0-5. |
| 11 | PASS | `PinGate.tsx` + `auth/route.ts` | No `sessionStorage` usage in code (only in comments referencing old approach). Auth sets httpOnly, secure, sameSite=strict cookies. PinGate checks auth state via server GET call. |
| 12 | PASS | `src/app/api/portfolios/route.ts` | `proof.length > 100000` check at line 36. Rejects oversized proofs with 400. |
| 13 | PASS | `src/app/api/auth/route.ts` | `timingSafeEqual` imported from `crypto`. `timingSafeCompare` pads both inputs to 64 bytes before comparison, preventing timing side-channel. |
| 14 | PASS | `next.config.ts` | Security headers configured: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, X-DNS-Prefetch-Control on, HSTS max-age=31536000 with includeSubDomains. |
| 15 | PASS | `src/lib/client-store.ts` | `MAX_PORTFOLIOS = 50` defined. `saveClientPortfolio` uses `existing.slice(0, MAX_PORTFOLIOS)` to cap storage. |

**Result: 15/15 PASS**

---

## New Vulnerability Analysis

### session.ts HMAC Implementation

- **Verdict: ACCEPTABLE with caveats**
- HMAC-SHA256 via Web Crypto API is correct and Edge-compatible.
- Constant-time comparison implemented manually via XOR loop - correct approach.
- **Caveat 1:** Default secret `"vexor-dev-secret-change-in-production"` is a weak fallback. If `SESSION_SECRET` env var is unset in production, sessions are trivially forgeable. Recommend: throw at startup if `SESSION_SECRET` is missing in production.
- **Caveat 2:** Token format `portal:exp:sig` exposes expiry in plaintext. Not a vulnerability (HMAC protects integrity), but an opaque token format would be marginally better.

### rate-limit.ts Redis Failure Handling

- **Verdict: ACCEPTABLE (fail-open by design)**
- The catch block returns `{ allowed: true }` on Redis failure - this is a deliberate fail-open design.
- Correct for availability: a Redis outage should not lock all users out.
- Acceptable trade-off given this is a PIN-gated internal tool, not a public API.

### Middleware Auth Exemption

- **Verdict: PASS**
- Only exact path `/api/auth` is exempted (line 9). No regex, no prefix match.
- Cannot be bypassed with trailing slashes or query strings because Next.js normalizes paths before middleware runs.

### Missing Validation Paths

- **Verdict: NO GAPS FOUND**
- All API inputs are validated before use.
- `portfolioId` in verify route is optional but validated when present.
- `metadata.rowCount` is capped at 10000 in portfolios route.
- Grade-to-publicInput consistency is verified (provenGrades vs submittedGrades loop).

---

## New Findings (Non-Original)

| ID | Severity | Finding |
|----|----------|---------|
| NEW-01 | MEDIUM | `session.ts` line 4: fallback secret `"vexor-dev-secret-change-in-production"` means sessions are forgeable if `SESSION_SECRET` env var is missing in production. Add a startup guard. |
| NEW-02 | LOW | `verify/route.ts` line 35: IP extraction from `x-forwarded-for` trusts the first value. On Vercel this is fine (they set it), but behind other proxies this header can be spoofed. Not actionable for current deployment target. |
| NEW-03 | LOW | `portfolios/route.ts` line 105: `redis.ltrim("portfolio:index", 0, 99)` caps stored portfolios at 100, but proof hashes in the `proof:hashes` set grow without bound. Consider TTL or periodic cleanup. |
| NEW-04 | INFO | No Content-Security-Policy header in `next.config.ts`. Recommend adding CSP to block inline scripts and reduce XSS surface. |

---

## Overall Verdict

**ALL 15 ORIGINAL VULNERABILITIES: FIXED AND VERIFIED.**

3 new low/medium findings identified (NEW-01 through NEW-03). One informational recommendation (NEW-04). None are critical. The codebase is in a significantly stronger security posture than pre-audit.

Priority action: fix NEW-01 (guard against missing SESSION_SECRET in production).
