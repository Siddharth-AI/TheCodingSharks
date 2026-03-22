# CLAUDE.md — Universal Engineering Intelligence Guide

> Transferable across any project. Project-specific context lives in `memory/` files.
> Load this file fully before touching any code. These instructions override all defaults.

---

## 1. CORE BEHAVIOR PRINCIPLES

### Before Writing ANY Code
1. **Read first, write second.** Always read existing files before editing. Never assume structure.
2. **Understand the pattern in use.** Match existing code style, naming, and architecture.
3. **Minimal change wins.** Prefer surgical edits over rewrites unless rewrite is explicitly requested.
4. **Ask once.** If ambiguous, bundle all questions into one message — not one-by-one.
5. **Never hallucinate APIs.** If unsure whether a method exists, say so.

### Planning Protocol
For any task touching 3+ files or 30+ lines:
- State what you're doing (1–3 sentences max)
- List files you'll touch
- Call out risks or side-effects
- Then execute

### Communication Rules
- Lead with the answer, not the reasoning
- Never summarize what you just did at the end of a response
- No emojis unless explicitly asked
- If blocked: diagnose root cause — never brute force or bypass safety checks
- Don't add unsolicited features, refactors, or "improvements"

### Decision Hierarchy
```
1. Security — never compromise
2. Correctness — works as specified
3. Simplicity — minimum code for the task
4. Performance — only optimize when measured
5. Style — follows project conventions
```

---

## 2. SELF-LEARNING & MEMORY SYSTEM

### Session Start Checklist
1. Read `memory/MEMORY.md` — check index for relevant context
2. Read this `CLAUDE.md` — apply all rules
3. Read actual files you'll modify — never assume
4. Check recent git log for changes in that area

### When to Save Memory
Save immediately when you discover:
- A non-obvious fix that will likely recur
- A user preference that should change your default behavior
- A project-specific pattern or constraint
- A "gotcha" — something that looks one way but works differently
- An architectural decision and its reason

### What NOT to Save
- Things derivable by reading the code
- Temporary task state
- Things already covered in CLAUDE.md

### Self-Learning Loop
After completing any task: "What did I learn that I didn't know before starting?"
If non-trivial → save to the appropriate memory file immediately.

---

## 3. PROJECT STRUCTURE STANDARDS

### Next.js 15 (App Router) — Canonical Structure
```
src/
├── app/
│   ├── (auth)/              # Route group — no URL segment
│   ├── (dashboard)/         # Route group — no URL segment
│   ├── api/                 # Route handlers only — NO business logic
│   └── layout.tsx
├── components/
│   ├── ui/                  # Dumb, reusable: Button, Input, Modal
│   ├── forms/               # Form modals: CreateLeadModal, EditCourseModal
│   ├── layout/              # Header, Sidebar, Footer
│   └── [feature]/           # Feature-scoped: kanban/, dashboard/, activity/
├── lib/                     # Third-party clients: db, redis, stripe, cloudinary
├── services/                # Business logic — called by API routes, not components
├── models/                  # Validation schemas (Joi/Zod)
├── hooks/                   # Custom React hooks only
├── store/                   # Redux / Zustand / Jotai + RTK Query slices
├── types/                   # Global TypeScript interfaces/enums
├── utils/                   # Pure functions, no side effects
├── middleware/               # Auth, rate limiting, logging
└── constants/               # Enums, config values, magic strings
```

### NestJS — Canonical Structure
```
src/
├── modules/
│   └── [feature]/
│       ├── [feature].module.ts
│       ├── [feature].controller.ts   # Thin — just req/res
│       ├── [feature].service.ts      # Business logic
│       ├── [feature].repository.ts   # DB queries
│       ├── dto/                      # create-*.dto.ts, update-*.dto.ts
│       └── entities/
├── common/
│   ├── decorators/
│   ├── filters/              # Exception filters
│   ├── guards/               # Auth guards
│   ├── interceptors/         # Logging, transform
│   └── pipes/               # Validation pipes
├── config/                  # Config modules
└── main.ts
```

### Node.js / Express API
```
src/
├── routes/
├── controllers/             # Thin — just req/res handling
├── services/                # Business logic
├── repositories/            # DB queries only
├── middleware/
├── validators/              # Joi / Zod schemas
├── utils/
├── config/
└── types/
```

### React Native
```
src/
├── screens/                 # One file per screen
├── navigation/              # Stack, Tab, Drawer navigators
├── components/              # Shared components
├── hooks/
├── services/                # API calls
├── store/
├── utils/
├── constants/
│   ├── colors.ts
│   ├── fonts.ts
│   └── endpoints.ts
└── assets/
```

---

## 4. NAMING CONVENTIONS (Universal)

| Thing | Convention | Example |
|---|---|---|
| Files — components | PascalCase | `UserCard.tsx` |
| Files — utils/hooks | camelCase | `useAuth.ts`, `formatDate.ts` |
| Files — routes/API | kebab-case | `user-profile/route.ts` |
| Variables / functions | camelCase | `getUserById` |
| Constants | SCREAMING_SNAKE | `MAX_RETRY_COUNT` |
| Types / Interfaces | PascalCase | `UserProfile`, `ApiResponse` |
| DB tables | snake_case | `user_profiles` |
| DB columns | snake_case | `created_at`, `is_active` |
| CSS classes | kebab-case | `btn-primary` |
| Env vars | SCREAMING_SNAKE | `DATABASE_URL` |

**Public-facing URLs always use slugs, not UUIDs.**
```
✓ /courses/intro-to-react
✗ /courses/550e8400-e29b-41d4-a716-446655440000
```
Internal dashboard operations can use UUIDs. API calls from internal tools use UUID params.

---

## 5. TYPESCRIPT DEEP PATTERNS

### Non-Obvious Rules
```typescript
// WRONG — any silently kills type safety
const data: any = await fetchUser();

// RIGHT — use unknown, then narrow
const data: unknown = await fetchUser();
if (isUser(data)) { /* now safe */ }

// WRONG — loose enum (compiles to runtime object with overhead)
enum Status { Active, Inactive }

// RIGHT — const object with as const (zero runtime cost)
const STATUS = { Active: 'active', Inactive: 'inactive' } as const;
type Status = typeof STATUS[keyof typeof STATUS];

// RIGHT — discriminated unions for state machines
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// RIGHT — branded types prevent ID confusion at compile time
type UserId = string & { readonly _brand: 'UserId' };
type LeadId = string & { readonly _brand: 'LeadId' };
// LeadId cannot be passed where UserId is expected

// WRONG — optional chaining hides undefined silently
const name = user?.profile?.name;

// RIGHT — explicit fallback at usage point
const name = user?.profile?.name ?? 'Anonymous';
```

### Useful Utility Types
```typescript
// Partial for update DTOs
type UpdateUser = Partial<Pick<User, 'name' | 'email'>>;

// Template literal types for API routes
type ApiRoute = `/api/${string}`;

// Deep readonly
type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };
```

### tsconfig Non-Obvious Settings
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```
`noUncheckedIndexedAccess`: `arr[0]` becomes `T | undefined`, not `T` — catches array access bugs.

---

## 6. DATABASE DESIGN PRINCIPLES

### Universal Rules
- **UUIDs as primary keys** — never auto-increment integers for exposed entities
- **Public URLs → slugs** — not UUIDs (see section 4)
- **Soft deletes** — `deleted_at TIMESTAMPTZ` instead of hard delete for auditable data
- **Every table needs**: `id`, `created_at`, `updated_at` at minimum
- **Timestamps always UTC** — convert to local only in the UI layer
- **Never store computed values** — calculate at query time or cache
- **New migrations = new files** — never edit existing migration files

### Slug Pattern
```sql
ALTER TABLE courses ADD COLUMN slug TEXT NOT NULL UNIQUE;
CREATE INDEX idx_courses_slug ON courses(slug);
-- "Intro to React" → "intro-to-react" or "intro-to-react-a3f2" if collision risk
```

### PostgreSQL / Supabase Specific
```sql
-- TIMESTAMPTZ not TIMESTAMP (timezone-aware)
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

-- JSONB not JSON (indexed, binary, faster)
metadata JSONB DEFAULT '{}'

-- Partial indexes for soft deletes
CREATE INDEX idx_active_leads ON leads(user_id) WHERE deleted_at IS NULL;

-- Row Level Security — always enable on Supabase tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
```

**Supabase client rule:**
- `supabase` (anon) — respects RLS, use for reads
- `supabaseAdmin` (service role) — bypasses RLS, use for **all server-side writes and deletes**
- Never use anon client for mutations in API routes — RLS will silently block

### MongoDB Specific
- Always define explicit schema — never rely on implicit document structure
- Use `lean()` for read-only queries (2–5x faster — returns plain objects)
- Never store unbounded arrays — use pagination or subcollections
- Index everything you query on — run `explain()` before shipping

### Index Strategy
```sql
-- Compound: most selective column first
CREATE INDEX idx_leads_user_stage ON leads(user_id, stage, created_at DESC);

-- Covering: include all columns the query needs (avoids table fetch)
CREATE INDEX idx_messages_covering ON messages(lead_id) INCLUDE (content, status);

-- Never index low-cardinality alone (booleans, tiny enums)
-- Always verify with EXPLAIN ANALYZE before adding
```

---

## 7. API DESIGN

### REST Rules
```
GET    /api/leads             — list (paginated)
POST   /api/leads             — create
GET    /api/leads/:id         — single
PATCH  /api/leads/:id         — partial update (prefer over PUT)
DELETE /api/leads/:id         — soft delete

GET    /api/leads/:id/messages — sub-resource list
POST   /api/leads/:id/stage    — action endpoint is fine

✗ GET  /api/getLeads           — verb in URL
✗ POST /api/leads/delete/:id   — method in URL
```

### Consistent Response Shape
```typescript
// Success
{ "success": true, "data": {...}, "meta": { "page": 1, "total": 100 } }

// Error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "field": "phone" } }
```

### HTTP Status Codes
| Code | Use |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No content (DELETE) |
| 400 | Bad input (validation) |
| 401 | Unauthenticated |
| 403 | Authenticated but forbidden |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 429 | Rate limited |
| 500 | Server error |

---

## 8. NEXT.JS 15 SPECIFIC PATTERNS

### Async Params — MANDATORY in App Router
```typescript
// Every [id] route handler MUST use async params
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;  // await is required
}
```

### Common Next.js Gotchas
```typescript
// searchParams.get() returns null, not undefined — always convert
const type = searchParams.get('type') || undefined;  // not just searchParams.get('type')

// Server Components by default — add 'use client' only for:
// - Event handlers (onClick, onChange)
// - Browser APIs (window, localStorage)
// - React hooks (useState, useEffect, useContext)
// - Third-party libs that need browser

// cookies() and headers() are async in Next.js 15
const cookieStore = await cookies();
```

---

## 9. SECURITY

### Input Validation (Always at Boundaries)
```typescript
// Validate EVERY external input — req.body, req.query, env vars
import { z } from 'zod';

const CreateLeadSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  phone: z.string().regex(/^\+[1-9]\d{7,14}$/),
  email: z.string().email().optional(),
});
// Never pass raw req.body to DB
```

### SQL Injection
```typescript
// WRONG — string interpolation
db.query(`SELECT * FROM users WHERE email = '${email}'`);

// RIGHT — parameterized always
db.query('SELECT * FROM users WHERE email = $1', [email]);
```

### XSS
- `dangerouslySetInnerHTML` only with trusted/sanitized content
- Use `DOMPurify` for user-generated HTML
- Set `Content-Security-Policy` headers

### Authentication
```typescript
// JWT: short expiry (15min access + 7d refresh)
// Refresh token rotation — invalidate old token on use
// Store refresh tokens server-side (Redis) to enable revocation
// Never store sensitive data in JWT payload — base64, not encrypted

// Password hashing — argon2id (preferred) or bcrypt cost ≥ 12
import argon2 from 'argon2';
const hash = await argon2.hash(password, { type: argon2.argon2id });
```

### Rate Limiting
- Login: 5 attempts / 15 min per IP
- OTP/magic link: 3 attempts / 10 min
- API general: 100 req / min per user
- Sensitive endpoints get stricter limits

### Security Headers (Always Set)
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 10. AUTH & OAUTH

### OAuth 2.0 Flow
```
1. Redirect to provider with: client_id, redirect_uri, scope, state (random), code_challenge (PKCE)
2. Provider redirects back with: code + state
3. Verify state (CSRF protection)
4. Exchange code → tokens (server-side ONLY — never client-side)
5. Fetch user profile from provider
6. Upsert user by provider_id (NOT email — emails can change or be shared)
7. Issue your own JWT/session
```

### Multi-Provider Account Linking
```typescript
// accounts table — separate from users
// provider: 'google' | 'github' | 'facebook'
// provider_id: string — UNIQUE(provider, provider_id)
// One user → multiple linked provider accounts
// Link by provider_id, never by email
```

---

## 11. NOTIFICATIONS

### Unified Architecture
```typescript
interface NotificationPayload {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channels: ('push' | 'email' | 'sms' | 'whatsapp')[];
}
// Abstract channel away from business logic
// Notification service decides delivery based on user preferences
```

### Push (FCM/APNs)
- Store device tokens in a separate table — one user = many devices
- Handle token refresh — tokens expire/rotate, update on app open
- Batch sends — never 10,000 individual API calls
- Send both `notification` (system tray) + `data` (app logic) payloads

### Email
- Never send email synchronously inside a request handler
- Always queue (BullMQ / SQS) and send async
- Implement: unsubscribe, bounce handling, complaint handling
- Track: delivered, opened, clicked

### WhatsApp (Wapmonkey / Meta Cloud API)
- With media: `{ phone, message, media: [{ url, caption }] }`
- Always `JSON.stringify` nested objects when logging — `[Object]` is useless
- Store message ID from API response — needed for delivery status tracking
- 24-hour window: free-form only within 24h of last user message

### SMS
- Validate phone with libphonenumber-js (not just regex)
- Store in E.164 format in DB: `+14155552671`
- Handle STOP/UNSUBSCRIBE webhooks — legally required in many countries

---

## 12. PERFORMANCE PATTERNS

### Avoid N+1 Queries
```typescript
// WRONG — N+1
const leads = await db.leads.findMany();
for (const lead of leads) {
  lead.messages = await db.messages.findMany({ where: { leadId: lead.id } });
}

// RIGHT — single query
const leads = await db.leads.findMany({ include: { messages: true } });
```

### Caching Layers
```
CDN (Cloudflare)      → static assets, public pages
Next.js ISR           → semi-static pages
Redis                 → API responses, sessions, rate limit counters
In-memory (node-cache) → config, feature flags (TTL: 60s)
```

Cache key convention: `{service}:{entity}:{id}:{variant}`
Example: `crm:lead:uuid-123:summary`

**Always set TTL — never cache without expiry.**

### React Performance
```typescript
// useMemo — expensive computations only (not objects/arrays unless profiler shows need)
// useCallback — only when passing to memoized child or as useEffect dep
// React.memo — only when profiler shows unnecessary re-renders

// Virtualize lists > 100 items — react-window or @tanstack/virtual
// Code split at route level — React.lazy() + Suspense
// Images — always Next.js <Image> or equivalent
```

---

## 13. ESLINT RULES TO ALWAYS ENABLE

```json
{
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "react-hooks/exhaustive-deps": "error",
    "no-nested-ternary": "error",
    "prefer-const": "error",
    "eqeqeq": ["error", "always"]
  }
}
```

`no-floating-promises` — catches async functions called without `await` or `.catch()`. Silent failures in production are caught at lint time.

---

## 14. ERROR HANDLING ARCHITECTURE

### Custom Error Classes
```typescript
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) { super('NOT_FOUND', `${resource} not found`, 404); }
}
export class ValidationError extends AppError {
  constructor(msg: string) { super('VALIDATION_ERROR', msg, 400); }
}
export class UnauthorizedError extends AppError {
  constructor() { super('UNAUTHORIZED', 'Authentication required', 401); }
}
```

### Error Handler Rules
- `isOperational: true` → expected error, return safe message to client
- `isOperational: false` → programmer error, log and restart process (pm2 handles restart)
- Never expose stack traces in production
- Log full error internally, return generic message externally

---

## 15. SYSTEM DESIGN PRINCIPLES

### Architectural Defaults
| Decision | Default | Reason |
|---|---|---|
| Monolith vs Microservices | Monolith | Ship faster, split when scale demands |
| Sync vs Async | Async for non-critical paths | Resilience, user experience |
| REST vs GraphQL | REST | Simpler caching, tooling, debugging |
| ORM vs Query Builder | Depends — Prisma for rapid dev, raw SQL for complex queries | Pick for team skill |

### Queue-Based Patterns
```
Use queues for:
- Emails / SMS / WhatsApp sends
- Image processing / PDF generation
- Webhook delivery (with retry)
- Report generation
- Any operation > 200ms that doesn't need sync response

Tools: BullMQ (Redis), AWS SQS, RabbitMQ
Always implement: dead letter queue, exponential backoff retry, idempotency key
```

### Idempotency
```typescript
// Critical for: payments, message sends, webhook handlers
// Idempotency-Key: <uuid> header from client
// Server stores key + response for ~24h
// Same key = return cached response, don't re-execute
```

### Twelve-Factor Rules (Non-Obvious)
- Config in env, never in code — including feature flags
- Disposability: app starts < 5s, shuts down gracefully
- Dev/prod parity: use Docker locally to match production
- Logs as streams: stdout only, aggregated by infrastructure

---

## 16. ENVIRONMENT CONFIG

### .env Structure (Universal Template)
```bash
# App
NODE_ENV=development
APP_URL=http://localhost:3000
PORT=3000

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=min-32-chars-random-string
JWT_REFRESH_SECRET=different-32-chars
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Email
RESEND_API_KEY=
EMAIL_FROM=noreply@yourdomain.com

# Storage
CLOUDINARY_URL=
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# WhatsApp
WHATSAPP_TOKEN=
WHATSAPP_PHONE_ID=
WHATSAPP_WEBHOOK_SECRET=

# Push Notifications
FCM_SERVER_KEY=
APNS_KEY_ID=

# Monitoring
SENTRY_DSN=
```

### Validate Env on Startup
```typescript
// Fail fast — don't discover missing env at 3am in production
import { z } from 'zod';
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
});
export const env = EnvSchema.parse(process.env);
```

---

## 17. GIT DISCIPLINE

### Commit Convention (Conventional Commits)
```
feat: add WhatsApp auto-welcome on lead create
fix: resolve token refresh race condition
refactor: extract lead scoring to service layer
perf: add index on messages.lead_id
docs: update API auth guide
chore: upgrade Next.js to 15.1
test: add integration tests for auth flow
```

### Branch Strategy
```
main      — production-ready, always deployable
feat/xyz  — feature branches
fix/abc   — bug fixes
hotfix/*  — emergency production fixes
```

---

## 18. DEPLOYMENT & DEVOPS

### Docker Best Practices
```dockerfile
# Multi-stage — keep production image small
FROM node:20-alpine AS builder
# build steps...

FROM node:20-alpine AS runner
# Copy only what's needed
# Never copy .env into image — use runtime env injection
# Non-root user
USER node
```

### Health Check
```typescript
// GET /api/health — always implement
// { status: 'ok', db: 'ok', uptime: 123, version: '1.2.3' }
// Check ACTUAL connectivity (run a DB ping), not just "app is running"
// Used by load balancers and container orchestration
```

### Graceful Shutdown
```typescript
process.on('SIGTERM', async () => {
  server.close();          // stop accepting new requests
  await drainInFlight();   // wait for in-flight (timeout: 30s)
  await db.disconnect();
  await redis.quit();
  process.exit(0);
});
```

---

## 19. FIREBASE SPECIFIC

```typescript
// Admin SDK (server) vs Client SDK (browser/React Native) — never mix
// Use Admin SDK in API routes — it has full DB + Auth access
// Use Client SDK in frontend — respects security rules

// Firestore: always paginate with startAfter (cursor), not offset
// Firestore: transactions for multi-document writes
// Firestore: security rules are not optional — test them explicitly

// Cloud Functions: cold starts are real — keep functions lean
// Use Firebase App Check for mobile to prevent API abuse

// Storage: generate signed URLs for private files (they expire — regenerate)
// Auth: ID tokens expire in 1h — use onIdTokenChanged not onAuthStateChanged
```

---

## 20. QUICK REFERENCE — COMMON GOTCHAS

| Symptom | Likely Cause | Fix |
|---|---|---|
| `Cannot read property of undefined` | Async data not awaited / null not handled | Check await, add null guard |
| `401 Unauthorized` on API | Missing auth header / token expired | Check header, middleware order |
| `400 Bad Request` | Validation mismatch — Joi/Zod vs what's sent | Log req.body, check schema |
| `23505 duplicate key` | Unique constraint violation | Check if record exists first |
| `[Object Object]` in logs | `console.log` of nested object | Use `JSON.stringify(obj, null, 2)` |
| Stale UI after mutation | Cache not invalidated | Check `invalidatesTags` in RTK Query |
| RLS blocking writes | Using anon Supabase client for writes | Switch to `supabaseAdmin` |
| `null` from searchParams | `searchParams.get()` returns null not undefined | Add `|| undefined` |
| Dates not formatting | DB returns string not Date object | Wrap in `new Date()` |
| Type error after DB query | DB returns string for numeric/date | Cast explicitly |
| N+1 queries | Fetching relations in a loop | Use join/include or batch + map |
| Memory leak in Node.js | Event listeners not removed | Always clean up in shutdown |
| JWT claims not updated | Old token still valid | Implement token revocation or short expiry |
| OAuth email not unique | Two providers, same email, different person | Link by provider_id not email |
| Push token stale | Token rotated by OS | Refresh token on app open, delete old |

---

## 21. CLAUDE SELF-CHECK BEFORE SUBMITTING CODE

- [ ] Read all files I'm about to edit?
- [ ] Types consistent across: request body → validation → service → DB → response?
- [ ] Null/undefined handled at all entry points?
- [ ] Auth applied to new routes?
- [ ] New DB fields → migration file created?
- [ ] No secrets hardcoded?
- [ ] No `console.log` with sensitive data?
- [ ] Cache invalidation updated?
- [ ] Error cases handled (not just happy path)?
- [ ] Public route uses slug, internal uses UUID?

---

*This file is living documentation. Update when patterns change, new tech is adopted, or new gotchas are found.*
