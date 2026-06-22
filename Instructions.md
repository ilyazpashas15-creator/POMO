# Pomo - Advanced Cognitive Flow Partner

## Project Overview

Pomo is a sophisticated Pomodoro timer application with advanced features including:
- Pomodoro timer with customizable work/break intervals
- User authentication (Google OAuth & GitHub OAuth)
- Background music player with multiple playlists
- Focus tracking and analytics
- Task management system
- Wellness check-ins
- Modern glassmorphism UI design

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and ensure OAuth credentials are set
   - See `docs/OAUTH-SETUP-INSTRUCTIONS.md` for details

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   - Server runs on `http://localhost:5174`

## Documentation

All documentation is located in the `/docs` folder:

- `OAUTH-SETUP-INSTRUCTIONS.md` - How to obtain OAuth credentials
- `GOOGLE-SIGNIN-SETUP.md` - Google OAuth configuration guide
- `GITHUB-SIGNIN-SETUP.md` - GitHub OAuth configuration guide
- `MUSIC-SETUP-GUIDE.md` - Background music configuration
- `QUICK-START-MUSIC.md` - Quick music setup guide
- `Task1.md` - Authentication implementation notes
- `Task2.md` - OAuth credentials reference table

## Key Features

### Timer System
- Pomodoro (25 min), Short Break (5 min), Long Break (15 min)
- Visual countdown with modern digital clock display
- Animated progress ring
- Auto-start options for breaks and work sessions

### Authentication
- Google OAuth 2.0 integration
- GitHub OAuth integration
- User profile management
- Avatar customization

### Music System
- 7 curated playlists (focus, break, energize, relax, sleep, nature, motivate)
- Volume control
- Auto-play during timer sessions
- Track selection

### Analytics
- Daily focus time tracking
- Session completion tracking
- Focus meter with percentage goals
- Streak tracking
- Focus insights dashboard

## Project Structure

```
/pomo
├── index.html          # Main application
├── main.js            # Core application logic
├── style.css          # Styles and themes
├── auth-callback.html # OAuth callback handler
├── .env.local         # Environment variables (OAuth credentials)
├── /docs              # Documentation
├── /public            # Static assets
│   └── /music         # Music files directory
└── package.json       # Dependencies
```

## Technologies

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Build Tool:** Vite
- **Authentication:** OAuth 2.0 (Google & GitHub)
- **Audio:** Web Audio API
- **Storage:** LocalStorage for state persistence

## Recent Updates

### Task 7: Enhanced Timer Display (✅ COMPLETED)
- Implemented modern digital clock styling with glass morphism
- Added glowing effects and animations
- Added animated colon separator with blink effect
- Added border rotation animation
- Added pulsing effect when timer is running
- Responsive design for mobile screens
- Fixed `pauseTimer()` to properly remove `data-timer-running` attribute

## Known Issues

- Music playback requires user interaction due to browser autoplay policies
- Some Pixabay music URLs may become unavailable over time
- OAuth requires proper configuration in Google Cloud Console and GitHub

## Contributing

This is a personal project. For questions or suggestions, please contact the project maintainer.

## License

All rights reserved.
