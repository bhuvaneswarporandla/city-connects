# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## Sign in with Google (client-side demo)

This project includes a client-side example of Google Sign-In using Google Identity Services (GSI). It uses a simple mock auth service (`src/services/mockData.js`) so Google users are created locally for demo purposes.

How to enable the Google button in development:

1. Create a Google OAuth Client ID in the Google Cloud Console (choose "Web application") and add your dev origin (for Vite the default is `http://localhost:5173`) or your actual dev URL to the allowed origins.
2. Create a `.env` file in the project root and set your client ID:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

3. Start the dev server (e.g. `npm run dev`) and the Google sign-in button will appear on the login page.

Important: This demo decodes the Google credential on the client and uses a mock service. For production you should verify Google tokens on the server and integrate with a proper user database.

## Login CAPTCHA

To make the demo login a bit harder to automate, the Login page includes a simple client-side math captcha (addition) that must be answered before submitting email/password credentials.

Notes:
- The captcha is a lightweight demo and is rendered in `src/pages/Login.jsx`.
- For real-world protection against bots you should integrate a production captcha provider such as Google reCAPTCHA (v2 checkbox, v2 invisible, or v3). ReCAPTCHA requires a server-side verification step for high security.

Quick reCAPTCHA integration outline:
1. Register a site and obtain a site key + secret from Google reCAPTCHA console.
2. Add the site key to your frontend environment (e.g. `VITE_RECAPTCHA_SITE_KEY`).
3. Render the reCAPTCHA widget on the login form and send the token to your server when the user submits.
4. On the server, verify the token with Google's verification endpoint using your secret key; only accept login attempts after verification.

If you want, I can integrate Google reCAPTCHA (client + server verification) into this project — tell me whether you'd prefer a frontend-only demo or the full server-verified flow and I will implement it next.

## Demo persistence (localStorage)

This project stores demo data in memory for fast development. To preserve demo data across reloads (so edits, new services or reports stick between page refreshes) the mock data service now persists state to localStorage under the key `city_connects_state_v1`.

What is persisted:
- Users (created via registration / Google demo sign-in)
- City services, infrastructure, amenities
- Reports and feedback
- The currently signed-in demo user

How to reset demo data:
- Open your browser DevTools → Application → Local Storage → select your site origin and delete the `city_connects_state_v1` item to restore the initial demo data.

If you prefer not to persist changes, you can remove or clear that localStorage key.
