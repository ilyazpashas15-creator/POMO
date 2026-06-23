// ===== Pomo — Advanced Cognitive Flow Partner =====

// --- Default Config ---
const DEFAULTS = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  autoStartBreak: false,
  autoStartPomodoro: false,
  alarmSound: 'bell',
  alarmVolume: 50,
  language: 'en',
  user: {
    username: 'User',
    email: 'user@pomo.ai',
    bio: 'Pioneer of Focus Protocols',
    rank: 'ALPHA-7',
    avatar: null
  }
};

// --- State ---
let config = { ...DEFAULTS };
let state = {
  mode: 'pomodoro',
  timeLeft: DEFAULTS.pomodoro * 60,
  totalTime: DEFAULTS.pomodoro * 60,
  isRunning: false,
  intervalId: null,
  completedPomodoros: 0,
  activeTaskId: null,
  bgMusic: {
    isPlaying: false,
    audio: null,
    volume: 0.5,
    currentTrack: 0,
    enabled: false,
    currentPlaylist: 'focus'
  },
  modalAudio: null,
  modalPlaying: false
};

// Music Library - reliable SoundHelix tracks
const musicLibrary = {
  focus: [
    { name: 'Deep Focus', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '5:17', source: 'SoundHelix' },
    { name: 'Coffee Shop', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '7:42', source: 'SoundHelix' },
    { name: 'Calm Piano', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: '6:24', source: 'SoundHelix' },
    { name: 'Flow State', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', duration: '5:03', source: 'SoundHelix' }
  ],
  relax: [
    { name: 'Calm Waves', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration: '6:38', source: 'SoundHelix' },
    { name: 'Healing Strings', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', duration: '8:12', source: 'SoundHelix' },
    { name: 'Peaceful Piano', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', duration: '4:56', source: 'SoundHelix' }
  ],
  sleep: [
    { name: 'Dream Drift', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', duration: '6:55', source: 'SoundHelix' },
    { name: 'Deep Sleep', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', duration: '7:18', source: 'SoundHelix' },
    { name: 'Calm Ambient', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', duration: '5:31', source: 'SoundHelix' }
  ],
  nature: [
    { name: 'Forest Morning', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', duration: '7:04', source: 'SoundHelix' },
    { name: 'Ocean Waves', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', duration: '5:17', source: 'SoundHelix' },
    { name: 'Rainy Window', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', duration: '4:22', source: 'SoundHelix' },
    { name: 'Nature Sounds', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', duration: '6:41', source: 'SoundHelix' }
  ],
  motivate: [
    { name: 'Epic Motivation', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', duration: '5:47', source: 'SoundHelix' },
    { name: 'Power Up', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', duration: '6:13', source: 'SoundHelix' },
    { name: 'Inspiring Beat', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '5:17', source: 'SoundHelix' },
    { name: 'Uplifting Vibes', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '7:42', source: 'SoundHelix' }
  ]
};

let tasks = [];
let nextTaskId = 1;

// Toast Notification System
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 10px;
    min-width: 300px;
    max-width: 400px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.3s ease-out;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
  `;

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  const iconColor = type === 'success' ? '#4ade80' : type === 'error' ? '#f87171' : '#60a5fa';

  toast.innerHTML = `
    <span style="font-size: 20px;">${icon}</span>
    <span style="flex: 1; color: ${iconColor};">${message}</span>
    <button onclick="this.parentElement.remove()" style="
      background: none;
      border: none;
      color: rgba(255,255,255,0.6);
      cursor: pointer;
      font-size: 18px;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s;
    " onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.color='#fff';" onmouseout="this.style.background='none'; this.style.color='rgba(255,255,255,0.6)';">✕</button>
  `;

  // Add animation keyframes if not already added
  if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  container.appendChild(toast);

  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- LocalStorage helpers ---
// --- Translations ---
const translations = {
  en: { start: 'START', pause: 'PAUSE', focus: 'Pomodoro', sbreak: 'Short Break', lbreak: 'Long Break', meter: 'Focus Meter' },
  es: { start: 'INICIAR', pause: 'PAUSA', focus: 'Enfoque', sbreak: 'Descanso Corto', lbreak: 'Descanso Largo', meter: 'Medidor' },
  fr: { start: 'DÉMARRER', pause: 'PAUSE', focus: 'Focus', sbreak: 'Pause Courte', lbreak: 'Longue Pause', meter: 'Compteur' },
  de: { start: 'START', pause: 'PAUSE', focus: 'Fokus', sbreak: 'Kurze Pause', lbreak: 'Lange Pause', meter: 'Anzeige' },
  hi: { start: 'शुरू करें', pause: 'रोकें', focus: 'पोमोडोरो', sbreak: 'छोटा ब्रेक', lbreak: 'लंबा ब्रेक', meter: 'मीटर' },
  ja: { start: '開始', pause: '一時停止', focus: '集中', sbreak: '短時間休憩', lbreak: '長時間休憩', meter: '集中メーター' }
};

function applyTranslation(lang) {
  const t = translations[lang] || translations.en;
  config.language = lang;
  saveConfig();

  // Update Start Button
  const btnStart = $('#btn-start span');
  if (btnStart) btnStart.textContent = state.isRunning ? t.pause : t.start;

  // Update Tabs
  $$('.mode-tab').forEach(tab => {
    const mode = tab.dataset.mode;
    const label = mode === 'pomodoro' ? t.focus : (mode === 'shortBreak' ? t.sbreak : t.lbreak);
    const svg = tab.querySelector('svg').outerHTML;
    tab.innerHTML = `${svg} ${label}`;
  });

  // Update Mode Label
  const modeLabel = $('#current-mode-label');
  if (modeLabel) {
    if (state.mode === 'pomodoro') modeLabel.textContent = t.focus;
    else if (state.mode === 'shortBreak') modeLabel.textContent = t.sbreak;
    else modeLabel.textContent = t.lbreak;
  }

  // Update Focus Meter Label
  const meterLabel = $('.mood-label');
  if (meterLabel) meterLabel.textContent = t.meter;
}

// --- LocalStorage helpers ---
function loadConfig() {
  try {
    const s = JSON.parse(localStorage.getItem('pomo-config'));
    if (s) config = { ...DEFAULTS, ...s };
  } catch { /* defaults */ }
}

function saveConfig() {
  localStorage.setItem('pomo-config', JSON.stringify(config));
}

function loadTasks() {
  try {
    const s = JSON.parse(localStorage.getItem('pomo-tasks'));
    if (Array.isArray(s)) {
      tasks = s;
      nextTaskId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    }
  } catch { tasks = []; }
  const savedActive = localStorage.getItem('pomo-active-task');
  if (savedActive) state.activeTaskId = parseInt(savedActive);
}

function saveTasks() {
  localStorage.setItem('pomo-tasks', JSON.stringify(tasks));
  localStorage.setItem('pomo-active-task', state.activeTaskId || '');
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadStats() {
  try { return JSON.parse(localStorage.getItem('pomo-stats')) || {}; }
  catch { return {}; }
}

function saveStats(stats) {
  localStorage.setItem('pomo-stats', JSON.stringify(stats));
}

function recordSession(minutes, isWork = true) {
  const stats = loadStats();
  const key = getTodayKey();
  if (!stats[key]) stats[key] = { sessions: 0, workMinutes: 0, breakMinutes: 0, totalMinutes: 0 };

  stats[key].sessions += 1;
  const mins = Number(minutes) || 0;

  if (isWork) {
    stats[key].workMinutes += mins;
  } else {
    stats[key].breakMinutes += mins;
  }

  stats[key].totalMinutes = stats[key].workMinutes + stats[key].breakMinutes;
  saveStats(stats);
}

function getDayStreak() {
  const stats = loadStats();
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const data = stats[key];
    const hasActivity = data && (data.sessions > 0 || data.totalMinutes > 0 || data.minutes > 0);
    if (hasActivity) streak++;
    else break;
  }
  return streak;
}

// --- DOM ---
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// --- Timer Ring ---
const RING_CIRCUMFERENCE = 2 * Math.PI * 44;

function updateTimerRing() {
  const ring = $('#timer-ring');
  if (!ring) return;
  const progress = state.totalTime > 0 ? state.timeLeft / state.totalTime : 1;
  const offset = RING_CIRCUMFERENCE * (1 - progress);
  ring.style.strokeDashoffset = offset;
}

// --- Focus Meter ---
function updateFocusMeter() {
  const fill = $('#mood-fill');
  const percentTag = $('#mood-percent');
  if (!fill) return;
  const stats = loadStats();
  const key = getTodayKey();
  const data = stats[key] || { totalMinutes: 0, workMinutes: 0, minutes: 0 };
  // Use totalMinutes if available, else fallback to old minutes field
  let displayMinutes = data.totalMinutes !== undefined ? data.totalMinutes : (data.minutes || 0);

  // Add current active session minutes for live feedback
  if (state.isRunning) {
    const elapsed = (state.totalTime - state.timeLeft) / 60;
    // We count both work and breaks as "Active Protocol Time" in the meter
    displayMinutes += elapsed;
  }

  // Daily goal is 120 minutes of total protocol time
  const percent = Math.min(100, (displayMinutes / 120) * 100);
  fill.style.width = `${Math.max(5, percent)}%`;

  if (percentTag) {
    percentTag.textContent = `${Math.round(percent)}%`;
    percentTag.style.color = percent > 50 ? 'var(--accent-teal)' : 'var(--accent-pink)';
  }

  // Dynamic color based on focus level
  if (percent < 30) {
    fill.style.background = 'linear-gradient(90deg, #f87171, #fb923c)';
  } else if (percent < 70) {
    fill.style.background = 'linear-gradient(90deg, #fbbf24, #10b981)';
  } else {
    fill.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
  }

  // Update modal live if open
  const modal = $('#focus-overlay');
  if (modal && !modal.classList.contains('hidden')) {
    renderFocusInsights();
  }
}

// --- Focus Insights ---
function renderFocusInsights() {
  const stats = loadStats();
  const key = getTodayKey();
  const data = stats[key] || { totalMinutes: 0, workMinutes: 0, minutes: 0, sessions: 0 };

  // Combine work and break time for "Focus Today"
  let todayMinutes = data.totalMinutes !== undefined ? data.totalMinutes : (data.minutes || 0);
  let totalSessions = data.sessions || 0;

  // Include current session for live insight (any mode: pomodoro or breaks)
  if (state.isRunning) {
    const elapsed = (state.totalTime - state.timeLeft) / 60;
    todayMinutes += elapsed;
  }

  const todayHrs = Math.floor(todayMinutes / 60);
  const todayMins = Math.round(todayMinutes % 60);

  const todayMinsEl = $('#insight-today-mins');
  if (todayMinsEl) {
    if (todayHrs > 0) todayMinsEl.textContent = `${todayHrs}h ${todayMins}m`;
    else if (todayMinutes > 0 && todayMinutes < 0.1) todayMinsEl.textContent = '< 0.1m';
    else todayMinsEl.textContent = `${todayMins}m`;
  }

  const streakEl = $('#insight-streak');
  if (streakEl) streakEl.textContent = totalSessions; // Showing sessions as "Activity Spike" for now

  const intensityEl = $('#insight-intensity');
  if (intensityEl) {
    const intensity = todayMinutes > 0 ? Math.min(98, 85 + Math.random() * 10) : 0;
    intensityEl.textContent = `${Math.round(intensity)}%`;
  }

  const flowEl = $('#insight-flow');
  if (flowEl) {
    flowEl.textContent = todayMinutes > 120 ? 'Transcend' : (todayMinutes > 60 ? 'High' : (todayMinutes > 0 ? 'Stable' : 'None'));
  }

  const percent = Math.min(100, (todayMinutes / 120) * 100);
  const percentLabel = $('#focus-percent-label');
  if (percentLabel) percentLabel.textContent = `${Math.round(percent)}%`;

  const insightFill = $('#focus-insight-fill');
  if (insightFill) insightFill.style.width = `${percent}%`;

  const levelLabel = $('#focus-level-label');
  const adviceEl = $('#focus-advice');

  if (levelLabel && adviceEl) {
    if (percent < 1) {
      levelLabel.textContent = 'Focus Level: Dormant';
      adviceEl.textContent = '"Initializing Pomo Sync... Complete a Pomodoro to begin your daily analysis."';
    } else if (percent < 25) {
      levelLabel.textContent = 'Focus Level: Theta (Baseline)';
      adviceEl.textContent = '"Your cognitive engine is warming up. Try a shorter sprint to build momentum."';
    } else if (percent < 50) {
      levelLabel.textContent = 'Focus Level: Alpha (Steady)';
      adviceEl.textContent = '"Stable state achieved. You are in the zone. Keep distractions at bay."';
    } else if (percent < 80) {
      levelLabel.textContent = 'Focus Level: Beta (High-Performance)';
      adviceEl.textContent = '"Pomo Synchronization is peak. This is where the magic happens. Deep focus mode."';
    } else {
      levelLabel.textContent = 'Focus Level: Gamma (Deep Flow)';
      adviceEl.textContent = '"You have transcended. Total immersion reached. You are at your highest cognitive output."';
    }
  }
}

function openFocusInsights() {
  renderFocusInsights();
  const focusOverlay = $('#focus-overlay');
  if (focusOverlay) {
    focusOverlay.classList.remove('hidden');
    startPomoAnimation();
  }
}

// Helper to refresh meter from anywhere
function refreshMeter() {
  updateFocusMeter();
  updateSessionInfo();
}

let PomoInterval = null;
function startPomoAnimation() {
  if (PomoInterval) clearInterval(PomoInterval);
  const bars = $$('.waveform-bar');
  if (bars.length === 0) return;

  PomoInterval = setInterval(() => {
    bars.forEach(bar => {
      const h = 10 + Math.random() * 35;
      bar.style.height = `${h}px`;
      bar.style.opacity = 0.4 + (h / 35) * 0.6;
    });
  }, 150);
}

function stopPomoAnimation() {
  if (PomoInterval) {
    clearInterval(PomoInterval);
    PomoInterval = null;
  }
}

// --- Timer ---
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateTimerDisplay() {
  const el = $('#timer-time');
  if (el) el.textContent = formatTime(state.timeLeft);
  updateTimerRing();

  const modeLabel = state.mode === 'pomodoro' ? 'Focus' : state.mode === 'shortBreak' ? 'Short Break' : 'Long Break';
  document.title = state.isRunning
    ? `${formatTime(state.timeLeft)} - ${modeLabel} | Pomo`
    : 'Pomo — Advanced Cognitive Partner';
}

function startTimer() {
  if (state.isRunning) return;
  state.isRunning = true;
  document.body.setAttribute('data-timer-running', 'true');
  const btnStart = $('#btn-start');
  if (btnStart) {
    btnStart.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
      </svg>
      <span>PAUSE</span>
    `;
    btnStart.classList.add('running');
  }

  // Start background music if enabled
  if (state.bgMusic.enabled) {
    resumeMusic();
  }

  state.intervalId = setInterval(() => {
    state.timeLeft--;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      updateTimerDisplay();
      onTimerComplete();
      return;
    }
    updateTimerDisplay();
    updateFocusMeter();
  }, 1000);

  const moodMeter = $('.mood-meter');
  if (moodMeter) moodMeter.setAttribute('data-running', 'true');
}

function pauseTimer() {
  state.isRunning = false;
  document.body.removeAttribute('data-timer-running');
  clearInterval(state.intervalId);
  state.intervalId = null;
  const btnStart = $('#btn-start');
  if (btnStart) {
    btnStart.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
      <span>START</span>
    `;
    btnStart.classList.remove('running');
  }

  // Pause background music
  if (state.bgMusic.enabled) {
    pauseMusic();
  }

  const moodMeter = $('.mood-meter');
  if (moodMeter) moodMeter.removeAttribute('data-running');
}

function resetTimer() {
  pauseTimer();
  const durations = { pomodoro: config.pomodoro, shortBreak: config.shortBreak, longBreak: config.longBreak };
  state.timeLeft = durations[state.mode] * 60;
  state.totalTime = state.timeLeft;
  updateTimerDisplay();
}

function switchMode(mode) {
  if (state.isRunning) pauseTimer();
  state.mode = mode;

  document.body.setAttribute('data-mode', mode);
  $$('.mode-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));

  const labels = { pomodoro: 'Pomodoro', shortBreak: 'Short Break', longBreak: 'Long Break' };
  const modeLabel = $('#current-mode-label');
  if (modeLabel) modeLabel.textContent = labels[mode];

  const durations = { pomodoro: config.pomodoro, shortBreak: config.shortBreak, longBreak: config.longBreak };
  state.timeLeft = durations[mode] * 60;
  state.totalTime = state.timeLeft;

  updateSessionInfo();
  updateTimerDisplay();
}

function updateSessionInfo() {
  const sn = $('#session-number');
  const sm = $('#session-message');
  if (sn) sn.textContent = `#${state.completedPomodoros + 1}`;
  if (sm) {
    if (state.mode === 'pomodoro') sm.textContent = 'Time to focus!';
    else if (state.mode === 'shortBreak') sm.textContent = 'Time for a break!';
    else sm.textContent = 'Time for a long break!';
  }
}

function onTimerComplete() {
  pauseTimer();
  playAlarm();

  if (state.mode === 'pomodoro') {
    state.completedPomodoros++;
    recordSession(config.pomodoro, true);
    updateFocusMeter();

    if (state.activeTaskId) {
      const task = tasks.find(t => t.id === state.activeTaskId);
      if (task) {
        task.completedPomos++;
        saveTasks();
        renderTasks();
      }
    }

    if (state.completedPomodoros % config.longBreakInterval === 0) {
      switchMode('longBreak');
    } else {
      switchMode('shortBreak');
    }

    if (config.autoStartBreak) setTimeout(() => startTimer(), 400);
  } else {
    // Record the break time too
    recordSession(config[state.mode], false);
    updateFocusMeter();

    switchMode('pomodoro');
    if (config.autoStartPomodoro) setTimeout(() => startTimer(), 400);
  }
}

// --- Alarm Sound ---
function playAlarm() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const vol = config.alarmVolume / 100;
    const type = config.alarmSound;

    if (type === 'bell') {
      [800, 1000, 800, 1200].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.25);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.25);
        gain.gain.linearRampToValueAtTime(vol * 0.2, ctx.currentTime + i * 0.25 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.25 + 0.7);
        osc.start(ctx.currentTime + i * 0.25);
        osc.stop(ctx.currentTime + i * 0.25 + 0.7);
      });
    } else if (type === 'digital') {
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(1000, ctx.currentTime + i * 0.3);
        gain.gain.setValueAtTime(vol * 0.08, ctx.currentTime + i * 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.3 + 0.15);
        osc.start(ctx.currentTime + i * 0.3);
        osc.stop(ctx.currentTime + i * 0.3 + 0.2);
      }
    } else {
      for (let i = 0; i < 6; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(vol * 0.12, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.08);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.1);
      }
    }
  } catch { /* silent */ }
}

// --- Background Music System ---
function initMusicPlayer() {
  if (!state.bgMusic.audio) {
    state.bgMusic.audio = new Audio();
    state.bgMusic.audio.addEventListener('ended', () => {
      playNextTrack();
    });
    state.bgMusic.audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      console.error('Failed URL:', state.bgMusic.audio.src);
      // Don't auto-advance on error to prevent infinite loop
      state.bgMusic.isPlaying = false;
      updateMusicUI();
    });
    state.bgMusic.audio.addEventListener('loadstart', () => {
      console.log('Loading audio:', state.bgMusic.audio.src);
    });
    state.bgMusic.audio.addEventListener('canplay', () => {
      console.log('Audio ready to play');
    });
  }
}

function playMusic(trackIndex = 0) {
  initMusicPlayer();
  const playlist = musicLibrary[state.bgMusic.currentPlaylist];
  if (!playlist || !playlist[trackIndex]) {
    console.error('Track not found:', trackIndex);
    return;
  }

  const track = playlist[trackIndex];
  console.log('Attempting to play:', track.name, track.url);
  
  // Stop any current playback first
  state.bgMusic.audio.pause();
  state.bgMusic.audio.currentTime = 0;
  
  // Set new source
  state.bgMusic.audio.src = track.url;
  state.bgMusic.audio.volume = state.bgMusic.volume;
  
  // Wait for audio to load before playing
  state.bgMusic.audio.load();
  
  // Use a small delay to ensure load completes
  setTimeout(() => {
    const playPromise = state.bgMusic.audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          state.bgMusic.isPlaying = true;
          state.bgMusic.currentTrack = trackIndex;
          updateMusicUI();
          console.log('✅ Now playing:', track.name);
        })
        .catch(err => {
          console.error('❌ Play error:', err);
          console.error('Failed track:', track.name, track.url);
          state.bgMusic.isPlaying = false;
          updateMusicUI();
          // Don't auto-retry to prevent infinite loop
        });
    } else {
      state.bgMusic.isPlaying = true;
      state.bgMusic.currentTrack = trackIndex;
      updateMusicUI();
    }
  }, 100);
}

function pauseMusic() {
  if (state.bgMusic.audio) {
    state.bgMusic.audio.pause();
    state.bgMusic.isPlaying = false;
    updateMusicUI();
  }
}

function resumeMusic() {
  if (state.bgMusic.audio && state.bgMusic.enabled) {
    const playPromise = state.bgMusic.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          state.bgMusic.isPlaying = true;
          updateMusicUI();
        })
        .catch(err => {
          console.error('Resume error:', err);
          state.bgMusic.isPlaying = false;
          updateMusicUI();
        });
    } else {
      state.bgMusic.isPlaying = true;
      updateMusicUI();
    }
  }
}

function stopMusic() {
  if (state.bgMusic.audio) {
    state.bgMusic.audio.pause();
    state.bgMusic.audio.currentTime = 0;
    state.bgMusic.isPlaying = false;
    updateMusicUI();
  }
}

function playNextTrack() {
  const playlist = musicLibrary[state.bgMusic.currentPlaylist];
  const nextIndex = (state.bgMusic.currentTrack + 1) % playlist.length;
  playMusic(nextIndex);
}

function setMusicVolume(volume) {
  state.bgMusic.volume = Math.max(0, Math.min(1, volume));
  if (state.bgMusic.audio) {
    state.bgMusic.audio.volume = state.bgMusic.volume;
  }
  updateMusicUI();
}

function toggleMusicEnabled() {
  state.bgMusic.enabled = !state.bgMusic.enabled;
  if (state.bgMusic.enabled && state.isRunning) {
    playMusic(state.bgMusic.currentTrack);
  } else if (!state.bgMusic.enabled) {
    stopMusic();
  }
  updateMusicUI();
}

function updateMusicUI() {
  const toggle = $('#music-toggle');
  if (toggle) toggle.checked = state.bgMusic.enabled;

  const musicPanel = $('#music-panel');
  if (musicPanel) {
    musicPanel.classList.toggle('music-enabled', state.bgMusic.enabled);
  }

  // Update now playing display
  const nowPlaying = $('#now-playing-track');
  if (nowPlaying && state.bgMusic.enabled) {
    const playlist = musicLibrary[state.bgMusic.currentPlaylist];
    const track = playlist[state.bgMusic.currentTrack];
    nowPlaying.textContent = `Now: ${track.name}`;
  }
}

function renderMusicPanel() {
  const panel = $('#music-panel');
  if (!panel) return;

  let html = `
    <div class="music-header">
      <h3>🎵 Background Music</h3>
      <label class="toggle-switch">
        <input type="checkbox" id="music-toggle-panel" ${state.bgMusic.enabled ? 'checked' : ''}>
        <span class="toggle-slider"></span>
      </label>
    </div>

    <div class="music-now-playing" id="now-playing-track">
      ${state.bgMusic.enabled ? `Now: ${musicLibrary[state.bgMusic.currentPlaylist][state.bgMusic.currentTrack].name}` : 'Music disabled'}
    </div>

    <div class="music-volume-control">
      <label>Volume</label>
      <input type="range" id="music-volume" min="0" max="100" value="${Math.round(state.bgMusic.volume * 100)}" class="volume-slider">
      <span id="volume-display">${Math.round(state.bgMusic.volume * 100)}%</span>
    </div>

    <div class="music-playlists">
      <h4>Playlists</h4>
  `;

  Object.keys(musicLibrary).forEach(playlistName => {
    const isActive = state.bgMusic.currentPlaylist === playlistName;
    html += `
      <button class="playlist-btn ${isActive ? 'active' : ''}" data-playlist="${playlistName}">
        ${playlistName === 'focus' ? '🎯' : playlistName === 'break' ? '☕' : '⚡'} ${playlistName.charAt(0).toUpperCase() + playlistName.slice(1)}
      </button>
    `;
  });

  html += `
    </div>

    <div class="music-tracks">
      <h4>Tracks</h4>
      <div class="tracks-list" id="tracks-list">
  `;

  const currentPlaylist = musicLibrary[state.bgMusic.currentPlaylist];
  currentPlaylist.forEach((track, idx) => {
    const isPlaying = state.bgMusic.currentTrack === idx && state.bgMusic.isPlaying;
    const sourceIcon = track.source === 'Pixabay' ? '🎨' : track.source === 'Free Music Archive' ? '🎵' : '📺';
    html += `
      <div class="track-item ${isPlaying ? 'playing' : ''}" data-track-index="${idx}">
        <span class="track-icon">${isPlaying ? '▶️' : sourceIcon}</span>
        <div class="track-info">
          <div class="track-name">${track.name}</div>
          <div class="track-duration">${track.duration} • ${track.source}</div>
        </div>
        <button class="track-play-btn" data-track-index="${idx}" type="button">
          ${isPlaying ? '⏸' : '▶'}
        </button>
      </div>
    `;
  });

  html += `
      </div>
    </div>

    <div class="music-controls">
      <button id="music-prev-btn" class="music-control-btn" type="button">⏮ Previous</button>
      <button id="music-play-btn" class="music-control-btn" type="button">${state.bgMusic.isPlaying ? '⏸ Pause' : '▶ Play'}</button>
      <button id="music-next-btn" class="music-control-btn" type="button">Next ⏭</button>
    </div>
  `;

  panel.innerHTML = html;

  // Attach event listeners
  const togglePanel = $('#music-toggle-panel');
  if (togglePanel) {
    togglePanel.addEventListener('change', (e) => {
      e.stopPropagation();
      toggleMusicEnabled();
    });
  }

  const volumeSlider = $('#music-volume');
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      setMusicVolume(e.target.value / 100);
      const display = $('#volume-display');
      if (display) display.textContent = `${e.target.value}%`;
    });
  }

  $$('.playlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.bgMusic.currentPlaylist = btn.dataset.playlist;
      state.bgMusic.currentTrack = 0;
      if (state.bgMusic.enabled) playMusic(0);
      renderMusicPanel();
    });
  });

  $$('.track-play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.trackIndex);
      if (state.bgMusic.currentTrack === idx && state.bgMusic.isPlaying) {
        pauseMusic();
      } else {
        state.bgMusic.enabled = true;
        playMusic(idx);
      }
      renderMusicPanel();
    });
  });

  const prevBtn = $('#music-prev-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const playlist = musicLibrary[state.bgMusic.currentPlaylist];
      const prevIndex = (state.bgMusic.currentTrack - 1 + playlist.length) % playlist.length;
      state.bgMusic.enabled = true;
      playMusic(prevIndex);
      renderMusicPanel();
    });
  }

  const playBtn = $('#music-play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.bgMusic.isPlaying) {
        pauseMusic();
      } else {
        state.bgMusic.enabled = true;
        if (state.bgMusic.audio && state.bgMusic.audio.src) {
          resumeMusic();
        } else {
          playMusic(state.bgMusic.currentTrack);
        }
      }
      renderMusicPanel();
    });
  }

  const nextBtn = $('#music-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.bgMusic.enabled = true;
      playNextTrack();
      renderMusicPanel();
    });
  }
}

// --- Tasks ---
function renderTasks() {
  const list = $('#task-list');
  if (!list) return;
  list.innerHTML = '';

  tasks.forEach(task => {
    const el = document.createElement('div');
    el.className = 'task-item' + (task.id === state.activeTaskId ? ' active' : '');
    el.dataset.id = task.id;

    el.innerHTML = `
      <div class="task-check-area">
        <button class="task-checkbox ${task.done ? 'checked' : ''}" data-action="toggle"></button>
      </div>
      <div class="task-content" data-action="select">
        <span class="task-name ${task.done ? 'done' : ''}">${escapeHtml(task.name)}</span>
        <span class="task-pomo-count">${task.completedPomos}/${task.estimatedPomos} pomodoros</span>
      </div>
      <div class="task-actions">
        <button class="task-action-btn" data-action="delete" title="Delete task">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    `;

    el.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (action === 'toggle') {
        task.done = !task.done;
        saveTasks(); renderTasks();
      } else if (action === 'delete') {
        tasks = tasks.filter(t => t.id !== task.id);
        if (state.activeTaskId === task.id) state.activeTaskId = null;
        saveTasks(); renderTasks();
      } else if (action === 'select') {
        state.activeTaskId = task.id;
        saveTasks(); renderTasks();
      }
    });

    list.appendChild(el);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== CHAT SYSTEM =====

const welcomeMessages = [
  "Hey there! 👋 I'm Pomo—your Advanced Cognitive Partner. How can I optimize your session today?",
  "Welcome back! 🍅 Ready to crush your goals today? Start a focus session or ask me anything!",
  "Hi! 🎯 I'm here to help you stay focused and productive. What would you like to do?",
  "Hello! ✨ New chat started. Let's make today count! Try clicking a suggestion below or type a message.",
  "Hey! 🚀 Fresh start! I can help you with focus timers, tasks, and productivity tips. What's on your mind?",
];

const chatResponses = {
  'add a task': () => {
    showTasksView();
    setTimeout(() => {
      const addBtn = $('#btn-add-task');
      if (addBtn) addBtn.click();
    }, 200);
    return "Sure! I've opened the task form for you. Add your task and let's get productive! 🚀";
  },
  'analyse my productivity': () => {
    setTimeout(() => openReport(), 500);
    return "Here's your productivity report! Let me pull up your stats... 📊";
  },
  'work is stressful': () => {
    setTimeout(() => switchMode('shortBreak'), 500);
    return "I hear you! Taking breaks is important. I've switched you to a short break. Remember: rest is part of the process. 🧘‍♀️ Take a deep breath!";
  },
  'customize my timer': () => {
    setTimeout(() => openSettings(), 500);
    return "Let's customize your timer! Opening settings now... ⚙️";
  },
  'today is great': () => {
    return "That's amazing to hear! 🎉 Let's make the most of this great energy. Hit START and crush your focus session! You've got this! 💪";
  },
  'find me a therapist': () => {
    return "I'm your Advanced Cognitive Partner, dedicated to both your productivity and your mental resilience. 💚\n\nIf you're feeling overwhelmed, please consider these resources:\n• 988 Suicide & Crisis Lifeline\n• BetterHelp.com for professional therapy\n• Psychology Today therapist finder\n\nYou aren't alone in this journey.";
  },
  'optimize my focus protocol': () => {
    return "Pomo Synchronization initialized. 🧠 To optimize your protocol, I recommend a 50/10 work-rest cycle today based on your recent peak performance data. Shall we begin?";
  },
  'cognitive reframing exercise': () => {
    return "Let's reframe your current challenge. 🔄 Instead of seeing it as a 'blockade,' let's view it as a 'Pomo expansion phase.' What is one small win you've had today?";
  },
  'stress resilience session': () => {
    return "Resilience protocol active. 🛡️ Take 4 rhythmic breaths: Inhale for 4, Hold for 4, Exhale for 6. Your physiological sync is key to sustained flow.";
  },
  'daily wellness audit': () => {
    return "Audit started. 📋 You've completed 4 sessions today with high consistency. Your hydration levels and screen-time breaks are within the optimal range. Keep it up!";
  },
  'analyze my Pomo peak-states': () => {
    return "Analyzing waveforms... 📊 Your highest cognitive output occurs between 10 AM and 1 PM. Your Gamma-state synchronization is strongest during 25-minute sprints.";
  },
  'elite therapist matching': () => {
    return "Accessing Elite Network... 🌐 I've unlocked our priority matching system for you. Would you like me to filter for cognitive-behavioral specialists or peak-performance coaches?";
  }
};

const generalResponses = [
  "That's interesting! Let me help you stay focused. Try starting a Pomodoro session! 🍅",
  "I'm here to help you be productive! Would you like to start a focus session or add a task?",
  "Great question! I can help you with timers, tasks, and productivity tips. What would you like to do?",
  "Let's make today productive! You can start a timer, add tasks, or check your stats. 📈",
  "I'm Pomo, your Advanced Cognitive Partner! Try initiating a 'Focus Protocol' or checking your 'Pomo Peak-States'! 🎯",
];

function addChatMessage(text, type = 'bot') {
  const container = $('#chat-messages');
  if (!container) return;
  container.classList.remove('hidden');
  container.style.display = '';

  const msg = document.createElement('div');
  msg.className = `chat-message ${type} advanced-msg`;

  if (type === 'system') {
    msg.style.justifyContent = 'center';
    msg.style.margin = '20px 0';
    msg.innerHTML = text; // Just insert the raw HTML for system messages
    container.appendChild(msg);
  } else {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const avatar = document.createElement('div');
    avatar.className = 'chat-message-avatar';
    avatar.innerHTML = type === 'bot' ?
      `<div class="avatar-glow"></div><span>🍅</span>` :
      `<span>👤</span>`;

    const msgBody = document.createElement('div');
    msgBody.className = 'chat-message-body';

    const bubble = document.createElement('div');
    bubble.className = 'chat-message-bubble';
    bubble.innerHTML = text;

    const meta = document.createElement('div');
    meta.className = 'chat-message-meta';

    const cleanText = text
      .replace(/<[^>]*>?/gm, '') // Strip HTML tags
      .replace(/(\r\n|\n|\r)/gm, " ") // Remove newlines
      .replace(/'/g, "\\'") // Escape single quotes for JS
      .replace(/"/g, "&quot;"); // Escape double quotes for HTML attribute

    const actions = type === 'bot' ? `
      <div class="msg-actions">
        <button onclick="speechSynthesis.speak(new SpeechSynthesisUtterance('${cleanText}'))" title="Listen">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        </button>
        <button onclick="navigator.clipboard.writeText('${cleanText}')" title="Copy">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
        <button title="Like"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg></button>
        <button title="Dislike"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg></button>
      </div>
    ` : '';

    meta.innerHTML = `<span class="msg-time">${timeString}</span> ${actions}`;

    msgBody.appendChild(bubble);
    msgBody.appendChild(meta);

    msg.appendChild(avatar);
    msg.appendChild(msgBody);

    container.appendChild(msg);
  }

  // Smooth scroll
  setTimeout(() => {
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, 100);
}

function handleChatSend() {
  const input = $('#chat-message-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  // HIDE Welcome Elements when chat starts
  const welcomeMsg = $('#welcome-message');
  const suggestions = $('#suggestion-chips-area');
  const timerCard = $('.timer-chat-area');

  if (welcomeMsg) welcomeMsg.classList.add('hidden');
  if (suggestions) suggestions.classList.add('hidden');
  if (timerCard) timerCard.classList.remove('hidden');

  addChatMessage(text, 'user');
  input.value = '';

  // Find matching response
  const lowerText = text.toLowerCase();
  let response = null;

  for (const [key, handler] of Object.entries(chatResponses)) {
    if (lowerText.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerText)) {
      response = handler();
      break;
    }
  }

  if (!response) {
    if (lowerText.includes('start') || lowerText.includes('begin') || lowerText.includes('focus')) {
      response = "Let's focus! Hit the START button or press Space to begin your Pomodoro session. 🍅";
    } else if (lowerText.includes('break') || lowerText.includes('rest') || lowerText.includes('pause')) {
      switchMode('shortBreak');
      response = "Taking a break is smart! I've set up a short break for you. Relax and recharge! ☕";
    } else if (lowerText.includes('task') || lowerText.includes('todo')) {
      showTasksView();
      response = "Let's manage your tasks! I've opened the tasks panel for you. 📝";
    } else if (lowerText.includes('report') || lowerText.includes('stats') || lowerText.includes('progress')) {
      setTimeout(() => openReport(), 500);
      response = "Let me pull up your stats! 📊";
    } else if (lowerText.includes('setting') || lowerText.includes('config') || lowerText.includes('customize')) {
      setTimeout(() => openSettings(), 500);
      response = "Opening your settings! ⚙️";
    } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
      response = "Hey there! 👋 I'm Pomo, your Advanced Cognitive Partner. Ready to achieve peak flow? Hit START or tell me what you need!";
    } else if (lowerText.includes('help')) {
      response = "I can help you with:\n🍅 Starting focus sessions\n📝 Managing tasks\n📊 Viewing your stats\n⚙️ Customizing your timer\n☕ Taking breaks\n\nJust type or click a suggestion chip!";
    }
  }

  if (!response) {
    response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
  }

  // Bot response with typing delay
  setTimeout(() => {
    addChatMessage(response, 'bot');
  }, 600 + Math.random() * 800);
}

function startNewChat(isDuo = false) {
  if (state.isRunning) pauseTimer();
  switchMode('pomodoro');

  // Navigate to home view first
  hideAllSections();
  const homeView = $('#pomo-home-view');
  if (homeView) homeView.classList.remove('hidden');

  // Clear existing chat messages
  const container = $('#chat-messages');
  if (container) {
    container.innerHTML = '';
    container.style.display = '';
  }

  // Clear input
  const input = $('#chat-message-input');
  if (input) input.value = '';

  // Hide welcome, show chat panel immediately
  const welcomeMsg = $('#welcome-message');
  if (welcomeMsg) welcomeMsg.classList.add('hidden');

  const suggestions = $('#suggestion-chips-area');
  if (suggestions) suggestions.classList.add('hidden');

  const timerCard = $('.timer-chat-area');
  if (timerCard) timerCard.classList.remove('hidden');

  // Show chat-messages panel right away
  if (container) container.classList.remove('hidden');

  // For Duo Chat — inject a distinct banner at the top of the chat
  if (isDuo && container) {
    const banner = document.createElement('div');
    banner.className = 'duo-chat-banner';
    banner.innerHTML = `
      <span class="duo-icon">👥</span>
      <div class="duo-info">
        <span class="duo-title">Duo Focus Session</span>
        <span class="duo-sub">Two minds, one goal — synchronized productivity</span>
      </div>
      <span class="duo-live-dot"></span>
    `;
    container.appendChild(banner);
  }

  // TRIGGER ADVANCED WELCOME SEQUENCE
  setTimeout(() => {
    const syncText = isDuo ? "POMO DUO SYNC INITIALIZED" : "Pomo Sync INITIALIZED";
    addChatMessage(`<div style="display:flex; flex-direction:column; align-items:center; gap:10px; padding:10px 0;">
      <span style="font-size:2rem; filter: drop-shadow(0 0 10px var(--accent-pink));">${isDuo ? '👥' : '🍅'}</span>
      <span style="font-weight:800; letter-spacing:0.05em; color:var(--text-primary); text-align:center;">${syncText}<br><small style="font-weight:400; opacity:0.6;">${isDuo ? 'Dual-Focus Mode Active' : 'Pomo AI is ready to assist'}</small></span>
    </div>`, 'system');

    setTimeout(() => {
      const welcome = isDuo ?
        "Pomo Duo joined the session! 👥 We're here to support <strong>both of you</strong> in achieving synchronized peak flow. You can each take turns sending messages!" :
        "Hi! I am <strong>Pomo</strong>, your elite Pomo productivity partner. My protocols are optimized for your peak cognitive states. 🧠";
      addChatMessage(welcome, 'bot');

      setTimeout(() => {
        const followUp = isDuo
          ? "So, what are you two working on today? Let's build a shared focus plan! 🎯"
          : "So tell me, what's on your agenda? How can we optimize your focus today? 🎯";
        addChatMessage(followUp, 'bot');
        if (suggestions) suggestions.classList.remove('hidden');
      }, 1200);
    }, 1200);
  }, 400);

  const mainContent = $('#main-content');
  if (mainContent) {
    mainContent.style.animation = 'none';
    mainContent.offsetHeight;
    mainContent.style.animation = 'st-fade-in 0.6s ease-out forwards';
  }

  // Highlight the sidebar chat item as active
  $$('.sidebar-item').forEach(i => i.classList.remove('active'));
  const chatItem = $('#chat-toggle')?.closest('.sidebar-item');
  if (chatItem) chatItem.classList.add('active');
}

// --- Sidebar ---
function updateSidebarBackdrop() {
  const backdrop = $('#sidebar-backdrop');
  const sidebar = $('#sidebar');
  const toggle = $('#sidebar-toggle');
  const isOpen = sidebar && sidebar.classList.contains('open');
  if (backdrop) {
    backdrop.classList.toggle('visible', isOpen);
  }
  if (toggle) {
    toggle.classList.toggle('open', isOpen);
  }
}

function initSidebar() {
  const sidebar = $('#sidebar');
  const toggle = $('#sidebar-toggle');
  const backdrop = $('#sidebar-backdrop');

  if (toggle) {
    toggle.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
        updateSidebarBackdrop();
      } else {
        sidebar.classList.toggle('collapsed');
      }
    });
  }

  // Close sidebar when clicking the backdrop
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        updateSidebarBackdrop();
      }
    });
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      const isClickInside = sidebar.contains(e.target);
      const isClickToggle = toggle && toggle.contains(e.target);
      const isClickBackdrop = backdrop && backdrop.contains(e.target);
      if (!isClickInside && !isClickToggle && !isClickBackdrop && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        updateSidebarBackdrop();
      }
    }
  });

  // Close sidebar when a navigation item is clicked on mobile
  sidebar.querySelectorAll('.sidebar-item, .sidebar-sub-item').forEach(item => {
    item.addEventListener('click', (e) => {
      // Don't close if it's an expandable group header (unless it's already active)
      if (item.classList.contains('sidebar-expandable')) return;
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        updateSidebarBackdrop();
      }
    });
  });

  // Expandable groups
  const chatToggle = $('#chat-toggle');
  const chatSubmenu = $('#chat-submenu');
  const wellnessToggle = $('#wellness-toggle');
  const wellnessSubmenu = $('#wellness-submenu');

  if (chatToggle && chatSubmenu) {
    chatToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      chatSubmenu.classList.toggle('open');
      chatToggle.classList.toggle('expanded');

      $$('.sidebar-item').forEach(s => s.classList.remove('active'));
      chatToggle.classList.add('active');
      showTimerView();
    });
  }

  if (wellnessToggle && wellnessSubmenu) {
    wellnessToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      wellnessSubmenu.classList.toggle('open');
      wellnessToggle.classList.toggle('expanded');
    });
  }

  // Wellness Corner sub-items
  $$('#wellness-submenu .sidebar-sub-item').forEach(item => {
    item.addEventListener('click', () => {
      const section = item.dataset.section;

      // Clear all active states first
      $$('.sidebar-item').forEach(s => s.classList.remove('active'));
      $$('.sidebar-sub-item').forEach(s => s.classList.remove('active'));

      // Set active states
      wellnessToggle.classList.add('active');
      item.classList.add('active');

      const sectionMap = {
        'ai-journal': 'ai-journal-section',
        'focus-zone': 'focus-zone-section',
        'self-care': 'self-care-section',
        'wc-music': 'wc-music-section',
        'worksheets': 'worksheets-section',
        'daily-tips': 'daily-tips-section',
        'reminders': 'reminders-section'
      };
      if (sectionMap[section]) {
        showWellnessView(sectionMap[section]);
      }
    });
  });

  // *** NEW CHAT BUTTON ***
  const newChatBtn = $('#new-chat-btn');
  if (newChatBtn) {
    newChatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      startNewChat();
    });
  }

  // *** DUO CHAT BUTTON ***
  const duoChatBtn = $('#duo-chat-btn');
  if (duoChatBtn) {
    duoChatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      startNewChat(true);
    });
  }

  // Suggestion chips listeners handled in bindEvents

  // --- AUTH MODAL ---
  const authOverlay = $('#auth-overlay');

  const openAuthModal = (e) => {
    if (e) e.preventDefault();
    if (authOverlay) {
      authOverlay.classList.remove('hidden');
      // Remove inline styles if they exist
      authOverlay.style.display = '';
      authOverlay.style.visibility = '';
      authOverlay.style.opacity = '';
    }
  };

  const closeAuthModal = (e) => {
    if (e) e.preventDefault();
    console.log('closeAuthModal called');
    console.log('authOverlay element:', authOverlay);
    if (authOverlay) {
      authOverlay.classList.add('hidden');
      // Force hide with inline styles as backup
      authOverlay.style.display = 'none';
      authOverlay.style.visibility = 'hidden';
      authOverlay.style.opacity = '0';
      console.log('Added hidden class, classes:', authOverlay.className);
      console.log('Applied inline styles');
    } else {
      console.error('authOverlay element not found!');
    }
  };

  // Open triggers
  const btnLoginHeader = $('#btn-login');
  console.log('Sign-up button found:', btnLoginHeader);
  if (btnLoginHeader) {
    btnLoginHeader.addEventListener('click', openAuthModal);
    console.log('Sign-up button click handler attached');
  } else {
    console.error('Sign-up button not found! Looking for #btn-login');
  }

  const drLogin = $('#dr-login');
  if (drLogin) drLogin.addEventListener('click', openAuthModal);

  // Close triggers
  const btnCloseAuth = $('#close-auth');
  if (btnCloseAuth) btnCloseAuth.addEventListener('click', closeAuthModal);

  const guestBtn = $('.auth-guest-btn');
  if (guestBtn) guestBtn.addEventListener('click', closeAuthModal);

  if (authOverlay) {
    authOverlay.addEventListener('click', (e) => {
      if (e.target === authOverlay && !window._trialExpired) closeAuthModal(e);
    });
  }

  // Interactive dummy login logic
  const authGoogleBtn = $('#google-signin-btn');
  if (authGoogleBtn) {
    authGoogleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Google button clicked');
      
      // Check if Google SDK is loaded and client ID is configured
      const clientId = document.querySelector('#g_id_onload')?.getAttribute('data-client_id');
      console.log('Google Client ID found:', clientId);
      
      const isGooglePlaceholder = !clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE' || clientId.startsWith('%VITE_') || clientId.startsWith('YOUR_');
      console.log('Is placeholder?', isGooglePlaceholder);
      console.log('Google SDK available?', typeof google !== 'undefined' && google.accounts);
      
      const originalText = authGoogleBtn.innerHTML;
      
      // Use direct Google OAuth URL with implicit flow (returns id_token in URL fragment)
      const googleClientId = '924419504630-4o5f3o2f1mo5m8q5uhjr34fceoa9f5k6.apps.googleusercontent.com';
      const googleRedirectUri = 'http://localhost:5174/auth/google/callback';
      const googleScope = 'openid email profile';
      const googleState = Math.random().toString(36).substring(2, 15);
      const googleNonce = Math.random().toString(36).substring(2, 15);
      
      // Store state and nonce for validation
      localStorage.setItem('google-oauth-state', googleState);
      localStorage.setItem('google-oauth-nonce', googleNonce);
      
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(googleRedirectUri)}&scope=${encodeURIComponent(googleScope)}&response_type=token%20id_token&state=${googleState}&nonce=${googleNonce}`;
      
      console.log('Opening Google OAuth URL:', googleAuthUrl);
      
      // Show loading state
      authGoogleBtn.innerHTML = `
        <div class="social-icon-wrapper">
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0,0)">
              <path d="M23.6 12.2c0-.8-.1-1.6-.2-2.3H12v4.5h6.6c-.3 1.5-1.1 2.7-2.3 3.5v2.9h3.7c2.2-2 3.5-5 3.5-8.6z" fill="#4285F4" />
              <path d="M12 24c3.2 0 6-1.1 8-2.9l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.3 0-6.1-2.2-7.1-5.3H1.1v3.1C3.2 21.4 7.3 24 12 24z" fill="#34A853" />
              <path d="M1.1 13.9V10.8h6c.3 1.6 1.3 3 2.7 3.9l3.7-2.9c-1.6-1.4-3.7-2.3-6.4-2.3-4.7 0-8.8 2.6-10.9 6.4z" fill="#FBBC05" />
              <path d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4C17.9 1.2 15.1 0 12 0 7.3 0 3.2 2.6 1.1 6.4l3.8 3c1-3.1 3.8-5.3 7.1-5.3z" fill="#EA4335" />
            </g>
          </svg>
        </div>
        <span>Redirecting to Google...</span>
      `;
      authGoogleBtn.disabled = true;
      
      // Open Google OAuth in a popup window
      const popup = window.open(googleAuthUrl, 'google-oauth', 'width=500,height=600,scrollbars=yes,resizable=yes');
      
      // Check if popup was blocked
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Popup was blocked - open in same window instead
        console.warn('Popup blocked, opening in same window');
        authGoogleBtn.innerHTML = originalText;
        authGoogleBtn.disabled = false;
        window.location.href = googleAuthUrl;
        return;
      }

      // Reset processed flag before opening popup
      window.__googleAuthProcessed = false;
      
      // Monitor popup for closure
      const checkClosed = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(checkClosed);
            authGoogleBtn.innerHTML = originalText;
            authGoogleBtn.disabled = false;

            // If already processed by postMessage listener, skip
            if (window.__googleAuthProcessed) {
              window.__googleAuthProcessed = false;
              return;
            }
            
            // Check if we received a success callback
            const googleUser = localStorage.getItem('google-oauth-success');
            if (googleUser) {
              const userData = JSON.parse(googleUser);
              localStorage.removeItem('google-oauth-success');
              
              // Store user info
              localStorage.setItem('pomo-user', JSON.stringify(userData));
              
              // Update UI
              const headerUsername = $('.header-username');
              if (headerUsername) headerUsername.textContent = userData.name;
              
              const headerAvatar = $('.header-avatar-v2 .avatar-emoji');
              if (headerAvatar) headerAvatar.textContent = userData.avatar || '👤';
              
              // Close modal
              closeAuthModal();
              
              // Show success
              showToast(`Welcome, ${userData.name}! 🎉`);
            } else {
              // Popup was closed without success - fall back to demo mode
              console.warn('Google OAuth popup closed without success, using demo mode');
              
              const demoUsers = [
                { name: 'Alex Johnson', email: 'alex@example.com', avatar: '👨‍💻' },
                { name: 'Sarah Chen', email: 'sarah@example.com', avatar: '👩‍🎨' },
                { name: 'Mike Rodriguez', email: 'mike@example.com', avatar: '👨‍🚀' },
                { name: 'Emma Wilson', email: 'emma@example.com', avatar: '👩‍🔬' }
              ];
              
              const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];
              
              // Store user info
              localStorage.setItem('pomo-user', JSON.stringify(randomUser));
              
              // Update UI
              const headerUsername = $('.header-username');
              if (headerUsername) headerUsername.textContent = randomUser.name;
              
              const headerAvatar = $('.header-avatar-v2 .avatar-emoji');
              if (headerAvatar) headerAvatar.textContent = randomUser.avatar;
              
              // Close modal
              closeAuthModal();
              
              // Show success with demo indicator
              showToast(`Welcome, ${randomUser.name}! 🎉 (Demo Mode - Google OAuth needs backend setup)`);
            }
          }
        } catch (e) {
          // Error checking popup - might be closed
          clearInterval(checkClosed);
          authGoogleBtn.innerHTML = originalText;
          authGoogleBtn.disabled = false;
        }
      }, 1000);
    });
  } else {
    console.error('Google button not found!');
  }

  // Listen for Google OAuth success messages from the popup
  window.addEventListener('message', function onGoogleOAuthMessage(event) {
    if (event.origin !== window.location.origin) return;
    if (!event.data || event.data.type !== 'google-oauth-success') return;

    console.log('Received Google OAuth success via postMessage');
    const userData = event.data.user;

    // Remove success flag so polling fallback doesn't re-process
    localStorage.removeItem('google-oauth-success');

    // Store user info
    localStorage.setItem('pomo-user', JSON.stringify(userData));

    // Mark as processed
    window.__googleAuthProcessed = true;

    // Update UI
    const headerUsername = $('.header-username');
    if (headerUsername) headerUsername.textContent = userData.name;

    const headerAvatar = $('.header-avatar-v2');
    if (headerAvatar) {
      if (userData.picture) {
        headerAvatar.innerHTML = '<img src="' + userData.picture + '" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">';
      } else {
        headerAvatar.innerHTML = '<span class="avatar-emoji">' + (userData.avatar || '👤') + '</span>';
      }
    }

    // Close modal
    closeAuthModal();

    // Update UI state to "Logged In"
    const btnLogin = $('#btn-login');
    if (btnLogin) btnLogin.classList.add('hidden');

    const drLoginSpan = $('#dr-login span');
    if (drLoginSpan) drLoginSpan.textContent = 'Log Out';

    // Sync to main config so Profile Modal is updated
    if (typeof config !== 'undefined') {
      config.user = {
        ...config.user,
        username: userData.name,
        email: userData.email || '',
        bio: ''
      };
      saveConfig();
    }

    // Reset trial flag and restore buttons
    window._trialExpired = false;
    if (typeof window.restoreAuthButtons === 'function') window.restoreAuthButtons();

    // Show success
    showToast(`Welcome, ${userData.name}! 🎉`);
  });

  // Listen for GitHub OAuth success messages from the popup
  window.addEventListener('message', function onGitHubOAuthMessage(event) {
    if (event.origin !== window.location.origin) return;
    if (!event.data || event.data.type !== 'github-oauth-success') return;

    console.log('Received GitHub OAuth success via postMessage');
    const userData = event.data.userData;

    // Remove temp flag so polling fallback doesn't re-process
    localStorage.removeItem('github-oauth-temp');

    // Mark as processed
    window.__githubAuthProcessed = true;

    // Use the existing handler
    if (typeof window.handleGitHubSignIn === 'function') {
      window.handleGitHubSignIn(userData);
    }
  });

  // GitHub Sign-In functionality
  const authGitHubBtn = $('#github-signin-btn');
  if (authGitHubBtn) {
    authGitHubBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('GitHub button clicked');
      
      // Check if GitHub OAuth is configured
      const clientId = document.querySelector('#github_oauth_config')?.getAttribute('data-github-client-id');
      const redirectUri = document.querySelector('#github_oauth_config')?.getAttribute('data-redirect-uri');
      
      const isGithubPlaceholder = !clientId || clientId === 'YOUR_GITHUB_CLIENT_ID_HERE' || clientId.startsWith('%VITE_') || clientId.startsWith('YOUR_');
      if (clientId && !isGithubPlaceholder) {
        // Real GitHub OAuth flow
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email read:user&state=${Math.random().toString(36).substring(7)}`;
        
        // Open GitHub OAuth in popup
        const popup = window.open(githubAuthUrl, 'github-oauth', 'width=600,height=700,scrollbars=yes,resizable=yes');

        // Reset processed flag
        window.__githubAuthProcessed = false;
        
        // Listen for the OAuth callback
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);

            // If already processed by postMessage listener, skip
            if (window.__githubAuthProcessed) {
              window.__githubAuthProcessed = false;
              return;
            }

            // Check if we received user data (this would be handled by the callback)
            const githubUser = localStorage.getItem('github-oauth-temp');
            if (githubUser) {
              handleGitHubSignIn(JSON.parse(githubUser));
              localStorage.removeItem('github-oauth-temp');
            }
          }
        }, 1000);
        
      } else {
        // Fallback to demo login if GitHub OAuth not configured
        console.warn('GitHub OAuth not configured, using demo mode');
        
        // Show loading state
        const originalText = authGitHubBtn.innerHTML;
        authGitHubBtn.innerHTML = `
          <div class="social-icon-wrapper">
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" 
                    fill="#333"/>
            </svg>
          </div>
          <span>Signing in...</span>
        `;
        authGitHubBtn.disabled = true;
        
        // Simulate GitHub login with demo data
        setTimeout(() => {
          // Generate demo GitHub user data
          const demoGitHubUsers = [
            { 
              name: 'CodeMaster Dev', 
              email: 'codemaster@github.com', 
              avatar: '👨‍💻',
              username: 'codemaster-dev',
              bio: 'Full-stack developer passionate about clean code'
            },
            { 
              name: 'Luna Rodriguez', 
              email: 'luna.codes@github.com', 
              avatar: '👩‍💻',
              username: 'luna-codes',
              bio: 'Frontend engineer & UI/UX enthusiast'
            },
            { 
              name: 'Alex Chen', 
              email: 'alex.opensource@github.com', 
              avatar: '🧑‍💻',
              username: 'alex-opensource',
              bio: 'Open source contributor & DevOps engineer'
            },
            { 
              name: 'Maya Patel', 
              email: 'maya.builds@github.com', 
              avatar: '👩‍🔬',
              username: 'maya-builds',
              bio: 'Data scientist & machine learning researcher'
            }
          ];
          
          const randomUser = demoGitHubUsers[Math.floor(Math.random() * demoGitHubUsers.length)];
          
          // Store user info
          localStorage.setItem('pomo-user', JSON.stringify({
            name: randomUser.name,
            email: randomUser.email,
            avatar: randomUser.avatar,
            provider: 'github',
            username: randomUser.username,
            bio: randomUser.bio
          }));
          
          // Update UI
          const headerUsername = $('.header-username');
          if (headerUsername) headerUsername.textContent = randomUser.name;
          
          const headerAvatar = $('.header-avatar-v2 .avatar-emoji');
          if (headerAvatar) headerAvatar.textContent = randomUser.avatar;
          
          // Reset button
          authGitHubBtn.innerHTML = originalText;
          authGitHubBtn.disabled = false;
          
          // Close modal
          closeAuthModal();
          
          // Show success with demo indicator
          showToast(`Welcome, ${randomUser.name}! 🎉 (Demo Mode - Set up GitHub OAuth for real authentication)`);
          
        }, 1500);
      }
    });
  } else {
    console.error('GitHub button not found!');
  }

  // GitHub Sign-In callback handler
  window.handleGitHubSignIn = function(userData) {
    console.log('GitHub Sign-In successful!', userData);
    
    try {
      // Store user info
      localStorage.setItem('pomo-user', JSON.stringify({
        name: userData.name || userData.login,
        email: userData.email,
        avatar: userData.avatar_url || '👤',
        provider: 'github',
        username: userData.login,
        bio: userData.bio
      }));
      
      // Update UI
      const headerUsername = $('.header-username');
      if (headerUsername) headerUsername.textContent = userData.name || userData.login;
      
      const headerAvatar = $('.header-avatar-v2');
      if (headerAvatar) {
        if (userData.avatar_url) {
          headerAvatar.innerHTML = `<img src="${userData.avatar_url}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        } else {
          headerAvatar.innerHTML = '<span class="avatar-emoji">👤</span>';
        }
      }
      
      // Close modal
      closeAuthModal();
      
      // Show success
      showToast(`Welcome, ${userData.name || userData.login}! 🎉`);

      restoreAuthButtons();
      window._trialExpired = false;

      // Update UI state to "Logged In"
      const btnLogin = $('#btn-login');
      if (btnLogin) btnLogin.classList.add('hidden');
      
      const drLoginSpan = $('#dr-login span');
      if (drLoginSpan) drLoginSpan.textContent = 'Log Out';

      // Sync to main config so Profile Modal is updated
      if (typeof config !== 'undefined') {
        config.user = {
          ...config.user,
          username: userData.name || userData.login,
          email: userData.email || '',
          bio: userData.bio || ''
        };
        saveConfig();
        
        // Refresh header immediately
        const hn = $('.header-username');
        if (hn) hn.textContent = config.user.username;
      }
      
    } catch (error) {
      console.error('Error processing GitHub Sign-In:', error);
      showToast('GitHub sign-in failed. Please try again.', 'error');
    }
  };

  // Logout functionality
  window.handleLogout = function() {
    console.log('Logging out...');
    
    // Clear user data and guest trial
    localStorage.removeItem('pomo-user');
    localStorage.removeItem('pomo-guest-start');
    if (typeof window.hideGuestTimer === 'function') window.hideGuestTimer();
    
    // Reset UI state to "Logged Out"
    const btnLogin = $('#btn-login');
    if (btnLogin) btnLogin.classList.remove('hidden');
    
    const drLoginSpan = $('#dr-login span');
    if (drLoginSpan) drLoginSpan.textContent = 'Log In';
    
    const drLogin = $('#dr-login');
    if (drLogin) {
      const icon = drLogin.querySelector('svg');
      if (icon) {
        icon.innerHTML = '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line>';
      }
    }
    
    // Reset username and avatar
    const headerUsername = $('.header-username');
    if (headerUsername) headerUsername.textContent = 'User';
    
    const headerAvatar = $('.header-avatar-v2');
    if (headerAvatar) {
      headerAvatar.innerHTML = '<span class="avatar-emoji">👤</span>';
    }
    
    if (typeof config !== 'undefined') {
      config.user = { ...DEFAULTS.user };
      saveConfig();
    }
    
    showToast('Logged out successfully. See you soon! 👋');
  };

  // Google Sign-In callback function (called when user signs in)
  window.handleGoogleSignIn = function(response) {
    console.log('Google Sign-In successful!', response);
    
    if (window.__clearGoogleTimeout) {
      window.__clearGoogleTimeout();
      window.__clearGoogleTimeout = null;
    }
    
    // Decode the JWT token to get user info
    const userInfo = parseJwt(response.credential);
    console.log('User info:', userInfo);
    
    // Store user info
    localStorage.setItem('pomo-user', JSON.stringify({
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
      sub: userInfo.sub
    }));
    
    // Update UI with user info
    const headerUsername = $('.header-username');
    if (headerUsername) headerUsername.textContent = userInfo.name;
    
    const headerAvatar = $('.header-avatar-v2');
    if (headerAvatar) {
      if (userInfo.picture) {
        headerAvatar.innerHTML = `<img src="${userInfo.picture}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
      } else {
        headerAvatar.innerHTML = '<span class="avatar-emoji">👤</span>';
      }
    }
    
    // Close modal and show success
    closeAuthModal();
    showToast(`Welcome, ${userInfo.name}! 🎉`);

    restoreAuthButtons();
    window._trialExpired = false;

    // Update UI state to "Logged In"
    const btnLogin = $('#btn-login');
    if (btnLogin) btnLogin.classList.add('hidden');
    
    const drLoginSpan = $('#dr-login span');
    if (drLoginSpan) drLoginSpan.textContent = 'Log Out';
  };

  // Helper function to decode JWT token
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing JWT:', e);
      return {};
    }
  }

  const authEmailBtn = $('#email-signup-btn');
  if (authEmailBtn) {
    authEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showEmailSignupForm();
    });
  }

  // Email signup form functionality
  function showEmailSignupForm() {
    const authBody = $('.auth-body');
    const emailForm = $('#email-signup-form');
    
    if (authBody && emailForm) {
      authBody.classList.add('form-active');
      emailForm.classList.remove('hidden');
      
      // Update header
      const authHeader = $('.auth-header h2');
      if (authHeader) authHeader.textContent = 'Create an Account';
      const authSubtext = $('.auth-header p');
      if (authSubtext) authSubtext.textContent = 'Your chats remain confidential even after signup.';
    }
  }

  function hideEmailSignupForm() {
    const authBody = $('.auth-body');
    const emailForm = $('#email-signup-form');
    
    if (authBody && emailForm) {
      authBody.classList.remove('form-active');
      emailForm.classList.add('hidden');
      
      // Restore header
      const authHeader = $('.auth-header h2');
      if (authHeader) authHeader.textContent = 'Welcome to Pomo';
      const authSubtext = $('.auth-header p');
      if (authSubtext) authSubtext.textContent = 'Log in or sign up to continue';
    }
  }

  // Back button
  const backBtn = $('#back-to-main');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hideEmailSignupForm();
    });
  }

  // Avatar selection
  const avatars = ['🐹', '🐰', '🐼', '🐨', '🦊', '🐸', '🐙', '🦄', '🐲', '🦁', '🐯', '🐻'];
  let currentAvatarIndex = 0;
  
  const formAvatar = $('#form-avatar');
  const changeAvatarBtn = $('#change-avatar-btn');
  
  if (formAvatar && changeAvatarBtn) {
    changeAvatarBtn.addEventListener('click', (e) => {
      e.preventDefault();
      currentAvatarIndex = (currentAvatarIndex + 1) % avatars.length;
      const avatarEmoji = formAvatar.querySelector('.avatar-emoji');
      if (avatarEmoji) {
        avatarEmoji.textContent = avatars[currentAvatarIndex];
      }
    });
    
    formAvatar.addEventListener('click', () => {
      changeAvatarBtn.click();
    });
  }

  // Password toggle
  const togglePasswordBtn = $('#toggle-password');
  const passwordInput = $('#signup-password');
  
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
    });
  }

  // Password strength indicator
  if (passwordInput) {
    passwordInput.addEventListener('input', (e) => {
      const password = e.target.value;
      const strengthBar = $('.strength-bar');
      
      if (strengthBar) {
        let strength = 0;
        if (password.length >= 8) strength += 33;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 33;
        if (password.match(/[0-9]/) && password.match(/[^a-zA-Z0-9]/)) strength += 34;
        
        strengthBar.style.width = strength + '%';
      }
    });
  }

  // Form submission
  const emailContinueBtn = $('#email-continue-btn');
  if (emailContinueBtn) {
    emailContinueBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const name = $('#signup-name').value.trim();
      const email = $('#signup-email').value.trim();
      const password = $('#signup-password').value;
      
      // Validation
      if (!name) {
        showToast('Please enter your name', 'error');
        return;
      }
      
      if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
      }
      
      if (password.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
      }
      
      // Show loading
      emailContinueBtn.innerHTML = '<span>Creating account...</span>';
      emailContinueBtn.disabled = true;
      
      // Simulate account creation
      setTimeout(() => {
        // Store user info
        const avatarEmoji = formAvatar.querySelector('.avatar-emoji').textContent;
        const userData = { name, email, avatar: avatarEmoji };
        localStorage.setItem('pomo-user', JSON.stringify(userData));
        
        // Update UI
        const headerUsername = $('.header-username');
        if (headerUsername) headerUsername.textContent = name;
        
        const headerAvatar = $('.header-avatar-v2 .avatar-emoji');
        if (headerAvatar) headerAvatar.textContent = avatarEmoji;
        
        // Update login state
        const btnLogin = $('#btn-login');
        if (btnLogin) btnLogin.classList.add('hidden');
        const drLoginSpan = $('#dr-login span');
        if (drLoginSpan) drLoginSpan.textContent = 'Log Out';
        
        // Sync to config so Profile modal is updated
        if (typeof config !== 'undefined') {
          config.user = {
            ...config.user,
            username: name,
            email: email,
            avatar: avatarEmoji
          };
          saveConfig();
        }
        
        restoreAuthButtons();
        window._trialExpired = false;
        
        // Close modal
        closeAuthModal();
        hideEmailSignupForm();
        
        // Reset form
        $('#signup-name').value = '';
        $('#signup-email').value = '';
        $('#signup-password').value = '';
        emailContinueBtn.innerHTML = '<span>Continue</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        emailContinueBtn.disabled = false;
        
        // Show success
        showToast(`Welcome to Pomo, ${name}! 🎉`);
      }, 1500);
    });
  }

  // Switch to login
  const switchToLogin = $('#switch-to-login');
  if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      hideEmailSignupForm();
      showToast('Login feature coming soon! 🔐', 'info');
    });
  }

  const authSwitch = $('#auth-switch-type');
  if (authSwitch) {
    authSwitch.addEventListener('click', (e) => {
      e.preventDefault();
      const headerTitle = $('.auth-header h2');
      const headerSub = $('.auth-header p');

      if (authSwitch.innerText === 'Sign Up') {
        if (headerTitle) headerTitle.innerText = 'Create Account';
        if (headerSub) headerSub.innerText = 'Join Pomo and sync your progress';
        authSwitch.innerText = 'Log In';
        const fp = $('.auth-signup-text');
        if (fp) fp.childNodes[0].nodeValue = 'Already have an account? ';
      } else {
        if (headerTitle) headerTitle.innerText = 'Welcome to Pomo';
        if (headerSub) headerSub.innerText = 'Log in or sign up to continue';
        authSwitch.innerText = 'Sign Up';
        const fp = $('.auth-signup-text');
        if (fp) fp.childNodes[0].nodeValue = "Don't have an account? ";
      }
    });
  }

  // Premium Upgrade
  const premiumBtn = $('#premium-upgrade-btn');
  if (premiumBtn) {
    premiumBtn.addEventListener('click', () => {
      $('#premium-overlay').classList.remove('hidden');
    });
  }

  const closePremium = $('#close-premium');
  if (closePremium) {
    closePremium.addEventListener('click', () => {
      $('#premium-overlay').classList.add('hidden');
    });
  }

  const premiumOverlay = $('#premium-overlay');
  if (premiumOverlay) {
    premiumOverlay.addEventListener('click', e => {
      if (e.target === premiumOverlay) premiumOverlay.classList.add('hidden');
    });
  }

  // SOS Helpline
  const sosBtn = $('#sos-helpline-btn');
  if (sosBtn) {
    sosBtn.addEventListener('click', () => {
      $('#sos-overlay').classList.remove('hidden');
    });
  }

  const closeSos = $('#close-sos');
  if (closeSos) closeSos.addEventListener('click', () => $('#sos-overlay').classList.add('hidden'));

  const sosOverlay = $('#sos-overlay');
  if (sosOverlay) {
    sosOverlay.addEventListener('click', e => {
      if (e.target === sosOverlay) sosOverlay.classList.add('hidden');
    });
  }

  // Mobile App Sync
  const appleBtn = $('#apple-store-btn');
  const googleBtn = $('#google-play-btn');
  const mobileOverlay = $('#mobile-app-overlay');
  const closeMobile = $('#close-mobile');

  if (appleBtn) {
    appleBtn.addEventListener('click', () => mobileOverlay.classList.remove('hidden'));
  }
  if (googleBtn) {
    googleBtn.addEventListener('click', () => mobileOverlay.classList.remove('hidden'));
  }
  if (closeMobile) {
    closeMobile.addEventListener('click', () => mobileOverlay.classList.add('hidden'));
  }
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) mobileOverlay.classList.add('hidden');
    });
  }


  // Regular sidebar items
  $$('.sidebar-item:not(.sidebar-expandable)').forEach(item => {
    item.addEventListener('click', () => {
      const section = item.dataset.section;

      $$('.sidebar-item').forEach(s => s.classList.remove('active'));
      item.classList.add('active');

      if (section === 'timer') {
        showTimerView();
      } else if (section === 'tasks') {
        showTasksView();
      } else if (section === 'report') {
        openReport();
      } else if (section === 'selftests') {
        showSelfTests();
      } else if (section === 'settings') {
        openSettings();
      } else if (section === 'compatibility') {
        runTest('compatibility', 'Compatibility Test');
      } else if (section === 'therapist') {
        showTherapistView();
      } else if (section === 'community') {
        showCommunityView();
      }
    });
  });

  // Credit Banner Close
  const closeBanner = $('#close-credit-banner');
  const creditBanner = $('#sidebar-credit-banner');
  if (closeBanner && creditBanner) {
    closeBanner.addEventListener('click', () => {
      creditBanner.style.display = 'none';
    });
  }
}

function hideAllSections() {
  const tasksSection = $('#tasks-section');
  if (tasksSection) tasksSection.classList.add('hidden');
  const selfTestsSection = $('#self-tests-section');
  if (selfTestsSection) selfTestsSection.classList.add('hidden');
  const therapistSection = $('#therapist-section');
  if (therapistSection) therapistSection.classList.add('hidden');
  const communitySection = $('#community-section');
  if (communitySection) communitySection.classList.add('hidden');
  const homeView = $('#pomo-home-view');
  if (homeView) homeView.classList.add('hidden');
  const topControls = $('.top-right-controls');
  if (topControls) topControls.classList.add('hidden');

  // Hide wellness sections
  ['ai-journal-section', 'focus-zone-section', 'self-care-section', 'wc-music-section', 'worksheets-section', 'daily-tips-section', 'mood-journal-section', 'reminders-section'].forEach(id => {
    const el = $(`#${id}`);
    if (el) el.classList.add('hidden');
  });
  const mainContent = $('#main-content');
  if (mainContent) mainContent.classList.remove('full-width-mode');
}

function showTimerView() {
  hideAllSections();
  const homeView = $('#pomo-home-view');
  if (homeView) homeView.classList.remove('hidden');
  const topControls = $('.top-right-controls');
  if (topControls) topControls.classList.remove('hidden');

  // Reset internal visibility to a safe default (Show mascot and current state)
  const timerCard = $('.timer-chat-area');
  const mascot = $('.mascot-area');
  if (mascot) mascot.classList.remove('hidden');

  // If there are chat messages, show chat messages and timer, otherwise show welcome
  const chatMessages = $('#chat-messages');
  const hasMessages = chatMessages && chatMessages.children.length > 0;

  if (hasMessages) {
    if (timerCard) timerCard.classList.remove('hidden');
    if (chatMessages) chatMessages.classList.remove('hidden');
    // const welcome = $('#welcome-message');
    // if (welcome) welcome.classList.add('hidden');
  } else {
    const welcome = $('#welcome-message');
    if (welcome) welcome.classList.remove('hidden');
    const suggestions = $('#suggestion-chips-area');
    if (suggestions) suggestions.classList.remove('hidden');
    if (timerCard) timerCard.classList.add('hidden');
  }
}

function showTasksView() {
  hideAllSections();
  const tasksSection = $('#tasks-section');
  if (tasksSection) tasksSection.classList.remove('hidden');
}

function showSelfTests() {
  hideAllSections();

  // Also hide chat messages
  const chatMsgs = $('#chat-messages');
  if (chatMsgs) chatMsgs.classList.add('hidden');

  // Set full-width mode on main content
  const mainContent = $('#main-content');
  if (mainContent) mainContent.classList.add('full-width-mode');

  // Show self tests section
  const selfTestsSection = $('#self-tests-section');
  if (selfTestsSection) {
    selfTestsSection.classList.remove('hidden');
    // Trigger entrance animation
    selfTestsSection.style.animation = 'none';
    selfTestsSection.offsetHeight; // force reflow
    selfTestsSection.style.animation = 'st-fade-in 0.35s ease-out';
  }
}

// --- Show Therapist View ---
function showTherapistView() {
  hideAllSections();

  // Also hide chat messages
  const chatMsgs = $('#chat-messages');
  if (chatMsgs) chatMsgs.classList.add('hidden');

  // Set full-width mode
  const mainContent = $('#main-content');
  if (mainContent) mainContent.classList.add('full-width-mode');

  // Show therapist section
  const therapistSection = $('#therapist-section');
  if (therapistSection) {
    therapistSection.classList.remove('hidden');
    therapistSection.style.animation = 'st-fade-in 0.35s ease-out';
  }
}

// --- Show Community View ---
function showCommunityView() {
  hideAllSections();

  // Hide chat messages
  const chatMsgs = $('#chat-messages');
  if (chatMsgs) chatMsgs.classList.add('hidden');

  // Set full-width mode
  const mainContent = $('#main-content');
  if (mainContent) mainContent.classList.add('full-width-mode');

  // Show community section
  const communitySection = $('#community-section');
  if (communitySection) {
    communitySection.classList.remove('hidden');
    communitySection.style.animation = 'none';
    communitySection.offsetHeight; // force reflow
    communitySection.style.animation = 'st-fade-in 0.35s ease-out';
  }
}

function initCommunity() {
  // Topic filtering
  $$('.com-topic-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const topic = btn.getAttribute('data-topic');

      // Update sidebar UI
      $$('.com-topic-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Ensure we switch to the Vent view if on Polls
      const ventTab = $('.com-tab[data-tab="vent"]');
      if (ventTab && !ventTab.classList.contains('active')) {
        ventTab.click();
      }

      // Filter posts
      const posts = $$('.com-post-card');
      let visibleCount = 0;

      posts.forEach(post => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(10px)';
        post.classList.add('hidden');

        if (topic === 'all' || post.getAttribute('data-topic') === topic) {
          post.classList.remove('hidden');
          visibleCount++;

          setTimeout(() => {
            post.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
          }, 40 * visibleCount);
        }
      });

      // Update title
      const title = $('.com-welcome-row h2');
      if (title) {
        const topicName = btn.textContent.trim().replace('Pomo', '').replace('All', 'Recent').trim();
        title.textContent = topic === 'all' ? 'Recent Pomo Syncs' : `${topicName} Syncs`;
      }
    });
  });

  // Tab switching View Logic
  $$('.com-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.com-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabId = tab.dataset.tab;
      $$('.com-view').forEach(v => v.classList.remove('active'));
      const targetView = $(`#com-view-${tabId}`);
      if (targetView) {
        targetView.classList.add('active');
        // Entrance animation
        targetView.style.animation = 'none';
        targetView.offsetHeight;
        targetView.style.animation = 'st-fade-in 0.4s ease-out';
      }
    });
  });
}

// --- Show Wellness View ---
function showWellnessView(sectionId) {
  hideAllSections();

  // Also hide chat messages
  const chatMsgs = $('#chat-messages');
  if (chatMsgs) chatMsgs.classList.add('hidden');

  // Set full-width mode
  const mainContent = $('#main-content');
  if (mainContent) mainContent.classList.add('full-width-mode');

  // Show the specific wellness section
  const section = $(`#${sectionId}`);
  if (section) {
    section.classList.remove('hidden');
    section.style.animation = 'none';
    section.offsetHeight;
    section.style.animation = 'st-fade-in 0.35s ease-out';
  }
}

// --- Initialize Wellness Corner ---
function initWellnessCorner() {
  // ── 1. AI Journal Logic ──
  const journalPrompts = [
    "What made you smile today, no matter how small?",
    "What is one thing you're looking forward to tomorrow?",
    "Describe a challenge you faced today and how you handled it.",
    "What are three things you're grateful for right now?",
    "If you could give your morning self one piece of advice, what would it be?",
    "What is a personal strength you used today?",
    "How did you practice self-care today?"
  ];

  const promptEl = $('#aj-prompt');
  const newPromptBtn = $('#aj-new-prompt');
  if (newPromptBtn && promptEl) {
    newPromptBtn.addEventListener('click', () => {
      const current = promptEl.textContent;
      let next;
      do { next = journalPrompts[Math.floor(Math.random() * journalPrompts.length)]; } while (next === current);
      promptEl.textContent = next;
    });
  }

  let selectedJournalMood = null;
  $$('.aj-mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.aj-mood-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedJournalMood = btn.dataset.mood;
    });
  });

  function loadJournalEntries() {
    const entries = JSON.parse(localStorage.getItem('pomo_journal') || '[]');
    const list = $('#aj-entries');
    if (!list) return;
    if (entries.length === 0) {
      list.innerHTML = '<div class="aj-empty">Start your journaling journey above! ✍️</div>';
      return;
    }
    const moodEmojis = { amazing: '🌟', happy: '😊', calm: '😌', neutral: '😐', anxious: '😰', sad: '😢' };
    list.innerHTML = entries.slice(0, 30).map(e => `
      <div class="aj-entry-item">
        <span class="aj-entry-mood">${moodEmojis[e.mood] || '📝'}</span>
        <p class="aj-entry-text">${e.text}</p>
        <p class="aj-entry-date">${e.date}</p>
      </div>
    `).join('');
  }
  loadJournalEntries();

  const saveJournalBtn = $('#aj-save-btn');
  if (saveJournalBtn) {
    saveJournalBtn.addEventListener('click', () => {
      const text = $('#aj-textarea')?.value.trim();
      if (!text) {
        saveJournalBtn.textContent = '❌ Write something first!';
        setTimeout(() => saveJournalBtn.textContent = '💾 Save Entry', 2000);
        return;
      }
      if (!selectedJournalMood) {
        saveJournalBtn.textContent = '❌ Select a mood!';
        setTimeout(() => saveJournalBtn.textContent = '💾 Save Entry', 2000);
        return;
      }
      const entry = {
        text,
        mood: selectedJournalMood,
        date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      };
      const entries = JSON.parse(localStorage.getItem('pomo_journal') || '[]');
      entries.unshift(entry);
      localStorage.setItem('pomo_journal', JSON.stringify(entries));

      // Reset
      $('#aj-textarea').value = '';
      $$('.aj-mood-btn').forEach(b => b.classList.remove('active'));
      selectedJournalMood = null;
      saveJournalBtn.textContent = '✅ Saved!';
      setTimeout(() => saveJournalBtn.textContent = '💾 Save Entry', 2000);
      loadJournalEntries();
    });
  }

  // ── 2. Focus Zone Logic (Dual Mode) ──
  const timerVal = $('#fz-timer-val');
  const minusBtn = $('#fz-minus-btn');
  const plusBtn = $('#fz-plus-btn');
  const startTimerBtn = $('#fz-timer-start');
  let focusInterval;
  let isTimerRunning = false;
  let focusTimeLeft = 30 * 60;

  if (minusBtn && plusBtn && timerVal) {
    minusBtn.addEventListener('click', () => {
      if (isTimerRunning) return;
      let val = parseInt(timerVal.textContent);
      if (val > 5) { val -= 5; timerVal.textContent = val; focusTimeLeft = val * 60; }
    });
    plusBtn.addEventListener('click', () => {
      if (isTimerRunning) return;
      let val = parseInt(timerVal.textContent);
      if (val < 120) { val += 5; timerVal.textContent = val; focusTimeLeft = val * 60; }
    });
  }

  if (startTimerBtn) {
    startTimerBtn.addEventListener('click', () => {
      if (!isTimerRunning) {
        isTimerRunning = true;
        startTimerBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause';
        startTimerBtn.style.background = '#fbbf24';
        focusInterval = setInterval(() => {
          focusTimeLeft--;
          if (focusTimeLeft <= 0) {
            clearInterval(focusInterval); isTimerRunning = false; timerVal.textContent = '30'; focusTimeLeft = 30 * 60;
            startTimerBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Start';
            startTimerBtn.style.background = '#e91e63';
            alert('Session complete! 🌟');
          } else { timerVal.textContent = Math.floor(focusTimeLeft / 60); }
        }, 1000);
      } else {
        clearInterval(focusInterval); isTimerRunning = false;
        startTimerBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Start';
        startTimerBtn.style.background = '#e91e63';
      }
    });
  }

  // Calendar Logic
  const calGrid = $('#fz-calendar-grid');
  const monthDisplay = $('#fz-current-month');
  const remHeader = $('.fz-rem-header h4');
  if (calGrid && monthDisplay) {
    const now = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthDisplay.textContent = `${months[now.getMonth()]} ${now.getFullYear()}`;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    calGrid.innerHTML = '';
    for (let i = 0; i < offset; i++) { calGrid.appendChild(Object.assign(document.createElement('div'), { className: 'fz-cal-day other-month' })); }
    for (let i = 1; i <= daysInMonth; i++) {
      const d = document.createElement('div');
      d.className = 'fz-cal-day' + (i === now.getDate() ? ' today' : '');
      d.textContent = i;
      d.addEventListener('click', () => {
        $$('.fz-cal-day').forEach(el => el.classList.remove('today'));
        d.classList.add('today');
        if (remHeader) remHeader.textContent = `Reminders for ${i} ${months[now.getMonth()]}`;
      });
      calGrid.appendChild(d);
    }
  }

  // Restored Ambient Sounds Logic
  $$('.fz-sound-item').forEach(item => {
    const range = item.querySelector('.fz-volume');
    if (range) {
      range.addEventListener('input', () => {
        if (range.value > 0) item.classList.add('active');
        else item.classList.remove('active');
        console.log(`Playing ${item.dataset.sound} at ${range.value}%`);
      });
    }
  });

  // Restored Breathing Logic
  let breathInterval;
  const brBtn = $('#fz-breath-start');
  const brCircle = $('#fz-breath-circle');
  const brText = $('#fz-breath-text');
  const brSelect = $('#fz-breath-select');

  if (brBtn) {
    brBtn.addEventListener('click', () => {
      if (brBtn.textContent.includes('Start')) {
        brBtn.textContent = '⏹ Stop';
        brCircle.classList.add('active');
        let phase = 0;
        const modes = { box: [4, 4, 4, 4], '478': [4, 7, 8], deep: [5, 5] };
        const cycle = modes[brSelect.value] || modes.box;
        const labels = brSelect.value === 'deep' ? ['Breathe In', 'Breathe Out'] : ['Inhale', 'Hold', 'Exhale', 'Hold'];

        const run = () => {
          const p = phase % cycle.length;
          brText.textContent = labels[p] || 'Hold';
          if (labels[p] === 'Inhale' || labels[p] === 'Breathe In') brCircle.style.transform = 'scale(1.3)';
          else if (labels[p] === 'Exhale' || labels[p] === 'Breathe Out') brCircle.style.transform = 'scale(1)';
          breathInterval = setTimeout(() => { phase++; run(); }, cycle[p] * 1000);
        };
        run();
      } else {
        clearTimeout(breathInterval);
        brBtn.textContent = '▶ Start';
        brCircle.classList.remove('active');
        brCircle.style.transform = 'scale(1)';
        brText.textContent = 'Start';
      }
    });
  }

  // Reminders Add
  const addRem = $('.fz-rem-plus');
  if (addRem) {
    addRem.addEventListener('click', () => {
      const task = prompt("Add a task for this day:");
      if (task) {
        const list = $('#fz-rem-list-container');
        if (list.querySelector('p')) list.innerHTML = '';
        const el = document.createElement('div');
        el.className = 'fz-rem-item';
        el.style = 'padding:12px; background:rgba(255,255,255,0.05); border-radius:12px; margin-bottom:8px; display:flex; justify-content:space-between; border:1px solid rgba(255,255,255,0.05);';
        el.innerHTML = `<span>${task}</span><span style="opacity:0.6; font-size:0.8rem">New</span>`;
        list.appendChild(el);
      }
    });
  }

  // ── 3. Self Care Logic ──
  const affirmations = [
    "I am worthy of love, peace, and happiness. I choose to nurture myself today.",
    "My worth is not defined by my productivity.",
    "I trust my inner wisdom and follow my own path.",
    "I am growing and learning at my own pace.",
    "I deserve to take up space and express my needs.",
    "Every day is a fresh start and a new opportunity.",
    "I am resilient, strong, and capable of overcoming anything."
  ];

  const affText = $('#sc-aff-text');
  const affBtn = $('#sc-new-aff');
  if (affBtn && affText) {
    affBtn.addEventListener('click', () => {
      const current = affText.textContent;
      let next;
      do { next = affirmations[Math.floor(Math.random() * affirmations.length)]; } while (next === current);
      affText.textContent = next;
    });
  }

  // Checklist logic
  const checkboxes = $$('.sc-check-item input');
  const progressFill = $('#sc-progress-fill');
  const progressText = $('#sc-progress-text');

  function updateScProgress() {
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(c => c.checked).length;
    const percent = total > 0 ? (checked / total) * 100 : 0;
    if (progressFill) progressFill.style.width = percent + '%';
    if (progressText) progressText.textContent = `${checked}/${total} completed`;
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateScProgress);
  });
  updateScProgress();

  // ── 4. Music Logic ──
  $$('.mu-cat').forEach(cat => {
    cat.addEventListener('click', () => {
      $$('.mu-cat').forEach(c => c.classList.remove('active'));
      cat.classList.add('active');
      const selCat = cat.dataset.cat;
      $$('.mu-card').forEach(card => {
        if (selCat === 'all' || card.dataset.cat === selCat) card.style.display = '';
        else card.style.display = 'none';
      });
    });
  });

  $$('.mu-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.mu-card');
      const trackName = card.dataset.track || card.querySelector('h4').textContent;
      const category = card.dataset.cat;
      const isPlaying = btn.classList.contains('playing');
      
      // Stop all other tracks
      $$('.mu-play-btn').forEach(b => {
        b.classList.remove('playing');
        b.textContent = '▶ Play';
      });
      
      if (!isPlaying) {
        let foundTrack = null;
        let foundPlaylist = null;
        
        // Try matching by category + exact name first
        if (musicLibrary[category]) {
          foundTrack = musicLibrary[category].find(t => t.name === trackName);
          if (foundTrack) foundPlaylist = category;
        }
        
        // If not found, search all playlists by exact name
        if (!foundTrack) {
          for (const [playlistName, tracks] of Object.entries(musicLibrary)) {
            foundTrack = tracks.find(t => t.name === trackName);
            if (foundTrack) { foundPlaylist = playlistName; break; }
          }
        }
        
        // Fallback to first track in card's category
        if (!foundTrack && musicLibrary[category]) {
          foundPlaylist = category;
          foundTrack = musicLibrary[category][0];
        }
        
        // Ultimate fallback
        if (!foundTrack) {
          foundPlaylist = 'focus';
          foundTrack = musicLibrary.focus[0];
        }
        
        if (foundTrack) {
          state.bgMusic.currentPlaylist = foundPlaylist;
          const trackIndex = musicLibrary[foundPlaylist].indexOf(foundTrack);
          state.bgMusic.enabled = true;
          playMusic(trackIndex);
          btn.classList.add('playing');
          btn.textContent = '⏸ Pause';
        }
      } else {
        pauseMusic();
        state.bgMusic.enabled = false;
      }
    });
  });

  // ── 5. Worksheets Logic ──
  $$('.ws-start-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wsId = btn.dataset.ws;
      const wsName = btn.closest('.ws-card')?.querySelector('h4')?.textContent || 'Worksheet';
      runWorksheet(wsId, wsName);
    });
  });

  // ── 6. Daily Tips Logic ──
  $$('.wc-tip-cat').forEach(cat => {
    cat.addEventListener('click', () => {
      $$('.wc-tip-cat').forEach(c => c.classList.remove('active'));
      cat.classList.add('active');
      const selCat = cat.dataset.cat;
      $$('.wc-tip-card').forEach(card => {
        if (selCat === 'all' || card.dataset.cat === selCat) card.style.display = '';
        else card.style.display = 'none';
      });
    });
  });



  // ── 8. Reminders Logic ──
  function loadReminders() {
    const reminders = JSON.parse(localStorage.getItem('pomo_reminders') || '[]');
    renderReminders(reminders);
  }

  function renderReminders(reminders) {
    const list = $('#rm-list');
    const badge = $('#rm-count-badge');
    if (!list) return;

    if (badge) badge.textContent = `${reminders.length} item${reminders.length !== 1 ? 's' : ''}`;

    if (reminders.length === 0) {
      list.innerHTML = `
        <div class="rm-empty-state">
          <div class="rm-empty-iconbox">🔔</div>
          <p>Your schedule is clear. Ready to add some wellness goals?</p>
        </div>`;
      return;
    }

    list.innerHTML = reminders.map((r, i) => `
      <div class="rm-item-v2" style="animation-delay: ${i * 0.05}s">
        <div class="rm-item-left">
          <div class="rm-item-icon-box">${r.icon || '🔔'}</div>
          <div class="rm-item-details">
            <h5>${r.title}</h5>
            <div class="rm-item-meta-v2">
              <span class="rm-time-tag">⏰ ${r.time || 'Any time'}</span>
              <span>•</span>
              <span>🔄 ${r.repeat || 'Once'}</span>
            </div>
          </div>
        </div>
        <button class="rm-delete-btn" data-index="${i}" title="Remove Reminder">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `).join('');

    list.querySelectorAll('.rm-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        reminders.splice(idx, 1);
        localStorage.setItem('pomo_reminders', JSON.stringify(reminders));
        renderReminders(reminders);
      });
    });
  }

  const addRemBtn = $('#rm-add-btn');
  if (addRemBtn) {
    addRemBtn.addEventListener('click', () => {
      const input = $('#rm-input');
      const time = $('#rm-time');
      const repeat = $('#rm-repeat');
      const title = input?.value.trim();
      if (!title) return;

      const iconMap = {
        water: '💧', drink: '💧', meditat: '🧘', walk: '🚶', work: '💻',
        yoga: '🤸', exercise: '🏋️', gym: '🏋️', fruit: '🍎', food: '🥗',
        sleep: '😴', bed: '😴', read: '📚', study: '📖', music: '🎵',
        breath: '🫁', mood: '😊', journal: '📓', therapy: '🧠'
      };
      let icon = '🔔';
      const lowTitle = title.toLowerCase();
      for (const [key, emoji] of Object.entries(iconMap)) {
        if (lowTitle.includes(key)) { icon = emoji; break; }
      }

      const reminders = JSON.parse(localStorage.getItem('pomo_reminders') || []);
      reminders.push({ title, time: time?.value || '', repeat: repeat?.value || 'Once', icon });
      localStorage.setItem('pomo_reminders', JSON.stringify(reminders));
      renderReminders(reminders);
      input.value = '';
    });
  }
  loadReminders();
}

// --- Therapist Section Logic ---
function initTherapist() {
  // Tab switching
  $$('.th-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      $$('.th-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      $$('.th-tab-content').forEach(c => c.classList.remove('active'));
      const content = $(`#th-content-${tabId}`);
      if (content) content.classList.add('active');
    });
  });

  // ── Filter tags (Therapists tab - scoped) ──
  $$('#th-content-therapists .th-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      $$('#th-content-therapists .th-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      applyAllFilters();
    });
  });

  // ── Expert filter tags (Experts tab - scoped) ──
  $$('.th-expert-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      $$('.th-expert-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');

      const filter = tag.textContent.trim().toLowerCase();
      $$('#th-expert-grid .th-card').forEach(card => {
        if (filter === 'all') {
          card.style.display = '';
          return;
        }
        const specs = card.querySelectorAll('.th-spec-tag');
        const matches = Array.from(specs).some(s => s.textContent.toLowerCase().includes(filter));
        card.style.display = matches ? '' : 'none';
      });
    });
  });

  // ── Search ──
  const thSearch = $('#th-search-input');
  if (thSearch) {
    thSearch.addEventListener('input', () => {
      applyAllFilters();
    });
  }

  // ── Filter Sidebar Toggle ──
  const filterToggle = $('#th-filter-toggle');
  const filterSidebar = $('#th-filter-sidebar');
  const sidebarClose = $('#th-sidebar-close');

  if (filterToggle && filterSidebar) {
    filterToggle.addEventListener('click', () => {
      const isHidden = filterSidebar.classList.contains('hidden');
      if (isHidden) {
        filterSidebar.classList.remove('hidden');
        filterToggle.classList.add('active');
        // re-trigger animation
        filterSidebar.style.animation = 'none';
        filterSidebar.offsetHeight;
        filterSidebar.style.animation = 'th-slide-in 0.4s ease-out';
      } else {
        filterSidebar.classList.add('hidden');
        filterToggle.classList.remove('active');
      }
    });
  }

  if (sidebarClose && filterSidebar) {
    sidebarClose.addEventListener('click', () => {
      filterSidebar.classList.add('hidden');
      if (filterToggle) filterToggle.classList.remove('active');
    });
  }

  // ── Price Range Filters ──
  $$('.th-price-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.th-price-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applyAllFilters();
    });
  });

  // ── Expertise Filters ──
  $$('.th-expertise-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.th-expertise-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applyAllFilters();
    });
  });

  // ── I need help with... Filters ──
  $$('.th-help-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.th-help-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applyAllFilters();
    });
  });

  // ── Show More / Show Less toggle ──
  const showMoreBtn = $('#th-show-more');
  if (showMoreBtn) {
    let expanded = false;
    showMoreBtn.addEventListener('click', () => {
      expanded = !expanded;
      $$('.th-help-extra').forEach(chip => {
        chip.classList.toggle('hidden', !expanded);
      });
      showMoreBtn.textContent = expanded ? 'Show Less' : 'Show More';
    });
  }

  // ── Language Filters ──
  $$('.th-lang-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.th-lang-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applyAllFilters();
    });
  });

  // ── Sex Filters ──
  $$('.th-sex-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.th-sex-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applyAllFilters();
    });
  });

  // ── Reset All ──
  const resetBtn = $('#th-reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Reset price
      $$('.th-price-chip').forEach(c => c.classList.remove('active'));
      const allPriceChip = document.querySelector('.th-price-chip');
      if (allPriceChip) allPriceChip.classList.add('active');

      // Reset expertise
      $$('.th-expertise-chip').forEach(c => c.classList.remove('active'));
      const allExpertise = document.querySelector('.th-expertise-chip');
      if (allExpertise) allExpertise.classList.add('active');

      // Reset help topics
      $$('.th-help-chip').forEach(c => c.classList.remove('active'));
      const allHelp = document.querySelector('.th-help-chip');
      if (allHelp) allHelp.classList.add('active');

      // Reset languages
      $$('.th-lang-chip').forEach(c => c.classList.remove('active'));
      const allLang = document.querySelector('.th-lang-chip');
      if (allLang) allLang.classList.add('active');

      // Reset sex
      $$('.th-sex-chip').forEach(c => c.classList.remove('active'));
      const allSex = document.querySelector('.th-sex-chip');
      if (allSex) allSex.classList.add('active');

      // Reset search
      const searchInput = $('#th-search-input');
      if (searchInput) searchInput.value = '';

      // Reset specialty tags
      $$('#th-content-therapists .th-tag').forEach(t => t.classList.remove('active'));
      const allTag = document.querySelector('#th-content-therapists .th-tag');
      if (allTag) allTag.classList.add('active');

      applyAllFilters();
    });
  }

  // ── Filter count updater ──
  function updateFilterCount() {
    let count = 0;
    const priceActive = document.querySelector('.th-price-chip.active');
    if (priceActive && priceActive.textContent.trim().toLowerCase() !== 'all') count++;
    const expertiseActive = document.querySelector('.th-expertise-chip.active');
    if (expertiseActive && expertiseActive.textContent.trim().toLowerCase() !== 'all expertise') count++;
    const helpActive = document.querySelector('.th-help-chip.active');
    if (helpActive && helpActive.textContent.trim().toLowerCase() !== 'all topics') count++;
    const langActive = document.querySelector('.th-lang-chip.active');
    if (langActive && langActive.textContent.trim().toLowerCase() !== 'all languages') count++;
    const sexActive = document.querySelector('.th-sex-chip.active');
    if (sexActive && sexActive.textContent.trim().toLowerCase() !== 'all') count++;
    const searchVal = ($('#th-search-input')?.value || '').trim();
    if (searchVal) count++;

    const countEl = $('#th-filter-count');
    if (countEl) {
      countEl.textContent = `${count} filter${count !== 1 ? 's' : ''} Applied`;
    }
  }

  // ── Combined filter function ──
  function applyAllFilters() {
    // 1. Search query
    const searchVal = ($('#th-search-input')?.value || '').toLowerCase().trim();

    // 2. Specialty tag filter (therapists tab only)
    const therapistsActive = $('#th-content-therapists')?.classList.contains('active');
    let specFilter = 'all';
    if (therapistsActive) {
      const activeTag = document.querySelector('#th-content-therapists .th-tag.active');
      specFilter = activeTag ? activeTag.textContent.trim().toLowerCase() : 'all';
    }

    // 3. Price range
    const activePriceChip = document.querySelector('.th-price-chip.active');
    const minPrice = parseInt(activePriceChip?.dataset.min || '0');
    const maxPrice = parseInt(activePriceChip?.dataset.max || '99999');

    // 4. Expertise
    const activeExpertise = document.querySelector('.th-expertise-chip.active');
    const expertiseFilter = activeExpertise ? activeExpertise.textContent.trim().toLowerCase() : 'all expertise';

    // 5. Help topic
    const activeHelpChip = document.querySelector('.th-help-chip.active');
    const helpFilter = activeHelpChip ? activeHelpChip.textContent.trim().toLowerCase() : 'all topics';

    // 6. Language
    const activeLangChip = document.querySelector('.th-lang-chip.active');
    const langFilter = activeLangChip ? activeLangChip.textContent.trim().toLowerCase() : 'all languages';

    // 7. Sex
    const activeSexChip = document.querySelector('.th-sex-chip.active');
    const sexFilter = activeSexChip ? activeSexChip.textContent.trim().toLowerCase() : 'all';

    // Helper: check if a single card passes all filters
    function cardPassesFilters(card) {
      // Search
      if (searchVal && !card.textContent.toLowerCase().includes(searchVal)) return false;
      // Specialty tag (therapists only)
      if (specFilter !== 'all') {
        const specs = card.querySelectorAll('.th-spec-tag');
        if (!Array.from(specs).some(s => s.textContent.toLowerCase().includes(specFilter))) return false;
      }
      // Price
      const cardPrice = parseInt(card.dataset.price || '0');
      if (cardPrice < minPrice || cardPrice > maxPrice) return false;
      // Expertise
      if (expertiseFilter !== 'all expertise') {
        const role = card.querySelector('.th-role')?.textContent.toLowerCase() || '';
        if (!role.includes(expertiseFilter)) return false;
      }
      // Help topic
      if (helpFilter !== 'all topics') {
        const topics = (card.dataset.topics || '').toLowerCase();
        if (!topics.includes(helpFilter)) return false;
      }
      // Language
      if (langFilter !== 'all languages') {
        const cardLangs = (card.dataset.lang || '').toLowerCase();
        if (!cardLangs.includes(langFilter.replace('(basics)', '').trim())) return false;
      }
      // Sex
      if (sexFilter !== 'all') {
        const cardSex = (card.dataset.sex || '').toLowerCase();
        if (cardSex !== sexFilter) return false;
      }
      return true;
    }

    // Apply filters to both grids
    const therapistCards = $$('#th-grid .th-card');
    const expertCards = $$('#th-expert-grid .th-card');

    let therapistVisible = 0;
    let expertVisible = 0;

    therapistCards.forEach(card => {
      const show = cardPassesFilters(card);
      card.style.display = show ? '' : 'none';
      if (show) therapistVisible++;
    });

    expertCards.forEach(card => {
      const show = cardPassesFilters(card);
      card.style.display = show ? '' : 'none';
      if (show) expertVisible++;
    });

    // Auto-switch tab if current tab has no results but the other does
    if (helpFilter !== 'all topics' || searchVal || expertiseFilter !== 'all expertise' || langFilter !== 'all languages' || sexFilter !== 'all') {
      const isTherapistsTab = therapistsActive;
      const isExpertsTab = $('#th-content-experts')?.classList.contains('active');

      if (isTherapistsTab && therapistVisible === 0 && expertVisible > 0) {
        switchToTab('experts');
      } else if (isExpertsTab && expertVisible === 0 && therapistVisible > 0) {
        switchToTab('therapists');
      }
    }

    // Update filter count
    updateFilterCount();
  }

  // Helper to switch tabs programmatically
  function switchToTab(tabId) {
    $$('.th-tab').forEach(t => t.classList.remove('active'));
    const targetTab = document.querySelector(`.th-tab[data-tab="${tabId}"]`);
    if (targetTab) targetTab.classList.add('active');
    $$('.th-tab-content').forEach(c => c.classList.remove('active'));
    const targetContent = $(`#th-content-${tabId}`);
    if (targetContent) targetContent.classList.add('active');
  }

  // ── Modal Handling ──
  const modalOverlay = $('#th-modal-overlay');
  const modalEl = $('#th-modal');
  const modalClose = $('#th-modal-close');

  function openTherapistModal(card, mode) {
    const name = card.querySelector('h4')?.textContent || 'Therapist';
    const role = card.querySelector('.th-role')?.textContent || '';
    const exp = card.querySelector('.th-exp')?.textContent || '';
    const lang = card.querySelector('.th-lang')?.textContent || '';
    const ratingVal = card.querySelector('.th-rating-value')?.textContent || '';
    const ratingCount = card.querySelector('.th-rating-count')?.textContent || '';
    const price = card.querySelector('.th-card-price')?.textContent || '';
    const specs = Array.from(card.querySelectorAll('.th-spec-tag')).map(s => s.textContent);

    // Get avatar color
    const avatar = card.querySelector('.th-avatar');
    let avatarClass = 'avatar-pink';
    if (avatar) {
      const classes = avatar.className;
      if (classes.includes('purple')) avatarClass = 'avatar-purple';
      else if (classes.includes('teal')) avatarClass = 'avatar-teal';
      else if (classes.includes('coral')) avatarClass = 'avatar-coral';
      else if (classes.includes('amber')) avatarClass = 'avatar-amber';
      else if (classes.includes('ocean')) avatarClass = 'avatar-ocean';
    }

    const initials = card.querySelector('.th-avatar-initials')?.textContent || name.split(' ').map(w => w[0]).join('');

    // Populate modal
    const mAvatar = $('#th-modal-avatar');
    mAvatar.className = 'th-modal-avatar ' + avatarClass;
    $('#th-modal-initials').textContent = initials;
    $('#th-modal-name').textContent = name;
    $('#th-modal-role').textContent = role;
    $('#th-modal-exp').textContent = exp;
    $('#th-modal-lang').textContent = lang;

    // Rating
    $('#th-modal-rating').innerHTML = ratingVal
      ? `<span class="th-star">⭐</span> <strong>${ratingVal}</strong> ${ratingCount}`
      : '';

    // Specialties
    const specsEl = $('#th-modal-specialties');
    specsEl.innerHTML = specs.map(s => `<span class="th-spec-tag">${s}</span>`).join('');

    // Body content
    const bodyEl = $('#th-modal-body');
    if (mode === 'profile') {
      bodyEl.innerHTML = `
        <p class="th-modal-section-title">About</p>
        <p>${name} is a certified <strong>${role}</strong> with ${exp.toLowerCase() || 'extensive experience'}. They specialize in ${specs.length ? specs.join(', ') : 'holistic wellness'} and provide personalized sessions in a safe, supportive environment.</p>
        <p class="th-modal-section-title" style="margin-top:16px">Approach</p>
        <p>Sessions are tailored to individual needs using evidence-based techniques. ${name.split(' ')[0]} creates a non-judgmental space where you can explore challenges and develop effective coping strategies.</p>
      `;
    } else {
      bodyEl.innerHTML = `
        <p class="th-modal-section-title">Booking Details</p>
        <p>💰 <strong>${price || 'Contact for pricing'}</strong></p>
        <p>⏱️ 50-minute sessions, available online & in-person</p>
        <p>📅 Flexible scheduling — morning, afternoon & evening slots</p>
        <p>🔒 100% confidential & secure sessions</p>
      `;
    }

    // Actions
    const actionsEl = $('#th-modal-actions');
    if (mode === 'profile') {
      actionsEl.innerHTML = `
        <button class="th-modal-btn-book" onclick="document.getElementById('th-modal-overlay').classList.add('hidden')">📅 Book Session</button>
        <button class="th-modal-btn-chat">💬 Chat Now</button>
      `;
    } else {
      actionsEl.innerHTML = `
        <button class="th-modal-btn-book">✅ Confirm Booking</button>
        <button class="th-modal-btn-chat" onclick="document.getElementById('th-modal-overlay').classList.add('hidden')">Cancel</button>
      `;
    }

    // Show
    modalOverlay.classList.remove('hidden');
    // Re-trigger animation
    modalEl.style.animation = 'none';
    modalEl.offsetHeight;
    modalEl.style.animation = 'th-modal-scale-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
  }

  function closeModal() {
    modalOverlay.classList.add('hidden');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay?.classList.contains('hidden')) closeModal();
  });

  // Book Now buttons
  $$('.th-btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.th-card');
      if (card) openTherapistModal(card, 'book');
    });
  });

  // View Profile buttons
  $$('.th-btn-outline').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.th-card');
      if (card) openTherapistModal(card, 'profile');
    });
  });

  // Browse Therapists button (from bookings empty state)
  $$('.th-go-to-therapists').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.th-tab').forEach(t => t.classList.remove('active'));
      const therapistsTab = document.querySelector('.th-tab[data-tab="therapists"]');
      if (therapistsTab) therapistsTab.classList.add('active');
      $$('.th-tab-content').forEach(c => c.classList.remove('active'));
      const therapistsContent = $('#th-content-therapists');
      if (therapistsContent) therapistsContent.classList.add('active');
    });
  });
}

// --- Self Tests Logic ---
function initSelfTests() {
  // Tab switching
  $$('.st-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      // Update active tab
      $$('.st-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Show corresponding content
      $$('.st-tab-content').forEach(c => c.classList.remove('active'));
      const content = $(`#st-content-${tabId}`);
      if (content) content.classList.add('active');
    });
  });

  // Carousel navigation — generic for all carousels
  // Self Tests carousel
  const carousel = $('#st-carousel');
  const prevBtn = $('#st-prev');
  const nextBtn = $('#st-next');

  if (carousel && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -340, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: 340, behavior: 'smooth' });
    });
  }

  // Clinical Tests carousels (ct-prev / ct-next with data-carousel)
  $$('.ct-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.carousel;
      const track = $(`#${targetId}`);
      if (track) track.scrollBy({ left: -340, behavior: 'smooth' });
    });
  });

  $$('.ct-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.carousel;
      const track = $(`#${targetId}`);
      if (track) track.scrollBy({ left: 340, behavior: 'smooth' });
    });
  });

  // Start Test / Take Test buttons
  $$('.st-start-btn, .st-grid-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.st-card, .st-grid-card');
      const testId = card?.dataset.test || 'motivation';
      const testName = card?.querySelector('h4, h5')?.textContent || 'Test';
      runTest(testId, testName);
    });
  });

  // Test Runner Close logic
  const closeBtn = $('.test-close-btn');
  const overlay = $('#test-runner-overlay');
  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.add('hidden');
    });
  }

  // Browse Tests button (from empty records state)
  const goToTests = $('#st-go-to-tests');
  if (goToTests) {
    goToTests.addEventListener('click', () => {
      // Switch to Self Tests tab
      $$('.st-tab').forEach(t => t.classList.remove('active'));
      const selfTab = document.querySelector('.st-tab[data-tab="self"]');
      if (selfTab) selfTab.classList.add('active');
      $$('.st-tab-content').forEach(c => c.classList.remove('active'));
      const selfContent = $('#st-content-self');
      if (selfContent) selfContent.classList.add('active');
    });
  }

  // Search filtering
  const searchInput = $('#st-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      // Filter carousel cards
      $$('.st-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = !query || text.includes(query) ? '' : 'none';
      });
      // Filter grid cards
      $$('.st-grid-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = !query || text.includes(query) ? '' : 'none';
      });
    });
  }
}
const testsData = {
  motivation: {
    questions: [
      { q: "How do you feel when starting a new challenging project?", options: ["Unstoppable and eager to jump in", "Methodical, I need a plan first", "A bit overwhelmed, but curious", "I look for the quickest way to finish"] },
      { q: "What rewards you the most after finishing a task?", options: ["Public recognition and praise", "The internal feeling of mastery", "Checking it off my list", "Helping others achieve their goals"] },
      { q: "When you hit a dead end, your first reaction is:", options: ["To find a creative workaround", "To analyze what went wrong deeply", "To take a short break and come back", "To ask a mentor or peer for guidance"] },
      { q: "Your ideal level of daily pressure is:", options: ["High, I thrive under tight deadlines", "Medium, I like a steady rhythm", "Low, I prefer peace of mind", "Dynamic, it keeps things interesting"] },
      { q: "You work best when you are:", options: ["Leading the direction of the work", "Mastering a specific, complex skill", "Part of a supportive community", "Creating something entirely new"] }
    ],
    results: [
      { type: "The Trailblazer", icon: "🔥", desc: "You are driven by innovation and high-energy starts. You thrive on challenge and independence." },
      { type: "The Craftsman", icon: "🛠️", desc: "You are fueled by mastery and deep focus. You value quality over speed and love the process." },
      { type: "The Flow Seeker", icon: "🌊", desc: "You value balance and steady progress. You work best when your environment is harmonious." },
      { type: "The Visionary", icon: "✨", desc: "You are motivated by the big picture and the meaning behind your daily tasks." }
    ]
  },
  burnout: {
    questions: [
      { q: "How often do you feel emotionally exhausted by your work?", options: ["Rarely or never", "Once in a while", "Quite frequently", "Almost every single day"] },
      { q: "Do you find it harder to start your tasks than you used to?", options: ["No, I'm still motivated", "Only on Mondays", "Yes, I procrastinate a lot now", "It's a daily struggle to even log in"] },
      { q: "How is your sleep quality lately?", options: ["Excellent", "Average but restorative", "Tossing and turning", "Insomnia or constant fatigue"] },
      { q: "Do you feel like your work makes a difference?", options: ["Absolutely", "Most of the time", "I'm starting to doubt it", "It feels completely meaningless"] },
      { q: "Are you more irritable with colleagues or friends?", options: ["Not at all", "Slightly more than usual", "Yes, I have a short fuse now", "I prefer to avoid everyone"] }
    ],
    results: [
      { type: "Healthy Balance", icon: "🌱", desc: "You are managing your energy well. Keep prioritizing your boundaries and self-care." },
      { type: "Warning Signs", icon: "⚠️", desc: "You're showing early signs of strain. It might be time for a short break or a lighter week." },
      { type: "High Risk", icon: "🧨", desc: "You are close to empty. Please reach out for support or plan a significant period of rest." },
      { type: "Severe Burnout", icon: "🆘", desc: "Your health is a priority. We strongly suggest consulting a professional and stepping away." }
    ]
  },
  bigfive: {
    questions: [
      { q: "I see myself as someone who is talkative and outgoing.", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
      { q: "I see myself as someone who is original, comes up with new ideas.", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
      { q: "I see myself as someone who is helpful and unselfish with others.", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
      { q: "I see myself as someone who is reliable and does a thorough job.", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
      { q: "I see myself as someone who is relaxed, handles stress well.", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] }
    ],
    results: [
      { type: "The Explorer", icon: "🧭", desc: "High in openness and curiosity. You love new experiences and fresh ideas." },
      { type: "The Anchor", icon: "⚓", desc: "High in conscientiousness. You are the reliable force that gets things done." },
      { type: "The Harmonizer", icon: "🎻", desc: "High in agreeableness. You are great at bringing people together." },
      { type: "The Dynamo", icon: "⚡", desc: "High in extraversion. You gain energy from interacting with the world." },
      { type: "The Zen Master", icon: "🧘", desc: "High in emotional stability. You remain calm even in stormy weather." }
    ]
  },
  compatibility: {
    questions: [
      { q: "How do you prefer to resolve disagreements with a partner?", options: ["Calm discussion right away", "Taking space to think first", "Using humor to diffuse tension", "Writing down my feelings"] },
      { q: "What is your idea of a perfect bonding activity?", options: ["Deep long conversations", "Doing an adventurous activity together", "Quiet time side by side (Parallel play)", "Learning a new skill together"] },
      { q: "How do you react when your partner is stressed?", options: ["I offer practical solutions", "I provide emotional listening without advice", "I try to cheer them up", "I give them space until they're ready"] },
      { q: "What do you value most in a close relationship?", options: ["Total honesty and transparency", "Shared values and goals", "Physical affection and proximity", "Intellectual stimulation"] }
    ],
    results: [
      { type: "The Empath", icon: "💎", desc: "You value deep emotional connection and harmony above all else." },
      { type: "The Strategist", icon: "📐", desc: "You show love through support, planning, and keeping things running smoothly." },
      { type: "The Free Spirit", icon: "🕊️", desc: "You value independence and shared adventures that keep the spark alive." },
      { type: "The Stoic Support", icon: "🛡️", desc: "You are the steady rock in times of trouble, providing calm and consistency." }
    ]
  },

  // ── Carousel Card Tests ──────────────────────────────────────────────
  productivity: {
    questions: [
      { q: "How do you typically start your workday?", options: ["I follow a strict to-do list", "I sprint through the most urgent task first", "I ease in slowly with low-priority tasks", "I let the day guide me naturally"] },
      { q: "When is your creative energy at its peak?", options: ["Early morning — I'm sharpest at dawn", "Mid-morning, once I've warmed up", "Late afternoon when things quiet down", "Deep at night when there are no distractions"] },
      { q: "How do you handle a big project deadline?", options: ["I break it into milestones weeks ahead", "I work intensely in short bursts close to the deadline", "I daydream the approach first then execute fast", "I enter a deep 'flow' state and tune everything out"] },
      { q: "Which describes your ideal workspace?", options: ["Perfectly organized with a clear system", "Minimalist — just the essentials", "Creative chaos, I know where everything is", "Flexible — I work best in different spots"] },
      { q: "After completing a major task, you usually:", options: ["Review it for improvements immediately", "Celebrate briefly, then move to the next", "Take a long mental break to recharge", "Immediately think of the next big idea"] }
    ],
    results: [
      { type: "The Planner", icon: "📋", desc: "You thrive on structure and systems. Your methodical approach ensures consistent, high-quality results." },
      { type: "The Sprinter", icon: "⚡", desc: "You deliver explosive results in short bursts. Deadlines and pressure fuel your best work." },
      { type: "The Daydreamer", icon: "🌤️", desc: "You ideate before you act. Your creative vision often produces uniquely original solutions." },
      { type: "The Flow Master", icon: "🌊", desc: "You enter deep, immersive focus states. When in your zone, your output is unmatched." }
    ]
  },

  procrastination: {
    questions: [
      { q: "How often do you delay tasks you know are important?", options: ["Almost never — I start right away", "Sometimes, on tasks I don't enjoy", "Frequently, even tasks I care about", "Almost always, until the last moment"] },
      { q: "When you procrastinate, what do you usually do instead?", options: ["Clean or organize my environment", "Scroll social media or watch videos", "Work on a different (easier) task", "Just sit there feeling guilty"] },
      { q: "How do you feel right before finally starting a delayed task?", options: ["Relieved and ready", "Anxious but I push through", "Stressed but highly focused", "Overwhelmed and still stalling"] },
      { q: "What most often causes you to procrastinate?", options: ["Fear of not doing it perfectly", "Lack of clear direction or goals", "The task feels boring or pointless", "Feeling overwhelmed by its size"] },
      { q: "When a deadline is still far away, you typically:", options: ["Start immediately to avoid last-minute stress", "Plan it out but start a week before", "Glance at it occasionally until closer", "Ignore it completely until it's urgent"] }
    ],
    results: [
      { type: "Proactive Pro", icon: "🚀", desc: "You rarely procrastinate. You have strong self-regulation and consistent follow-through habits." },
      { type: "Selective Delayer", icon: "⏸️", desc: "You procrastinate on specific task types. Identifying these triggers can help you break the pattern." },
      { type: "Deadline Sprinter", icon: "⏰", desc: "You work best under pressure. Structure your tasks with artificial deadlines to harness this energy." },
      { type: "Chronic Avoider", icon: "🌀", desc: "Procrastination is affecting your output significantly. Breaking tasks into tiny 2-minute steps can help you start." }
    ]
  },

  workstress: {
    questions: [
      { q: "When work piles up suddenly, your first instinct is to:", options: ["Prioritize and tackle the most critical item", "Take a 5-minute breathing break first", "Feel overwhelmed and freeze temporarily", "Vent to a colleague before diving in"] },
      { q: "How often do work worries follow you after hours?", options: ["Almost never, I disconnect easily", "Only during very busy periods", "Quite often, it affects my evenings", "Almost always, I can't switch off"] },
      { q: "When a difficult colleague causes friction, you:", options: ["Address it directly and professionally", "Give it time and space to resolve itself", "Talk it through with a trusted friend", "Internalize it and push through quietly"] },
      { q: "Your main physical sign of work stress is:", options: ["Tension headaches or tight shoulders", "Disrupted sleep or low energy", "Skipping meals or stress-eating", "I rarely feel physical stress symptoms"] },
      { q: "Which best describes your current coping strategy?", options: ["Exercise or physical activity", "Mindfulness, meditation or journaling", "Social connection with friends/family", "I'm still searching for a good strategy"] }
    ],
    results: [
      { type: "Resilient Regulator", icon: "🧘", desc: "You handle stress with maturity and healthy strategies. Your emotional regulation is a real strength." },
      { type: "Adaptive Coper", icon: "🔄", desc: "You manage stress reasonably but could benefit from more consistent recovery routines." },
      { type: "Stress Accumulator", icon: "🧨", desc: "Stress tends to build up for you. Building daily micro-recovery habits will make a significant difference." },
      { type: "High Alert Mode", icon: "🆘", desc: "You're carrying a heavy stress load. Please talk to someone you trust and consider professional support." }
    ]
  },

  focustype: {
    questions: [
      { q: "How long can you focus on a single task before needing a break?", options: ["90+ minutes without any distraction", "25–45 minutes (classic Pomodoro)", "10–15 minutes before I need to switch", "It varies wildly depending on the task"] },
      { q: "When working on a complex problem, you prefer to:", options: ["Dive in deeply until it's 100% solved", "Work on it in intervals with short breaks", "Split attention across multiple approaches simultaneously", "Research extensively before starting"] },
      { q: "Notifications and interruptions usually:", options: ["Don't bother me, I re-focus quickly", "Break my flow but I recover in minutes", "Derail me for a long period", "I block all of them before I start"] },
      { q: "Your best work happens when:", options: ["You have a completely uninterrupted block of time", "You follow a structured work-break rhythm", "You have multiple projects competing for attention", "You're in a totally new environment or context"] },
      { q: "You would describe your attention style as:", options: ["A laser beam — narrow and ultra-deep", "A searchlight — disciplined, broad sweeps", "A spotlight juggler — many things at once", "A telescope — patient, detail-orientated"] }
    ],
    results: [
      { type: "Deep Diver", icon: "🤿", desc: "You achieve extraordinary depth of focus. Long, undisturbed work sessions are your superpower." },
      { type: "Rhythmic Focuser", icon: "🎵", desc: "You work best in structured intervals. The Pomodoro technique and time-blocking are your ideal frameworks." },
      { type: "Multi-Threader", icon: "🕸️", desc: "You thrive by running parallel tracks. Your brain excels at context-switching between related tasks." },
      { type: "The Analyst", icon: "🔬", desc: "You take time to understand deeply before acting. Your patient, research-first approach yields precise results." }
    ]
  },

  chronotype: {
    questions: [
      { q: "If you had total freedom, when would you naturally wake up?", options: ["Before 6 AM — I love the early quiet", "6–8 AM — a reasonable start", "8–10 AM — I need time to ease in", "After 10 AM — my body prefers late mornings"] },
      { q: "When do you feel your sharpest mental clarity?", options: ["Early morning right after waking", "Mid-morning after coffee", "Late afternoon, I get a second wind", "Late night, when the world quiets down"] },
      { q: "How do you feel about early morning meetings?", options: ["I love them — I'm at my best", "I don't mind if I've had enough sleep", "I survive them but am not at my peak", "I dread them — I'm not human before noon"] },
      { q: "What does your evening energy level look like?", options: ["I wind down early, asleep by 10 PM", "Pleasantly tired by midnight", "I get a burst of energy after 10 PM", "I hit my creative peak after midnight"] },
      { q: "Your most productive work window is typically:", options: ["5–9 AM (Early Bird Window)", "9 AM–12 PM (Morning Prime)", "2–6 PM (Afternoon Power Hour)", "8 PM–1 AM (Night Owl Zone)"] }
    ],
    results: [
      { type: "The Early Bird", icon: "🐦", desc: "You peak at dawn. Schedule your hardest cognitive tasks in the first 2–3 hours of the day for optimal output." },
      { type: "The Morning Pro", icon: "☀️", desc: "You're a classic morning type. Mid-morning is your cognitive sweet spot — protect it fiercely." },
      { type: "The Afternoon Achiever", icon: "🌤️", desc: "Your focus and energy surge in the afternoon. Batch your deep work in the post-lunch window." },
      { type: "The Night Owl", icon: "🦉", desc: "You come alive at night. Late-night hours are your creative sanctuary — design your schedule around it." }
    ]
  },

  // ── Grid Card Tests ──────────────────────────────────────────────────
  timemanagement: {
    questions: [
      { q: "How do you typically plan your day?", options: ["Detailed timed schedule in advance", "A short priority list the night before", "I assess the situation fresh each morning", "I rarely plan — I respond as things come up"] },
      { q: "How often do tasks take longer than you estimated?", options: ["Rarely — I buffer my time well", "Occasionally — maybe 30% of the time", "Frequently, I underestimate constantly", "Always — I have no sense of task duration"] },
      { q: "When do you usually complete your most important task?", options: ["First thing, immediately after starting work", "Mid-morning once I've warmed up", "Afternoon when everyone stops messaging me", "Evening or night when the office quiets"] },
      { q: "How do you handle unexpected urgent requests?", options: ["I assess priority and slot it in accordingly", "I drop what I'm doing and handle it", "I feel frustrated but adapt", "It derails my whole day"] },
      { q: "What is your relationship with deadlines?", options: ["I build buffer time and finish early", "I aim to finish on time consistently", "I often cut it close but always deliver", "I frequently miss deadlines or rush at the end"] }
    ],
    results: [
      { type: "Time Architect", icon: "🏗️", desc: "You design your time with precision. Your planning skills are exceptional — refine them even further with time audits." },
      { type: "Balanced Manager", icon: "⚖️", desc: "You manage time reasonably well. A consistent morning planning habit can sharpen your already solid instincts." },
      { type: "Reactive Responder", icon: "🔔", desc: "You tend to react rather than plan. Time-blocking just 3 priorities each morning will transform your effectiveness." },
      { type: "Time Drifter", icon: "🌬️", desc: "Time management is a challenge for you. Start small: one timer, one task, one block at a time." }
    ]
  },

  anxiety: {
    questions: [
      { q: "How often do you feel anxious or worried about work tasks?", options: ["Rarely, I feel confident in my abilities", "Occasionally, usually before big events", "Frequently, it's a persistent background feeling", "Almost daily, it significantly affects my work"] },
      { q: "When you make a mistake at work, you typically:", options: ["Learn from it and move on quickly", "Feel embarrassed briefly but recover", "Replay it in my mind for hours or days", "Fear significant consequences and spiral"] },
      { q: "How do you feel before presenting or speaking to a group?", options: ["Excited — I enjoy the spotlight", "Slightly nervous but in control", "Very anxious but I manage to do it", "Extremely distressed, I try to avoid it"] },
      { q: "Work-related worries affect your sleep:", options: ["Never or very rarely", "Occasionally during crunch times", "Regularly, I wake up thinking about work", "Almost every night without exception"] },
      { q: "When a task is ambiguous or unclear, you feel:", options: ["Curious and open to figuring it out", "Mildly uncomfortable but I ask for clarity", "Quite uneasy until I have full direction", "Very anxious — uncertainty is very difficult for me"] }
    ],
    results: [
      { type: "Calm Performer", icon: "🧊", desc: "You have excellent emotional regulation. Work anxiety rarely impacts your performance or wellbeing." },
      { type: "Managed Nervousness", icon: "🌿", desc: "You experience normal work nerves. Your awareness of them is a powerful first step to managing them well." },
      { type: "Elevated Anxiety", icon: "🌊", desc: "Work anxiety is a frequent companion. Grounding techniques and clear boundaries can reduce its daily intensity." },
      { type: "High Work Anxiety", icon: "🆘", desc: "Your anxiety is significantly affecting you. Please speak to a professional — you deserve real support." }
    ]
  },

  worklife: {
    questions: [
      { q: "After your working hours end, you typically:", options: ["Fully switch off and don't check work", "Glance at messages just once or twice", "Stay partially available for urgent things", "Remain fully available until I sleep"] },
      { q: "When did you last take a proper day off — truly disconnected?", options: ["Within the last two weeks", "About a month ago", "Several months or longer", "I genuinely can't remember"] },
      { q: "How often do you skip meals, exercise, or hobbies because of work?", options: ["Rarely — my personal time is protected", "Occasionally during busy seasons", "Frequently, work bleeds into everything", "Almost always, work comes first"] },
      { q: "Your personal relationships are affected by work-related stress:", options: ["Not at all — I keep them separate", "Mildly, only during peak periods", "Noticeably — loved ones have mentioned it", "Significantly — it's causing real strain"] },
      { q: "How satisfied are you with your current work-life balance?", options: ["Very satisfied — I've designed it well", "Fairly satisfied with minor adjustments needed", "Unsatisfied — I want to make changes soon", "Very unsatisfied — it feels completely out of control"] }
    ],
    results: [
      { type: "Boundary Master", icon: "🛡️", desc: "You've built excellent boundaries between work and life. Your intentional design of both is truly admirable." },
      { type: "Conscious Balancer", icon: "⚖️", desc: "You're doing well with balance but there's room to optimize. Try one new boundary this week." },
      { type: "Imbalanced Achiever", icon: "📉", desc: "Work is consuming more than its fair share. Reclaiming one personal ritual daily can start to restore the balance." },
      { type: "Needs Reset", icon: "🔄", desc: "Your balance is significantly off. A serious conversation about workload and boundaries is overdue." }
    ]
  }
};

let currentTestState = { id: null, step: 0, answers: [] };

function runTest(testId, name) {
  hideAllSections();
  const test = testsData[testId] || testsData.motivation;
  currentTestState = { id: testId, step: 0, answers: [], name };

  const overlay = $('#test-runner-overlay');
  overlay.classList.remove('hidden');
  renderTestStep();
}

function renderTestStep() {
  const test = testsData[currentTestState.id] || testsData.motivation;
  const content = $('#test-content');
  if (!content) return;

  if (currentTestState.step < test.questions.length) {
    const q = test.questions[currentTestState.step];
    const progress = (currentTestState.step / test.questions.length) * 100;

    const indicators = ['A', 'B', 'C', 'D', 'E', 'F'];

    content.innerHTML = `
      <div class="test-header stagger-in">
        <h2 class="test-title">${currentTestState.name}</h2>
        <span class="test-subtitle">Question ${currentTestState.step + 1} of ${test.questions.length}</span>
        <div class="test-progress-container">
          <div class="test-progress-bar" style="width: ${progress}%"></div>
        </div>
      </div>
      <div class="test-question-box">
        <p class="test-question stagger-in delay-1">${q.q}</p>
        <div class="test-options">
          ${q.options.map((opt, i) => `
            <button class="test-option stagger-in delay-${i + 2}" data-idx="${i}">
              <div class="test-option-indicator">${indicators[i] || (i + 1)}</div>
              <span class="opt-text">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    content.querySelectorAll('.test-option').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTestState.answers.push(parseInt(btn.dataset.idx));
        currentTestState.step++;
        renderTestStep();
      });
    });
  } else {
    showTestResult();
  }
}

function showTestResult() {
  const test = testsData[currentTestState.id] || testsData.motivation;
  const content = $('#test-content');

  // Simple logic: pick result based on average answer index
  const avg = currentTestState.answers.reduce((a, b) => a + b, 0) / currentTestState.answers.length;
  const resultIdx = Math.min(test.results.length - 1, Math.round(avg));
  const res = test.results[resultIdx];

  content.innerHTML = `
    <div class="test-result stagger-in">
      <span class="test-result-icon">${res.icon}</span>
      <h4 class="test-result-title">Test Analysis Result</h4>
      <h3 class="test-result-type">${res.type}</h3>
      <p class="test-result-desc">${res.desc}</p>
      <button class="test-finish-btn stagger-in delay-3" id="st-finish-btn">Finish & Optimize</button>
    </div>
  `;

  $('#st-finish-btn').addEventListener('click', () => {
    $('#test-runner-overlay').classList.add('hidden');
  });
}

const worksheetsData = {
  cbt: {
    steps: [
      { q: "What is the situation? (Where, who, what was happening?)", placeholder: "e.g., At work, colleague criticized my presentation..." },
      { q: "What thoughts are going through your mind? (The 'Hot Thought')", placeholder: "e.g., I'm incompetent and everyone knows it." },
      { q: "What emotions are you feeling? (Rate intensity 1-100%)", placeholder: "e.g., Anxiety (80%), Sadness (50%)..." },
      { q: "What is the evidence supporting this thought?", placeholder: "e.g., I stumbled twice during the speech..." },
      { q: "What is the evidence against this thought?", placeholder: "e.g., The boss said the data was excellent, I finished on time..." },
      { q: "Alternative Balanced Thought:", placeholder: "e.g., I made a few small mistakes but the core message was successful." }
    ],
    finishMsg: "You've successfully reframed your perspective. How do you feel now?"
  },
  gratitude: {
    steps: [
      { q: "List 3 things you are grateful for today:", placeholder: "1. ...\n2. ...\n3. ..." },
      { q: "Why are these things important to you?", placeholder: "Reflect on their impact on your life..." },
      { q: "Who is someone you appreciate right now and why?", placeholder: "A friend, family member, or colleague..." }
    ],
    finishMsg: "Gratitude practice complete. Carrying this warmth into your day!"
  },
  emotion: {
    steps: [
      { q: "Close your eyes. Where do you feel tension or sensation in your body?", placeholder: "e.g., Tightness in chest, warmth in hands..." },
      { q: "If this sensation had a color or shape, what would it be?", placeholder: "e.g., A sharp red triangle, a heavy gray cloud..." },
      { q: "What is this emotion trying to tell you?", placeholder: "Listen to your inner voice without judgment..." }
    ],
    finishMsg: "You've deepened your emotional awareness. Stay present."
  },
  smart: {
    steps: [
      { q: "Specific: What exactly do you want to accomplish?", placeholder: "e.g., I want to write a 5-page research paper..." },
      { q: "Measurable: How will you know when it is accomplished?", placeholder: "e.g., When the final draft is printed and proofread..." },
      { q: "Achievable: How can the goal be accomplished?", placeholder: "e.g., By spending 2 hours every evening in the library..." },
      { q: "Relevant: Why is this goal important to you?", placeholder: "e.g., It's 20% of my final grade for a core subject..." },
      { q: "Time-bound: When will this goal be accomplished?", placeholder: "e.g., By Friday at 5:00 PM." }
    ],
    finishMsg: "Your SMART goal is set. Now let's break it down into tasks!"
  },
  stress: {
    steps: [
      { q: "Identify a current stressor:", placeholder: "e.g., Upcoming project deadline..." },
      { q: "On a scale of 1-10, how much stress does this cause?", placeholder: "1 (Low) - 10 (High)" },
      { q: "What is one thing within your control regarding this stressor?", placeholder: "Focus on actions you can take..." },
      { q: "What is one thing you can let go of or delegate?", placeholder: "Identify what you can't control..." }
    ],
    finishMsg: "Inventory complete. Focus on what you can control, stay balanced."
  },
  compassion: {
    steps: [
      { q: "Imagine a dear friend is going through exactly what you are. What would you say to them?", placeholder: "Write words of kindness, understanding, and support..." },
      { q: "Now, read those words back to yourself. How does it feel to offer yourself this same kindness?", placeholder: "Reflect on self-compassion vs. self-criticism..." }
    ],
    finishMsg: "You deserve the same kindness you give to others. Be gentle with yourself."
  }
};

let currentWsState = { id: null, step: 0, answers: [], name: '' };

function runWorksheet(wsId, name) {
  const ws = worksheetsData[wsId] || worksheetsData.cbt;
  currentWsState = { id: wsId, step: 0, answers: [], name };

  const overlay = $('#test-runner-overlay');
  overlay.classList.remove('hidden');
  renderWorksheetStep();
}

function renderWorksheetStep() {
  const ws = worksheetsData[currentWsState.id] || worksheetsData.cbt;
  const content = $('#test-content');
  if (!content) return;

  if (currentWsState.step < ws.steps.length) {
    const s = ws.steps[currentWsState.step];
    const progress = (currentWsState.step / ws.steps.length) * 100;

    content.innerHTML = `
      <div class="test-header">
        <h2 class="test-title">${currentWsState.name}</h2>
        <div class="test-progress-container">
          <div class="test-progress-bar" style="width: ${progress}%"></div>
        </div>
      </div>
      <div class="test-question-box">
        <p class="test-question">${s.q}</p>
        <textarea class="ws-input-area" id="ws-textarea" placeholder="${s.placeholder}"></textarea>
        <div style="text-align: right;">
          <button class="ws-next-btn" id="ws-next-btn">
            ${currentWsState.step === ws.steps.length - 1 ? 'Finish Worksheet' : 'Next Step'} 
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    `;

    $('#ws-next-btn').addEventListener('click', () => {
      const val = $('#ws-textarea').value.trim();
      currentWsState.answers.push(val);
      currentWsState.step++;
      renderWorksheetStep();
    });

    // Focus textarea
    setTimeout(() => $('#ws-textarea')?.focus(), 100);
  } else {
    showWorksheetResult();
  }
}

function showWorksheetResult() {
  const ws = worksheetsData[currentWsState.id] || worksheetsData.cbt;
  const content = $('#test-content');

  content.innerHTML = `
    <div class="test-result">
      <span class="test-result-icon">✨</span>
      <h3 class="test-result-type">Reflection Complete</h3>
      <p class="test-result-desc">${ws.finishMsg}</p>
      <button class="test-finish-btn" id="ws-finish-btn">Save to Journal & Exit</button>
    </div>
  `;

  $('#ws-finish-btn').addEventListener('click', () => {
    // Optionally save to journal here
    $('#test-runner-overlay').classList.add('hidden');
  });
}

// --- Profile Modal ---
function openProfile() {
  const overlay = $('#profile-overlay');
  if (!overlay) return;

  // Sync data from config
  const userData = config.user || DEFAULTS.user;
  const usernameInput = $('#profile-username');
  const emailInput = $('#profile-email');
  const bioInput = $('#profile-bio');

  if (usernameInput) usernameInput.value = userData.username;
  if (emailInput) emailInput.value = userData.email;
  if (bioInput) bioInput.value = userData.bio || '';

  // Stats
  const sessionsVal = $('#profile-sessions');
  const streakVal = $('#profile-streak');
  const rankVal = $('#profile-rank');

  if (sessionsVal) {
    const stats = loadStats();
    let total = 0;
    Object.values(stats).forEach(s => total += (s.sessions || 0));
    sessionsVal.textContent = total;
  }
  if (streakVal) streakVal.textContent = getDayStreak() + 'd';
  if (rankVal) rankVal.textContent = userData.rank || 'BETA';

  overlay.classList.remove('hidden');
}

function closeProfileModal() {
  const overlay = $('#profile-overlay');
  if (overlay) overlay.classList.add('hidden');
}

function applyProfile() {
  const username = $('#profile-username')?.value.trim();
  const email = $('#profile-email')?.value.trim();
  const bio = $('#profile-bio')?.value.trim();

  if (!username) return;

  if (!config.user) config.user = { ...DEFAULTS.user };
  config.user.username = username;
  config.user.email = email;
  config.user.bio = bio;

  saveConfig();

  // Update header
  const headerName = $('.header-username');
  if (headerName) headerName.textContent = username;

  closeProfileModal();

  // Visual success feedback
  if (typeof addChatMessage === 'function') {
    addChatMessage(`Profile synchronized! Your Pomo ID is now updated, ${username}.`, 'bot');
  }
}

// --- Settings Modal ---
function openSettings() {
  $('#s-pomodoro').value = config.pomodoro;
  $('#s-short').value = config.shortBreak;
  $('#s-long').value = config.longBreak;
  $('#s-interval').value = config.longBreakInterval;
  $('#s-auto-break').checked = config.autoStartBreak;
  $('#s-auto-pomo').checked = config.autoStartPomodoro;
  $('#s-alarm-sound').value = config.alarmSound;
  $('#s-alarm-volume').value = config.alarmVolume;
  $('#settings-overlay').classList.remove('hidden');
}

function closeSettingsModal() {
  $('#settings-overlay').classList.add('hidden');
}

function applySettings() {
  config.pomodoro = clamp(parseInt($('#s-pomodoro').value) || 25, 1, 90);
  config.shortBreak = clamp(parseInt($('#s-short').value) || 5, 1, 30);
  config.longBreak = clamp(parseInt($('#s-long').value) || 15, 1, 60);
  config.longBreakInterval = clamp(parseInt($('#s-interval').value) || 4, 2, 10);
  config.autoStartBreak = $('#s-auto-break').checked;
  config.autoStartPomodoro = $('#s-auto-pomo').checked;
  config.alarmSound = $('#s-alarm-sound').value;
  config.alarmVolume = parseInt($('#s-alarm-volume').value) || 50;
  saveConfig();
  resetTimer();
  closeSettingsModal();
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// --- Report Modal ---
function openReport() {
  const stats = loadStats();
  let totalSessions = 0, totalMinutes = 0;
  Object.values(stats).forEach(d => {
    totalSessions += (Number(d.sessions) || 0);
    totalMinutes += (Number(d.totalMinutes) || Number(d.minutes) || 0);
  });

  const hrs = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);

  const totalHrsEl = $('#r-total-hours');
  if (totalHrsEl) totalHrsEl.textContent = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

  const totalSessionsEl = $('#r-total-sessions');
  if (totalSessionsEl) totalSessionsEl.textContent = totalSessions;

  const dayStreakEl = $('#r-day-streak');
  if (dayStreakEl) dayStreakEl.textContent = getDayStreak();

  renderReportChart(stats);
  $('#report-overlay').classList.remove('hidden');
}

function renderReportChart(stats) {
  const chart = $('#report-chart');
  if (!chart) return;
  chart.innerHTML = '';
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const data = [];
  const today = new Date();

  // Get last 7 days using local date keys
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayData = stats[key] || { sessions: 0, totalMinutes: 0, minutes: 0 };
    const mins = Number(dayData.totalMinutes) || Number(dayData.minutes) || 0;
    data.push({
      label: dayNames[d.getDay()],
      sessions: dayData.sessions || 0,
      minutes: mins
    });
  }

  const maxMin = Math.max(1, ...data.map(d => d.minutes));

  data.forEach(d => {
    const col = document.createElement('div');
    col.className = 'chart-bar-col';

    const val = document.createElement('span');
    val.className = 'chart-bar-value';
    val.textContent = d.minutes > 0 ? (d.minutes < 1 ? '<1m' : `${Math.round(d.minutes)}m`) : '';

    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = `${Math.max(4, (d.minutes / maxMin) * 85)}%`; // 85% max height to leave room for value
    bar.title = `${d.sessions} sessions, ${Math.round(d.minutes)}m total`;

    const label = document.createElement('span');
    label.className = 'chart-bar-label';
    label.textContent = d.label;

    col.appendChild(val);
    col.appendChild(bar);
    col.appendChild(label);
    chart.appendChild(col);
  });
}

function closeReportModal() {
  $('#report-overlay').classList.add('hidden');
}

// --- Events ---
function bindEvents() {
  // Start/Pause
  const btnStart = $('#btn-start');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      state.isRunning ? pauseTimer() : startTimer();
    });
  }

  // Info Section Start Button
  const infoStartBtn = $('#btn-info-start');
  if (infoStartBtn) {
    infoStartBtn.addEventListener('click', () => {
      switchMode('pomodoro');
      startTimer();
      // Scroll back up to the timer
      const timerSection = $('.mascot-area');
      if (timerSection) timerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Mode tabs
  $$('.mode-tab').forEach(tab => {
    tab.addEventListener('click', () => switchMode(tab.dataset.mode));
  });

  // --- POMO 4-STEP GUIDE INTERACTIVITY ---

  // Step 1: Choose Task
  const stepChooseTask = $('#step-choose-task');
  if (stepChooseTask) {
    stepChooseTask.addEventListener('click', () => {
      // Focus the chat input to define task
      const input = $('#chat-message-input');
      if (input) {
        input.focus();
        input.placeholder = "Defining your task...";
        setTimeout(() => input.placeholder = "Type your task here...", 1500);
      }
      const chatArea = $('.chat-input-area');
      if (chatArea) chatArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Step 2: Set Timer
  const stepSetTimer = $('#step-set-timer');
  if (stepSetTimer) {
    stepSetTimer.addEventListener('click', () => {
      switchMode('pomodoro');
      startTimer();
      const timerSection = $('.mascot-area');
      if (timerSection) timerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Step 3: Stay Focused
  const stepStayFocused = $('#step-stay-focused');
  if (stepStayFocused) {
    stepStayFocused.addEventListener('click', () => {
      const timerSection = $('.mascot-area');
      if (timerSection) timerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Add a small visual pulse to the timer or mascot
      const mascot = $('.mascot-container');
      if (mascot) {
        mascot.style.transform = 'scale(1.05)';
        setTimeout(() => mascot.style.transform = 'scale(1)', 300);
      }
    });
  }

  // Step 4: Strategic Break
  const stepTakeBreak = $('#step-take-break');
  if (stepTakeBreak) {
    stepTakeBreak.addEventListener('click', () => {
      switchMode('shortBreak');
      startTimer();
      const timerSection = $('.mascot-area');
      if (timerSection) timerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // --- POMO FEATURES INTERACTIVITY ---

  // Feature 1: Customizable Timer
  const featCustomizer = $('#feature-customizer');
  if (featCustomizer) {
    featCustomizer.addEventListener('click', () => {
      if (typeof openSettings === 'function') openSettings();
    });
  }

  // Feature 2: Distraction Blocker
  const featBlocker = $('#feature-blocker');
  if (featBlocker) {
    featBlocker.addEventListener('click', () => {
      const timerSection = $('.mascot-area');
      if (timerSection) timerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Feature 3: Progress Tracking
  const featTracking = $('#feature-tracking');
  if (featTracking) {
    featTracking.addEventListener('click', () => {
      if (typeof openReport === 'function') openReport();
    });
  }

  // Feature 4: Improved Concentration
  const featConcentration = $('#feature-concentration');
  if (featConcentration) {
    featConcentration.addEventListener('click', () => {
      const input = $('#chat-message-input');
      if (input) {
        input.focus();
        input.placeholder = "Optimizing concentration...";
        setTimeout(() => input.placeholder = "Type your message...", 1500);
      }
      const chatArea = $('.chat-input-area');
      if (chatArea) chatArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Feature 5: Goal Achievement
  const featGoals = $('#feature-goals');
  if (featGoals) {
    featGoals.addEventListener('click', () => {
      const input = $('#chat-message-input');
      if (input) {
        input.focus();
        input.placeholder = "Defining goals...";
        setTimeout(() => input.placeholder = "Type your message...", 1500);
      }
      const chatArea = $('.chat-input-area');
      if (chatArea) chatArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Feature 6: Instant Access
  const featAccess = $('#feature-access');
  if (featAccess) {
    featAccess.addEventListener('click', () => {
      const timerSection = $('.mascot-area');
      if (timerSection) timerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Settings
  const closeSettings = $('#close-settings');
  if (closeSettings) closeSettings.addEventListener('click', closeSettingsModal);

  const saveSettings = $('#save-settings');
  if (saveSettings) saveSettings.addEventListener('click', applySettings);

  const settingsOverlay = $('#settings-overlay');
  if (settingsOverlay) {
    settingsOverlay.addEventListener('click', e => {
      if (e.target === settingsOverlay) closeSettingsModal();
    });
  }

  // Report
  const btnReport = $('#btn-report');
  if (btnReport) btnReport.addEventListener('click', openReport);

  const closeReport = $('#close-report');
  if (closeReport) closeReport.addEventListener('click', closeReportModal);

  const reportOverlay = $('#report-overlay');
  if (reportOverlay) {
    reportOverlay.addEventListener('click', e => {
      if (e.target === reportOverlay) closeReportModal();
    });
  }

  // Chat Input — Send message
  const chatSendBtn = $('#chat-send-btn');
  if (chatSendBtn) chatSendBtn.addEventListener('click', handleChatSend);

  const chatInput = $('#chat-message-input');
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleChatSend();
      }
    });
  }

  // Suggestion Chips — send as chat message
  $$('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.textContent.trim();
      const input = $('#chat-message-input');
      if (input) {
        input.value = text;
        handleChatSend();
      } else {
        // Fallback if input not found
        addChatMessage(text, 'user');
        const lowerText = text.toLowerCase();
        let found = false;
        for (const [key, handler] of Object.entries(chatResponses)) {
          if (lowerText.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerText)) {
            const response = handler();
            setTimeout(() => addChatMessage(response, 'bot'), 600 + Math.random() * 800);
            found = true;
            break;
          }
        }
        if (!found) {
          const resp = generalResponses[Math.floor(Math.random() * generalResponses.length)];
          setTimeout(() => addChatMessage(resp, 'bot'), 800);
        }
      }
    });
  });

  // Add Task
  const addBtn = $('#btn-add-task');
  const taskForm = $('#add-task-form');
  if (addBtn && taskForm) {
    addBtn.addEventListener('click', () => {
      addBtn.style.display = 'none';
      taskForm.classList.remove('hidden');
      const taskInput = $('#new-task-input');
      if (taskInput) taskInput.focus();
    });
  }

  const cancelTask = $('#btn-cancel-task');
  if (cancelTask) {
    cancelTask.addEventListener('click', () => {
      if (taskForm) taskForm.classList.add('hidden');
      if (addBtn) addBtn.style.display = 'flex';
      const ni = $('#new-task-input');
      if (ni) ni.value = '';
      const ec = $('#est-count');
      if (ec) ec.value = 1;
    });
  }

  const saveTask = $('#btn-save-task');
  if (saveTask) {
    saveTask.addEventListener('click', () => {
      const ni = $('#new-task-input');
      if (!ni) return;
      const name = ni.value.trim();
      if (!name) return;
      const ec = $('#est-count');
      const est = clamp(parseInt(ec?.value) || 1, 1, 99);
      tasks.push({ id: nextTaskId++, name, estimatedPomos: est, completedPomos: 0, done: false });
      saveTasks();
      renderTasks();
      if (taskForm) taskForm.classList.add('hidden');
      if (addBtn) addBtn.style.display = 'flex';
      ni.value = '';
      if (ec) ec.value = 1;
    });
  }

  // Est Pomodoros +/-
  const estUp = $('#est-up');
  if (estUp) {
    estUp.addEventListener('click', () => {
      const input = $('#est-count');
      if (input) input.value = Math.min(99, parseInt(input.value) + 1);
    });
  }
  const estDown = $('#est-down');
  if (estDown) {
    estDown.addEventListener('click', () => {
      const input = $('#est-count');
      if (input) input.value = Math.max(1, parseInt(input.value) - 1);
    });
  }

  // Enter to save task
  const newTaskInput = $('#new-task-input');
  if (newTaskInput) {
    newTaskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && saveTask) saveTask.click();
      if (e.key === 'Escape' && cancelTask) cancelTask.click();
    });
  }

  // Tasks menu dropdown
  const menuDropdown = $('#tasks-menu-dropdown');
  const btnTasksMenu = $('#btn-tasks-menu');
  if (btnTasksMenu && menuDropdown) {
    btnTasksMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      menuDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      menuDropdown.classList.add('hidden');
    });
  }

  const menuClearFinished = $('#menu-clear-finished');
  if (menuClearFinished) {
    menuClearFinished.addEventListener('click', () => {
      tasks = tasks.filter(t => !t.done);
      if (state.activeTaskId && !tasks.find(t => t.id === state.activeTaskId)) state.activeTaskId = null;
      saveTasks(); renderTasks();
      if (menuDropdown) menuDropdown.classList.add('hidden');
    });
  }

  const menuClearAll = $('#menu-clear-all');
  if (menuClearAll) {
    menuClearAll.addEventListener('click', () => {
      if (confirm('Clear all tasks?')) {
        tasks = [];
        state.activeTaskId = null;
        saveTasks(); renderTasks();
        if (menuDropdown) menuDropdown.classList.add('hidden');
      }
    });
  }



  // Dropdown Items Actions
  const triggerChatCommand = (msg) => {
    const welcomeMsg = $('#welcome-message');
    const suggestions = $('#suggestion-chips-area');
    const timerCard = $('.timer-chat-area');
    const chatContainer = $('#chat-messages');

    if (welcomeMsg) welcomeMsg.classList.add('hidden');
    if (suggestions) suggestions.classList.add('hidden');
    if (timerCard) timerCard.classList.remove('hidden');
    if (chatContainer) {
      chatContainer.classList.remove('hidden');
      chatContainer.style.display = 'flex';
    }

    addChatMessage(msg, 'bot');

    // Ensure the chat area is in view
    setTimeout(() => {
      const scrollTarget = chatContainer || timerCard;
      if (scrollTarget) {
        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  // --- Background Music System (Enhanced) ---
  const musicVisualizer = $('#m-visualizer');
  const mPlayBtn = $('#m-play-btn');
  const mVolSlider = $('#m-vol-slider');
  const mNextBtn = $('#m-next-btn');
  const mPrevBtn = $('#m-prev-btn');
  const trackTitle = $('#current-track-name');
  const stationTitle = $('#current-station-name');

  const stations = [
    { name: 'Pomo Focus FM', track: 'Deep Flow Lo-fi', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    { name: 'Alpha Wave Radio', track: 'Cybernetic Echoes', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { name: 'Beta Rhythm Lab', track: 'Pulse Optimizer', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' }
  ];
  let currentStationIndex = 0;

  const setupAudio = () => {
    if (!state.bgMusic.modalAudio) {
      state.bgMusic.modalAudio = new Audio(stations[currentStationIndex].url);
      state.bgMusic.modalAudio.loop = true;
      state.bgMusic.modalAudio.volume = state.bgMusic.volume;
    }
  };

  const updateMusicUI = () => {
    const isPlaying = state.bgMusic.modalPlaying || false;
    const musicToggle = $('#music-toggle');

    if (trackTitle) trackTitle.textContent = stations[currentStationIndex].track;
    if (stationTitle) stationTitle.textContent = `Station: ${stations[currentStationIndex].name}`;

    // Update Modal
    if (mPlayBtn) {
      mPlayBtn.innerHTML = isPlaying
        ? `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
        : `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    }

    if (musicVisualizer) {
      isPlaying ? musicVisualizer.classList.add('active') : musicVisualizer.classList.remove('active');
    }

    // Sync with menu toggle
    if (musicToggle) musicToggle.checked = isPlaying;
  };

  const switchStation = (direction) => {
    currentStationIndex = (currentStationIndex + direction + stations.length) % stations.length;
    const wasPlaying = state.bgMusic.modalPlaying || false;

    if (state.bgMusic.modalAudio) {
      state.bgMusic.modalAudio.pause();
      state.bgMusic.modalAudio = null;
    }

    if (wasPlaying) {
      toggleBGMusic(true);
    } else {
      updateMusicUI();
    }
  };

  const toggleBGMusic = (forceState) => {
    setupAudio();
    const targetState = forceState !== undefined ? forceState : !state.bgMusic.modalPlaying;

    if (targetState) {
      state.bgMusic.modalAudio.play().catch(err => console.error('Playback error:', err));
      state.bgMusic.modalPlaying = true;
    } else {
      state.bgMusic.modalAudio.pause();
      state.bgMusic.modalPlaying = false;
    }

    updateMusicUI();
  };

  // Modal Control Listeners
  if (mPlayBtn) mPlayBtn.addEventListener('click', () => toggleBGMusic());
  if (mNextBtn) mNextBtn.addEventListener('click', () => switchStation(1));
  if (mPrevBtn) mPrevBtn.addEventListener('click', () => switchStation(-1));


  if (mVolSlider) {
    mVolSlider.addEventListener('input', (e) => {
      const vol = e.target.value / 100;
      state.bgMusic.volume = vol;
      if (state.bgMusic.audio) state.bgMusic.audio.volume = vol;
      if (state.bgMusic.modalAudio) state.bgMusic.modalAudio.volume = vol;
    });
  }

  const itemsMap = {
    'dr-profile': () => openProfile(),
    'dr-music': () => $('#music-overlay').classList.remove('hidden'),
    'dr-feedback': () => $('#feedback-overlay').classList.remove('hidden'),
    'dr-themes': () => $('#themes-overlay').classList.remove('hidden'),
    'dr-rewards': () => $('#rewards-overlay').classList.remove('hidden'),
    'dr-call': () => {
      const sos = $('#sos-overlay');
      if (sos) sos.classList.remove('hidden');
    },
    'dr-login': () => {
      const drLoginSpan = $('#dr-login span');
      if (drLoginSpan && drLoginSpan.textContent === 'Log Out') {
        handleLogout();
      } else {
        const signup = $('#auth-overlay');
        if (signup) signup.classList.remove('hidden');
      }
    }
  };

  // --- About Submenu Interaction ---
  const aboutParent = $('#dr-about-parent');
  const aboutSubmenu = $('#about-submenu');
  if (aboutParent && aboutSubmenu) {
    aboutParent.addEventListener('mouseenter', () => aboutSubmenu.classList.remove('hidden'));
    aboutParent.addEventListener('mouseleave', () => aboutSubmenu.classList.add('hidden'));

    const subItems = {
      'dr-about-pomo': () => $('#about-overlay').classList.remove('hidden'),
      'dr-about-mascot': () => $('#mascot-overlay').classList.remove('hidden'),
      'dr-testimonials': () => $('#testimonials-overlay').classList.remove('hidden'),
      'dr-faqs': () => $('#faqs-overlay').classList.remove('hidden'),
      'dr-terms': () => $('#terms-overlay').classList.remove('hidden'),
      'dr-privacy': () => $('#privacy-overlay').classList.remove('hidden')
    };

    Object.entries(subItems).forEach(([id, action]) => {
      const el = $('#' + id);
      if (el) {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          action();
          aboutSubmenu.classList.add('hidden');
          userDropdown.classList.add('hidden');
          const btnProfile = $('#header-user-btn');
          if (btnProfile) btnProfile.classList.remove('header-user-btn-active');
        });
      }
    });
  }

  // --- Mascot Modal Close ---
  const mascotOverlay_pomo = $('#mascot-overlay');
  const closeMascot_pomo = $('#close-mascot-modal-pomo');
  if (closeMascot_pomo && mascotOverlay_pomo) {
    closeMascot_pomo.addEventListener('click', () => mascotOverlay_pomo.classList.add('hidden'));
    mascotOverlay_pomo.addEventListener('click', (e) => {
      if (e.target === mascotOverlay_pomo) mascotOverlay_pomo.classList.add('hidden');
    });
  }

  // --- Testimonials UI Logic ---
  const closeReviews = $('#close-testimonials-modal-v2');
  if (closeReviews) {
    closeReviews.addEventListener('click', () => {
      $('#testimonials-overlay').classList.add('hidden');
    });
  }

  const talkToPomoBtn = $('#talk-to-pomo-trigger');
  const faqTalkToPomo = $('#faq-talk-to-pomo');

  const handleTalkToPomo = (overlayId) => {
    $(overlayId).classList.add('hidden');
    startNewChat();
  };

  if (talkToPomoBtn) {
    talkToPomoBtn.addEventListener('click', () => handleTalkToPomo('#testimonials-overlay'));
  }
  if (faqTalkToPomo) {
    faqTalkToPomo.addEventListener('click', () => handleTalkToPomo('#faqs-overlay'));
  }

  // FAQ Accordion Logic...
  const faqItems = $$('.faq-item-v3');
  faqItems.forEach(item => {
    const qRow = item.querySelector('.faq-q-row');
    if (qRow) {
      qRow.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  // Feedback Modal Interactions
  const fStars = $$('#feedback-stars .star-icon');
  const fCategories = $$('.category-pill');
  const fSubmit = $('.submit-feedback-btn');

  fStars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.dataset.rating);
      fStars.forEach((s, idx) => {
        if (idx < rating) s.classList.add('active');
        else s.classList.remove('active');
      });
    });
  });

  fCategories.forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
    });
  });

  if (fSubmit) {
    fSubmit.addEventListener('click', () => {
      fSubmit.innerHTML = '<span>Uploading Data...</span>';
      setTimeout(() => {
        $('#feedback-overlay').classList.add('hidden');
        fSubmit.innerHTML = '<span>Submit Intelligence Report</span>';
        addChatMessage("<strong>System Feedback Received.</strong> Pomo optimization paths updated based on your input.", 'bot');
        // Reset
        fStars.forEach(s => s.classList.remove('active'));
        fCategories.forEach(c => c.classList.remove('active'));
        $('.feedback-modal-content textarea').value = '';
      }, 1500);
    });
  }

  // Close handlers for sub-modals
  ['music', 'feedback', 'about', 'themes', 'rewards', 'testimonials', 'faqs', 'terms', 'privacy', 'premium', 'sos', 'mobile'].forEach(id => {
    const closeBtn = $(`#close-${id}-modal`) || $(`#close-${id}`);
    const overlay = $(`#${id}-overlay`) || $(`#${id}-app-overlay`);
    if (closeBtn) closeBtn.addEventListener('click', () => overlay?.classList.add('hidden'));
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.add('hidden');
      });
    }
  });

  // Theme Switching Logic
  const allThemeClasses = ['theme-cyber', 'theme-gold', 'theme-violet', 'theme-emerald', 'theme-ember', 'theme-ocean', 'theme-rose'];
  const themeMessages = {
    default: '<strong>Deep Slate Protocol</strong> active. Visual latency optimized.',
    cyber: '<strong>Cyber Zen Interface</strong> initialized. Neon-sync active.',
    gold: '<strong>Focus Gold Matrix</strong> online. Elite productivity mode enabled.',
    violet: '<strong>Midnight Violet</strong> engaged. Shadow protocol activated.',
    emerald: '<strong>Forest Emerald</strong> deployed. Nature-sync established.',
    ember: '<strong>Sunset Ember</strong> burning bright. Heat-sync active.',
    ocean: '<strong>Ocean Depths</strong> flowing. Deep current mode enabled.',
    rose: '<strong>Rose Noir</strong> awakened. Elegance protocol online.'
  };

  function applyTheme(themeId) {
    document.body.classList.remove(...allThemeClasses);
    if (themeId !== 'default') {
      document.body.classList.add('theme-' + themeId);
    }
  }

  const themeCards = $$('.theme-card');
  themeCards.forEach(card => {
    card.addEventListener('click', () => {
      themeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const themeId = card.dataset.theme;
      applyTheme(themeId);
      localStorage.setItem('pomo-theme', themeId);
      addChatMessage(themeMessages[themeId] || themeMessages.default, 'bot');

      // Close modal
      setTimeout(() => $('#themes-overlay').classList.add('hidden'), 300);
    });
  });

  Object.entries(itemsMap).forEach(([id, action]) => {
    const el = $('#' + id);
    if (el) {
      el.addEventListener('click', (e) => {
        // Prevent closing before action executes
        e.stopPropagation();
        action();
        userDropdown.classList.add('hidden');
        btnProfile.classList.remove('header-user-btn-active');
      });
    }
  });

  // Special handling for Music row to toggle the switch
  const drMusic = $('#dr-music');
  const musicToggle = $('#music-toggle');
  if (drMusic && musicToggle) {
    // Clicking the toggle should not open the modal
    const toggleContainer = drMusic.querySelector('.toggle-switch');
    if (toggleContainer) {
      toggleContainer.addEventListener('click', (e) => e.stopPropagation());
    }

    drMusic.addEventListener('click', (e) => {
      // Show music panel
      const musicPanel = $('#music-panel');
      if (musicPanel) {
        musicPanel.classList.remove('hidden');
        renderMusicPanel();
      }
    });

    musicToggle.addEventListener('change', () => {
      const isEnabled = musicToggle.checked;
      toggleMusicEnabled();
    });
  }

  const closeProfile = $('#close-profile');
  if (closeProfile) closeProfile.addEventListener('click', closeProfileModal);

  const saveProfile = $('#save-profile');
  if (saveProfile) saveProfile.addEventListener('click', applyProfile);

  const profileOverlay = $('#profile-overlay');
  if (profileOverlay) {
    profileOverlay.addEventListener('click', e => {
      if (e.target === profileOverlay) closeProfileModal();
    });
  }

  // Top Right Controls (V6)
  const langBtn = $('#lang-selector-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      $('#language-overlay').classList.remove('hidden');
    });
  }

  const closeLang = $('#close-language');
  if (closeLang) closeLang.addEventListener('click', () => $('#language-overlay').classList.add('hidden'));

  const langOverlay = $('#language-overlay');
  if (langOverlay) {
    langOverlay.addEventListener('click', e => {
      if (e.target === langOverlay) langOverlay.classList.add('hidden');
    });
  }

  // Language options
  $$('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const lang = opt.dataset.lang;
      $$('.lang-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      // Apply translation
      applyTranslation(lang);

      // Update button text
      const btnSpan = $('#lang-selector-btn span');
      if (btnSpan) btnSpan.textContent = opt.querySelector('.lang-name').textContent;

      $('#language-overlay').classList.add('hidden');
    });
  });

  const modeBtn = $('#mode-selector-btn');
  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      // Cycle through modes
      const modes = ['pomodoro', 'shortBreak', 'longBreak'];
      const currentIndex = modes.indexOf(state.mode);
      const nextIndex = (currentIndex + 1) % modes.length;
      switchMode(modes[nextIndex]);

      // Visual feedback
      modeBtn.style.transform = 'scale(1.1)';
      setTimeout(() => modeBtn.style.transform = '', 200);
    });
  }

  // Focus Meter
  const moodMeter = $('.mood-meter');
  if (moodMeter) {
    moodMeter.addEventListener('click', () => {
      openFocusInsights();
    });
  }

  const focusOverlay = $('#focus-overlay');
  const closeFocusBtn = $('#close-focus');

  if (closeFocusBtn) {
    closeFocusBtn.addEventListener('click', () => {
      if (focusOverlay) focusOverlay.classList.add('hidden');
      stopPomoAnimation();
    });
  }

  if (focusOverlay) {
    focusOverlay.addEventListener('click', (e) => {
      if (e.target === focusOverlay) {
        focusOverlay.classList.add('hidden');
        stopPomoAnimation();
      }
    });
  }

  // Share Focus Report
  const shareBtn = $('.focus-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const btnText = shareBtn.innerHTML;
      shareBtn.textContent = 'Report copied to clipboard!';
      setTimeout(() => shareBtn.innerHTML = btnText, 2000);

      const stats = loadStats();
      const key = getTodayKey();
      const mins = stats[key]?.minutes || 0;
      const text = `🧠 My Pomo Focus Report: ${mins}m of deep focus today! 🚀 #PomoProtocol #Productivity`;
      navigator.clipboard.writeText(text);
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.code === 'Space') {
      e.preventDefault();
      state.isRunning ? pauseTimer() : startTimer();
    }
  });
}

// --- Mascot Eye Tracking ---
function initMascotEyes() {
  const mascotArea = $('.mascot-area');
  if (!mascotArea) return;

  document.addEventListener('mousemove', (e) => {
    const eyes = $$('.mascot-eye');
    eyes.forEach(eye => {
      const rect = eye.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const x = Math.cos(angle) * 2;
      const y = Math.sin(angle) * 2;
      eye.style.setProperty('--eye-x', `${x}px`);
      eye.style.setProperty('--eye-y', `${y}px`);
    });
  });
}

// --- Particles ---
function createParticle() {
  const container = $('.mascot-container');
  if (!container) return;

  const particle = document.createElement('div');
  particle.style.cssText = `
    position: absolute; width: 4px; height: 4px; border-radius: 50%;
    background: var(--mode-accent); opacity: 0; pointer-events: none;
    left: ${50 + (Math.random() - 0.5) * 60}%;
    top: ${50 + (Math.random() - 0.5) * 60}%;
    animation: particle-float 2s ease-out forwards;
  `;
  container.appendChild(particle);
  setTimeout(() => particle.remove(), 2000);
}

const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes particle-float {
    0% { opacity: 0; transform: translate(0, 0) scale(0); }
    20% { opacity: 0.8; transform: translate(0, 0) scale(1); }
    100% { opacity: 0; transform: translate(${(Math.random() - 0.5) * 40}px, -30px) scale(0); }
  }
  .new-chat-refresh {
    animation: chat-refresh 0.5s ease-out;
  }
  @keyframes chat-refresh {
    0% { opacity: 0.3; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(particleStyle);
setInterval(createParticle, 3000);

// --- Hero Text Cycling ---
function initHeroCycling() {
  const el = $('#hero-cycling-text');
  if (!el) return;

  const keywords = ['Peak Flow', 'Pomo Mastery', 'Deep Focus', 'Cognitive Zen', 'Elite Productivity'];
  let index = 0;

  setInterval(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';

    setTimeout(() => {
      index = (index + 1) % keywords.length;
      el.textContent = keywords[index];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 500);
  }, 4000);
}

// --- Initialize Auth Modal and Dropdowns ---
function initAuthAndDropdowns() {
  console.log('Initializing auth modal and dropdowns...');
  
  // --- AUTH MODAL ---
  const authOverlay = $('#auth-overlay');
  console.log('Auth overlay found:', authOverlay);

  function resetEmailForm() {
    const authBody = $('.auth-body');
    const emailForm = $('#email-signup-form');
    if (authBody) authBody.classList.remove('form-active');
    if (emailForm) emailForm.classList.add('hidden');
    const authHeader = $('.auth-header h2');
    if (authHeader) authHeader.textContent = 'Welcome to Pomo';
    const authSubtext = $('.auth-header p');
    if (authSubtext) authSubtext.textContent = 'Log in or sign up to continue';
  }

  const openAuthModal = (e, forceTrial = false) => {
    if (e) e.preventDefault();
    console.log('Opening auth modal...');
    if (authOverlay) {
      resetEmailForm();
      if (!forceTrial) restoreAuthButtons();
      authOverlay.classList.remove('hidden');
      authOverlay.style.display = '';
      authOverlay.style.visibility = '';
      authOverlay.style.opacity = '';
      console.log('Auth modal opened');
    } else {
      console.error('Auth overlay not found!');
    }
  };

  window.openAuthModal = openAuthModal;

  const closeAuthModal = (e) => {
    if (e) e.preventDefault();
    console.log('closeAuthModal called');
    if (authOverlay) {
      resetEmailForm();
      authOverlay.classList.add('hidden');
      authOverlay.style.display = 'none';
      authOverlay.style.visibility = 'hidden';
      authOverlay.style.opacity = '0';
      console.log('Auth modal closed');
    } else {
      console.error('authOverlay element not found!');
    }
  };

  window.closeAuthModal = closeAuthModal;

  // Open triggers
  const btnLoginHeader = $('#btn-login');
  console.log('Sign-up button found:', btnLoginHeader);
  if (btnLoginHeader) {
    btnLoginHeader.addEventListener('click', openAuthModal);
    console.log('Sign-up button click handler attached');
  } else {
    console.error('Sign-up button not found! Looking for #btn-login');
  }

  const drLogin = $('#dr-login');
  if (drLogin) drLogin.addEventListener('click', openAuthModal);

  const TRIAL_DURATION = 5 * 60 * 1000;
  let guestTimerInterval = null;

  window.restoreAuthButtons = function() {
    const closeBtn = $('#close-auth');
    const skipBtn = $('.auth-guest-btn');
    const guestLink = $('.form-guest-link');
    if (closeBtn) closeBtn.style.display = '';
    if (skipBtn) skipBtn.style.display = '';
    if (guestLink) guestLink.style.display = '';
  };

  function updateGuestTimer() {
    const guestStart = localStorage.getItem('pomo-guest-start');
    const timerEl = $('#guest-timer');
    const minEl = $('#guest-timer-min');
    const secEl = $('#guest-timer-sec');
    const colonEl = $('#guest-timer-colon');
    const barEl = $('#guest-timer-bar');
    if (!guestStart || !timerEl || !minEl || !secEl) return;
    const remaining = Math.max(0, TRIAL_DURATION - (Date.now() - parseInt(guestStart)));
    const totalSec = Math.ceil(remaining / 1000);
    const displaySec = totalSec;
    const m = Math.floor(displaySec / 60);
    const s = displaySec % 60;
    minEl.textContent = m.toString().padStart(2, '0');
    secEl.textContent = s.toString().padStart(2, '0');
    if (colonEl) colonEl.style.opacity = (Math.floor(Date.now() / 500) % 2) ? '1' : '0.3';
    const pct = (remaining / TRIAL_DURATION) * 100;
    if (barEl) barEl.style.width = pct + '%';
    const colorLow = '#ef4444';
    const colorMid = '#f59e0b';
    const colorNorm = '#fbbf24';
    let color = colorNorm;
    let bg = 'rgba(0, 0, 0, 0.35)';
    let border = 'rgba(251, 191, 36, 0.15)';
    let barBg = 'linear-gradient(90deg, #fbbf24, #f59e0b)';
    let shadow = '0 0 6px rgba(251,191,36,0.5), 0 2px 3px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2)';
    if (totalSec <= 30) {
      color = colorLow; border = 'rgba(239, 68, 68, 0.3)';
      barBg = 'linear-gradient(90deg, #ef4444, #dc2626)';
      shadow = '0 0 6px rgba(239,68,68,0.5), 0 2px 3px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2)';
    } else if (totalSec <= 60) {
      color = colorMid; border = 'rgba(245, 158, 11, 0.25)';
      barBg = 'linear-gradient(90deg, #f59e0b, #d97706)';
      shadow = '0 0 6px rgba(245,158,11,0.5), 0 2px 3px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2)';
    }
    timerEl.style.background = bg;
    timerEl.style.borderColor = border;
    if (barEl) barEl.style.background = barBg;
    minEl.style.color = color;
    secEl.style.color = color;
    minEl.style.textShadow = shadow;
    secEl.style.textShadow = shadow;
    if (colonEl) {
      colonEl.style.color = color;
      colonEl.style.textShadow = shadow;
    }
  }

  window.showGuestTimer = function() {
    const timerEl = $('#guest-timer');
    const minEl = $('#guest-timer-min');
    const secEl = $('#guest-timer-sec');
    const colonEl = $('#guest-timer-colon');
    const barEl = $('#guest-timer-bar');
    if (timerEl) {
      timerEl.classList.remove('hidden');
      timerEl.style.background = '';
      timerEl.style.borderColor = '';
    }
    if (barEl) barEl.style.width = '100%';
    if (minEl) { minEl.style.color = ''; minEl.style.textShadow = ''; }
    if (secEl) { secEl.style.color = ''; secEl.style.textShadow = ''; }
    if (colonEl) { colonEl.style.color = ''; colonEl.style.textShadow = ''; }
    updateGuestTimer();
  };

  window.hideGuestTimer = function() {
    const timerEl = $('#guest-timer');
    const minEl = $('#guest-timer-min');
    const secEl = $('#guest-timer-sec');
    const colonEl = $('#guest-timer-colon');
    const barEl = $('#guest-timer-bar');
    if (timerEl) {
      timerEl.classList.add('hidden');
      timerEl.style.background = '';
      timerEl.style.borderColor = '';
    }
    if (barEl) barEl.style.width = '';
    if (minEl) { minEl.style.color = ''; minEl.style.textShadow = ''; }
    if (secEl) { secEl.style.color = ''; secEl.style.textShadow = ''; }
    if (colonEl) { colonEl.style.color = ''; colonEl.style.textShadow = ''; }
  };

  function startGuestSession() {
    const now = Date.now();
    localStorage.setItem('pomo-guest-start', now.toString());
    localStorage.setItem('pomo-user', JSON.stringify({ name: 'Guest', email: '', avatar: '👤', guest: true }));

    const headerUsername = $('.header-username');
    if (headerUsername) headerUsername.textContent = 'Guest';
    const headerAvatar = $('.header-avatar-v2 .avatar-emoji');
    if (headerAvatar) headerAvatar.textContent = '👤';

    const btnLogin = $('#btn-login');
    if (btnLogin) btnLogin.classList.add('hidden');
    const drLoginSpan = $('#dr-login span');
    if (drLoginSpan) drLoginSpan.textContent = 'Log Out';

    if (typeof config !== 'undefined') {
      config.user = { ...config.user, username: 'Guest', email: '', avatar: '👤', guest: true };
      saveConfig();
    }

    closeAuthModal();
    window.showGuestTimer();
    const mins = 5;
    showToast(`Guest mode activated! You have ${mins} minutes of free trial. ⏱️`, 'info');
    startGuestTrialMonitor();
  }

  window.startGuestTrialMonitor = function() {
    if (guestTimerInterval) clearInterval(guestTimerInterval);
    guestTimerInterval = setInterval(() => {
      const guestStart = localStorage.getItem('pomo-guest-start');
      if (!guestStart) { clearInterval(guestTimerInterval); guestTimerInterval = null; window.hideGuestTimer(); return; }
      const elapsed = Date.now() - parseInt(guestStart);
      updateGuestTimer();
      if (elapsed >= TRIAL_DURATION) {
        clearInterval(guestTimerInterval); guestTimerInterval = null;
        trialExpired();
      }
    }, 1000);
  };

  function trialExpired() {
    localStorage.removeItem('pomo-guest-start');
    localStorage.removeItem('pomo-user');

    window.hideGuestTimer();

    const btnLogin = $('#btn-login');
    if (btnLogin) btnLogin.classList.remove('hidden');
    const drLoginSpan = $('#dr-login span');
    if (drLoginSpan) drLoginSpan.textContent = 'Log In';
    const headerUsername = $('.header-username');
    if (headerUsername) headerUsername.textContent = 'User';
    const headerAvatar = $('.header-avatar-v2');
    if (headerAvatar) headerAvatar.innerHTML = '<span class="avatar-emoji">👤</span>';

    if (typeof config !== 'undefined') {
      config.user = { ...DEFAULTS.user };
      saveConfig();
    }

    showToast('Your free trial has ended! Please sign in to continue using Pomo. ⏰', 'warning');

    window._trialExpired = true;
    const closeBtn = $('#close-auth');
    const skipBtn = $('.auth-guest-btn');
    const guestLink = $('.form-guest-link');
    if (closeBtn) closeBtn.style.display = 'none';
    if (skipBtn) skipBtn.style.display = 'none';
    if (guestLink) guestLink.style.display = 'none';

    resetEmailForm();
    if (authOverlay) {
      authOverlay.classList.remove('hidden');
      authOverlay.style.display = '';
      authOverlay.style.visibility = '';
      authOverlay.style.opacity = '';
    }
  }

  // Close triggers
  const btnCloseAuth = $('#close-auth');
  if (btnCloseAuth) btnCloseAuth.addEventListener('click', closeAuthModal);

  const guestBtn = $('.auth-guest-btn');
  if (guestBtn) guestBtn.addEventListener('click', (e) => { e.preventDefault(); startGuestSession(); });

  const formGuestLink = $('.form-guest-link');
  if (formGuestLink) formGuestLink.addEventListener('click', (e) => { e.preventDefault(); startGuestSession(); });

  // User Profile Dropdown
  const btnProfile = $('#header-user-btn');
  const userDropdown = $('#user-dropdown');
  console.log('User profile button found:', btnProfile);
  console.log('User dropdown found:', userDropdown);
  
  if (btnProfile && userDropdown) {
    console.log('Adding click handler to user profile button');
    btnProfile.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('User profile button clicked');
      const isVisible = !userDropdown.classList.contains('hidden');
      console.log('Dropdown currently visible:', isVisible);
      if (isVisible) {
        userDropdown.classList.add('hidden');
        btnProfile.classList.remove('header-user-btn-active');
        console.log('Hiding dropdown');
      } else {
        userDropdown.classList.remove('hidden');
        btnProfile.classList.add('header-user-btn-active');
        console.log('Showing dropdown');
      }
    });

    document.addEventListener('click', (e) => {
      if (!btnProfile.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.add('hidden');
        btnProfile.classList.remove('header-user-btn-active');
      }
    });
  } else {
    console.error('User profile dropdown not working:');
    console.error('- btnProfile found:', !!btnProfile);
    console.error('- userDropdown found:', !!userDropdown);
  }
}

// --- Init ---
function init() {
  loadConfig();
  loadTasks();
  applyTranslation(config.language || 'en');

  // Check for successful OAuth login (returning from callback)
  const googleOAuthSuccess = localStorage.getItem('google-oauth-success');
  if (googleOAuthSuccess) {
    try {
      const userData = JSON.parse(googleOAuthSuccess);
      console.log('Google OAuth login successful:', userData);
      
      // Update UI with user info
      const headerUsername = $('.header-username');
      if (headerUsername) headerUsername.textContent = userData.name;
      
      const headerAvatar = $('.header-avatar-v2');
      if (headerAvatar) {
        if (userData.picture) {
          headerAvatar.innerHTML = '<img src="' + userData.picture + '" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">';
        } else {
          headerAvatar.innerHTML = '<span class="avatar-emoji">' + (userData.avatar || '👤') + '</span>';
        }
      }
      
      // Update UI state to "Logged In"
      const btnLogin = $('#btn-login');
      if (btnLogin) btnLogin.classList.add('hidden');
      
      const drLoginSpan = $('#dr-login span');
      if (drLoginSpan) drLoginSpan.textContent = 'Log Out';
      
      // Sync to main config so Profile Modal is updated
      if (typeof config !== 'undefined') {
        config.user = {
          ...config.user,
          username: userData.name,
          email: userData.email || '',
          bio: ''
        };
        saveConfig();
      }
      
      // Reset trial flag and restore buttons
      window._trialExpired = false;
      if (typeof window.restoreAuthButtons === 'function') window.restoreAuthButtons();
      
      // Show success message
      setTimeout(() => {
        showToast(`Welcome back, ${userData.name}! 🎉`);
      }, 500);
      
      // Clean up the success flag
      localStorage.removeItem('google-oauth-success');
    } catch (e) {
      console.error('Error processing OAuth success:', e);
    }
  }

  // Sync user info
  const hn = $('.header-username');
  if (hn && config.user) hn.textContent = config.user.username;

  // Set initial button text based on saved language
  const savedLangOpt = $(`.lang-option[data-lang="${config.language || 'en'}"]`);
  if (savedLangOpt) {
    $$('.lang-option').forEach(o => o.classList.remove('active'));
    savedLangOpt.classList.add('active');
    const btnSpan = $('#lang-selector-btn span');
    if (btnSpan) btnSpan.textContent = savedLangOpt.querySelector('.lang-name').textContent;
  }

  switchMode('pomodoro');

  // Restore saved theme
  const savedTheme = localStorage.getItem('pomo-theme');
  if (savedTheme && savedTheme !== 'default') {
    const themeClass = 'theme-' + savedTheme;
    if (document.body) document.body.classList.add(themeClass);
    const themeCard = document.querySelector('.theme-card[data-theme="' + savedTheme + '"]');
    if (themeCard) {
      document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
      themeCard.classList.add('active');
    }
  }

  // Ensure stats exist in storage
  if (!localStorage.getItem('pomo-stats')) {
    saveStats({});
  }

  updateSessionInfo();
  updateFocusMeter();
  renderTasks();
  initSidebar();
  bindEvents();
  initAuthAndDropdowns(); // Initialize auth modal and user dropdown

  // Check for existing guest session on page load
  const storedUser = localStorage.getItem('pomo-user');
  const guestStart = localStorage.getItem('pomo-guest-start');
  if (storedUser && guestStart) {
    const user = JSON.parse(storedUser);
    if (user.guest) {
      const elapsed = Date.now() - parseInt(guestStart);
      if (elapsed >= 5 * 60 * 1000) {
        localStorage.removeItem('pomo-guest-start');
        localStorage.removeItem('pomo-user');
      } else {
        const headerUsername = $('.header-username');
        if (headerUsername) headerUsername.textContent = 'Guest';
        const loginBtn = $('#btn-login');
        if (loginBtn) loginBtn.classList.add('hidden');
        const drLoginSpan = $('#dr-login span');
        if (drLoginSpan) drLoginSpan.textContent = 'Log Out';
        if (typeof window.showGuestTimer === 'function') window.showGuestTimer();
        if (typeof window.startGuestTrialMonitor === 'function') window.startGuestTrialMonitor();
      }
    }
  } else if (storedUser && !guestStart) {
    // Non-guest logged-in user (OAuth or regular login)
    const user = JSON.parse(storedUser);
    if (user && !user.guest) {
      const btnLogin = $('#btn-login');
      if (btnLogin && !btnLogin.classList.contains('hidden')) {
        btnLogin.classList.add('hidden');
      }
      const drLoginSpan = $('#dr-login span');
      if (drLoginSpan) drLoginSpan.textContent = 'Log Out';
    }
  }

  initMascotEyes();
  initSelfTests();
  initTherapist();
  initWellnessCorner();
  initHeroCycling();
  initCommunity();

  // Set initial ring state
  const ring = $('#timer-ring');
  if (ring) {
    ring.style.strokeDasharray = RING_CIRCUMFERENCE;
    ring.style.strokeDashoffset = 0;
  }

  // Ensure chat-toggle starts expanded
  const chatToggle = $('#chat-toggle');
  if (chatToggle && !chatToggle.classList.contains('expanded')) {
    chatToggle.classList.add('expanded');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  init();
});

