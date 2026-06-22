# Music Sources for Pomo

## Free Music Archive (via Internet Archive)
Free Music Archive content is hosted on Internet Archive and can be streamed directly.

### Example URLs:
- https://archive.org/download/[item-id]/[filename].mp3

### How to find music:
1. Go to https://freemusicarchive.org/
2. Search for music (e.g., "focus", "ambient", "lofi")
3. Click on a track
4. Look for "Download" or "Stream" options
5. Get the direct MP3 URL

## YouTube Audio Library
YouTube Audio Library requires manual download.

### How to use:
1. Go to https://studio.youtube.com/ (requires Google account)
2. Click "Audio Library" in left sidebar
3. Browse "Free music" tab
4. Download MP3 files
5. Place in `/public/music/` folder
6. Reference as `/music/filename.mp3` in your app

## Recommended Free Streaming Sources

### 1. Jamendo (Has API)
- API: https://api.jamendo.com/v3.0/
- Free tier: 10,000 requests/month
- Direct streaming URLs
- No API key needed for basic use

### 2. ccMixter
- Creative Commons music
- Direct download links
- No API needed

### 3. Incompetech
- Kevin MacLeod's music
- Direct MP3 links
- Free with attribution

## Current Implementation
Using Pixabay Audio Library (direct streaming, no downloads needed)
