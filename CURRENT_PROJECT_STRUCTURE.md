# Frontend: current project structure (`yoga-course-landing-page`)

> A snapshot of the code **as it is today** (2026-10-09). It lists every folder, file, route and function so new features can be planned against the real codebase.
>
> Note: `YOGA_PLATFORM_FOLDER_STRUCTURE.md` in this folder describes a *target/approved* structure (e.g. `(marketing)`, `learn/`, `profile/`, `components/sections/`, `services/`). Several of those folders do **not** exist yet. This file describes what actually exists.

---

## 1. Tech stack

| Area | Tool |
|---|---|
| Framework | Next.js 16.3 (App Router), React 19.2, TypeScript 5 |
| Styling | Tailwind CSS 4 + `tw-animate-css` + `shadcn` CSS, plus hand-written CSS in `assets/styles/` |
| UI primitives | `@base-ui/react` (shadcn-style wrappers in `components/ui/`), `lucide-react`, `react-icons` |
| HTTP | `axios` (client, authenticated calls), native `fetch` (server components, ISR) |
| Auth storage | `js-cookie` (cookie) or `sessionStorage` (when "remember me" is off) |
| Video | `hls.js` (Cloudflare Stream HLS playback) |
| Carousels | `swiper` |
| OTP input | `input-otp` |
| Payments | Razorpay Checkout script (`https://checkout.razorpay.com/v1/checkout.js`) |
| Package manager | pnpm 10.2.1 |

Scripts: `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`.

Path alias: `@/*` → project root (see `tsconfig.json`).

### Environment variables (`.env`)

| Variable | Used in | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `lib/config/envConfig.ts` | Backend base URL (for example `https://host/app/api/v1`) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `lib/config/envConfig.ts` | Razorpay public key for checkout |
| `NEXT_PUBLIC_SITE_URL` (optional) | `lib/seo.ts` | Canonical site URL; defaults to `https://kratikayoga.com` |

`next.config.ts` allows remote images from `imagedelivery.net` (Cloudflare Images) and `res.cloudinary.com`.

---

## 2. Folder tree

```text
yoga-course-landing-page/
├── app/                              # Next.js App Router (routes only)
│   ├── layout.tsx                    # Root layout: fonts, metadata, <Toaster />
│   ├── globals.css                   # Imports Tailwind + all files in assets/styles/
│   ├── sitemap.ts                    # /sitemap.xml generator
│   ├── (landing)/                    # Public home page group
│   │   ├── layout.tsx                # Navbar + Footer wrapper
│   │   └── page.tsx                  # "/"  (ISR 600s)
│   ├── (auth)/                       # Login/signup flows (client session guard)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── verify-email/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (protected)/                  # Logged-in area (dashboard shell)
│   │   ├── layout.tsx                # Verifies session via /auth/verify/me
│   │   ├── dashboard/{layout,page}.tsx
│   │   ├── course/
│   │   │   ├── enrolled/page.tsx
│   │   │   ├── enrolled/[courseId]/{layout,page}.tsx          # page re-exports my-courses/[courseId]
│   │   │   ├── enrolled/[courseId]/videos/[videoId]/{layout,page}.tsx  # page re-exports my-courses video page
│   │   │   └── explore/page.tsx
│   │   ├── my-courses/
│   │   │   ├── page.tsx              # redirect → /course/enrolled
│   │   │   ├── [courseId]/{layout,page}.tsx                    # Course detail + buy
│   │   │   └── [courseId]/videos/[videoId]/{layout,page}.tsx   # Video player
│   │   └── pdf-course/
│   │       ├── explore/{page,loading}.tsx
│   │       ├── purchased/{page,loading}.tsx
│   │       └── [courseId]/{layout,page,loading}.tsx
│   ├── courses/{page,loading}.tsx           # Public paid-course listing
│   ├── pdf-courses/{page,loading}.tsx       # Public PDF listing (ISR 600s)
│   ├── affiliate-products/{page,loading}.tsx # Public product listing (ISR 600s)
│   ├── faq/page.tsx
│   ├── privacy-policy/page.tsx
│   ├── terms/page.tsx
│   └── sitemap/page.tsx              # Human-readable sitemap page
│
├── components/
│   ├── auth/                         # email-verification-banner.tsx
│   ├── course/                       # course-card, course-detail, course-listing-page, course-skeletons, star-rating
│   ├── dashboard/                    # dashboard-loading, dashboard-skeleton
│   ├── landing-page/                 # All public landing sections (hero, about, carousels, footer, navbar…)
│   ├── layout/                       # dashboard-header, dashboard-session (context), dashboard-sidebar, section-container
│   ├── pdf-course/                   # pdf-course-detail-page, pdf-course-listing-page, skeletons
│   ├── shared/                       # course-error-state, library-empty-state, logo
│   └── ui/                           # shadcn/base-ui primitives: alert-dialog, button, input, input-otp, skeleton, toast (+ components.md)
│
├── features/
│   └── auth/components/              # login, signup, verify-email, forgot-password, reset-password forms
│
├── hooks/                            # useDebounce.ts, useOnline.hook.ts
│
├── lib/
│   ├── api/                          # multiple.api.ts (axios) + landing-*.ts (server fetch)
│   ├── config/envConfig.ts
│   ├── formatters/currency.ts
│   ├── helper/hepler.ts              # cookie/session storage helpers (file name has a typo)
│   ├── helper/time.ts
│   ├── validation/auth.validation.ts
│   ├── seo.ts
│   └── utils.ts
│
├── types/                            # Shared TS interfaces (api, auth, course, payment, pdf-course, user, landing-*)
├── data/landing-page.ts              # Static landing content (nav links, footer, FAQs, testimonials…)
├── assets/
│   ├── image-assets.ts               # (empty)
│   ├── images/landing/               # Landing images
│   └── styles/                       # base, landing, landing-overrides, dashboard, course-catalogue, course-detail, video-playback .css
├── public/                           # favicon/, free-course/*.webp, videos/hero-video.mp4, meta-image.png
│
├── next.config.ts, tsconfig.json, eslint.config.mjs, postcss.config.mjs, components.json
├── DEVELOPER_HANDOVER.md             # Earlier handover notes
├── YOGA_PLATFORM_FOLDER_STRUCTURE.md # Target structure rules (see note at top)
└── CURRENT_PROJECT_STRUCTURE.md      # This file
```

There is no global state library and no `store/` folder. The only shared client state is the `DashboardSession` React context.

---

## 3. Route map

### Public routes

| URL | File | Rendering | Data source |
|---|---|---|---|
| `/` | `app/(landing)/page.tsx` → `components/landing-page/landing-page.tsx` | Server, ISR 600s | `getLandingCourses("top-rated")`, `getLandingPdfCourses("top")` |
| `/courses` | `app/courses/page.tsx` | Server | `getLandingCourses("all")` |
| `/pdf-courses` | `app/pdf-courses/page.tsx` | Server, ISR 600s | `getLandingPdfCourses("all")` |
| `/affiliate-products` | `app/affiliate-products/page.tsx` | Server, ISR 600s | `getLandingAffiliateProducts()` |
| `/faq` | `app/faq/page.tsx` | Static | `data/landing-page.ts` |
| `/privacy-policy`, `/terms` | `app/privacy-policy/page.tsx`, `app/terms/page.tsx` | Static | — |
| `/sitemap` | `app/sitemap/page.tsx` | Static | — |
| `/sitemap.xml` | `app/sitemap.ts` | Generated | List of public routes |

### Auth routes (`app/(auth)/`)

`layout.tsx` wraps pages in `AuthSessionGuard`, which redirects already-logged-in users away from the auth pages.

| URL | Page | Form component |
|---|---|---|
| `/login?returnTo=` | `login/page.tsx` | `LoginForm` |
| `/signup?returnTo=` | `signup/page.tsx` | `SignupForm` |
| `/verify-email` | `verify-email/page.tsx` | `VerifyEmailForm` |
| `/forgot-password` | `forgot-password/page.tsx` | `ForgotPasswordForm` |
| `/reset-password?token=` | `reset-password/page.tsx` | `ResetPasswordForm` |

### Protected routes (`app/(protected)/`)

`layout.tsx` calls `GET /auth/verify/me` on mount. It shows `DashboardLoading` while waiting, redirects to `/login` on failure, and otherwise renders the sidebar/header shell. It also shows `EmailVerificationBanner` if the email is not verified, and provides the user via `DashboardSession`.

| URL | File | What it does |
|---|---|---|
| `/dashboard` | `dashboard/page.tsx` | Greeting, my courses, explore courses, purchased PDFs, affiliate products |
| `/course/enrolled` | `course/enrolled/page.tsx` | `<CourseListingPage mode="enrolled" />` |
| `/course/explore` | `course/explore/page.tsx` | `<CourseListingPage mode="explore" />` |
| `/course/enrolled/[courseId]` | re-export of `my-courses/[courseId]/page.tsx` | Course detail |
| `/course/enrolled/[courseId]/videos/[videoId]` | re-export of `my-courses/.../videos/[videoId]/page.tsx` | Video player |
| `/my-courses` | `my-courses/page.tsx` | `redirect("/course/enrolled")` |
| `/my-courses/[courseId]` | `my-courses/[courseId]/page.tsx` | Course detail, Razorpay purchase |
| `/my-courses/[courseId]/videos/[videoId]` | `my-courses/[courseId]/videos/[videoId]/page.tsx` | HLS player, rating, mark complete |
| `/pdf-course/explore` | `pdf-course/explore/page.tsx` | `<PdfCourseListingPage mode="explore" />` |
| `/pdf-course/purchased` | `pdf-course/purchased/page.tsx` | `<PdfCourseListingPage mode="purchased" />` |
| `/pdf-course/[courseId]` | `pdf-course/[courseId]/page.tsx` | `<PdfCourseDetailPage />`: buy or download |

Sidebar links (`components/layout/dashboard-sidebar.tsx`): `/dashboard`, `/course/enrolled`, `/pdf-course/explore`, `/affiliate-products`, plus Logout.

---

## 4. Backend endpoints used by the frontend

Authenticated calls go through `multipleApiHandler` (axios) with paths relative to `NEXT_PUBLIC_API_BASE_URL`. Public landing data uses server-side `fetch` with `revalidate: 600`. Those helpers append `/app/api/v1` to the base URL when it is missing.

| Method | Endpoint | Auth | Called from |
|---|---|---|---|
| POST | `/auth/sign-up` | – | `features/auth/components/signup-form.tsx` |
| POST | `/auth/login` | – | `features/auth/components/login-form.tsx` |
| POST | `/auth/verify-otp` | – | `verify-email-form.tsx` |
| POST | `/auth/resend-otp` | – | `verify-email-form.tsx`, `components/auth/email-verification-banner.tsx` |
| POST | `/auth/forgot-password` | – | `forgot-password-form.tsx` |
| POST | `/auth/reset-password` | – | `reset-password-form.tsx` |
| GET | `/auth/verify/me` | ✔ | `app/(protected)/layout.tsx` |
| GET | `/courses` | ✔ | dashboard, `course-listing-page.tsx` (explore) |
| GET | `/courses/my-courses` | ✔ | dashboard, `course-listing-page.tsx` (enrolled) |
| GET | `/courses/top-rated`, `/courses/all` | – | `lib/api/landing-courses.ts` |
| GET | `/courses/reviews` | – | `lib/api/landing-reviews.ts` |
| GET | `/courses/:courseId` | ✔ | `my-courses/[courseId]/page.tsx` |
| POST | `/courses/:courseId/review` | ✔ | `components/course/course-detail.tsx` |
| GET | `/courses/:courseId/videos/:videoId/playback` | ✔ | video page |
| GET | `/courses/:courseId/videos/:videoId/others` | ✔ | video page |
| POST | `/courses/:courseId/videos/:videoId/rating` | ✔ | video page |
| POST | `/courses/:courseId/videos/:videoId/complete` | ✔ | video page |
| GET | `/pdf-courses/top`, `/pdf-courses/all` | – | `lib/api/landing-pdf-courses.ts` |
| GET | `/pdf-courses/explore`, `/pdf-courses/purchased` | ✔ | `pdf-course-listing-page.tsx`, dashboard |
| GET | `/pdf-courses/:id` | ✔ | `pdf-course-detail-page.tsx` |
| GET | `/pdf-courses/:id/access` | ✔ | `pdf-course-detail-page.tsx` (download, returns `fileUrl`) |
| GET | `/affiliate-products` | – | dashboard, `lib/api/landing-affiliate-products.ts` |
| POST | `/payments/orders` | ✔ | course detail (`{ courseId }`) |
| POST | `/payments/pdf-orders` | ✔ | PDF detail (`{ pdfCourseId }`) |
| POST | `/payments/verify` | ✔ | course and PDF detail after Razorpay success |

---

## 5. Key flows

**Auth token.** After login, `LoginForm` stores the JWT under the key `yoga_platform_auth_token`:
- "Remember me" on: cookie via `storeDataInSecureCookie(token, key, true)`. The cookie lasts 30 days, is `Secure` in production, and is scoped to `kratikayoga.com`.
- "Remember me" off: `sessionStorage` via `storeDataInSessionStorage`.

`getAuthToken(key)` reads the cookie first, then `sessionStorage`. `VerifyEmailForm` also stores the token in the cookie after OTP success.

**Protected API calls.** If `endpoint.protected` is true, `fetchEndpoint` in `lib/api/multiple.api.ts` adds `Authorization: Bearer <token>`. If no token exists, or the API returns **401, 403 or 404**, it clears storage and redirects to `/login?returnTo=<current path>`.

**Logout.** `DashboardSidebar.handleLogout` calls `clearLocalSessionStorage()` and routes to `/login`.

**Purchase (course and PDF):**
1. `POST /payments/orders` (or `/payments/pdf-orders`) returns a Razorpay order.
2. `new window.Razorpay({...}).open()`; the script is loaded with `next/script`.
3. Razorpay's success handler calls `POST /payments/verify`.
4. The page re-fetches the course to check access. Enrollment is actually granted by the backend Razorpay **webhook**.

**Video playback.** The video page fetches `/playback` and `/others` in parallel, attaches `hls.js` to the `hlsUrl`, and uses custom controls (play, mute, volume, fullscreen). It calls `/complete` when the video ends, and the user can rate the video with `StarRating`.

**Debounced handlers.** Almost every async action is wrapped with `useDebounce(fn, delay)` from `hooks/useDebounce.ts` (default 500 ms) to prevent double submits.

---

## 6. File-by-file reference (functions and exports)

`[client]` marks files with `"use client"`.

### `app/`

| File | Exports / functions |
|---|---|
| `layout.tsx` | `metadata`, `RootLayout` (mounts `<Toaster />`) |
| `sitemap.ts` | `sitemap()` |
| `(landing)/layout.tsx` | `LandingLayout` |
| `(landing)/page.tsx` | `metadata`, `revalidate = 600`, `Page` |
| `(auth)/layout.tsx` [client] | `AuthLayout`, `AuthSessionGuard` (internal) |
| `(auth)/login/page.tsx` | `metadata`, `LoginPage({ searchParams })` |
| `(auth)/signup/page.tsx` | `metadata`, `SignupPage({ searchParams })` |
| `(auth)/verify-email/page.tsx` | `metadata`, `VerifyEmailPage` |
| `(auth)/forgot-password/page.tsx` | `metadata`, `ForgotPasswordPage` |
| `(auth)/reset-password/page.tsx` | `metadata`, `ResetPasswordPage({ searchParams })` |
| `(protected)/layout.tsx` [client] | `RootLayout`: `redirectToLogin`, `verifySession` (debounced) |
| `(protected)/dashboard/layout.tsx` | `metadata`, `DashboardPageLayout` |
| `(protected)/dashboard/page.tsx` [client] | `DashboardPage`: `fetchDashboardData` |
| `(protected)/course/enrolled/page.tsx` | `metadata`, `EnrolledCoursesPage` |
| `(protected)/course/explore/page.tsx` | `metadata`, `ExploreCoursesPage` |
| `(protected)/course/enrolled/[courseId]/layout.tsx` | `metadata`, `CourseDetailLayout` |
| `(protected)/course/enrolled/[courseId]/videos/[videoId]/layout.tsx` | `metadata`, `EnrolledVideoLessonLayout` |
| `(protected)/my-courses/page.tsx` | `metadata`, `MyCoursesRedirect` |
| `(protected)/my-courses/[courseId]/layout.tsx` | `metadata`, `MyCourseLayout` |
| `(protected)/my-courses/[courseId]/page.tsx` [client] | `CourseDetailPage`: `fetchCourse`, `handleBuyCourse`, `verifyPayment` |
| `(protected)/my-courses/[courseId]/videos/[videoId]/layout.tsx` | `metadata`, `VideoLessonLayout` |
| `(protected)/my-courses/[courseId]/videos/[videoId]/page.tsx` [client] | `VideoPlaybackPage`: `loadPlayback`, `submitRating`, `completeVideo`, `handleVideoEnded`, `togglePlay`, `toggleMute`, `changeVolume`, `toggleFullscreen`, `handleFullscreenChange`; type `FullscreenVideoElement` |
| `(protected)/pdf-course/[courseId]/layout.tsx` | `metadata`, `PdfCourseDetailLayout` |
| `(protected)/pdf-course/[courseId]/page.tsx` | `PdfCourseDetailsRoute` |
| `(protected)/pdf-course/explore/page.tsx` | `metadata`, `ExplorePdfCoursesPage` |
| `(protected)/pdf-course/purchased/page.tsx` | `metadata`, `PurchasedPdfCoursesPage` |
| `(protected)/pdf-course/*/loading.tsx` | `Loading` |
| `courses/page.tsx` / `loading.tsx` | `metadata`, `CoursesPage` / `CoursesLoading` |
| `pdf-courses/page.tsx` / `loading.tsx` | `metadata`, `revalidate`, `PdfCoursesPage` / `PdfCoursesLoading` |
| `affiliate-products/page.tsx` / `loading.tsx` | `metadata`, `revalidate`, `AffiliateProductsPage` / `AffiliateProductsLoading` |
| `faq/page.tsx` | `metadata`, `FaqPage` |
| `privacy-policy/page.tsx` | `metadata`, `PrivacyPolicyPage` |
| `terms/page.tsx` | `metadata`, `TermsPage` |
| `sitemap/page.tsx` | `metadata`, `SitemapPage`, `SitemapGroup` (internal) |

### `components/`

| File | Exports / functions |
|---|---|
| `auth/email-verification-banner.tsx` [client] | `EmailVerificationBanner({ email, encryptedToken })`: `handleVerifyEmail` |
| `course/course-card.tsx` | type `Course`, `CourseCard`, `PdfCard`, `ProductCard`, `ExploreRow`, `Stat`, `completedIcon` |
| `course/course-detail.tsx` [client] | `CourseDetailHero` (`handleShare`), `CourseAboutSection`, `CourseVideoCard`, `CourseVideoSection`, `CourseCompletionSection` (`submitReview`) |
| `course/course-listing-page.tsx` [client] | `CourseListingPage({ mode: "enrolled" \| "explore" })`: `fetchCourses`; config object `listingContent` |
| `course/course-skeletons.tsx` | `CourseDetailSkeleton`, `CourseListingSkeleton`, `VideoPlaybackSkeleton` |
| `course/star-rating.tsx` [client] | `StarRating({ value, onChange, readOnly, label })`: `updateRating` |
| `dashboard/dashboard-loading.tsx` [client] | `DashboardLoading` |
| `dashboard/dashboard-skeleton.tsx` | `DashboardSkeleton` (+ internal `PanelHeadingSkeleton`, `CourseCardSkeleton`, `ProductCardSkeleton`) |
| `landing-page/landing-page.tsx` | `LandingPage` (async server component) |
| `landing-page/hero-section.tsx` | `HeroSection` |
| `landing-page/about-section.tsx` | `AboutSection` |
| `landing-page/platform-sections.tsx` | `PlatformSections` (+ internal `CategoryHighlights`, `Faq`, `FinalCta`) |
| `landing-page/course-carousel.tsx` [client] | `CourseCarousel({ courses, error })`: `copyCourseLink` |
| `landing-page/pdf-course-carousel.tsx` [client] | `PdfCourseCarousel({ courses, error })` |
| `landing-page/free-course-swiper.tsx` [client] | `FreeCourseSwiper` |
| `landing-page/instagram-feedback-swiper.tsx` [client] | `InstagramFeedbackSwiper` |
| `landing-page/testimonial-swiper.tsx` [client] | `TestimonialSwiper({ reviews, error })` |
| `landing-page/testimonials-section.tsx` | `TestimonialsSection` (async), `TestimonialsSkeleton` |
| `landing-page/paid-course-listing.tsx` | `PaidCourseListing({ courses, error })` |
| `landing-page/pdf-course-listing.tsx` | `PdfCourseListing({ courses, error })` |
| `landing-page/affiliate-product-listing.tsx` | `AffiliateProductListing({ products, error })` |
| `landing-page/course-rating-stars.tsx` | `CourseRatingStars({ rating, label })` |
| `landing-page/section-intro.tsx` | `SectionIntro({ eyebrow, title, description })` |
| `landing-page/navbar.tsx` [client] | `Navbar` |
| `landing-page/footer.tsx` | `Footer` |
| `layout/dashboard-header.tsx` | `DashboardHeader({ onMenuClick, isMenuOpen })` |
| `layout/dashboard-session.tsx` [client] | `DashboardSession({ user, children })` (context provider), `useDashboardSession()` |
| `layout/dashboard-sidebar.tsx` [client] | `DashboardSidebar({ isOpen, onClose })`: `handleLogout` |
| `layout/section-container.tsx` | `SectionContainer` |
| `pdf-course/pdf-course-detail-page.tsx` [client] | default `PdfCourseDetailPage`: `fetchCourse`, `downloadPdf`, `purchaseCourse`, `verifyPayment` |
| `pdf-course/pdf-course-listing-page.tsx` [client] | `PdfCourseListingPage({ mode: "explore" \| "purchased" })`: `fetchCourses` |
| `pdf-course/pdf-course-listing-skeleton.tsx` | `PdfCourseListingSkeleton` |
| `pdf-course/pdf-course-skeleton.tsx` | `PdfCourseSkeleton` |
| `shared/course-error-state.tsx` | `CourseErrorState({ message, onRetry })` |
| `shared/library-empty-state.tsx` | `LibraryEmptyState` |
| `shared/logo.tsx` | `Logo` |
| `ui/alert-dialog.tsx` [client] | `AlertDialog`, `AlertDialogTrigger`, `AlertDialogPortal`, `AlertDialogOverlay`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogMedia`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel` |
| `ui/button.tsx` | `Button` (+ cva variants) |
| `ui/input.tsx` | `Input` |
| `ui/input-otp.tsx` [client] | `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator` |
| `ui/skeleton.tsx` | `Skeleton` |
| `ui/toast.tsx` [client] | `toast` manager, `Toaster`, `ToastProvider`, `ToastPortal`, `ToastViewport`, `Toast`, `ToastContent`, `ToastTitle`, `ToastDescription`, `ToastAction`, `ToastClose`, `ToastIcon`, `ToastList`. Use as `toast.add({ title, description, type })` |

### `features/auth/components/` (all [client])

| File | Exports / functions |
|---|---|
| `login-form.tsx` | `LoginForm({ returnTo })`: `updateValue`, `submitLogin`, `handleSubmit` |
| `signup-form.tsx` | `SignupForm({ returnTo })`: `submitSignup`, `handleSubmit` |
| `verify-email-form.tsx` | `VerifyEmailForm({ email, returnTo })`: `submitVerify`, `submitResend`, `handleSubmit`, `handleResend` |
| `forgot-password-form.tsx` | `ForgotPasswordForm`: `submitForgotPassword`, `handleSubmit` |
| `reset-password-form.tsx` | `ResetPasswordForm({ token })`: `submitResetPassword`, `handleSubmit` |

### `hooks/`

| File | Exports |
|---|---|
| `useDebounce.ts` | `useDebounce(callback, delay = 500)` |
| `useOnline.hook.ts` | default `useOnlineStatus()` |

### `lib/`

| File | Exports / functions |
|---|---|
| `api/multiple.api.ts` | `multipleApiHandler(endpoints[], signal?)`; internal `getUrl`, `redirectToLogin`, `axiosApiErrorHandler`, `fetchEndpoint` |
| `api/landing-courses.ts` | `getLandingCourses(kind: "top-rated" \| "all")`; internal `fallbackCourse` |
| `api/landing-pdf-courses.ts` | `getLandingPdfCourses(kind: "top" \| "all")`; internal `fallbackPdfCourse` |
| `api/landing-affiliate-products.ts` | `getLandingAffiliateProducts()`; internal `fallbackProduct` |
| `api/landing-reviews.ts` | `getLandingReviews()` |
| `config/envConfig.ts` | `EnvConfig { CURRENT_ENVIRONMENT, OWNER_NAME, API_BASE_URL, RAZORPAY_KEY_ID }` |
| `formatters/currency.ts` | `formatCurrency(value)` |
| `helper/hepler.ts` | `cn`, `getDataFromSecureCookie`, `storeDataInSecureCookie`, `getDataFromSessionStorage`, `storeDataInSessionStorage`, `removeDataFromSecureCookie`, `removeDataFromSessionStorage`, `getAuthToken`, `clearLocalSessionStorage`, `getRemainingCountDownSeconds`, `formatCountDownTime`, `isValidUrl`; internal `getCookieConfig` |
| `helper/time.ts` | `getTimeGreeting(date?)` |
| `seo.ts` | `metaImage`, `siteUrl`, `pageMetadata(title, description, path)` |
| `utils.ts` | `cn`, `formatVideoDuration`, `formatDuration`, `formatTime` |
| `validation/auth.validation.ts` | `validateEmailAddress`, `validateLoginForm`, `validateSignupForm`, `validateVerifyEmailForm`, `validateForgotPasswordForm`, `validateResetPasswordForm` |

### `types/`

| File | Types |
|---|---|
| `api.ts` | `ApiMethod`, `EndpointObject { endPoint, method?, protected?, header?, data? }`, `CommonDataFormat`, `ApiReturnInterface` |
| `auth.ts` | `VerifiedUser`, `VerifyUserData`, `VerifyUserResponse` |
| `course.ts` | `CourseVideo`, `Course`, `CourseDetailsResponse`, `ApiCourse`, `CoursesResponse`, `VideoPlayback`, `VideoPlaybackResponse` |
| `pdf-course.ts` | `PdfCourse`, `PdfCoursesResponse`, `PdfCourseResponse`, `PdfPurchaseOrderResponse`, `PdfPaymentVerifyResponse`, `PdfAccessResponse` |
| `payment.ts` | `RazorpayPaymentResponse`, `RazorpayOptions`, `RazorpayOrder`, `WindowWithRazorpay` |
| `user.ts` | `LoginFormData/Errors`, `SignupFormData/Errors`, `VerifyEmailFormData/Errors`, `ForgotPasswordFormData/Errors`, `ResetPasswordFormData/Errors` |
| `affiliate-product.ts` | `AffiliateProduct`, `AffiliateProductsResponse` |
| `landing-course.ts` | `LandingCourse`, `LandingCoursesResponse` |
| `landing-pdf-course.ts` | `LandingPdfCourse`, `LandingPdfCoursesResponse` |
| `landing-affiliate-product.ts` | `LandingAffiliateProduct`, `LandingAffiliateProductsResponse` |
| `landing-review.ts` | `LandingReview`, `LandingReviewsResponse` |
| `landing-content.ts` | `NavLink`, `FreeCourse`, `Testimonial`, `EssentialProduct`, `FooterColumn` |
| `helper.interface.ts` | `CookieConfigInterface` |

### `data/landing-page.ts`

Static content: `landingNavLinks`, `footerColumns`, `aboutPrinciples`, `freeCourses`, `testimonials`, `essentialProducts`, `faqQuestions`.

### `assets/styles/` (all imported by `app/globals.css`, in this order)

`base.css` → `landing.css` → `dashboard.css` → `course-catalogue.css` → `course-detail.css` → `video-playback.css` → `landing-overrides.css`

---

## 7. Conventions to follow when adding features

- **New page:** add the route file under `app/` (inside `(protected)/` if login is required). Keep it thin and render a component from `components/<area>/` or `features/<feature>/components/`.
- **Metadata:** use `pageMetadata(title, description, path)` from `lib/seo.ts` for public pages. If the page is public, also add it to `app/sitemap.ts`.
- **Authenticated API call:** use `multipleApiHandler([{ endPoint, method, protected: true, data }])`, then check `response.ok` and `response.data.success`.
- **Public, SEO-relevant data:** add a server-side `fetch` helper in `lib/api/landing-*.ts` with `next: { revalidate: 600 }`.
- **Types:** put them in `types/<domain>.ts`. Put form validation in `lib/validation/`.
- **User feedback:** use `toast.add({ title, description, type: "success" | "error" })`.
- **Async click/submit handlers:** wrap them with `useDebounce`.
- **Shared client state:** use React Context (see `DashboardSession`). Do not add a global store.
- **Styles:** use Tailwind classes or the matching file in `assets/styles/`.

## 8. Known quirks (current state, not yet changed)

- `lib/helper/hepler.ts`: the file name is misspelled, and `cn()` is defined in both this file and `lib/utils.ts`.
- `assets/image-assets.ts` is empty.
- Course detail and video pages exist at two URLs (`/my-courses/...` and `/course/enrolled/...`). The `course/enrolled` versions re-export the `my-courses` pages.
- The backend returns **404** for a missing or invalid token, so the frontend treats 401, 403 and 404 on protected calls as "log out and redirect".
