with open(r'd:\pomo\style.css', 'r', encoding='utf-8') as f:
    content = f.read()

old_start = '/* ═══ Wellness Corner Shared Styles ═══ */'
old_end = '/* TH Header */'

start_idx = content.find(old_start)
end_idx = content.find(old_end)

if start_idx == -1 or end_idx == -1:
    print(f"ERROR: start={start_idx}, end={end_idx}")
    exit(1)

new_css = '''/* ═══ Wellness Corner Shared Styles ═══ */
.wc-section {
  padding: 30px;
  max-width: 1100px;
  margin: 0 auto;
}

.wc-header h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.wc-subtitle {
  font-size: 0.92rem;
  color: var(--text-muted);
  margin-bottom: 28px;
}

.wc-two-col {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
}

@media (max-width: 768px) {
  .wc-two-col { grid-template-columns: 1fr; }
}

/* ── AI Journal ── */
.aj-entry-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 28px;
}

.aj-prompt-area {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(233, 30, 140, 0.05));
  border: 1px solid rgba(168, 85, 247, 0.15);
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 20px;
}

.aj-prompt-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--accent-purple);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.aj-prompt-text {
  font-size: 1.05rem;
  color: var(--text-primary);
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 10px;
}

.aj-new-prompt {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(168, 85, 247, 0.2);
  background: transparent;
  color: var(--accent-purple);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
}

.aj-new-prompt:hover {
  background: rgba(168, 85, 247, 0.1);
  border-color: var(--accent-purple);
}

.aj-textarea {
  width: 100%;
  min-height: 180px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
  color: var(--text-primary);
  padding: 16px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: border-color 0.3s;
  margin-bottom: 16px;
  line-height: 1.7;
}

.aj-textarea:focus {
  border-color: rgba(168, 85, 247, 0.4);
}

.aj-entry-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.aj-mood-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.aj-mood-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.aj-moods {
  display: flex;
  gap: 6px;
}

.aj-mood-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.08);
  background: transparent;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.aj-mood-btn:hover { transform: scale(1.15); border-color: rgba(233, 30, 140, 0.3); }
.aj-mood-btn.active { transform: scale(1.2); border-color: var(--accent-pink); background: rgba(233, 30, 140, 0.12); box-shadow: 0 0 14px rgba(233, 30, 140, 0.2); }

.aj-save-btn {
  padding: 12px 28px;
  border-radius: var(--radius-full);
  border: none;
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
  color: white;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition);
  box-shadow: 0 4px 18px rgba(168, 85, 247, 0.25);
}

.aj-save-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(168, 85, 247, 0.35); }

.aj-history-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 24px;
}

.aj-history-card h4 { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; }

.aj-entries { display: flex; flex-direction: column; gap: 12px; max-height: 450px; overflow-y: auto; }
.aj-entries::-webkit-scrollbar { width: 4px; }
.aj-entries::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

.aj-empty { color: var(--text-dim); text-align: center; padding: 30px; font-size: 0.88rem; }

.aj-entry-item {
  padding: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  animation: st-fade-in 0.3s ease;
}

.aj-entry-item .aj-entry-mood { font-size: 1.2rem; float: right; }
.aj-entry-item .aj-entry-text { font-size: 0.83rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 6px; }
.aj-entry-item .aj-entry-date { font-size: 0.72rem; color: var(--text-dim); }

/* ── Focus Zone ── */
.fz-sounds-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
}

.fz-sounds-card h4 { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
.fz-desc { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 20px; }

.fz-sounds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 14px;
}

.fz-sound-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s;
}

.fz-sound-item:hover { border-color: rgba(45, 212, 168, 0.25); }
.fz-sound-item.active { border-color: var(--accent-teal); background: rgba(45, 212, 168, 0.06); }
.fz-sound-icon { font-size: 2rem; margin-bottom: 8px; }
.fz-sound-item span { display: block; font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 10px; font-weight: 500; }

.fz-volume {
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
}

.fz-volume::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-teal);
  cursor: pointer;
  box-shadow: 0 0 8px rgba(45, 212, 168, 0.3);
}

.fz-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 768px) { .fz-two-col { grid-template-columns: 1fr; } }

.fz-breathing-card, .fz-stats-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 28px;
}

.fz-breathing-card h4, .fz-stats-card h4 { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 20px; }

.fz-breath-circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 3px solid rgba(45, 212, 168, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.fz-breath-circle.active { border-color: var(--accent-teal); box-shadow: 0 0 30px rgba(45, 212, 168, 0.15); }
.fz-breath-circle.inhale { animation: fz-inhale 4s ease-in-out; }
.fz-breath-circle.exhale { animation: fz-exhale 4s ease-in-out; }

@keyframes fz-inhale { from { transform: scale(1); } to { transform: scale(1.25); } }
@keyframes fz-exhale { from { transform: scale(1.25); } to { transform: scale(1); } }

.fz-breath-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 2px solid rgba(45, 212, 168, 0.1);
}

.fz-breath-text { font-size: 1.1rem; font-weight: 700; color: var(--accent-teal); }

.fz-breath-controls { display: flex; gap: 10px; justify-content: center; }

.fz-breath-select {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
  color: var(--text-primary);
  font-size: 0.82rem;
  font-family: inherit;
  outline: none;
}

.fz-breath-select option { background: var(--bg-primary); color: var(--text-primary); }

.fz-breath-start {
  padding: 10px 20px;
  border-radius: var(--radius-full);
  border: none;
  background: linear-gradient(135deg, var(--accent-teal), #0d9488);
  color: white;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all var(--transition);
}

.fz-breath-start:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(45, 212, 168, 0.3); }

.fz-stat-items { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }

.fz-stat {
  text-align: center;
  padding: 16px 8px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.fz-stat-value { display: block; font-size: 1.6rem; font-weight: 800; color: var(--accent-teal); margin-bottom: 4px; }
.fz-stat-label { font-size: 0.72rem; color: var(--text-muted); }

.fz-quote {
  background: linear-gradient(135deg, rgba(45, 212, 168, 0.06), rgba(168, 85, 247, 0.04));
  border-radius: 12px;
  padding: 16px;
  border-left: 3px solid var(--accent-teal);
}

.fz-quote p { font-size: 0.88rem; color: var(--text-secondary); font-style: italic; line-height: 1.5; margin-bottom: 6px; }
.fz-quote-author { font-size: 0.78rem; color: var(--text-muted); font-weight: 600; }

/* ── Self Care ── */
.sc-affirmation-card {
  position: relative;
  background: linear-gradient(135deg, rgba(233, 30, 140, 0.08), rgba(168, 85, 247, 0.06));
  border: 1px solid rgba(233, 30, 140, 0.15);
  border-radius: 24px;
  padding: 36px;
  margin-bottom: 28px;
  text-align: center;
  overflow: hidden;
}

.sc-aff-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(233, 30, 140, 0.15), transparent);
  border-radius: 50%;
  top: -60px;
  right: -40px;
  pointer-events: none;
}

.sc-aff-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--accent-pink);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 14px;
}

.sc-aff-text {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 20px;
}

.sc-aff-btn {
  padding: 10px 24px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(233, 30, 140, 0.25);
  background: transparent;
  color: var(--accent-pink);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
}

.sc-aff-btn:hover { background: rgba(233, 30, 140, 0.1); border-color: var(--accent-pink); }

.sc-checklist-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 28px;
}

.sc-checklist-card h4 { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
.sc-check-desc { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 20px; }

.sc-check-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.sc-check-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.sc-check-item:hover { border-color: rgba(45, 212, 168, 0.2); background: rgba(255, 255, 255, 0.04); }
.sc-check-item:has(input:checked) { border-color: rgba(45, 212, 168, 0.3); background: rgba(45, 212, 168, 0.06); }
.sc-check-item:has(input:checked) span { text-decoration: line-through; opacity: 0.7; }

.sc-check-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--accent-teal);
  cursor: pointer;
}

.sc-check-icon { font-size: 1.1rem; }

.sc-check-progress { display: flex; align-items: center; gap: 14px; }

.sc-progress-bar {
  flex: 1;
  height: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.sc-progress-fill {
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--accent-teal), var(--accent-purple));
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  width: 0%;
}

.sc-progress-text { font-size: 0.82rem; color: var(--text-muted); font-weight: 600; white-space: nowrap; }

/* ── Music ── */
.mu-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.mu-cat {
  padding: 8px 18px;
  border-radius: var(--radius-full);
  border: 1px solid var(--surface-border);
  background: transparent;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
}

.mu-cat:hover { border-color: rgba(168, 85, 247, 0.4); color: var(--accent-purple); }

.mu-cat.active {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(233, 30, 140, 0.08));
  border-color: rgba(168, 85, 247, 0.35);
  color: var(--accent-purple);
  font-weight: 600;
}

.mu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

.mu-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.3s;
}

.mu-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3); border-color: rgba(168, 85, 247, 0.2); }

.mu-card-visual {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}

.mu-v-focus { background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(59, 130, 246, 0.08)); }
.mu-v-focus2 { background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(99, 102, 241, 0.08)); }
.mu-v-relax { background: linear-gradient(135deg, rgba(45, 212, 168, 0.12), rgba(16, 185, 129, 0.08)); }
.mu-v-relax2 { background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.06)); }
.mu-v-nature { background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(16, 185, 129, 0.08)); }
.mu-v-nature2 { background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(99, 102, 241, 0.08)); }
.mu-v-sleep { background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08)); }
.mu-v-motivate { background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(239, 68, 68, 0.08)); }

.mu-card h4 { font-size: 1rem; font-weight: 700; color: var(--text-primary); padding: 14px 18px 4px; }
.mu-card p { font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; padding: 0 18px 12px; }

.mu-card-footer { display: flex; align-items: center; justify-content: space-between; padding: 0 18px 16px; }
.mu-duration { font-size: 0.75rem; color: var(--text-dim); }

.mu-play-btn {
  padding: 8px 18px;
  border-radius: var(--radius-full);
  border: none;
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
  color: white;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition);
}

.mu-play-btn:hover { transform: scale(1.05); box-shadow: 0 4px 14px rgba(168, 85, 247, 0.3); }
.mu-play-btn.playing { background: linear-gradient(135deg, #ef4444, #dc2626); }

/* ── Worksheets ── */
.ws-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 20px;
}

.ws-card {
  position: relative;
  border-radius: 20px;
  padding: 28px;
  transition: all 0.3s;
  overflow: hidden;
}

.ws-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3); }

.ws-card-purple { background: linear-gradient(165deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.04)); border: 1px solid rgba(168, 85, 247, 0.15); }
.ws-card-teal { background: linear-gradient(165deg, rgba(45, 212, 168, 0.1), rgba(16, 185, 129, 0.04)); border: 1px solid rgba(45, 212, 168, 0.15); }
.ws-card-pink { background: linear-gradient(165deg, rgba(233, 30, 140, 0.1), rgba(219, 39, 119, 0.04)); border: 1px solid rgba(233, 30, 140, 0.15); }
.ws-card-amber { background: linear-gradient(165deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.04)); border: 1px solid rgba(245, 158, 11, 0.15); }
.ws-card-ocean { background: linear-gradient(165deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.04)); border: 1px solid rgba(59, 130, 246, 0.15); }
.ws-card-green { background: linear-gradient(165deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.04)); border: 1px solid rgba(34, 197, 94, 0.15); }

.ws-card-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-purple));
  color: white;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
}

.ws-card-icon { font-size: 2.2rem; margin-bottom: 14px; }

.ws-card h4 { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
.ws-card p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px; }

.ws-card-meta {
  display: flex;
  gap: 14px;
  margin-bottom: 18px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.ws-start-btn {
  width: 100%;
  padding: 12px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
}

.ws-start-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

'''

content = content[:start_idx] + new_css + content[end_idx:]

with open(r'd:\pomo\style.css', 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS: Replaced old wellness CSS with new 5-section CSS")
