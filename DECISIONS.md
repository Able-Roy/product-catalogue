# Architectural Decision Records

This document records the significant technical and architectural choices made during the development of the Product Catalogue application, including the rationale and trade-offs for each decision.

---

## Tech Choices

### React + TypeScript (over iOS / Android native)

A web application was chosen because it provides the widest possible reviewer reach — anyone with a browser can run it without installing a development environment for a specific mobile platform. React is the most widely understood frontend framework, reducing the barrier to code review. TypeScript was added to catch type errors at compile time, make component interfaces self-documenting, and reduce runtime surprises — especially important in a short PoC where there is no time for extensive manual testing.

### Node.js / Express (over Laravel or other server-side frameworks)

Using the same language (TypeScript/JavaScript) across the full stack reduces context switching and means the same type definitions (e.g. `Product`) can be reused or mirrored easily. Express is minimal and familiar; it does not impose an opinionated file structure, which suits a small focused API. Laravel would have required a separate language runtime (PHP) and a larger scaffolding footprint — overkill for a proxy API with six endpoints.

### Vite (over Create React App)

Vite starts in milliseconds (native ES modules in dev), has built-in TypeScript support with no extra config, and produces faster production builds via Rollup. CRA is officially deprecated and ships a Webpack config that is slow and difficult to extend. Vite is now the de-facto standard for new React projects.

---

## Architecture Decisions

### Backend as API Proxy

The acceptance criteria explicitly state that the client must not call the Fake Store API directly. Beyond compliance, routing all data through the backend:

- Gives us a single place to add caching, transformation, or authentication in future
- Hides the upstream API's URL and shape from the browser (easier to swap later)
- Allows the frontend to use a stable, internally-defined API contract

### In-Memory Cache (5-Minute TTL)

A `Map<string, { data: any; expiresAt: number }>` cache wraps every Fake Store call. Benefits:

- Reduces upstream request count during development and review sessions
- Lowers perceived latency for the reviewer
- Simple to reason about — no external dependency

**Trade-off / production path:** The cache is ephemeral (lost on restart) and not shared between instances. Production would replace this with Redis for distributed, persistent caching. The cache is isolated in `fakeStoreService.ts` so the swap is a single-file change.

### CSS Modules (not Tailwind)

Tailwind requires a PostCSS config, a `tailwind.config.js`, and familiarity with utility class naming. CSS Modules require nothing beyond Vite's built-in support (zero config). Reviewers who know plain CSS can read and modify the styles immediately. Scoping is automatic — no class-name collisions across components. If a future team wants Tailwind, it can be added per-component without touching existing styles.

### EnquiryModal (not a Separate Page)

The enquiry form opens as a modal overlay on the product detail page rather than navigating to a new URL. This keeps the product image, title, and price visible while the user fills in the form — matching common e-commerce UX (the user stays in context). It also avoids a routing decision about how to pass product data between pages (props vs URL params vs global state). The trade-off is that deep-linking to an open enquiry form is not possible, which is acceptable for this PoC.

### Ethereal for Email

Any real SMTP provider (SendGrid, AWS SES, Mailgun) requires account registration and either a paid plan or domain verification — violating the constraint that the reviewer must be able to run the app without depending on paid external services. Ethereal creates a temporary catch-all SMTP account programmatically on startup (no sign-up required) and returns a preview URL per message. The reviewer can click that URL to see exactly what the email would look like in a real inbox.

**Production path:** Set the `SMTP_*` environment variables. `emailService.ts` checks for `SMTP_HOST` and falls back to Ethereal when it is absent — the switch is purely configuration, no code change needed.

---

## Assumptions Made

| Assumption | Reasoning |
|------------|-----------|
| "Top rated" = sorted by `rating.rate` descending; top 5 across all categories = "featured" | Most natural interpretation of "featured" without an explicit featured-product CMS |
| "Top rated products for that category" = top 3 by rating within that category, displayed prominently; remaining products shown below | Provides a clear visual hierarchy on the category page |
| "Sales inbox" address is configurable via `SALES_EMAIL` env var | Allows different environments (staging, production) to route to different addresses without code changes |
| Phone field on the enquiry form is optional | The acceptance criteria do not mention phone as a required field; collecting it optionally is a common UX pattern |
| No authentication required | Not mentioned in the acceptance criteria; adding it later is straightforward (JWT middleware on protected routes) |
| No pagination | Not mentioned in the acceptance criteria for MVP; Fake Store returns ≤ 20 products, which renders fine in a grid |
| Product images served directly from the Fake Store CDN | Acceptable for a PoC; production would proxy or re-host images |

---

## What Was Dropped / Simplified and Why

| Feature | Decision | Rationale |
|---------|----------|-----------|
| Pagination | Omitted | Not in AC; Fake Store dataset is small; cursor-based pagination can be added later without breaking the existing API shape |
| Authentication / sessions | Omitted | Not in AC for MVP; would add significant scope (login UI, token storage, protected routes) |
| Persistent database | Omitted | Fake Store is the authoritative source; the in-memory cache is sufficient for a PoC; designed for easy swap |
| Real-time features (WebSockets) | Omitted | Not in AC; no use case identified |
| Image upload | Omitted | Products come from Fake Store with existing images; custom image hosting is out of scope for MVP |

---

## How the Design Supports Growth

- **`fakeStoreService.ts` is the only file that knows the Fake Store API exists.** Replace it with a service that reads from a PostgreSQL database, and no routes or controllers change.
- **`emailService.ts` is fully isolated.** Swap Ethereal for SendGrid or AWS SES by updating `SMTP_*` env vars and, at most, changing the transporter initialisation in one file.
- **CSS Modules are scoped per component.** A rebrand means swapping or editing CSS files — no risk of cascading side-effects across components.
- **The frontend API client lives in one file (`src/api/client.ts`).** Point the frontend at a new backend by changing `VITE_API_URL` — no component changes needed.
- **Express router structure** (`routes/products.ts`, `routes/enquiry.ts`) makes adding new resource types a matter of creating a new route file and registering it in `app.ts`.

---

## What's Next (Given Another Day)

1. **Redis cache** — replace the in-memory `Map` with a Redis client for distributed, persistent caching across backend instances
2. **Pagination** — add `limit` / `offset` (or cursor-based) query parameters to product listing endpoints
3. **Admin panel** — lightweight UI to manage which products are "featured" (currently the top 5 by rating, hardcoded by sort)
4. **Image upload** — allow custom product images stored in object storage (S3-compatible)
5. **E2E tests** — Playwright test suite covering the happy path: browse → product detail → open modal → submit enquiry
6. **CI/CD pipeline** — GitHub Actions: lint → test → build Docker images → push to registry on merge to `main`
