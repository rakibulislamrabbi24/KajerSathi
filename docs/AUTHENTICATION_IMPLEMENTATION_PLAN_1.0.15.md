# KajerSathi Account & Authentication System — Release 1.0.15

**Status:** Planning / prerequisites pending  
**Selected provider:** Supabase Auth + Supabase Postgres  
**Login methods:** Google OAuth + Email/Password  
**Access policy:** Authentication required before opening any tool

## 1. Current repository baseline

- Static HTML/CSS/JavaScript application (no existing authentication provider or server-side application layer).
- Main app: `index.html`.
- PDF tools: `pdf-tools.html`.
- Service worker: `sw.js`; app shell and tool assets are precached for offline use.
- Hosting targets: Vercel (`https://kajersathi.vercel.app/`) and GitHub Pages (`https://rakibulislamrabbi24.github.io/KajerSathi/`).
- PDF Tools PR #6 and Image Background Remover PR #7 are merged into `main` as of this plan.
- Since this is a static client-side app, the Supabase publishable key may be present in browser code. A Supabase secret/service-role key must NEVER be placed in this repository or browser bundle.

## 2. Product decisions

1. Users must authenticate before accessing any tool.
2. Supported sign-in methods:
   - Continue with Google.
   - Email + password registration.
   - Email + password sign-in.
3. Email confirmation is enabled for email/password registration.
4. Password recovery and logout are included.
5. A persistent session is restored on reload, with explicit sign-out.
6. There is no paid subscription or paid feature tier in this release.
7. Tool files remain local to the user's device. Do not upload images/PDFs or generated outputs to Supabase.
8. If Supabase is unavailable or configuration is missing, fail closed: do not expose tools as an unauthenticated fallback. Show a clear setup/service error instead.
9. No anonymous/guest account mode.

## 3. Proposed user experience

### Public routes
- Sign in / create account screen.
- Email verification pending screen.
- Password reset request and set-new-password screens.
- OAuth return handling.
- Privacy notice and help links.

### Authenticated routes/views
- Main KajerSathi dashboard.
- Existing Image tools (including AI Background Remover).
- PDF Tools page.
- All future tools.
- Account menu: profile, account settings, logout.

### Auth flow
1. On initial load, initialise the Supabase client and resolve the current session.
2. While session resolution is pending, show a branded loading state; do not initialise or display tool controls.
3. If there is no valid session, render the sign-in/register view.
4. If authenticated, render the dashboard and allow navigation to tool pages.
5. Subscribe to Supabase auth state changes; sign-out or session expiry immediately returns the user to the auth screen.
6. On OAuth return, validate/restore the Supabase session before rendering protected content.
7. Restore the intended destination after successful login, using an allow-listed same-origin relative path only.

## 4. Architecture and implementation

### Frontend
- Keep the current static-site deployment model.
- Add a small, pinned Supabase JS v2 client dependency (CDN ESM or a locally vendored, licence-compliant build).
- Add a single auth/config module and a single auth UI/controller module; do not duplicate session logic across pages.
- Add a shared guard used by both `index.html` and `pdf-tools.html`.
- Ensure protected tool initialisation happens only after the guard confirms an authenticated session.
- Do not trust a hidden/blurred UI alone: all protected page entry points must use the same guard.
- Do not put secrets, OAuth client secrets, SMTP passwords, or Supabase service-role/secret keys in client-side code.

### Supabase
- Enable Email provider and Google provider.
- Create a `public.profiles` table keyed to `auth.users.id`.
- Suggested profile fields: `id`, `display_name`, `avatar_url`, `created_at`, `updated_at`.
- Create the profile row on new-user creation using a secure database trigger or a trusted server-side function.
- Enable RLS on every exposed user-owned table.
- Profile SELECT/UPDATE policies must restrict rows to `auth.uid() = id`.
- Future saved tools/preferences/history tables must include `user_id`, have RLS enabled, and restrict reads/writes to `auth.uid() = user_id`.
- Do not create a user-owned file storage bucket in this release.

### OAuth and redirect configuration
Register both production application origins:
- `https://kajersathi.vercel.app`
- `https://rakibulislamrabbi24.github.io`

Allow the exact app return URLs in Supabase Auth URL Configuration:
- `https://kajersathi.vercel.app/`
- `https://rakibulislamrabbi24.github.io/KajerSathi/`

Google Cloud OAuth Web client:
- Authorized JavaScript origins: both origins above.
- Authorized redirect URI: the Supabase project's exact callback URL, `https://<project-ref>.supabase.co/auth/v1/callback`.
- Do not commit the Google client secret. Configure it only in the Supabase dashboard.

## 5. Email delivery constraint — must be resolved before public launch

Supabase's built-in email sender is for testing: it only sends to authorised team addresses and is currently limited to 2 emails/hour. Therefore, public email registration, email confirmation, and password reset will not be production-ready with the default sender.

Before launch:
- Configure a custom SMTP provider that supports the expected volume.
- Verify the sender domain and configure SPF/DKIM (and DMARC where available).
- Test confirmation and recovery emails in real inboxes, including spam-folder handling.
- Keep SMTP credentials only in Supabase settings/secret storage, never in GitHub.

The SMTP provider may have its own free-tier limits or domain requirements; verify those before selecting it. Do not advertise unlimited free email delivery.

## 6. Security requirements

- Use only the Supabase publishable key in the browser.
- Never expose `service_role`, secret API keys, Google client secret, or SMTP credentials.
- Keep email confirmation enabled.
- Validate form inputs and show generic authentication errors where appropriate; do not reveal whether an arbitrary email is registered.
- Enforce password policy supported by Supabase Auth.
- Use Supabase-managed OAuth/session flows and exact redirect allow-lists.
- Enable RLS on all public tables; test unauthenticated and cross-user access.
- Treat browser-side login gating as an access-control UX for this static client-side utility site, not as DRM: a technically skilled visitor can inspect public JavaScript/assets. Any future server-side premium/private resource must independently verify JWTs and permissions on the server.
- Avoid collecting/storing unnecessary personal data.
- Provide account deletion request/flow and explain what profile data is removed; do not promise deletion of auth logs/backups beyond provider capabilities.

## 7. Service worker / offline behaviour

- Update the cache version and precache the new auth modules and login assets.
- Never cache Supabase API responses, OAuth callback responses, auth tokens, or private user data in Cache Storage.
- Keep offline app shell limited to the sign-in/error shell; protected tools must not be exposed if the app cannot validate an existing session.
- Test logout while offline and session expiry/reconnect behaviour.
- Ensure GitHub Pages subpath handling works for `/KajerSathi/` and Vercel root hosting.

## 8. Implementation sequence

### Phase 0 — external setup (owner action required)
- Create a Supabase project.
- Copy the Project URL and publishable key.
- Configure Google OAuth credentials in Google Cloud and Supabase.
- Add both production origins and exact redirect URLs.
- Choose/configure SMTP for public email delivery.

### Phase 1 — authentication foundation
- Add environment/config placeholder module (no real secrets).
- Add shared Supabase client and auth state manager.
- Build responsive Bangla/English login, registration, email verification, forgot-password and reset-password views.
- Implement Google OAuth and email/password flows.
- Add profile table SQL and RLS policies.

### Phase 2 — mandatory access gate
- Guard `index.html` and `pdf-tools.html`.
- Delay all tool initialisation until session verification succeeds.
- Protect direct navigation, reload, OAuth return, and service-worker navigation.
- Add account menu and logout.

### Phase 3 — quality and security tests
- New email registration, verification, login, logout, password reset.
- Google sign-in on both domains.
- Refresh/reopen tab/session persistence.
- Unauthenticated direct access to every tool route.
- Expired/revoked session.
- Cross-user RLS checks.
- Service worker update and offline behaviour.
- Android Chrome, desktop Chrome, Firefox and Safari smoke tests.
- Verify no file is uploaded during Image/PDF tool usage.

### Phase 4 — release
- Deploy preview to Vercel and test.
- Test GitHub Pages subpath deployment.
- Merge only after required owner credentials/configuration and QA are complete.
- Update privacy policy and user-facing auth notices.

## 9. Owner-provided setup values required before coding the live integration

The repository can contain the integration code, but it cannot connect to a real Supabase project until the owner creates/configures it.

Required public client values:
- Supabase Project URL.
- Supabase Publishable Key (safe for browser use when RLS is correctly configured).

Required dashboard-only setup:
- Google OAuth Client ID and Client Secret.
- SMTP host, port, username, password, sender address (if using custom SMTP).

Only the Project URL and Publishable Key should be provided for insertion into the public client configuration. Never send or commit the Google Client Secret, SMTP password, Supabase secret key, or service-role key.

## 10. Definition of done

- Google and email/password flows both work.
- Unverified email accounts cannot access tools.
- All current tools require a valid session.
- Direct links to `pdf-tools.html` and all tool routes are guarded.
- Session survives refresh and works on both production domains.
- Logout removes access immediately.
- Password reset and verification email delivery are verified.
- RLS tests prove one user cannot read/update another user's profile or private rows.
- No auth secrets are present in Git history or browser assets.
- No image/PDF files are uploaded as a side effect of authentication.
- Mobile and desktop smoke tests pass.
