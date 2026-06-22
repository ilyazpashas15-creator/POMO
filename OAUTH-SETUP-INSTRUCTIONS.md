# 🔐 OAuth Setup Instructions for Browser Coder

This document provides step-by-step instructions for obtaining Google and GitHub OAuth credentials for the Pomo application.

## 🔍 What We Need

### Google OAuth
- **Client ID**: Public identifier for the application
- **Client Secret**: Private key (keep secure, don't commit to repo)

### GitHub OAuth  
- **Client ID**: Public identifier for the application
- **Client Secret**: Private key (keep secure, don't commit to repo)

---

## 🌐 Google OAuth Setup

### Step 1: Access Google Cloud Console
1. Go to: https://console.cloud.google.com/
2. Sign in with your Google account
3. Create a new project or select existing one

### Step 2: Enable Google+ API
1. Go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"Google Sign-In API"**
3. Click **"Enable"**

### Step 3: Configure OAuth Consent Screen
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** user type
3. Fill in required fields:
   - **App name**: `Pomo - Advanced Cognitive Partner`
   - **User support email**: Your email
   - **Developer contact email**: Your email
   - **App domain**: `http://localhost:5174` (for development)
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. Save and continue

### Step 4: Create OAuth Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Choose **"Web application"**
4. Configure:
   - **Name**: `Pomo Web Client`
   - **Authorized JavaScript origins**: 
     - `http://localhost:5174`
     - `http://127.0.0.1:5174`
   - **Authorized redirect URIs**: 
     - `http://localhost:5174`
     - `http://localhost:5174/auth/google/callback`
5. Click **"Create"**

### Step 5: Copy Credentials
- **Client ID**: Copy the long string (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
- **Client Secret**: Copy the secret key

---

## 🐙 GitHub OAuth Setup

### Step 1: Access GitHub Developer Settings
1. Go to: https://github.com/settings/developers
2. Sign in to your GitHub account
3. Click **"New OAuth App"**

### Step 2: Create OAuth App
Fill in the application details:
- **Application name**: `Pomo - Advanced Cognitive Partner`
- **Homepage URL**: `http://localhost:5174`
- **Application description**: `AI-powered Pomodoro timer with focus optimization and productivity tracking`
- **Authorization callback URL**: `http://localhost:5174/auth-callback.html`

### Step 3: Register Application
1. Click **"Register application"**
2. You'll be redirected to the app settings page

### Step 4: Generate Client Secret
1. On the app settings page, click **"Generate a new client secret"**
2. Confirm your password if prompted
3. Copy the generated secret immediately (it won't be shown again)

### Step 5: Copy Credentials
- **Client ID**: Copy the Client ID (visible on the page)
- **Client Secret**: Copy the secret you just generated

---

## 📋 Information to Share

Please provide the following information:

### Google OAuth Credentials
```
Google Client ID: [PASTE HERE]
Google Client Secret: [PASTE HERE]
```

### GitHub OAuth Credentials
```
GitHub Client ID: [PASTE HERE]
GitHub Client Secret: [PASTE HERE]
```

---

## 🔒 Security Notes

### ⚠️ Important Security Guidelines:
1. **Never commit secrets to version control**
2. **Client IDs are public** - safe to include in frontend code
3. **Client Secrets are private** - only use on backend/server
4. **Use environment variables** for production deployment
5. **Rotate secrets regularly** for production apps

### For Development:
- Client IDs can be directly placed in the HTML/JS files
- Client Secrets are not needed for frontend-only OAuth flows
- The app uses implicit OAuth flow (no backend required)

---

## 🧪 Testing Instructions

After obtaining the credentials:

### Google OAuth Test:
1. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` in `index.html` with actual Client ID
2. Open `http://localhost:5174`
3. Click "Sign Up" → "Continue with Google"
4. Should open Google OAuth popup
5. After authorization, should return user data and close modal

### GitHub OAuth Test:
1. Replace `YOUR_GITHUB_CLIENT_ID_HERE` in `index.html` with actual Client ID  
2. Open `http://localhost:5174`
3. Click "Sign Up" → "Continue with GitHub"
4. Should open GitHub OAuth popup
5. After authorization, should return user data and close modal

---

## 🐛 Troubleshooting

### Common Issues:

**"Invalid Client ID" Error:**
- Double-check the Client ID is copied correctly
- Ensure no extra spaces or characters
- Verify the OAuth app is not suspended

**"Redirect URI Mismatch" Error:**
- Check callback URLs match exactly
- Ensure protocol (http/https) matches
- Verify port numbers are correct

**"Access Denied" Error:**
- User cancelled the authorization
- Check OAuth app permissions
- Verify app is publicly available (not restricted)

---

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all URLs and credentials are correct
3. Test with a different browser or incognito mode
4. Ensure popup blockers are disabled

---

**Once you have the credentials, share them in the format above and I'll integrate them into the application!** 🚀