# Kratika Yoga — Platform Handover

**Covers:** Website & Learner Portal (this repo), Backend API, Admin Panel
**Prepared:** 8 September 2026
**Verified against:** `yoga-course-landing-page` @ `development`
**Status:** Landing-page sections fact-checked line-by-line against the live code. Admin Panel section is reference material carried over from its own handover doc — not re-verified in this pass.

> **If you're the owner:** read the blockquoted *"In plain terms"* notes at the top of each section and skip the tables. Section 1 gives you the whole system in one picture. Section 9 is the current punch list.
>
> **If you're the developer:** the tables, file paths and endpoint lists were checked against the live code on 8 Sept 2026, not copied from an older doc. Anything marked **[corrected]** means a previous draft said something the code no longer does.

## What changed in this pass

- ✅ **Verified** — every endpoint, file path, cache setting and component name below was re-checked against the repository.
- 🛠️ **Corrected — login cookie.** The "needs to be made environment-aware" warning is out of date. It already is: the cookie only gets the `kratikayoga.com` domain and the `Secure` flag in production; `localhost` gets neither.
- 🛠️ **Corrected — payments.** There are two checkout flows, not one. PDF programmes use `/payments/pdf-orders`; video courses use a separate `/payments/orders` flow on the course page. The old draft only documented the PDF one.
- 🛠️ **Corrected — homepage sections.** An Instagram-style feedback strip renders between the course carousel and testimonials. It wasn't in the previous section map.
- ⚠️ **Still open — PDF carousel.** The homepage fetches top PDF programmes but never renders them. The component exists; it's just not wired in. See §9.

---

## 1. The big picture

> **In plain terms:** Kratika Yoga isn't one piece of software — it's three, built and deployed separately, that agree to talk to each other over the internet. This document is mostly about the first one.

```
   Admin Panel  ──publishes to──▶   Backend API   ◀──serves──  Website
 (owner's tool                  (database, payments,        (this document —
  for uploading                  video & file storage)       students browse,
  courses/PDFs)                                               buy & learn)
```

All three are separate codebases. This repository has no database and no admin screens — every course, PDF, review and product you see on the site was entered into the Admin Panel by the owner and handed to this site through the Backend's API. Nothing in this repo can create or change that content by itself.

## 2. What the website does

> **In plain terms:** Four jobs — show visitors the courses (marketing pages), let them create an account, let them pay, and once they've paid, let them watch videos or open PDFs. All the buying and watching happens behind a login.

- **Public marketing pages** — homepage, full course catalogue, PDF programmes, affiliate-linked products.
- **Account screens** — sign up, log in, verify email by OTP, forgot/reset password.
- **Learner dashboard (behind login)** — a student's purchased courses, video lessons, and purchased PDFs.
- **A browser-side API client** — every screen above talks to the Backend over HTTPS; this project never talks to a database directly.

Home page entry point: `app/(landing)/page.tsx`, composed in `components/landing-page/landing-page.tsx`.

## 3. Built with

> **In plain terms:** Modern, actively maintained tools. Nothing exotic — any React/Next.js developer can pick this up without a ramp-up period.

| Piece | Version | Job |
| --- | --- | --- |
| Next.js | `16.3.0` | Page routing, server rendering, image optimisation |
| React | `19.2.8` | UI components |
| TypeScript | `^5` | Type-checked JavaScript |
| Tailwind CSS | `v4` | Styling, alongside hand-written CSS in `assets/styles` |
| pnpm | `10.2.1` | Package manager — the only one this repo is set up for |
| Axios | `^1.19` | Logged-in API requests |
| Swiper | `^14` | Course, testimonial & free-practice carousels |
| js-cookie | `^3` | Reading/writing the login cookie |
| HLS.js | `^1.6` | Streaming protected lesson video |
| Razorpay Checkout | script tag | Payment for PDFs and courses (not an npm package) |

```bash
pnpm install    # install dependencies
pnpm dev        # start dev server — http://localhost:3000
pnpm lint       # eslint
pnpm build      # production build
pnpm start      # run the production build
```

## 4. How the homepage is assembled

> **In plain terms:** The homepage is built on the server before it's sent to a visitor's browser, and it asks the Backend for the top-rated courses and top PDF programmes while it's doing that build — with a ten-minute cache, so it's not re-asking on every single visit.

```
app/(landing)/page.tsx
        │
        ▼
components/landing-page/landing-page.tsx
        │
        ├── getLandingCourses("top-rated")   → GET /courses/top-rated
        └── getLandingPdfCourses("top")      → GET /pdf-courses/top
        │
        ▼
Navbar → Hero → About → Course carousel → Instagram feedback strip
       → Testimonials → Category highlights → Free practice
       → FAQ → Final CTA → Footer
```

Both requests use Next's data cache with `revalidate: 600` (10 minutes).

### Section-by-section

| Section | Component | Content source |
| --- | --- | --- |
| Navigation | `navbar.tsx` | `data/landing-page.ts` |
| Hero | `hero-section.tsx` | Static copy + `public/videos/hero-video.mp4` |
| Instructor / about | `about-section.tsx` | Static copy + about-us image |
| Featured courses | `course-carousel.tsx` | Top-rated courses from the Backend, first 3 shown |
| Instagram feedback **[added to map]** | `instagram-feedback-swiper.tsx` | Static image gallery, not from the Backend |
| Testimonials | `testimonials-section.tsx` | Backend reviews *merged with* static testimonials in `data/landing-page.ts`, capped at 5 |
| Categories | `platform-sections.tsx` | Static copy + CSS background images |
| Free practice | `free-course-swiper.tsx` | `freeCourses` in `data/landing-page.ts` + YouTube links |
| FAQ (short answers) | `platform-sections.tsx` | `faqQuestions` in `data/landing-page.ts` — every question gets the same generic answer here (see §9) |
| Final call-to-action | `platform-sections.tsx` | Static copy |
| Footer | `footer.tsx` | Navigation, contact & social links |

## 5. Every public page

| Route | Purpose | Data source |
| --- | --- | --- |
| `/` | Homepage | Top-rated courses, top PDFs, reviews |
| `/courses` | Full video course catalogue | `getLandingCourses("all")` |
| `/pdf-courses` | Full PDF programme catalogue | `getLandingPdfCourses("all")` |
| `/affiliate-products` | Recommended products | `getLandingAffiliateProducts()` |
| `/faq` | Full FAQ, real per-question answers | Static — `faqAnswers` array |
| `/privacy-policy` | Privacy policy | Static content |
| `/terms` | Terms of use | Static content |
| `/sitemap` | Human-readable sitemap | Static route list |

## 6. Talking to the backend

> **In plain terms:** The website never stores course or user data itself — it asks the Backend for everything, over one web address configured by whoever deploys the site. Public pages (homepage, catalogues) fetch data openly; logged-in pages attach the user's login token to prove who's asking.

The base API address is read in `lib/config/envConfig.ts`. It accepts either form and each caller normalises it:

```
https://api.example.com
https://api.example.com/app/api/v1
```

**Note for developers:** that dual-format tolerance is implemented separately inside each of the four public `lib/api/landing-*.ts` wrappers — it is *not* shared by `lib/api/multiple.api.ts`, which every logged-in request goes through. If the deployed `NEXT_PUBLIC_API_BASE_URL` is set without the `/app/api/v1` suffix, public pages still work but every authenticated request breaks. Keep the suffix in the env var.

### Public endpoints (no login required)

| Frontend wrapper | Endpoint | Returns |
| --- | --- | --- |
| `lib/api/landing-courses.ts` | `GET /courses/top-rated` or `/all` | `{ courses: LandingCourse[] }` |
| `lib/api/landing-pdf-courses.ts` | `GET /pdf-courses/top` or `/all` | `{ pdfCourses: LandingPdfCourse[] }` |
| `lib/api/landing-reviews.ts` | `GET /courses/reviews` | `{ reviews: [...] }` |
| `lib/api/landing-affiliate-products.ts` | `GET /affiliate-products` | `{ products: LandingAffiliateProduct[] }` |

Every response is expected to carry `success: true`. If a request fails, these wrappers return a friendly fallback message instead of throwing — the page still renders.

### Logged-in endpoints

All routed through `lib/api/multiple.api.ts`, which attaches `Authorization: Bearer <token>` read from the `yoga_platform_auth_token` cookie.

| Method | Endpoint | Used for |
| --- | --- | --- |
| POST | `/auth/sign-up` | Create account |
| POST | `/auth/login` | Log in |
| POST | `/auth/verify-otp` | Confirm email OTP |
| POST | `/auth/resend-otp` | Resend OTP |
| POST | `/auth/forgot-password` | Start password reset |
| POST | `/auth/reset-password` | Set new password |
| GET | `/auth/verify/me` | Confirm the session token is still valid |
| GET | `/courses` | Course list (dashboard) |
| GET | `/courses/my-courses` | Purchased courses |
| GET | `/courses/{courseId}` | Single course detail — also drives the course purchase screen |
| GET | `/courses/{courseId}/videos/{videoId}/others` | Related videos in a course |
| GET | `/courses/{courseId}/videos/{videoId}/playback` | Signed playback URL |
| POST | `/courses/{courseId}/videos/{videoId}/rating` | Rate a lesson |
| POST | `/courses/{courseId}/videos/{videoId}/complete` | Mark a lesson complete |
| POST | `/courses/{courseId}/review` | Leave a course review |
| GET | `/pdf-courses/explore` | PDF catalogue (dashboard) |
| GET | `/pdf-courses/purchased` | Purchased PDFs |
| GET | `/pdf-courses/{courseId}` | Single PDF programme detail |
| GET | `/pdf-courses/{courseId}/access` | Confirm purchase before opening the file |
| POST | `/payments/orders` **[missing before]** | Create a Razorpay order for a **video course** purchase |
| POST | `/payments/pdf-orders` | Create a Razorpay order for a **PDF programme** purchase |
| POST | `/payments/verify` | Verify a completed Razorpay payment (both flows share this) |
| GET | `/affiliate-products` | Affiliate list (also used unauthenticated on the dashboard) |

Treat the request/response bodies inside the relevant form or detail component as the source of truth before changing anything on the Backend that these calls depend on.

## 7. Accounts & sessions

> **In plain terms:** Logging in drops a cookie in the browser that proves who you are on every later request. In production that cookie is scoped tightly to `kratikayoga.com`; on a developer's own laptop it isn't, on purpose — so this already works out of the box for local development.

1. Login/sign-up stores the session in the `yoga_platform_auth_token` cookie.
2. Cookie rules live in `lib/helper/hepler.ts`. **[corrected]** — the config already branches on environment: `secure` and the `kratikayoga.com` domain are only applied when `NODE_ENV === "production"`; locally, neither is set, so the browser scopes the cookie to `localhost` itself. This is *not* an open task any more.
3. Auth pages use an `AuthSessionGuard` that bounces an already-logged-in visitor to `/dashboard`, or to a validated `returnTo` path.
4. The protected dashboard layout calls `GET /auth/verify/me` before it renders anything.
5. A failed logged-in request clears local/session storage and cookies, then redirects to `/login` with the current path attached as `returnTo`.

## 8. Payments & protected content

> **In plain terms:** There are two separate "buy now" flows — one for PDF programmes, one for video courses — and they both work the same way underneath: this site never decides the price or confirms the payment. It only asks the Backend to do both, and the Backend is the only thing allowed to say "yes, this actually paid."

### PDF programme purchase

`components/pdf-course/pdf-course-detail-page.tsx`

1. Request an order — `POST /payments/pdf-orders`
2. Open Razorpay Checkout with the returned order + `NEXT_PUBLIC_RAZORPAY_KEY_ID`
3. Razorpay returns payment identifiers to the browser
4. Send those identifiers to `POST /payments/verify`
5. On success, the PDF becomes accessible through the Backend

### Video course purchase **[undocumented before]**

Same pattern, different screen and endpoint — `app/(protected)/my-courses/[courseId]/page.tsx`, using `POST /payments/orders` instead of `/pdf-orders`, then the same `/payments/verify` call.

**Do not trust the browser** for price, purchase status, or payment success. The Backend must calculate order amounts, validate the Razorpay signature, and authorise every PDF/video access request independently of anything the frontend claims.

Video playback uses signed, short-lived HLS URLs (via HLS.js) fetched from `/videos/{videoId}/playback` — those tokens must stay short-lived and be validated server-side, not trusted from a cached response.

## 9. Punch list — what's open

> **In plain terms:** Nothing here is broken for a paying customer today. These are loose ends a developer should close before the next big content push, roughly in order of how visible they are.

**PDF programmes are fetched on the homepage but never shown.** ⚠️ Still open. `landing-page.tsx` fetches `topPdfCourses` and passes it into `PlatformSections`, but that component only destructures `topCourses` and `error` — it never renders the (already-built) `PdfCourseCarousel`. Right now the homepage makes an API call and throws the answer away. Either wire the carousel in between the course and testimonial sections, or stop fetching it.

**Homepage FAQ answers are generic.** Every accordion on the homepage gets the same one-size-fits-all answer, while `/faq` has real, specific answers per question. Decide whether the homepage should just reuse the real answers.

**Mixed `<a>` / `<Link>` usage.** Some internal navigation uses a plain HTML link instead of Next's `<Link>`, which loses client-side navigation and prefetching. Not broken, just inconsistent — worth a pass.

**Rich text is injected raw.** Course and product descriptions render through `dangerouslySetInnerHTML`. The Admin Panel's editor (or the Backend) must sanitise that HTML before it ever reaches this site — this repo has no sanitisation step of its own.

**No admin system lives here.** Adding a field to `types/landing-*.ts` changes nothing by itself. Any new field needs a matching change in the Backend response, the Admin Panel form, and its own validation — coordinate all three, not just this repo.

## 10. Configuration & content editing

> **In plain terms:** Nobody needs to touch code to update the free-practice videos, FAQ wording, or footer links — they all live in one plain data file. Images and the hero video are just files in the project; swap them and rebuild.

### Environment variables — `.env.local`

| Variable | Required? | Used for |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Required | Every backend request, public and logged-in |
| `API_BASE_URL` | Optional | Server-side fallback if the public variable isn't set |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Required for checkout | Browser-side Razorpay public key |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URLs & page metadata (defaults to `https://kratikayoga.com` if unset) |

**Never** put a Razorpay secret, backend signing key, or database credential in a `NEXT_PUBLIC_*` variable — anything with that prefix ships straight to every visitor's browser. Only the public Razorpay key belongs there.

### Where to edit things

- **Navigation, footer links, FAQ questions, testimonials, free-practice videos** → `data/landing-page.ts`
- **Landing images** → `assets/images/landing/` — update the import if a filename changes
- **Hero video** → must exist at `public/videos/hero-video.mp4` before deploying
- **New image hosts** → add to `remotePatterns` in `next.config.ts` before using with `next/image`. Currently allowed: `imagedelivery.net`, `res.cloudinary.com`
- **Landing page styles** → `assets/styles/landing.css`, with targeted overrides in `landing-overrides.css` (loaded after, so it wins)
- **Currency formatting** → `lib/formatters/currency.ts`, Indian Rupees via `toLocaleString("en-IN")`

## 11. Shipping a change

- [ ] Production `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_BASE_URL` are set correctly
- [ ] Backend CORS allows the production site's origin and the `Authorization` header
- [ ] Cookie domain, Secure flag, and SameSite policy are right for the deployed domain
- [ ] Backend responses match the documented `success` / `data` shape
- [ ] Any new remote image host is allow-listed in `next.config.ts`
- [ ] Razorpay is on the production key, and the Backend verifies signatures server-side
- [ ] `public/videos/hero-video.mp4`, favicons and the metadata image are in the build
- [ ] `pnpm lint` and `pnpm build` both pass
- [ ] Smoke-test: `/`, `/courses`, `/pdf-courses`, `/affiliate-products`, `/faq`, login, dashboard, PDF checkout, course checkout, video playback
- [ ] Deliberately test an empty/failed backend response — the landing wrappers should degrade to their fallback message, not crash the page

---

# Part B — The Admin Panel (reference)

Lives in a separate codebase (`Admin-Panel/`), not inside this repo. Summarised here as documented by that project — this pass did not re-verify it against its own source.

## 12. What the owner uses to run the site

> **In plain terms:** This is the owner's control room: a separate, password-protected website where courses, PDFs and recommended products get created, priced, published, and taken down. Anything published here is what customers see on the main site — usually within about ten minutes, because of the caching described in §4.

### 12.1 Built with

React 19 + TypeScript, bundled with Vite; React Router for navigation; Axios for requests; Tailwind CSS v4; TipTap for the rich-text description editor; `tus-js-client` for resumable video uploads to Cloudflare Stream; deployed on Vercel.

### 12.2 Sign-in

Email + password, then a 6-digit emailed OTP, then a JWT stored in the same-named `yoga_platform_auth_token` cookie used on the learner site — but this is a *separate* login system with its own session; admin and learner tokens are never interchangeable.

### 12.3 What it manages

| Area | Can do |
| --- | --- |
| Video courses | Create (3-step wizard), edit, publish, delete, reorder; upload thumbnails to Cloudflare Images and videos to Cloudflare Stream; view analytics, enrolments & reviews; revoke or restore a learner's access with a reason |
| PDF courses | Create, edit, delete, reorder; PDF + thumbnail upload straight to Cloudinary via a signed URL from the Backend |
| Affiliate products | Create, edit, delete, reorder; same signed-upload pattern as PDFs |

### 12.4 How it reaches the Backend

Every admin request is prefixed with an admin-only namespace — keep it that way, and never substitute a public endpoint into an admin call:

```
https://api.kratikayoga.com/app/api/v1/admin
```

Condensed endpoint map — full detail lives in the Admin Panel's own handover doc.

| Area | Representative endpoints |
| --- | --- |
| Auth | `/auth/login` · `/auth/verify-otp` · `/auth/forgot-password` · `/auth/reset-password` · `/auth/verify/me` |
| Courses | `/course/fetch/all` · `/course/add/step-one` · `/course/edit/{id}` · `/course/publish/{id}` · `/course/analytics/{id}` · `/course/{id}/users/{id}/revoke-access` |
| Course videos | `/uploads/videos/fetch` · `/uploads/videos/upload-url` · `/uploads/videos/reorder` |
| PDF courses | `/pdf-course/fetch` · `/pdf-course/add` · `/pdf-course/edit` · `/pdf-course/reorder` |
| Affiliate products | `/affiliate-product/fetch` · `/affiliate-product/add` · `/affiliate-product/reorder` |

### 12.5 External services in play

- **Cloudflare Images** — thumbnails for courses, PDFs, products and custom video thumbnails
- **Cloudflare Stream** — video hosting and playback; a freshly uploaded video sits in *Processing* until Cloudflare's webhook tells the Backend it's ready
- **Cloudinary** — PDF files and their thumbnails, plus affiliate product images
- **Email provider** — admin OTP and password-reset emails, configured in the Backend

### 12.6 Known considerations

- The admin session cookie is readable by JavaScript (not HttpOnly) — treat dependency hygiene and XSS prevention as high priority while that's true.
- No automated test suite; confidence currently comes from TypeScript, linting, and manual smoke testing.
- Listing and filtering in the admin UI assume the Backend returns the full collection — large catalogues will eventually need server-side pagination.
- Single-admin assumptions live in the Backend's auth service; multi-admin roles would need coordinated changes across Backend middleware, JWT claims, and the Admin Panel's navigation/permissions.

## 13. Glossary

> For the non-technical reader — the developer sections above use these terms without re-explaining them each time.

| Term | Meaning |
| --- | --- |
| **API** | The set of web addresses (endpoints) the Backend exposes for other software to ask for data or trigger an action — "please give me the course list," "please charge this card." |
| **Endpoint** | One specific address within an API, e.g. `/courses/top-rated`. |
| **Cookie** | A small piece of data a website stores in your browser so it can recognise you on your next request — here, it holds proof that you're logged in. |
| **JWT** | "JSON Web Token" — the specific format of the proof-of-login stored in that cookie. Issued by the Backend and expires after a set time. |
| **CORS** | A browser security rule that stops one website from quietly calling another site's API unless that API explicitly allows it. The Backend has to name this site as allowed. |
| **Cache / revalidate** | Reusing a previously-fetched answer for a while instead of asking again on every visit — here, up to 10 minutes, which is why a newly published course can take a few minutes to appear. |
| **Webhook** | A notification one service sends to another when something finishes — e.g. Cloudflare tells the Backend "this video is ready to play." |
| **CDN** | A network of servers (like Cloudflare or Cloudinary) that stores and delivers images/video/files quickly, closer to the visitor. |
| **Environment variable** | A setting supplied outside the code itself (e.g. which web address to call) so the same code can run differently in development vs. production without being edited. |
| **Repository / repo** | One self-contained project's code, e.g. this website is one repo, the Admin Panel is another. |

## 14. Developer quick-reference card

**Commands**
```
pnpm install       install dependencies
pnpm dev            → http://localhost:3000
pnpm lint
pnpm build
pnpm start
```

**Key env vars**
```
NEXT_PUBLIC_API_BASE_URL     API base (keep the /app/api/v1 suffix)
API_BASE_URL                 server-side fallback
NEXT_PUBLIC_RAZORPAY_KEY_ID   Razorpay public key
NEXT_PUBLIC_SITE_URL          canonical URL base
```

**Files worth knowing**
```
lib/api/multiple.api.ts       shared authenticated API client
lib/api/landing-*.ts          public landing-page fetchers
lib/helper/hepler.ts          auth cookie helpers
lib/config/envConfig.ts       env var normalisation
lib/seo.ts                    metadata / canonical URL helper
data/landing-page.ts          static copy, nav, FAQ, free courses
next.config.ts                allowed remote image hosts
```

**Auth cookie**
```
name:          yoga_platform_auth_token
expiry:        30 days default
prod domain:   kratikayoga.com
local domain:  none (host-scoped)
```

---

*Kratika Yoga — Platform Handover · Landing-page section fact-checked against the `development` branch, 8 Sept 2026.*
