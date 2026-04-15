# Vexor ZK Portfolio Grading Platform - Security Audit

**Date:** 2026-04-15
**Auditor:** Automated penetration test (static analysis)
**Scope:** All API routes, CSV parser, ZK prover, auth, Redis storage, client components
**Severity Scale:** Critical / High / Medium / Low / Info

---

## Executive Summary

The platform has **3 Critical**, **3 High**, **4 Medium**, **2 Low**, and **3 Info** findings. The most dangerous issues are: all API endpoints are completely unauthenticated, the PATCH endpoint allows arbitrary status tampering, and the verify endpoint is a CPU-exhaustion DoS vector. The grade-proof binding check is sound but has an array length bypass. No XSS via dangerouslySetInnerHTML, but stored XSS via metadata filenames is possible if rendering context changes.

---

## Findings

### VULN-01: All API Endpoints Lack Authentication
**Severity:** Critical
**Endpoint:** POST /api/portfolios, GET /api/portfolios, PATCH /api/portfolios, POST /api/verify
**Evidence:**

- `src/app/api/portfolios/route.ts` lines 7-56 (POST), 59-84 (PATCH), 86-101 (GET) - no auth check
- `src/app/api/verify/route.ts` lines 5-33 - no auth check
- No `middleware.ts` exists anywhere in the project (confirmed via glob search)
- PINs only gate the React UI via `PinGate` component (`src/components/PinGate.tsx`), which stores auth state in `sessionStorage` (line 21)

**Exploit Scenario:**
Any attacker can directly call all API endpoints with curl. No PIN, no token, no session cookie is required:
```
curl -X GET https://vexor.example.com/api/portfolios
curl -X POST https://vexor.example.com/api/portfolios -H 'Content-Type: application/json' -d '{...}'
curl -X PATCH https://vexor.example.com/api/portfolios -H 'Content-Type: application/json' -d '{"id":"<uuid>","status":"verified"}'
```

**Recommended Fix:**
- Add Next.js middleware (`src/middleware.ts`) that validates a session token or JWT on all `/api/*` routes
- Replace PIN-only gate with server-side session management (e.g., iron-session or next-auth)
- At minimum, require a Bearer token header on API routes validated server-side

---

### VULN-02: PATCH Endpoint Allows Arbitrary Status Tampering
**Severity:** Critical
**Endpoint:** PATCH /api/portfolios
**Evidence:** `src/app/api/portfolios/route.ts` lines 59-84

```typescript
const { id, status } = await request.json();
if (!id || !status || !["verified", "failed"].includes(status)) {
  return NextResponse.json({ error: "Missing id or invalid status" }, { status: 400 });
}
// ... directly updates Redis
portfolio.status = status;
await redis.set(`portfolio:${id}`, JSON.stringify(portfolio));
```

**Exploit Scenario:**
An attacker can mark any portfolio as "verified" without ever running proof verification:
```
curl -X PATCH https://vexor.example.com/api/portfolios \
  -H 'Content-Type: application/json' \
  -d '{"id":"<any-portfolio-uuid>","status":"verified"}'
```
This completely bypasses ZK verification - the entire point of the platform. The admin UI will show the portfolio as "Verified" with a green badge.

**Recommended Fix:**
- Remove the PATCH endpoint entirely, or restrict it to only be callable after server-side proof verification
- Implement server-side verification flow: when admin clicks "Verify", the server should call the verify logic internally and set the status based on the result, never trusting the client to tell it the status
- If PATCH must exist, require admin authentication and audit logging

---

### VULN-03: Verify Endpoint CPU Exhaustion (DoS)
**Severity:** Critical
**Endpoint:** POST /api/verify
**Evidence:** `src/app/api/verify/route.ts` lines 5-33

```typescript
const backend = new BarretenbergBackend(circuit);  // CPU-intensive WASM instantiation
const verified = await backend.verifyProof(proofData);  // CPU-intensive verification
```

**Exploit Scenario:**
An attacker can repeatedly POST to `/api/verify` with random proof data. Each request:
1. Loads and parses the circuit JSON from disk (line 16)
2. Instantiates a BarretenbergBackend (heavy WASM) (line 18)
3. Attempts proof verification (CPU-bound) (line 25)

There is no rate limiting, no auth, no request queuing. A simple loop can exhaust server CPU:
```
for i in $(seq 1 100); do
  curl -X POST https://vexor.example.com/api/verify \
    -H 'Content-Type: application/json' \
    -d '{"proof":"deadbeef","publicInputs":[1,2,3]}' &
done
```

**Recommended Fix:**
- Add rate limiting (e.g., Vercel Edge rate limiter, or upstash/ratelimit with Redis)
- Queue verification requests with a concurrency limit of 1-2
- Cache the BarretenbergBackend instance instead of re-instantiating per request
- Require authentication before allowing verification

---

### VULN-04: Grade-Proof Binding Check Has Array Length Bypass
**Severity:** High
**Endpoint:** POST /api/portfolios
**Evidence:** `src/app/api/portfolios/route.ts` lines 17-27

```typescript
const provenGrades: GradeLetter[] = publicInputs.map((v: string | number) => numericToGrade(Number(v)));
const submittedGrades = grades as GradeLetter[];

for (let i = 0; i < provenGrades.length; i++) {
  if (provenGrades[i] !== submittedGrades[i]) {
    return NextResponse.json(
      { error: `Grade mismatch at index ${i}: submitted ${submittedGrades[i]} but proof shows ${provenGrades[i]}` },
      { status: 400 }
    );
  }
}
```

The loop iterates over `provenGrades.length` (derived from publicInputs), not `submittedGrades.length`. If an attacker sends:
- `publicInputs: []` (empty array) - the loop never executes, any grades array is accepted
- `publicInputs: [5]` with `grades: ["AA", "AA", "AA", ...]` - only index 0 is checked

**Exploit Scenario:**
```json
{
  "grades": ["AA","AA","AA","AA","AA"],
  "proof": "deadbeef",
  "publicInputs": [],
  "metadata": {"filename":"fake.csv"}
}
```
This passes all checks and stores a portfolio with fabricated grades. The proof is garbage but is stored as "pending_verification". Combined with VULN-02 (PATCH), the attacker can then mark it verified.

**Recommended Fix:**
- Validate that `grades.length === publicInputs.length`
- Validate that `publicInputs.length === 100` (matching CIRCUIT_SIZE)
- Validate that publicInputs values are integers in range 0-5
- Add a check: `if (grades.length !== publicInputs.length) return 400`

---

### VULN-05: No Rate Limiting on PIN Bruteforce
**Severity:** High
**Endpoint:** POST /api/auth
**Evidence:** `src/app/api/auth/route.ts` lines 8-21

```typescript
export async function POST(request: Request) {
  const { pin, portal } = await request.json();
  const authenticated = pin === PINS[portal];
  return NextResponse.json({ authenticated });
}
```

No rate limiting, no lockout, no delay, no CAPTCHA. PINs are 4-digit numeric (10,000 combinations).

**Exploit Scenario:**
```python
for pin in range(10000):
    r = requests.post(url, json={"pin": f"{pin:04d}", "portal": "admin"})
    if r.json()["authenticated"]:
        print(f"Admin PIN: {pin:04d}")
        break
```
At ~100 requests/second, full keyspace exhausted in ~100 seconds. Both client and admin PINs cracked trivially.

**Recommended Fix:**
- Add rate limiting: max 5 attempts per IP per minute
- Add exponential backoff after failed attempts
- Consider replacing 4-digit PINs with proper passwords or OAuth
- Add account lockout after N failed attempts
- Log failed auth attempts for monitoring

---

### VULN-06: Unauthenticated Data Leakage via GET /api/portfolios
**Severity:** High
**Endpoint:** GET /api/portfolios
**Evidence:** `src/app/api/portfolios/route.ts` lines 86-101

```typescript
export async function GET() {
  const redis = getRedis();
  const ids = await redis.lrange("portfolio:index", 0, 19);
  // ... returns full portfolio objects
  return NextResponse.json(portfolios);
}
```

Returns up to 20 full portfolio objects including: grades, full proof hex, publicInputs, metadata (filename, rowCount, uploadedAt), and status. No authentication required.

**Exploit Scenario:**
```
curl https://vexor.example.com/api/portfolios
```
Leaks all portfolio data to any anonymous user. The proof hex string, while not containing raw scores, reveals grade distributions and portfolio metadata. Filenames may contain client-identifying information.

**Recommended Fix:**
- Require authentication on GET endpoint
- Return different data depending on role (client sees only their own, admin sees all)
- Strip proof hex from list responses (return only on detail view)
- Add per-portfolio access controls

---

### VULN-07: Proof Replay - No Deduplication
**Severity:** Medium
**Endpoint:** POST /api/portfolios
**Evidence:** `src/app/api/portfolios/route.ts` lines 7-56

No check for duplicate proofs. The same proof+publicInputs combination can be submitted repeatedly, each time creating a new portfolio with a new UUID.

**Exploit Scenario:**
An attacker intercepts one valid proof (from GET /api/portfolios - VULN-06) and resubmits it:
```
curl -X POST /api/portfolios -d '{"grades":[...],"proof":"<stolen-proof>","publicInputs":[...]}'
```
Creates unlimited duplicate portfolios, inflating numbers and potentially manipulating aggregate statistics.

**Recommended Fix:**
- Hash the proof and store it in a Redis set
- Before accepting a new portfolio, check `SISMEMBER proof:hashes <sha256(proof)>`
- Return 409 Conflict if the proof has already been submitted

---

### VULN-08: Redis Key Injection via Portfolio ID
**Severity:** Medium
**Endpoint:** PATCH /api/portfolios
**Evidence:** `src/app/api/portfolios/route.ts` lines 59-84

```typescript
const { id, status } = await request.json();
// ...
const raw = await redis.get(`portfolio:${id}`);
// ...
await redis.set(`portfolio:${id}`, JSON.stringify(portfolio));
```

The `id` field is used directly in Redis key construction with no validation. While UUIDs are expected, an attacker can supply arbitrary strings.

**Exploit Scenario:**
```json
{"id": "../../some:other:key", "status": "verified"}
```
While Redis does not have path traversal, keys like `portfolio:*` could interfere with Redis key patterns. More concerning: if `id` contains newline characters or very long strings, it could cause unexpected behavior in Redis.

**Recommended Fix:**
- Validate that `id` matches UUID format: `/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i`
- Reject any `id` that does not match

---

### VULN-09: Stored XSS via Metadata Filename
**Severity:** Medium
**Endpoint:** POST /api/portfolios
**Evidence:** `src/app/api/portfolios/route.ts` line 36

```typescript
filename: metadata?.filename ?? "unknown",
```

The filename from metadata is stored verbatim in Redis with no sanitization. In `src/app/admin/page.tsx` line 285:

```tsx
<p className="text-sm font-semibold text-gray-900 truncate">
  {p.metadata.filename}
</p>
```

React's JSX auto-escapes text content, so this is currently safe against XSS. However:
1. The filename is stored unsanitized in Redis - if any future code uses `dangerouslySetInnerHTML` or renders it in a non-React context (email, PDF, etc.), it becomes exploitable
2. Very long filenames (megabytes) are accepted and stored, wasting Redis memory

**Exploit Scenario:**
```json
{"metadata": {"filename": "<img src=x onerror=alert(document.cookie)>"}}
```
Currently mitigated by React's JSX escaping, but one code change away from being exploitable.

**Recommended Fix:**
- Sanitize filename on the server: strip HTML tags, limit length to 255 chars
- `filename: (metadata?.filename ?? "unknown").replace(/<[^>]*>/g, "").slice(0, 255)`

---

### VULN-10: No Input Validation on POST /api/portfolios Body Types
**Severity:** Medium
**Endpoint:** POST /api/portfolios
**Evidence:** `src/app/api/portfolios/route.ts` lines 9-12

```typescript
const { grades, proof, publicInputs, metadata } = body;
if (!grades || !proof || !publicInputs) {
  return NextResponse.json({ error: "Missing grades, proof, or publicInputs" }, { status: 400 });
}
```

Only checks for truthiness. Does not validate:
- `grades` is an array of valid GradeLetter strings
- `proof` is a string (could be an object, number, or array)
- `publicInputs` is an array of numbers
- `metadata` has expected shape

**Exploit Scenario:**
```json
{
  "grades": "not-an-array",
  "proof": {"__proto__": {"isAdmin": true}},
  "publicInputs": "also-not-an-array",
  "metadata": 42
}
```
The `.map()` on line 17 will throw on non-arrays, but the proof (an arbitrary object) is stored in Redis via `JSON.stringify`. Prototype pollution is unlikely in this context but type confusion could cause crashes or unexpected behavior.

**Recommended Fix:**
- Use a schema validation library (zod, ajv) to validate the request body
- Validate: `Array.isArray(grades)`, `typeof proof === 'string'`, `Array.isArray(publicInputs)`
- Validate proof is valid hex: `/^[0-9a-f]+$/i`
- Validate publicInputs contains only integers 0-5
- Set a max length on proof string (prevent memory exhaustion)

---

### VULN-11: PIN Stored in SessionStorage
**Severity:** Low
**Endpoint:** Client-side (PinGate component)
**Evidence:** `src/components/PinGate.tsx` line 21-22

```typescript
const stored = sessionStorage.getItem(storageKey);
if (stored === "authenticated") setAuthed(true);
```

Auth state is a simple string "authenticated" in sessionStorage. Any XSS (or browser devtools) can set this:
```javascript
sessionStorage.setItem("vexor-admin-pin", "authenticated");
```
This bypasses the PIN gate entirely on the client side. Combined with VULN-01 (no server-side auth), this is defense-in-depth failure.

**Recommended Fix:**
- This is moot until server-side auth exists (VULN-01). Once server sessions are implemented, the client-side gate becomes a UX convenience, not a security boundary
- Use httpOnly cookies for session management instead of sessionStorage

---

### VULN-12: Proof Data Stored as Unbounded Hex String
**Severity:** Low
**Endpoint:** POST /api/portfolios
**Evidence:** `src/app/api/portfolios/route.ts` line 44

```typescript
await redis.set(`portfolio:${id}`, JSON.stringify(portfolio));
```

The `proof` field is stored as-is with no size limit. A real Barretenberg proof is typically a few KB, but an attacker can send megabytes of hex data.

**Exploit Scenario:**
```python
import requests
huge_proof = "aa" * 10_000_000  # 10MB hex string
requests.post(url, json={"grades":["E"]*100, "proof": huge_proof, "publicInputs":[0]*100})
```
Repeated submissions fill Redis memory. The LTRIM on the index limits to 100 entries, but each entry can be arbitrarily large.

**Recommended Fix:**
- Validate proof length: real proofs are <10KB hex. Reject anything over 50KB
- `if (typeof proof !== 'string' || proof.length > 100000) return 400`

---

### VULN-13: Timing Side Channel on PIN Comparison
**Severity:** Info
**Endpoint:** POST /api/auth
**Evidence:** `src/app/api/auth/route.ts` line 15

```typescript
const authenticated = pin === PINS[portal];
```

JavaScript string `===` comparison is not constant-time. In theory, an attacker could measure response times to deduce the PIN character by character. In practice, with 4-digit PINs and network jitter, this is largely theoretical - bruteforce (VULN-05) is far more practical.

**Recommended Fix:**
- Use `crypto.timingSafeEqual(Buffer.from(pin), Buffer.from(PINS[portal]))` for constant-time comparison
- This is low priority given VULN-05 makes it irrelevant

---

### VULN-14: No Security Headers
**Severity:** Info
**Evidence:** `next.config.ts` has no security headers configured

```typescript
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(import.meta.dirname),
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};
```

Missing headers:
- `Content-Security-Policy` (CSP)
- `X-Frame-Options` / `X-Content-Type-Options`
- `Strict-Transport-Security` (HSTS)
- `Referrer-Policy`
- CORS headers (no explicit CORS policy)

**Recommended Fix:**
Add security headers in `next.config.ts`:
```typescript
headers: async () => [{
  source: '/(.*)',
  headers: [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  ],
}]
```

---

### VULN-15: Client-Side Portfolio Storage in LocalStorage
**Severity:** Info
**Evidence:** `src/lib/client-store.ts` lines 16-40

```typescript
const STORAGE_KEY = "vexor-client-portfolios";
localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
```

Full portfolio data including proof hex is stored in localStorage with no encryption. Any script running on the same origin can read all portfolio data. No size limit on accumulated portfolios.

**Recommended Fix:**
- Encrypt localStorage data with a key derived from the PIN
- Add a maximum number of stored portfolios (e.g., 50)
- Consider IndexedDB with encryption for larger data

---

## Attack Chain Summary

The most dangerous attack chain combines multiple vulnerabilities:

1. **Enumerate** all portfolios: `GET /api/portfolios` (VULN-06, no auth)
2. **Forge** a portfolio with fake grades: `POST /api/portfolios` with empty publicInputs to bypass binding check (VULN-04 + VULN-01)
3. **Mark it verified** without proof verification: `PATCH /api/portfolios` (VULN-02, no auth)
4. **Result:** A completely fabricated portfolio appears as "Verified" in the admin dashboard

This chain completely subverts the ZK proof system - the core value proposition of the platform.

---

## Priority Fix Order

| Priority | Vuln | Fix |
|----------|------|-----|
| P0 | VULN-01 | Add server-side authentication to all API routes |
| P0 | VULN-02 | Remove or restrict PATCH endpoint; verify server-side only |
| P0 | VULN-04 | Validate grades.length === publicInputs.length === 100 |
| P1 | VULN-03 | Rate limit /api/verify, cache backend instance |
| P1 | VULN-05 | Rate limit /api/auth, add lockout |
| P1 | VULN-06 | Require auth on GET, scope data by role |
| P2 | VULN-07 | Deduplicate proofs by hash |
| P2 | VULN-10 | Add schema validation (zod) on all endpoints |
| P2 | VULN-08 | Validate UUID format on id parameter |
| P2 | VULN-09 | Sanitize filename, limit length |
| P3 | VULN-12 | Cap proof string length |
| P3 | VULN-14 | Add security headers |
| P3 | VULN-11 | Use httpOnly cookies (after server auth) |
| P3 | VULN-15 | Encrypt or limit client storage |
| P4 | VULN-13 | Constant-time PIN comparison |
