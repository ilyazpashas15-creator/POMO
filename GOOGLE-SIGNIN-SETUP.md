# 🔐 Google Sign-In Setup Guide

## Step 1: Get Google OAuth Client ID

1. **Go to Google Cloud Console**: https://console.cloud.google.com/

2. **Create a New Project** (or select existing):
   - Click "Select a project" → "New Project"
   - Name: "Pomo Timer"
   - Click "Create"

3. **Enable Google Sign-In API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Pomo Web App"
   
5. **Add Authorized Origins**:
   ```
   http://localhost:5173
   http://localhost:3000
   http://127.0.0.1:5173
   ```
   
6. **Add Authorized Redirect URIs**:
   ```
   http://localhost:5173
   http://localhost:3000
   ```

7. **Copy Your Client ID**:
   - It looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`

## Step 2: Add Client ID to Your App

1. **Open** `index.html`

2. **Find this line** (around line 4417):
   ```html
   data-client_id="YOUR_GOOGLE_CLIENT_ID_HERE"
   ```

3. **Replace** `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID:
   ```html
   data-client_id="123456789-abcdefghijklmnop.apps.googleusercontent.com"
   ```

## Step 3: Test It!

1. **Rebuild**:
   ```bash
   npm run build
   ```

2. **Start dev server**:
   ```bash
   npm run dev
   ```

3. **Open**: http://localhost:5173/

4. **Click "Sign Up"** → **"Continue with Google"**

5. **You should see**:
   - Google account chooser popup
   - Select your Google account
   - Grant permissions
   - Modal closes
   - Welcome message with your name!

## 🎯 What Happens After Sign-In:

- ✅ User's name appears in header
- ✅ User's Google profile picture shows
- ✅ User info stored in localStorage
- ✅ Modal closes automatically
- ✅ Welcome toast notification

## 🐛 Troubleshooting:

### "Popup blocked"
- Allow popups for localhost in your browser

### "Invalid client ID"
- Check that you copied the full Client ID
- Make sure there are no extra spaces

### "Unauthorized origin"
- Add your localhost URL to Authorized Origins in Google Console

### "Google Sign-In SDK not loaded"
- Check your internet connection
- The app will fall back to dummy login

## 📝 User Data Stored:

After successful sign-in, this data is saved in localStorage:

```javascript
{
  name: "John Doe",
  email: "john@example.com",
  picture: "https://lh3.googleusercontent.com/...",
  sub: "1234567890"  // Google user ID
}
```

## 🔒 Security Notes:

- Client ID is safe to expose (it's public)
- Never expose Client Secret (not needed for frontend-only auth)
- User data is stored locally (not sent to any server)
- This is a frontend-only implementation

## 🚀 Production Deployment:

When deploying to production:

1. Add your production domain to Authorized Origins:
   ```
   https://yourapp.com
   ```

2. Update the Client ID in `index.html` if needed

3. Test thoroughly before going live

---

**That's it! You now have real Google Sign-In! 🎉**
