# 🎵 YouTube Audio Library Setup Guide

## Complete Step-by-Step Guide to Add Free Music to Your Pomo App

---

## 📋 What You'll Get

- **100% Free Music** - No cost, no subscriptions
- **100% Legal** - No copyright issues
- **High Quality** - Professional audio
- **No Attribution Required** - Use freely
- **Unlimited Tracks** - Download as many as you want

---

## 🚀 Quick Start (5 Steps)

### Step 1: Access YouTube Audio Library

1. Go to **YouTube Studio**: https://studio.youtube.com/
2. Sign in with your Google account (free)
3. Click **"Audio Library"** in the left sidebar
4. Click the **"Free music"** tab

### Step 2: Download Music by Category

I'll recommend specific tracks for each category. Download these:

#### 🎯 **Focus Music (Download 5 tracks)**

Search for these tracks and download:

1. **"Ambient Relaxing"** by Aakash Gandhi
   - Genre: Ambient
   - Mood: Calm
   - Duration: ~3 min

2. **"Lofi Study"** by FASSounds
   - Genre: Electronic
   - Mood: Calm
   - Duration: ~3 min

3. **"Concentration"** by Rexlambo
   - Genre: Ambient
   - Mood: Calm
   - Duration: ~3 min

4. **"Deep Focus"** by Ghostrifter Official
   - Genre: Electronic
   - Mood: Calm
   - Duration: ~3 min

5. **"Study Music"** by Purrple Cat
   - Genre: Electronic
   - Mood: Calm
   - Duration: ~3 min

**How to find them:**
- Use the search box
- Filter by Genre: "Ambient" or "Electronic"
- Filter by Mood: "Calm"
- Click download icon (⬇️) next to each track

#### ☕ **Break Music (Download 3 tracks)**

1. **"Calm Waters"** by Aakash Gandhi
2. **"Peaceful Piano"** by Purrple Cat
3. **"Chill Vibes"** by LiQWYD

#### ⚡ **Energize Music (Download 3 tracks)**

1. **"Upbeat Energy"** by Vibe Mountain
2. **"Motivational"** by Infraction
3. **"Power Up"** by Vibe Tracks

#### 🧘 **Relax Music (Download 3 tracks)**

1. **"Meditation"** by Aakash Gandhi
2. **"Zen Garden"** by Christopher Lloyd Clarke
3. **"Peaceful Mind"** by Purrple Cat

#### 😴 **Sleep Music (Download 3 tracks)**

1. **"Deep Sleep"** by Christopher Lloyd Clarke
2. **"Dream State"** by Aakash Gandhi
3. **"Sleeping Music"** by Kevin MacLeod

#### 🌿 **Nature Sounds (Download 3 tracks)**

1. **"Forest Rain"** by Nature Sounds
2. **"Ocean Waves"** by Nature Sounds
3. **"Birds Chirping"** by Nature Sounds

#### 💪 **Motivation Music (Download 3 tracks)**

1. **"Workout Energy"** by Vibe Mountain
2. **"Pump Up"** by Infraction
3. **"High Energy"** by Vibe Tracks

---

### Step 3: Rename Downloaded Files

After downloading, rename files to match this format:

```
Original: "Aakash Gandhi - Ambient Relaxing.mp3"
Rename to: "focus-1.mp3"
```

**Naming Convention:**

```
Focus tracks:
- focus-1.mp3
- focus-2.mp3
- focus-3.mp3
- focus-4.mp3
- focus-5.mp3

Break tracks:
- break-1.mp3
- break-2.mp3
- break-3.mp3

Energize tracks:
- energize-1.mp3
- energize-2.mp3
- energize-3.mp3

Relax tracks:
- relax-1.mp3
- relax-2.mp3
- relax-3.mp3

Sleep tracks:
- sleep-1.mp3
- sleep-2.mp3
- sleep-3.mp3

Nature tracks:
- nature-1.mp3
- nature-2.mp3
- nature-3.mp3

Motivate tracks:
- motivate-1.mp3
- motivate-2.mp3
- motivate-3.mp3
```

### Step 4: Copy Files to Your Project

1. Open File Explorer
2. Navigate to: `d:\pomo\public\music\`
3. Copy all renamed MP3 files into this folder

**Verify files are in place:**
```powershell
dir d:\pomo\public\music\*.mp3
```

You should see all your MP3 files listed.

### Step 5: Update Track Names (Optional)

If you want to show the actual track names in your app:

1. Open `d:\pomo\main.js`
2. Find the `musicLibrary` object
3. Update the YouTube track names:

```javascript
focus: [
  // ... existing Pixabay tracks ...
  { name: 'Ambient Relaxing', url: '/music/focus-1.mp3', duration: '3:00', source: 'YouTube Audio Library', local: true },
  { name: 'Lofi Study', url: '/music/focus-2.mp3', duration: '3:00', source: 'YouTube Audio Library', local: true },
  // etc...
]
```

---

## 🎯 Recommended Tracks by Use Case

### **For Deep Work & Coding:**
- Ambient Relaxing
- Lofi Study
- Concentration
- Deep Focus

### **For Creative Work:**
- Study Music
- Peaceful Piano
- Zen Garden

### **For Exercise/Energy:**
- Workout Energy
- Pump Up
- High Energy
- Upbeat Energy

### **For Breaks:**
- Calm Waters
- Peaceful Piano
- Chill Vibes

### **For Sleep/Rest:**
- Deep Sleep
- Dream State
- Sleeping Music

---

## 🔍 How to Search in YouTube Audio Library

### **By Mood:**
- Calm (for focus)
- Happy (for motivation)
- Sad (for reflection)
- Bright (for energy)
- Dark (for deep focus)

### **By Genre:**
- Ambient (best for focus)
- Electronic (good for work)
- Cinematic (for motivation)
- Classical (for relaxation)

### **By Duration:**
- 0-2 min (short tracks)
- 2-5 min (medium tracks)
- 5+ min (long tracks)

### **Pro Tips:**
1. Sort by "Most Popular" to find best tracks
2. Use "Attribution not required" filter
3. Preview before downloading (click play icon)
4. Download in highest quality

---

## 📊 Recommended Track Count

| Category | Minimum | Recommended | Maximum |
|----------|---------|-------------|---------|
| Focus | 3 | 5 | 10 |
| Break | 2 | 3 | 5 |
| Energize | 2 | 3 | 5 |
| Relax | 2 | 3 | 5 |
| Sleep | 2 | 3 | 5 |
| Nature | 2 | 3 | 5 |
| Motivate | 2 | 3 | 5 |
| **Total** | **15** | **23** | **40** |

**Start with 23 tracks** (recommended) - you can always add more later!

---

## 🛠️ After Adding Files

### Rebuild Your App:

```powershell
cd d:\pomo
npm run build
npm run dev
```

### Test Your Music:

1. Open http://localhost:5173/
2. Go to **Wellness Corner** → **Music**
3. Click **Play** on any track
4. Your YouTube Audio Library tracks will play!

---

## ✅ Verification Checklist

- [ ] Accessed YouTube Studio
- [ ] Downloaded at least 15 tracks
- [ ] Renamed files correctly (focus-1.mp3, etc.)
- [ ] Copied files to `d:\pomo\public\music\`
- [ ] Verified files exist in folder
- [ ] Rebuilt app (`npm run build`)
- [ ] Tested music playback
- [ ] All tracks play successfully

---

## 🎵 Current Music Status

**After setup, you'll have:**

- ✅ **21 Pixabay tracks** (already working)
- ✅ **23 YouTube tracks** (your new additions)
- ✅ **Total: 44 tracks!**

**All 100% free and legal!** 🎉

---

## 🐛 Troubleshooting

### Files Not Playing?

1. **Check file location:**
   ```powershell
   dir d:\pomo\public\music\
   ```

2. **Check file names:**
   - Must be lowercase
   - Must match exactly: `focus-1.mp3` (not `Focus-1.mp3`)
   - No spaces in names

3. **Rebuild app:**
   ```powershell
   npm run build
   ```

4. **Hard refresh browser:**
   - Press Ctrl+Shift+R (Windows)
   - Press Cmd+Shift+R (Mac)

### 404 Error?

- File name doesn't match
- File not in correct folder
- Need to rebuild app

### No Sound?

- Check system volume
- Check browser volume
- Try different track
- Check browser console (F12)

---

## 📝 Quick Reference

**YouTube Studio:** https://studio.youtube.com/
**Audio Library:** Click "Audio Library" in left sidebar
**File Location:** `d:\pomo\public\music\`
**File Format:** `category-number.mp3` (e.g., `focus-1.mp3`)

---

## 🎯 Next Steps

1. **Download 23 tracks** (recommended set above)
2. **Rename them** (use naming convention)
3. **Copy to** `d:\pomo\public\music\`
4. **Rebuild app** (`npm run build`)
5. **Test & enjoy!** 🎵

---

## 💡 Pro Tips

1. **Start small** - Download 5 tracks first to test
2. **Preview first** - Listen before downloading
3. **Organize** - Keep track of which tracks you downloaded
4. **Update names** - Use actual track names in your app
5. **Expand later** - Add more tracks as needed

---

## 🎉 Benefits of YouTube Audio Library

✅ **Free forever**
✅ **No copyright strikes**
✅ **High quality audio**
✅ **Professional music**
✅ **Regular new additions**
✅ **No attribution required**
✅ **Commercial use allowed**

**Perfect for your Pomo app!**

---

Need help? Check the troubleshooting section or ask me!

Happy focusing with great music! 🍅🎵
