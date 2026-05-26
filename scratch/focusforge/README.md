# FocusForge 🔥

> Your ultimate Python-powered productivity hub — Solo Timer, Study Rooms, Real-time Chat, Analytics & more.

---

## Features

| Feature | Status |
|---|---|
| ⏱ Hour/Min/Second + Millisecond Timer | ✅ |
| 🌙 Dark / Light Mode | ✅ |
| 📋 Session History with Labels | ✅ |
| 🏷 Label Tags per Session | ✅ |
| ▶ Start / Pause / Reset / Skip | ✅ |
| 💬 Motivational Quotes (rotate per session) | ✅ |
| ✅ To-Do List (add, check, delete, filter) | ✅ |
| 🎉 Session-end Celebration Popup | ✅ |
| 🔔 Next-day Reminders with Time | ✅ |
| 📊 Weekly / Monthly / Yearly Reports | ✅ |
| ⚙ Customizable Timer (H/M/S) | ✅ |
| 🎨 Solid-state Design (no gradients) | ✅ |
| 💾 Persistent Data (SQLite + localStorage) | ✅ |
| 🧑‍💻 Real-time Study Rooms | ✅ |
| 💬 Live Chat (Socket.IO) | ✅ |
| 📎 File / PDF Sharing | ✅ |
| 👥 Peer Timer Visibility | ✅ |

---

## Setup & Run

### 1. Install Python 3.8+
Download from https://www.python.org/downloads/
✅ Check **"Add Python to PATH"** during installation

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the app
```bash
python app.py
```
Or double-click `start.bat`

### 4. Open browser
```
http://localhost:5000
```

---

## Project Structure
```
focusforge/
├── app.py              ← Main Flask app + Socket.IO
├── models.py           ← Database models (SQLAlchemy)
├── requirements.txt    ← Python dependencies
├── start.bat           ← Windows one-click launcher
├── static/
│   ├── style.css       ← Complete design system
│   └── uploads/        ← Uploaded files
└── templates/
    ├── base.html       ← Navbar, theme, layout
    ├── index.html      ← Solo Timer page
    ├── room_lobby.html ← Study Room browser
    └── room.html       ← Live study room
```

---

## Deploy to Web (Free)

### Render.com (Easiest)
1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Start command: `gunicorn -k eventlet -w 1 app:app`
4. Add env var: `SECRET_KEY=your-strong-secret`

### Railway.app
```bash
pip install railway
railway login
railway init
railway up
```
