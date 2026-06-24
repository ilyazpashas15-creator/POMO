# 🎵 Music Folder - YouTube Audio Library Files

This folder is for music files downloaded from **YouTube Audio Library**.

## How to Add Music from YouTube Audio Library

### Step 1: Access YouTube Audio Library
1. Go to https://studio.youtube.com/
2. Sign in with your Google account
3. Click **"Audio Library"** in the left sidebar
4. Click the **"Free music"** tab

### Step 2: Download Music
1. Browse or search for music (try: "focus", "ambient", "lofi", "relaxing")
2. Click the **download icon** (⬇️) next to any track
3. The MP3 file will download to your computer

### Step 3: Add to This Folder
1. Rename the file to match the category:
   - `focus-1.mp3`, `focus-2.mp3`, etc.
   - `break-1.mp3`, `break-2.mp3`, etc.
   - `energize-1.mp3`, `energize-2.mp3`, etc.
   - `relax-1.mp3`, `relax-2.mp3`, etc.
   - `sleep-1.mp3`, `sleep-2.mp3`, etc.
   - `nature-1.mp3`, `nature-2.mp3`, etc.
   - `motivate-1.mp3`, `motivate-2.mp3`, etc.

2. Copy the renamed file to this folder: `d:\pomo\public\music\`

### Step 4: Update Track Names (Optional)
If you want to change the track names shown in the app:
1. Open `d:\pomo\main.js`
2. Find the `musicLibrary` object
3. Update the `name` field for the YouTube tracks

Example:
```javascript
{ name: 'Inspiring Ambient', url: '/music/focus-1.mp3', duration: '3:00', source: 'YouTube Audio Library', local: true }
```

## Recommended YouTube Audio Library Tracks

### For Focus:
- "Ambient Relaxing" by Aakash Gandhi
- "Lofi Study" by FASSounds
- "Concentration" by Rexlambo

### For Breaks:
- "Calm Waters" by Aakash Gandhi
- "Peaceful Piano" by Purrple Cat

### For Sleep:
- "Deep Sleep" by Christopher Lloyd Clarke
- "Meditation" by Aakash Gandhi

### For Nature:
- "Forest Rain" by Nature Sounds
- "Ocean Waves" by Nature Sounds

## File Naming Convention

**Format:** `[category]-[number].mp3`

Examples:
- ✅ `focus-1.mp3`
- ✅ `break-2.mp3`
- ✅ `sleep-3.mp3`
- ❌ `My Favorite Song.mp3` (won't work)

## Current Files

Place your downloaded YouTube Audio Library MP3 files here:
- `focus-1.mp3` - (add your file)
- `focus-2.mp3` - (add your file)
- `break-1.mp3` - (add your file)
- `energize-1.mp3` - (add your file)
- `relax-1.mp3` - (add your file)
- `sleep-1.mp3` - (add your file)
- `nature-1.mp3` - (add your file)
- `motivate-1.mp3` - (add your file)

## Notes

- YouTube Audio Library music is **100% free** to use
- No attribution required
- No copyright issues
- Perfect for your Pomo app!
- Files stay on your server (no external dependencies)

## Testing

After adding files:
1. Rebuild the app: `npm run build`
2. Restart dev server: `npm run dev`
3. Go to Wellness Corner → Music
4. Click play on any track
5. Your local files will play!
