# Vexor ZK Portfolio Grading

Zero-knowledge proof platform for GDPR-compliant borrower risk grading. Debt collectors share verified letter grades with Vexor - an AI debt collection company - without exposing raw credit bureau scores. Built on the **Trustless Credential Portability Protocol (TCPP)**.

Raw scores never leave the collector's browser. Only ZK-proven letter grades (AA through E) are transmitted. Vexor verifies the grades were computed correctly without ever seeing the underlying data.

## Quick Start

```bash
pnpm install
```

Create `.env.local`:

```env
CLIENT_PIN=your-collector-pin
ADMIN_PIN=your-admin-pin
REDIS_URL=redis://localhost:6379
SESSION_SECRET=your-random-secret
```

Run the dev server:

```bash
pnpm dev --turbopack
```

Run tests:

```bash
pnpm test
```

## How It Works

1. **Collector uploads CSV** - A CSV containing `bureau_score` values is loaded into the collector portal at `/client-uploads`.
2. **Browser generates ZK proof** - Scores are graded and proven inside the browser via WASM. Raw scores never leave the client.
3. **Proof and grades are submitted** - The hex-encoded proof, public inputs (grade values 0-5), and letter grades are sent to the `/api/portfolios` endpoint.
4. **Vexor verifies cryptographically** - The admin portal at `/admin` calls `/api/verify` which runs UltraPlonk verification against the Barretenberg backend.
5. **Grades drive AI strategy** - Verified grade distributions inform Vexor's AI collection agent behaviour.

## Grade Thresholds

The ZK circuit maps bureau scores to letter grades:

| Grade | Score Range | Circuit Value |
|-------|-------------|---------------|
| AA    | >= 900      | 5             |
| A     | 800 - 899   | 4             |
| B     | 650 - 799   | 3             |
| C     | 500 - 649   | 2             |
| D     | 300 - 499   | 1             |
| E     | < 300       | 0             |

Scores below the portfolio's actual row count are zero-padded to fill the 100-element circuit array. Sentinel entries (score 0, grade E) are filtered on the client before display.

## TCPP - Trustless Credential Portability Protocol

TCPP is the cryptographic framework enabling verified data exchange between debt collectors and Vexor without trust assumptions.

**Problem**: Sharing raw credit bureau scores between organisations violates GDPR, creates data processing liability, and exposes sensitive borrower information.

**Solution**: TCPP uses zero-knowledge proofs to:

- Grade borrowers locally in the collector's browser using a deterministic Noir circuit
- Generate a cryptographic proof (UltraPlonk over BN254) that the grading was computed correctly against the declared thresholds
- Allow Vexor to verify the proof without accessing the underlying scores
- Create an auditable, tamper-proof record of the data exchange via proof deduplication

This eliminates data processing agreements around raw scores, reduces GDPR exposure to near zero, and gives Vexor the risk granularity needed to optimise AI collection strategies.

## Architecture

```
circuits/
  batch_grade/src/main.nr        Noir circuit - 100 scores, ~5000 constraints

src/
  app/
    client-uploads/page.tsx      Collector portal (PIN-gated)
    admin/page.tsx               Vexor admin dashboard (PIN-gated)
    api/
      auth/route.ts              PIN authentication with rate limiting + httpOnly cookies
      portfolios/route.ts        Portfolio CRUD with input validation + proof dedup
      verify/route.ts            ZK proof verification with cached Barretenberg backend
  lib/
    session.ts                   HMAC-SHA256 session tokens (Edge + Node.js compatible)
    rate-limit.ts                Redis-based sliding window rate limiter
    redis.ts                     ioredis client (supports REDIS_URL and storage_REDIS_URL)
    prover.ts                    Browser-side WASM proving via noir_js + backend_barretenberg
    grades.ts                    Grade mapping, thresholds, distribution, sentinel filtering
    csv-parser.ts                CSV parsing with PapaParse
    types.ts                     Shared TypeScript interfaces
    client-store.ts              Client-side portfolio persistence (capped at 50)
  middleware.ts                  Auth middleware on all /api/* routes (except /api/auth)
```

**Stack**: Next.js 15.3, React 19, Tailwind CSS v4, TypeScript, Noir 0.36.0 (Barretenberg, BN254, UltraPlonk), ioredis, Vitest.

## API Reference

All endpoints except `/api/auth` require a valid session cookie (set via the auth endpoint). Unauthenticated requests receive `401`.

### POST /api/auth

Authenticate with a PIN and receive an httpOnly session cookie.

**Request:**

```json
{
  "pin": "string",
  "portal": "client" | "admin"
}
```

**Response (200):**

```json
{ "authenticated": true }
```

Sets an httpOnly cookie (`vexor_session_client` or `vexor_session_admin`) valid for 24 hours.

**Rate limit:** 5 attempts per minute per IP. Returns `429` with `Retry-After` header when exceeded.

### GET /api/auth?portal=client|admin

Check whether the current session cookie is valid for a given portal.

**Response (200):**

```json
{ "authenticated": true | false }
```

### POST /api/portfolios

Submit a proved portfolio.

**Request:**

```json
{
  "grades": ["AA", "B", "C", ...],
  "proof": "hex-encoded proof string",
  "publicInputs": [5, 3, 2, ...],
  "metadata": {
    "filename": "portfolio.csv",
    "rowCount": 42
  }
}
```

**Validation rules:**
- `grades` and `publicInputs` must each be arrays of exactly 100 elements
- `proof` must be a hex string, max 100KB
- Grade values must be one of: AA, A, B, C, D, E
- `publicInputs` values must be integers 0-5
- Submitted grades must match the grades derived from `publicInputs`
- Duplicate proofs are rejected (SHA-256 dedup) with `409`

**Response (200):**

```json
{ "id": "uuid", "status": "pending_verification" }
```

### GET /api/portfolios

Retrieve the 20 most recent portfolios.

**Response (200):**

```json
[
  {
    "id": "uuid",
    "grades": ["AA", "B", ...],
    "proof": "hex",
    "publicInputs": [5, 3, ...],
    "metadata": { "filename": "...", "rowCount": 42, "uploadedAt": "ISO-8601" },
    "status": "pending_verification" | "verified" | "failed"
  }
]
```

### POST /api/verify

Verify a ZK proof using the Barretenberg backend. Optionally updates a portfolio's status.

**Request:**

```json
{
  "proof": "hex-encoded proof string",
  "publicInputs": [5, 3, 2, ...],
  "portfolioId": "uuid (optional)"
}
```

**Response (200):**

```json
{ "verified": true | false }
```

If `portfolioId` is provided and valid (UUIDv4 format), the portfolio's status in Redis is updated to `verified` or `failed`.

**Rate limit:** 10 requests per minute per IP. Returns `429` with `Retry-After` header when exceeded.

## Security Model

| Layer | Mechanism |
|-------|-----------|
| Authentication | PIN-gated portals with HMAC-SHA256 signed httpOnly session cookies |
| PIN comparison | Constant-time via `crypto.timingSafeEqual` (prevents timing side-channels) |
| Session tokens | HMAC-SHA256 with configurable `SESSION_SECRET` (random fallback in dev) |
| Rate limiting | Redis-based sliding window - 5 auth attempts/min, 10 verify requests/min per IP |
| Proof replay | SHA-256 hash deduplication rejects previously submitted proofs (`409`) |
| Input validation | Type checks, hex format validation, array length enforcement, value range checks |
| XSS prevention | Filename sanitisation strips HTML tags, capped at 255 characters |
| ID validation | UUID v4 regex on all portfolio ID parameters |
| API auth | Middleware on all `/api/*` routes (except `/api/auth`) checks session cookies |
| Security headers | X-Frame-Options, HSTS, content type options |
| Client storage | Portfolio cap at 50 entries in browser local storage |
| ZK privacy | Raw bureau scores never leave the browser - only proven grades are transmitted |

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `CLIENT_PIN` | Yes | PIN for the collector portal (`/client-uploads`) |
| `ADMIN_PIN` | Yes | PIN for the Vexor admin portal (`/admin`) |
| `REDIS_URL` | Yes | Redis connection string for portfolio storage and rate limiting |
| `storage_REDIS_URL` | No | Auto-injected by Vercel KV - used as fallback if `REDIS_URL` is unset |
| `SESSION_SECRET` | Recommended | HMAC signing key for session tokens. Falls back to a random value in development |

## Development

```bash
pnpm install          # Install dependencies
pnpm dev --turbopack  # Start dev server with Turbopack
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm test             # Run Vitest test suite
```

### Circuit

The Noir circuit lives at `circuits/batch_grade/src/main.nr`. It accepts 100 bureau scores as private inputs and asserts they map to 100 expected grade values (public inputs). The compiled circuit JSON is served from `public/circuits/batch_grade.json` for browser-side WASM proving.

### CSV Format

The collector portal expects a CSV with at minimum a `bureau_score` column. An optional `app_id` column is preserved in the UI. Rows beyond 100 are batched; rows under 100 are zero-padded.

## License

Proprietary. All rights reserved.
