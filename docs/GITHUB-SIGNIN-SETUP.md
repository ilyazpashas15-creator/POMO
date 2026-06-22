# 🐙 GitHub Sign-In Setup Guide

## Step 1: Create GitHub OAuth App

1. **Go to GitHub Settings**: https://github.com/settings/developers
2. **Click "New OAuth App"**
3. **Fill in the details**:
   - **Application name**: `Pomo - Advanced Cognitive Partner`
   - **Homepage URL**: `http://localhost:5174` (or `http://localhost:5173`)
   - **Authorization callback URL**: `http://localhost:5174/auth-callback.html` (or `http://localhost:5173/auth-callback.html`)
   - **Application description**: `AI-powered Pomodoro timer with focus optimization`

4. **Click "Register application"**

## Step 2: Get Your Credentials

After creating the app, you'll see:
- **Client ID**: `abc123def456` (example)
- **Client Secret**: Click "Generate a new client secret"

## Step 3: Configure Your App

1. **Open**: `.env.local` (in the project root)

2. **Find or add this line**:
   ```
   VITE_GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID_HERE
   GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET_HERE
   ```

3. **Replace** with your actual credentials from GitHub:
   ```
   VITE_GITHUB_CLIENT_ID=abc123def456
   GITHUB_CLIENT_SECRET=abc123def456secret789
   ```

   > **Note:** Vite automatically replaces `%VITE_GITHUB_CLIENT_ID%` in `index.html` with the value from `.env.local`. The `GITHUB_CLIENT_SECRET` is only used server-side in the Vite dev server middleware (never exposed to the browser).

## Step 4: Test the Integration

1. **Start your dev server**: `npm run dev`
2. **Open**: `http://localhost:5174/` (or the port Vite provides)
3. **Click "Sign Up"** → **"Continue with GitHub"**
4. **You should see**:
   - GitHub OAuth popup
   - Permission request
   - Successful login with your GitHub profile

## ⚠️ Technical Note: Demo Mode vs. Production

GitHub's OAuth system uses the **Authorization Code Flow**. Here is how it works:
1. **Frontend**: Requests a `code` from GitHub.
2. **Backend**: Exchanges that `code` + `Client Secret` for an `access_token`.
3. **GitHub API**: Provides real user data (username, avatar) only when given an `access_token`.

**Since this is a client-side (frontend-only) demo**:
- The app successfully performs Step 1 (logs you into GitHub).
- It receives the secure `code`.
- However, because we don't have a **backend server** to hold your `Client Secret` securely, we cannot complete Step 2.
- **Result**: The app logs you in using **simulated data** ("Pomo Explorer") after verifying the GitHub flow works. To see your real GitHub username, you would need to implement a small backend (Node.js/Python) to handle the secret exchange.

## Troubleshooting

### "Application not found" error
- Check that your Client ID is correct
- Ensure the OAuth app is not suspended

### "Redirect URI mismatch" error
- Verify the callback URL matches exactly
- Check for trailing slashes
- Ensure protocol (http/https) matches

### "Access denied" error
- User cancelled the authorization
- Check OAuth app permissions
- Verify app is not restricted

## Production Setup

For production deployment:
1. Create a new OAuth app for production
2. Use your production domain in callback URL
3. Store credentials securely (environment variables)
4. Enable HTTPS for security

## API Scopes

The integration requests these GitHub scopes:
- `user:email` - Access to user's email addresses
- `read:user` - Access to user profile information

You can modify scopes in the OAuth URL if needed.