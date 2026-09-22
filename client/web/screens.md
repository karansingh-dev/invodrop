# Screen catalog

Living layout notes for Invodrop. The user names a page (or part of a page) and one file.
Cursor puts all UI work in that file. The user owns logic, splitting, and modularization.

When a screen is added or redesigned, update this file so the next Cursor session has the same context.

## Rules of the road

- The user names a page (or part of a page) **and** one file. All layout work goes in that file.
- Do not create extra files, extract components, add routes, or write logic (no API, hooks, form state, toasts, or navigation flows).
- Folders and files: kebab-case (`sign-up/`, `sign-up-form.tsx`). Components: PascalCase matching the file (`SignUpForm`). Hooks/functions: camelCase (`signUp`). Routes: kebab-case (`/sign-up`).
- `pages/` is the route entry. Feature UI the user extracts later lives in `components/<feature>/`. Shared auth chrome lives in `components/auth/`. `components/ui/` is shadcn only.
- Use shadcn from `src/components/ui/` — compose primitives, do not restyle them.
- Use semantic Tailwind tokens. Never hardcode colors. Never edit `src/index.css`.

## Template for a new entry

```
## <Name> `<route>`
- File:
- Logic: none
- Layout:
- Pieces:
- Fields:
```

---

## Sign up `/sign-up`

- Page: `src/pages/auth/sign-up/index.tsx` — split canvas, mobile wordmark, composes the pieces below
- Form: `src/components/auth/sign-up/sign-up-form.tsx` (`SignUpForm`)
- Shared panel: `src/components/auth/brand-panel.tsx` (`BrandPanel`)
- Hook: `src/hooks/better-auth.ts` (`signUp`, `isSigningUp`, `resendVerification`, `isResending`)
- Logic: form submits through `signUp`; success navigates to `/check-email` with the email in location state; errors toast
- Layout: full-viewport **split auth canvas**
  - Desktop (`lg+`): brand panel on the left (`bg-sidebar`, border-r) with wordmark, headline, and a decorative invoice card. Form column on the right, content `max-w-sm` and vertically centered.
  - Mobile: wordmark lockup above a centered form. Brand panel is hidden.
- Pieces: `Button`, `Input`, `Field`, `FieldGroup`, `FieldLabel` (`lucide-react` `FileText` for the mark; `Eye` / `EyeOff` on the password field)
- Fields: **name**, **email**, **password** (password has a show/hide toggle)
- Copy: title “Create an account”; primary CTA “Create account”; footer link to `/sign-in` (visual only)
- Notes: inputs are taller than the default shadcn size (`h-10`) so the auth form feels easier to use. Password uses `pr-10` so the eye control does not overlap the text. Do not add confirm-password or social buttons until asked.

---

## Check email `/check-email`

- Page: `src/pages/auth/check-email/index.tsx` — same split auth canvas as sign-up
- Panel: `src/components/auth/check-email/check-email-panel.tsx` (`CheckEmailPanel`)
- Shared panel: `src/components/auth/brand-panel.tsx` (`BrandPanel`)
- Logic: page does not render unless `location.state.email` is set (from sign-up). Direct visits go to `/sign-up`. Signed-in sessions are sent to `/dashboard` by `GuestLayout`. Resend uses `resendVerification`.
- Layout: brand panel (`lg+`) | centered confirmation column (`max-w-sm`)
  - Mail mark, title, email in the body copy, inbox/spam note, resend button, verify CTA, back to sign-up
- Pieces: `Button`, `buttonVariants` on a `Link`, `lucide-react` `Mail` / `FileText`
- Copy: title “Check your email”; primary “Resend verification email”; outline “I have verified my email” → `/sign-in`

---

## Sign in `/sign-in`

- Page: `src/pages/auth/sign-in/index.tsx` (`SignInPage`) — layout and form live in this file
- Shared panel: `src/components/auth/brand-panel.tsx` (`BrandPanel`)
- Logic: form submits through `signIn`; unverified email (`EMAIL_NOT_VERIFIED`) goes to `/check-email` with the email in location state; success goes to `/dashboard`
- Layout: same split auth canvas as sign-up
  - Desktop (`lg+`): brand panel left, form column right (`max-w-sm`)
  - Mobile: wordmark above the form
- Pieces: `Button`, `Input`, `Field`, `FieldGroup`, `FieldLabel` (`FileText`, `Eye`, `EyeOff`)
- Fields: **email**, **password** (show/hide toggle, `h-10`, password `pr-10`)
- Copy: title “Welcome back”; CTA “Sign in”; “Forgot password?” → `/forgot-password` (visual only); footer link to `/sign-up`

---

## Forgot password `/forgot-password`

- Page: `src/pages/auth/forgot-password/index.tsx` (`ForgotPasswordPage`)
- Form: `src/components/auth/forgot-password/forget-password-form.tsx` (`ForgotPasswordForm`)
- Shared panel: `src/components/auth/brand-panel.tsx` (`BrandPanel`)
- Logic: form owns `email` / `emailSent` and `requestPasswordReset`
- Layout: same split auth canvas as sign-in
  - Desktop (`lg+`): brand panel left, form column right (`max-w-sm`)
  - Mobile: wordmark above the form
  - After send (`emailSent`): email field is replaced by a success message; CTA becomes “Send again”
- Pieces: `Button`, `Input`, `Field`, `FieldGroup`, `FieldLabel` (`FileText`)
- Fields: **email** (`h-10`) — hidden when `emailSent`
- Copy: title “Forgot password” → “Email sent successfully”; CTA “Send reset link” / “Send again”; footer link to `/sign-in`

---

## Reset password `/reset-password`

- Page: `src/pages/auth/reset-password/index.tsx` (`ResetPasswordPage`)
- Form: `src/components/auth/reset-password/reset-password-form.tsx` (`ResetPasswordForm`)
- Shared panel: `src/components/auth/brand-panel.tsx` (`BrandPanel`)
- Logic: form submits through `resetPassword`; mismatch sets `passwordMatch` and shows a field error; success navigates to `/sign-in`
- Layout: same split auth canvas as sign-in
  - Desktop (`lg+`): brand panel left, form column right (`max-w-sm`)
  - Mobile: wordmark above the form
  - Missing token (`?token` absent): “Reset link missing” + request a new link
  - Invalid token (`?error=INVALID_TOKEN` or `token=INVALID_TOKEN`): “Reset link expired” + request a new link
- Pieces: `Button`, `buttonVariants` on a `Link`, `Input`, `Field`, `FieldError`, `FieldGroup`, `FieldLabel` (`FileText`, `Eye`, `EyeOff`)
- Fields: **new password**, **confirm password** (show/hide toggles, `h-10`, `pr-10`) — hidden on missing/invalid token
- Copy: title “Reset password”; CTA “Reset password”; mismatch “Passwords do not match.” under confirm; error CTA “Request a new link” → `/forgot-password`; footer link to `/sign-in`

---

## Home `/`

- File: `src/pages/home/index.tsx` (`HomePage`)
- Logic: none
- Layout: full-viewport greeting. Header wordmark + Sign in. Two columns (`lg+`): copy + CTAs left, decorative invoice `Card` right. Create / Send / Track labels under the CTAs
- Pieces: `buttonVariants` on `Link`, `Card`, `CardHeader`, `CardContent`, `CardFooter`, `Separator` (`FileText`)
- Fields: none
- Copy: title “Hello.”; primary “Get started” → `/sign-up`; outline “Sign in” → `/sign-in`
