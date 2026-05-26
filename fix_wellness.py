import re

with open(r'd:\pomo\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the old 3 wellness sections
old_start = '      <!-- ═══ DAILY TIPS Section ═══ -->'
old_end = '      <!-- Tasks Section (hidden by default, shown via sidebar) -->'

start_idx = content.find(old_start)
end_idx = content.find(old_end)

if start_idx == -1 or end_idx == -1:
    print(f"ERROR: Could not find markers. start={start_idx}, end={end_idx}")
    exit(1)

new_sections = '''      <!-- ═══ AI JOURNAL Section ═══ -->
      <div id="ai-journal-section" class="content-section hidden">
        <div class="wc-section">
          <div class="wc-header">
            <h2>📓 AI Journal</h2>
            <p class="wc-subtitle">Your intelligent journaling companion — reflect, grow, and gain insights</p>
          </div>

          <div class="wc-two-col">
            <!-- Journal Entry -->
            <div class="aj-entry-card">
              <div class="aj-prompt-area">
                <p class="aj-prompt-label">✨ Today's Prompt</p>
                <p class="aj-prompt-text" id="aj-prompt">What made you smile today, no matter how small?</p>
                <button class="aj-new-prompt" id="aj-new-prompt">🔄 New Prompt</button>
              </div>
              <textarea class="aj-textarea" id="aj-textarea" placeholder="Start writing... Let your thoughts flow freely. There's no right or wrong way to journal." rows="8"></textarea>
              <div class="aj-entry-footer">
                <div class="aj-mood-row">
                  <span class="aj-mood-label">How you're feeling:</span>
                  <div class="aj-moods" id="aj-moods">
                    <button class="aj-mood-btn" data-mood="amazing" title="Amazing">🌟</button>
                    <button class="aj-mood-btn" data-mood="happy" title="Happy">😊</button>
                    <button class="aj-mood-btn" data-mood="calm" title="Calm">😌</button>
                    <button class="aj-mood-btn" data-mood="neutral" title="Neutral">😐</button>
                    <button class="aj-mood-btn" data-mood="anxious" title="Anxious">😰</button>
                    <button class="aj-mood-btn" data-mood="sad" title="Sad">😢</button>
                  </div>
                </div>
                <button class="aj-save-btn" id="aj-save-btn">💾 Save Entry</button>
              </div>
            </div>

            <!-- Journal History -->
            <div class="aj-history-card">
              <h4>📅 Past Entries</h4>
              <div class="aj-entries" id="aj-entries">
                <div class="aj-empty">Start your journaling journey above! ✍️</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ FOCUS ZONE Section ═══ -->
      <div id="focus-zone-section" class="content-section hidden">
        <div class="wc-section">
          <div class="wc-header">
            <h2>🎯 Focus Zone</h2>
            <p class="wc-subtitle">Immerse yourself in deep focus — ambient sounds, breathing exercises &amp; distraction-free mode</p>
          </div>

          <!-- Ambient Sounds -->
          <div class="fz-sounds-card">
            <h4>🔊 Ambient Sounds</h4>
            <p class="fz-desc">Mix sounds to create your perfect focus environment</p>
            <div class="fz-sounds-grid">
              <div class="fz-sound-item" data-sound="rain">
                <div class="fz-sound-icon">🌧️</div>
                <span>Rain</span>
                <input type="range" class="fz-volume" min="0" max="100" value="0" />
              </div>
              <div class="fz-sound-item" data-sound="forest">
                <div class="fz-sound-icon">🌲</div>
                <span>Forest</span>
                <input type="range" class="fz-volume" min="0" max="100" value="0" />
              </div>
              <div class="fz-sound-item" data-sound="ocean">
                <div class="fz-sound-icon">🌊</div>
                <span>Ocean</span>
                <input type="range" class="fz-volume" min="0" max="100" value="0" />
              </div>
              <div class="fz-sound-item" data-sound="fire">
                <div class="fz-sound-icon">🔥</div>
                <span>Fireplace</span>
                <input type="range" class="fz-volume" min="0" max="100" value="0" />
              </div>
              <div class="fz-sound-item" data-sound="birds">
                <div class="fz-sound-icon">🐦</div>
                <span>Birds</span>
                <input type="range" class="fz-volume" min="0" max="100" value="0" />
              </div>
              <div class="fz-sound-item" data-sound="wind">
                <div class="fz-sound-icon">💨</div>
                <span>Wind</span>
                <input type="range" class="fz-volume" min="0" max="100" value="0" />
              </div>
            </div>
          </div>

          <div class="fz-two-col">
            <!-- Breathing Exercise -->
            <div class="fz-breathing-card">
              <h4>🫁 Breathing Exercise</h4>
              <div class="fz-breath-circle" id="fz-breath-circle">
                <div class="fz-breath-ring"></div>
                <span class="fz-breath-text" id="fz-breath-text">Start</span>
              </div>
              <div class="fz-breath-controls">
                <select class="fz-breath-select" id="fz-breath-select">
                  <option value="box">Box Breathing (4-4-4-4)</option>
                  <option value="478">4-7-8 Relaxing Breath</option>
                  <option value="deep">Deep Breathing (5-5)</option>
                </select>
                <button class="fz-breath-start" id="fz-breath-start">▶ Start</button>
              </div>
            </div>

            <!-- Focus Stats -->
            <div class="fz-stats-card">
              <h4>📊 Focus Stats</h4>
              <div class="fz-stat-items">
                <div class="fz-stat">
                  <span class="fz-stat-value" id="fz-today-mins">0</span>
                  <span class="fz-stat-label">Minutes Today</span>
                </div>
                <div class="fz-stat">
                  <span class="fz-stat-value" id="fz-streak">0</span>
                  <span class="fz-stat-label">Day Streak 🔥</span>
                </div>
                <div class="fz-stat">
                  <span class="fz-stat-value" id="fz-total-sessions">0</span>
                  <span class="fz-stat-label">Total Sessions</span>
                </div>
              </div>
              <div class="fz-quote">
                <p id="fz-quote-text">"The successful warrior is the average man, with laser-like focus."</p>
                <span class="fz-quote-author">— Bruce Lee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ SELF CARE Section ═══ -->
      <div id="self-care-section" class="content-section hidden">
        <div class="wc-section">
          <div class="wc-header">
            <h2>💖 Self Care</h2>
            <p class="wc-subtitle">Nurture your mind, body &amp; soul — daily rituals that transform your wellbeing</p>
          </div>

          <!-- Daily Affirmation -->
          <div class="sc-affirmation-card">
            <div class="sc-aff-glow"></div>
            <p class="sc-aff-label">🌸 Today's Affirmation</p>
            <p class="sc-aff-text" id="sc-aff-text">I am worthy of love, peace, and happiness. I choose to nurture myself today.</p>
            <button class="sc-aff-btn" id="sc-new-aff">✨ New Affirmation</button>
          </div>

          <!-- Self Care Checklist -->
          <div class="sc-checklist-card">
            <h4>✅ Daily Self Care Checklist</h4>
            <p class="sc-check-desc">Check off what you've done today. Small steps count!</p>
            <div class="sc-check-grid" id="sc-check-grid">
              <label class="sc-check-item"><input type="checkbox" /><span class="sc-check-icon">💧</span><span>Drank 8 glasses of water</span></label>
              <label class="sc-check-item"><input type="checkbox" /><span class="sc-check-icon">🧘</span><span>Meditated / Deep breathing</span></label>
              <label class="sc-check-item"><input type="checkbox" /><span class="sc-check-icon">🚶</span><span>30 minutes of movement</span></label>
              <label class="sc-check-item"><input type="checkbox" /><span class="sc-check-icon">📖</span><span>Read something inspiring</span></label>
              <label class="sc-check-item"><input type="checkbox" /><span class="sc-check-icon">🥗</span><span>Ate a healthy meal</span></label>
              <label class="sc-check-item"><input type="checkbox" /><span class="sc-check-icon">😴</span><span>Got 7+ hours of sleep</span></label>
              <label class="sc-check-item"><input type="checkbox" /><span class="sc-check-icon">💬</span><span>Connected with a loved one</span></label>
              <label class="sc-check-item"><input type="checkbox" /><span class="sc-check-icon">🎨</span><span>Did something creative</span></label>
              <label class="sc-check-item"><input type="checkbox" /><span class="sc-check-icon">🌿</span><span>Spent time in nature</span></label>
              <label class="sc-check-item"><input type="checkbox" /><span class="sc-check-icon">📝</span><span>Wrote in my journal</span></label>
            </div>
            <div class="sc-check-progress">
              <div class="sc-progress-bar"><div class="sc-progress-fill" id="sc-progress-fill"></div></div>
              <span class="sc-progress-text" id="sc-progress-text">0/10 completed</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ MUSIC Section ═══ -->
      <div id="wc-music-section" class="content-section hidden">
        <div class="wc-section">
          <div class="wc-header">
            <h2>🎵 Music &amp; Sounds</h2>
            <p class="wc-subtitle">Curated playlists to help you focus, relax, and recharge your mind</p>
          </div>

          <div class="mu-categories">
            <button class="mu-cat active" data-cat="all">All</button>
            <button class="mu-cat" data-cat="focus">🎯 Focus</button>
            <button class="mu-cat" data-cat="relax">🧘 Relaxation</button>
            <button class="mu-cat" data-cat="sleep">😴 Sleep</button>
            <button class="mu-cat" data-cat="nature">🌿 Nature</button>
            <button class="mu-cat" data-cat="motivate">⚡ Motivation</button>
          </div>

          <div class="mu-grid" id="mu-grid">
            <div class="mu-card" data-cat="focus">
              <div class="mu-card-visual mu-v-focus">🎹</div>
              <h4>Deep Focus</h4>
              <p>Lo-fi beats & ambient textures for maximum concentration</p>
              <div class="mu-card-footer"><span class="mu-duration">∞ Continuous</span><button class="mu-play-btn">▶ Play</button></div>
            </div>
            <div class="mu-card" data-cat="relax">
              <div class="mu-card-visual mu-v-relax">🎶</div>
              <h4>Calm Waves</h4>
              <p>Gentle piano melodies with soft ocean waves in the background</p>
              <div class="mu-card-footer"><span class="mu-duration">45 min</span><button class="mu-play-btn">▶ Play</button></div>
            </div>
            <div class="mu-card" data-cat="nature">
              <div class="mu-card-visual mu-v-nature">🌲</div>
              <h4>Forest Morning</h4>
              <p>Birds chirping, leaves rustling, and a gentle stream flowing</p>
              <div class="mu-card-footer"><span class="mu-duration">60 min</span><button class="mu-play-btn">▶ Play</button></div>
            </div>
            <div class="mu-card" data-cat="sleep">
              <div class="mu-card-visual mu-v-sleep">🌙</div>
              <h4>Dream Drift</h4>
              <p>Ethereal soundscapes designed to guide you into restful sleep</p>
              <div class="mu-card-footer"><span class="mu-duration">90 min</span><button class="mu-play-btn">▶ Play</button></div>
            </div>
            <div class="mu-card" data-cat="motivate">
              <div class="mu-card-visual mu-v-motivate">🔥</div>
              <h4>Power Up</h4>
              <p>Energizing beats and uplifting melodies to fuel your drive</p>
              <div class="mu-card-footer"><span class="mu-duration">30 min</span><button class="mu-play-btn">▶ Play</button></div>
            </div>
            <div class="mu-card" data-cat="focus">
              <div class="mu-card-visual mu-v-focus2">☕</div>
              <h4>Coffee Shop</h4>
              <p>Ambient café sounds with muted chatter and espresso machines</p>
              <div class="mu-card-footer"><span class="mu-duration">∞ Continuous</span><button class="mu-play-btn">▶ Play</button></div>
            </div>
            <div class="mu-card" data-cat="relax">
              <div class="mu-card-visual mu-v-relax2">🎻</div>
              <h4>Healing Strings</h4>
              <p>Classical strings and soft harp for deep emotional release</p>
              <div class="mu-card-footer"><span class="mu-duration">50 min</span><button class="mu-play-btn">▶ Play</button></div>
            </div>
            <div class="mu-card" data-cat="nature">
              <div class="mu-card-visual mu-v-nature2">🌧️</div>
              <h4>Rainy Window</h4>
              <p>Rain on glass with distant thunder — the coziest sound</p>
              <div class="mu-card-footer"><span class="mu-duration">∞ Continuous</span><button class="mu-play-btn">▶ Play</button></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ WORKSHEETS Section ═══ -->
      <div id="worksheets-section" class="content-section hidden">
        <div class="wc-section">
          <div class="wc-header">
            <h2>📋 Worksheets</h2>
            <p class="wc-subtitle">Evidence-based exercises for mental clarity, emotional resilience &amp; personal growth</p>
          </div>

          <div class="ws-grid" id="ws-grid">
            <div class="ws-card ws-card-purple">
              <div class="ws-card-badge">Popular</div>
              <div class="ws-card-icon">🧠</div>
              <h4>CBT Thought Record</h4>
              <p>Challenge negative thoughts with this cognitive behavioral therapy worksheet. Identify, examine, and reframe.</p>
              <div class="ws-card-meta"><span>📝 15 min</span><span>🏷️ CBT</span></div>
              <button class="ws-start-btn" data-ws="cbt">Start Worksheet →</button>
            </div>
            <div class="ws-card ws-card-teal">
              <div class="ws-card-icon">🙏</div>
              <h4>Gratitude Reflection</h4>
              <p>Shift your focus to abundance. Write 5 things you're grateful for and why they matter to you.</p>
              <div class="ws-card-meta"><span>📝 10 min</span><span>🏷️ Positive Psychology</span></div>
              <button class="ws-start-btn" data-ws="gratitude">Start Worksheet →</button>
            </div>
            <div class="ws-card ws-card-pink">
              <div class="ws-card-icon">😤</div>
              <h4>Emotion Wheel</h4>
              <p>Expand your emotional vocabulary. Identify subtle feelings beyond "good" or "bad".</p>
              <div class="ws-card-meta"><span>📝 10 min</span><span>🏷️ Emotional Intelligence</span></div>
              <button class="ws-start-btn" data-ws="emotion">Start Worksheet →</button>
            </div>
            <div class="ws-card ws-card-amber">
              <div class="ws-card-icon">🎯</div>
              <h4>Goal Setting (SMART)</h4>
              <p>Define Specific, Measurable, Achievable, Relevant, Time-bound goals for real progress.</p>
              <div class="ws-card-meta"><span>📝 20 min</span><span>🏷️ Productivity</span></div>
              <button class="ws-start-btn" data-ws="smart">Start Worksheet →</button>
            </div>
            <div class="ws-card ws-card-ocean">
              <div class="ws-card-icon">🌊</div>
              <h4>Stress Inventory</h4>
              <p>Map your stress triggers, rate their intensity, and plan coping strategies for each one.</p>
              <div class="ws-card-meta"><span>📝 15 min</span><span>🏷️ Stress Management</span></div>
              <button class="ws-start-btn" data-ws="stress">Start Worksheet →</button>
            </div>
            <div class="ws-card ws-card-green">
              <div class="ws-card-icon">💪</div>
              <h4>Self-Compassion Letter</h4>
              <p>Write a kind letter to yourself as you would to a dear friend going through a hard time.</p>
              <div class="ws-card-meta"><span>📝 15 min</span><span>🏷️ Self-Compassion</span></div>
              <button class="ws-start-btn" data-ws="compassion">Start Worksheet →</button>
            </div>
          </div>
        </div>
      </div>

'''

content = content[:start_idx] + new_sections + content[end_idx:]

with open(r'd:\pomo\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS: Replaced old 3 sections with 5 new wellness sections")
