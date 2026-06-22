# 🎵 Complete Music Setup Guide

Your Pomo app now supports **3 music sources**:
1. ✅ **Pixabay** - Already working (no setup needed)
2. ✅ **Free Music Archive** (via Internet Archive) - Already integrated
3. 📥 **YouTube Audio Library** - Requires manual download

---

## Current Status

### ✅ Working Now (No Setup Needed)
- **Pixabay Audio** - 14+ tracks streaming directly
- **Free Music Archive** - 7+ tracks via Internet Archive
- **Total:** 21+ tracks ready to play!

### 📥 Optional: Add YouTube Audio Library

---

## How to Add YouTube Audio Library Music

### Step 1: Download Music

1. **Go to YouTube Studio**
   - Visit: https://studio.youtube.com/
   - Sign in with your Google account

2. **Access Audio Library**
   - Click "Audio Library" in the left sidebar
   - Click "Free music" tab

3. **Search for Music**
   - Search terms: "focus", "ambient", "lofi", "relaxing", "meditation"
   - Filter by mood, genre, duration

4. **Download Tracks**
   - Click the download icon (⬇️) next to any track
   - Recommended: Download 2-3 tracks per category

### Step 2: Organize Files

1. **Rename Downloaded Files**
   ```
   Original: "Aakash Gandhi - Ambient Relaxing.mp3"
   Rename to: "focus-1.mp3"
   ```

2. **File Naming Convention**
   - Focus: `focus-1.mp3`, `focus-2.mp3`, `focus-3.mp3`
   - Break: `break-1.mp3`, `break-2.mp3`
   - Energize: `energize-1.mp3`, `energize-2.mp3`
   - Relax: `relax-1.mp3`, `relax-2.mp3`
   - Sleep: `sleep-1.mp3`, `sleep-2.mp3`
   - Nature: `nature-1.mp3`, `nature-2.mp3`
   - Motivate: `motivate-1.mp3`, `motivate-2.mp3`

### Step 3: Add to Project

1. **Copy Files**
   - Copy renamed MP3 files to: `d:\pomo\public\music\`

2. **Verify Files**
   ```powershell
   # Check if files are in the right place
   dir d:\pomo\public\music\*.mp3
   ```

### Step 4: Update Track Names (Optional)

If you want custom names in the app:

1. Open `d:\pomo\main.js`
2. Find the YouTube Audio Library entries
3. Update the `name` field:

```javascript
// Before
{ name: 'YT Focus Track 1', url: '/music/focus-1.mp3', ... }

// After (with actual track name)
{ name: 'Ambient Relaxing', url: '/music/focus-1.mp3', ... }
```

### Step 5: Rebuild & Test

```powershell
# Rebuild the app
npm run build

# Restart dev server
npm run dev
```

Then test:
1. Open http://localhost:5173/
2. Go to Wellness Corner → Music
3. Click play on any track
4. Your YouTube Audio Library tracks will play!

---

## Recommended YouTube Audio Library Tracks

### 🎯 Focus (Concentration)
- "Ambient Relaxing" by Aakash Gandhi
- "Lofi Study" by FASSounds
- "Concentration" by Rexlambo
- "Deep Focus" by Ghostrifter Official

### ☕ Break (Relaxation)
- "Calm Waters" by Aakash Gandhi
- "Peaceful Piano" by Purrple Cat
- "Chill Vibes" by LiQWYD

### ⚡ Energize (Motivation)
- "Upbeat Energy" by Vibe Mountain
- "Motivational" by Infraction
- "Power Up" by Vibe Tracks

### 🧘 Relax (Meditation)
- "Meditation" by Aakash Gandhi
- "Zen Garden" by Christopher Lloyd Clarke
- "Peaceful Mind" by Purrple Cat

### 😴 Sleep (Deep Rest)
- "Deep Sleep" by Christopher Lloyd Clarke
- "Dream State" by Aakash Gandhi
- "Sleeping Music" by Kevin MacLeod

### 🌿 Nature (Ambient)
- "Forest Rain" by Nature Sounds
- "Ocean Waves" by Nature Sounds
- "Birds Chirping" by Nature Sounds

### 💪 Motivate (Workout)
- "Workout Energy" by Vibe Mountain
- "Pump Up" by Infraction
- "High Energy" by Vibe Tracks

---

## Free Music Archive (Already Working!)

The app already includes tracks from Free Music Archive via Internet Archive:

### Current Tracks:
- ✅ Concentration Flow
- ✅ Minimal Focus
- ✅ Gentle Breeze
- ✅ Upbeat Energy
- ✅ Meditation Space
- ✅ Deep Sleep
- ✅ Nature Sounds
- ✅ Motivational Beat

**No setup needed** - these stream directly from Internet Archive!

---

## Troubleshooting

### Music Not Playing?

1. **Check file location**
   ```powershell
   dir d:\pomo\public\music\
   ```

2. **Check file names**
   - Must match exactly: `focus-1.mp3` (not `Focus-1.mp3` or `focus_1.mp3`)

3. **Check browser console**
   - Press F12
   - Look for 404 errors
   - Check if files are loading

4. **Rebuild app**
   ```powershell
   npm run build
   ```

### File Not Found (404)?

- Verify file is in `public/music/` folder
- Check file name matches exactly
- Restart dev server

### No Sound?

- Check system volume
- Check browser volume (right-click tab)
- Try different browser
- Check if other tracks work

---

## Music Sources Summary

| Source | Status | Tracks | Setup Required |
|--------|--------|--------|----------------|
| Pixabay | ✅ Working | 14+ | None |
| Free Music Archive | ✅ Working | 7+ | None |
| YouTube Audio Library | 📥 Optional | Unlimited | Download files |

**Total Ready to Play:** 21+ tracks!

---

## Legal & Licensing

### ✅ All Sources Are 100% Legal & Free

- **Pixabay:** Royalty-free, no attribution required
- **Free Music Archive:** Creative Commons, free to use
- **YouTube Audio Library:** 100% free, no attribution required

**You can use all this music in your Pomo app without any legal issues!**

---

## Next Steps

1. ✅ **Test current music** - 21+ tracks already working!
2. 📥 **Optional:** Download YouTube Audio Library tracks
3. 🎵 **Enjoy your music-powered Pomo app!**

---

## Support

If you need help:
1. Check the troubleshooting section above
2. Check browser console (F12) for errors
3. Verify files are in the correct location
4. Make sure file names match exactly

Happy focusing! 🍅🎵
