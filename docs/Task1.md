Authentication Fixes Needed:

Google Sign-In:
- Verify Google OAuth 2.0 credentials in Google Cloud Console.
- Ensure the Client ID and Client Secret are correctly set in the backend.
- Add authorized origins (http://localhost:5174 and production domain) in Google Cloud Console.
- Add authorized redirect URIs (http://localhost:5174/auth/google/callback).
- Replace placeholder logic with proper OAuth flow: request token → handle callback → validate user → store session.

GitHub Sign-In:
- Register the app in GitHub Developer Settings → OAuth Apps.
- Set correct Client ID, Client Secret, and callback URL.
- Ensure backend callback route exists and returns valid JSON (current error “Unexpected token '<'” means HTML error page is being returned).
- Implement proper error handling: if callback fails, return JSON with error message instead of HTML.
- Confirm redirect URI matches exactly with GitHub app settings.
