# Yoga Platform Frontend Folder Structure

## Mandatory instruction for AI agents

This document defines the **only approved folder structure** for the Yoga Platform frontend.

- Follow this structure exactly.
- Do not introduce a different architectural pattern.
- Do not create a `store/` directory.
- Do not add Redux, Zustand, MobX, Recoil, Jotai, or another global state-management library.
- Use React Context API for shared client-side state.
- Do not create new top-level folders unless this document is updated first.
- Reuse an existing folder before creating a new one.
- Create feature-specific code inside `features/<feature-name>/`.
- Keep route files inside `app/`; do not place reusable UI or business logic there.

## Approved folder structure

```text
landing-page/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── courses/
│   │   │   ├── page.tsx
│   │   │   └── [courseId]/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── verify-email/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (protected)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── my-courses/
│   │   │   └── page.tsx
│   │   ├── learn/
│   │   │   └── [courseId]/
│   │   │       └── [videoId]/
│   │   │           └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── error.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-navigation.tsx
│   │   └── section-container.tsx
│   │
│   ├── sections/
│   │   ├── hero-section.tsx
│   │   ├── about-section.tsx
│   │   ├── benefits-section.tsx
│   │   ├── courses-section.tsx
│   │   ├── instructor-section.tsx
│   │   ├── testimonials-section.tsx
│   │   ├── faq-section.tsx
│   │   └── cta-section.tsx
│   │
│   ├── course/
│   │   ├── course-card.tsx
│   │   ├── course-grid.tsx
│   │   ├── course-progress.tsx
│   │   └── video-player.tsx
│   │
│   └── shared/
│       ├── logo.tsx
│       ├── page-heading.tsx
│       ├── empty-state.tsx
│       └── loading-spinner.tsx
│
│
├── contexts/
│   ├── auth-context.tsx
│   ├── course-context.tsx
│   └── app-providers.tsx
│
├── lib/
│   ├── api/
│   │   ├── api-client.ts
│   │   ├── endpoints.ts
│   │   └── error-handler.ts
│   ├── auth/
│   │   └── session.ts
│   ├── constants/
│   │   ├── navigation.ts
│   │   └── site.ts
│   ├── validations/
│   └── utils.ts
|   └── validation/
|       |── auth.validation.ts
│
├── hooks/
│   ├── use-media-query.ts
│   └── use-scroll.ts
│
├── types/
│   ├── api.ts
│   ├── course.ts
│   └── user.ts
│
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── courses/
│   │   ├── instructors/
│   │   └── testimonials/
│   ├── icons/
│   ├── fonts/
│   └── videos/
│
├── middleware.ts
├── components.json
├── yoga-platform-design-language.json
├── next.config.ts
└── package.json
```

## Context API rules

- Place all global React contexts in `contexts/`.
- Use `app-providers.tsx` as the single component that combines application providers.
- Import `AppProviders` once in the root `app/layout.tsx`.
- Keep context state minimal and limited to genuinely shared client state.
- Keep server-fetched data in Server Components whenever possible.
- Keep state used by only one feature or component local to that feature or component.
- A feature-specific context may be placed inside `features/<feature-name>/context/` only when it is not used outside that feature.

## Component placement rules

- `components/ui/`: reusable primitive components such as buttons, inputs and dialogs.
- `components/layout/`: shared page-shell components such as the header and footer.
- `components/sections/`: landing-page sections.
- `components/course/`: reusable course-related presentation components.
- `components/shared/`: reusable application components that do not fit the other groups.
- `features/`: feature-specific components, hooks, validation schemas, services and types.

## Current landing-page implementation

Create only the folders needed for the current implementation. For the initial landing page, use:

```text
app/
components/
├── ui/
├── layout/
├── sections/
└── shared/
contexts/
lib/
├── constants/
└── utils.ts
public/
├── images/
├── icons/
└── fonts/
```

Do not create empty future-feature folders merely to match the full tree. Add an approved folder only when its feature is being implemented.

## Design-system rule

All page sections must use `components/layout/section-container.tsx`. It must apply the spacing rules defined in `yoga-platform-design-language.json`, including the standard `16px` horizontal padding on mobile.


example of the validation file export const validateSignInForm = ({ value }: { value: LoginFormData }): ValidationResult => {
  const errors: Record<string, string> = {};

  let isValid = true;

  const email = value?.email?.trim() ?? "";
  const password = value?.password?.trim() ?? "";

  if (!email) {
    errors.email = ERROR_MESSAGES.PLEASE_ENTER_VALID_EMAIL;
    isValid = false;
  }

  if (email && !validator.isEmail(email)) {
    errors.email = ERROR_MESSAGES.PLEASE_ENTER_VALID_EMAIL;
    isValid = false;
  }

  if (!password) {
    errors.password = ERROR_MESSAGES.PLEASE_ENTER_A_LONG_PASSWORD;
    isValid = false;
  }

  if (password && password.length < 8) {
    errors.password = ERROR_MESSAGES.PLEASE_ENTER_A_LONG_PASSWORD;
    isValid = false;
  }

  if (password && !PASSWORD_REGEX.test(password)) {
    errors.password = ERROR_MESSAGES.PLEASE_ENTER_VALID_PASSWORD;
    isValid = false;
  }

  return { isValid, errors };
};