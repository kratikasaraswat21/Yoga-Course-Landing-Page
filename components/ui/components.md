# UI Components

This directory contains the reusable Shadcn-style UI components available in this project.

Import components using the `@/components/ui/...` alias.

## Available components

| Component | File | Description |
| --- | --- | --- |
| `Button` | [`button.tsx`](./button.tsx) | Action button with variants and sizes. |
| `Input` | [`input.tsx`](./input.tsx) | Styled single-line text input. |
| `InputOTP` | [`input-otp.tsx`](./input-otp.tsx) | One-time-password input composed of individual slots. |
| `Toast` | [`toast.tsx`](./toast.tsx) | Toast notification system with actions, icons, close controls, and a provider. |

## Exports by file

### `button.tsx`

- `Button`
- `buttonVariants`

`Button` supports these `variant` values:

- `default`
- `outline`
- `secondary`
- `ghost`
- `destructive`
- `link`

Supported `size` values:

- `default`
- `xs`
- `sm`
- `lg`
- `icon`
- `icon-xs`
- `icon-sm`
- `icon-lg`

Example:

```tsx
import { Button } from "@/components/ui/button"

<Button>Continue</Button>
<Button variant="outline" size="sm">Cancel</Button>
```

### `input.tsx`

- `Input`

`Input` accepts the standard HTML input props, including `type`, `placeholder`, `value`, `onChange`, `disabled`, and `aria-invalid`.

Example:

```tsx
import { Input } from "@/components/ui/input"

<Input type="email" placeholder="you@example.com" />
```

### `input-otp.tsx`

- `InputOTP`
- `InputOTPGroup`
- `InputOTPSlot`
- `InputOTPSeparator`

Use `InputOTP` with one or more groups and slots. `InputOTPSlot` requires an `index` prop.

Example:

```tsx
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

### `toast.tsx`

- `Toaster`
- `Toast`
- `ToastAction`
- `ToastClose`
- `ToastContent`
- `ToastDescription`
- `ToastPortal`
- `ToastProvider`
- `ToastTitle`
- `ToastViewport`
- `createToastManager`
- `toast`
- `useToastManager`

`Toaster` is the main convenience component. It provides the toast manager and renders the toast portal, viewport, and current toast list. Toast types supported by the built-in icon renderer are `success`, `info`, `warning`, `error`, and `loading`.

Example:

```tsx
import { Toaster, toast } from "@/components/ui/toast"

// Render once near the application root.
<Toaster />

// Trigger from an event handler.
toast.add({
  title: "Saved",
  description: "Your changes were saved successfully.",
  type: "success",
})
```

## Implementation notes

- Components use Tailwind CSS utility classes and the shared `cn` helper from `@/lib/utils`.
- `Button`, `Input`, and toast primitives are built on `@base-ui/react`.
- OTP inputs use the `input-otp` package.
- Icons come from `lucide-react`.
- Add new reusable UI components to this directory and update this inventory when they are added.
