from flask import Flask, render_template, request, jsonify, session
from flask_socketio import SocketIO, join_room, leave_room, emit
from models import db, Session as FocusSession, Todo, Reminder, ChatMessage
import os, uuid
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SECRET_KEY'] = 'focusforge-secret-2026-change-this'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///focusforge.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db.init_app(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Track online users per room
room_users = {}

with app.app_context():
    db.create_all()

# ── PAGES ──────────────────────────────────────────────────────────────────────
@app.route('/')
def index():
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
    return render_template('index.html')

@app.route('/room')
def room_lobby():
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
    return render_template('room_lobby.html')

@app.route('/room/<room_id>')
def study_room(room_id):
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
    return render_template('room.html', room_id=room_id)

# ── SESSIONS API ───────────────────────────────────────────────────────────────
@app.route('/api/sessions', methods=['GET', 'POST'])
def sessions_api():
    uid = session.get('user_id', 'anon')
    if request.method == 'POST':
        d = request.json or {}
        s = FocusSession(
            user_id=uid,
            label=d.get('label', 'Untitled'),
            mode=d.get('mode', 'custom'),
            duration_mins=d.get('mins', 0)
        )
        db.session.add(s)
        db.session.commit()
        return jsonify({'id': s.id})
    rows = FocusSession.query.filter_by(user_id=uid) \
                             .order_by(FocusSession.created_at.desc()) \
                             .limit(50).all()
    return jsonify([{
        'id': r.id,
        'label': r.label,
        'mode': r.mode,
        'mins': r.duration_mins,
        'ts': r.created_at.isoformat()
    } for r in rows])

@app.route('/api/sessions/<int:sid>', methods=['DELETE'])
def delete_session(sid):
    uid = session.get('user_id', 'anon')
    s = FocusSession.query.filter_by(id=sid, user_id=uid).first()
    if s:
        db.session.delete(s)
        db.session.commit()
    return jsonify({'ok': True})

# ── TODOS API ──────────────────────────────────────────────────────────────────
@app.route('/api/todos', methods=['GET', 'POST'])
def todos_api():
    uid = session.get('user_id', 'anon')
    if request.method == 'POST':
        d = request.json or {}
        t = Todo(user_id=uid, text=d.get('text', ''), done=False)
        db.session.add(t)
        db.session.commit()
        return jsonify({'id': t.id, 'text': t.text, 'done': t.done})
    rows = Todo.query.filter_by(user_id=uid).all()
    return jsonify([{'id': r.id, 'text': r.text, 'done': r.done} for r in rows])

@app.route('/api/todos/<int:tid>', methods=['PATCH', 'DELETE'])
def todo_item(tid):
    uid = session.get('user_id', 'anon')
    t = Todo.query.filter_by(id=tid, user_id=uid).first()
    if not t:
        return jsonify({'error': 'Not found'}), 404
    if request.method == 'PATCH':
        d = request.json or {}
        if 'done' in d:
            t.done = d['done']
        if 'text' in d:
            t.text = d['text']
        db.session.commit()
        return jsonify({'id': t.id, 'text': t.text, 'done': t.done})
    db.session.delete(t)
    db.session.commit()
    return jsonify({'ok': True})

# ── REMINDERS API ──────────────────────────────────────────────────────────────
@app.route('/api/reminders', methods=['GET', 'POST'])
def reminders_api():
    uid = session.get('user_id', 'anon')
    if request.method == 'POST':
        d = request.json or {}
        r = Reminder(user_id=uid, text=d.get('text', ''), remind_time=d.get('time', ''))
        db.session.add(r)
        db.session.commit()
        return jsonify({'id': r.id})
    rows = Reminder.query.filter_by(user_id=uid).all()
    return jsonify([{'id': r.id, 'text': r.text, 'time': r.remind_time} for r in rows])

@app.route('/api/reminders/<int:rid>', methods=['DELETE'])
def delete_reminder(rid):
    uid = session.get('user_id', 'anon')
    r = Reminder.query.filter_by(id=rid, user_id=uid).first()
    if r:
        db.session.delete(r)
        db.session.commit()
    return jsonify({'ok': True})

# ── REPORTS API ────────────────────────────────────────────────────────────────
@app.route('/api/report/<period>')
def report(period):
    uid = session.get('user_id', 'anon')
    now = datetime.utcnow()
    if period == 'weekly':
        since = now - timedelta(days=7)
    elif period == 'monthly':
        since = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    elif period == 'yearly':
        since = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    else:
        since = now - timedelta(days=7)

    rows = FocusSession.query.filter(
        FocusSession.user_id == uid,
        FocusSession.created_at >= since
    ).all()
    total_mins = sum(r.duration_mins for r in rows)
    by_label = {}
    for r in rows:
        by_label[r.label] = by_label.get(r.label, 0) + r.duration_mins
    return jsonify({
        'sessions': len(rows),
        'total_mins': total_mins,
        'hours': round(total_mins / 60, 1),
        'period': period,
        'by_label': by_label
    })

# ── FILE UPLOAD ────────────────────────────────────────────────────────────────
@app.route('/api/upload', methods=['POST'])
def upload():
    f = request.files.get('file')
    if not f:
        return jsonify({'error': 'No file'}), 400
    ext = os.path.splitext(f.filename)[1]
    filename = str(uuid.uuid4()) + ext
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    f.save(save_path)
    return jsonify({'url': f'/static/uploads/{filename}', 'name': f.filename})

# ── WEBSOCKET: STUDY ROOM ──────────────────────────────────────────────────────
@socketio.on('join_room')
def on_join(data):
    room = data['room']
    name = data.get('username', 'Anonymous')
    join_room(room)
    if room not in room_users:
        room_users[room] = {}
    room_users[room][request.sid] = name
    emit('user_joined', {'username': name, 'count': len(room_users[room])}, to=room)
    # Send last 50 messages
    msgs = ChatMessage.query.filter_by(room_id=room) \
                            .order_by(ChatMessage.created_at.asc()) \
                            .limit(50).all()
    emit('chat_history', [{
        'username': m.username,
        'message': m.message,
        'file_url': m.file_url,
        'file_name': m.file_name,
        'ts': m.created_at.isoformat()
    } for m in msgs])
    emit('room_users', {'users': list(room_users[room].values()), 'count': len(room_users[room])}, to=room)

@socketio.on('disconnect')
def on_disconnect():
    for room, users in room_users.items():
        if request.sid in users:
            name = users.pop(request.sid)
            emit('user_left', {'username': name, 'count': len(users)}, to=room)
            emit('room_users', {'users': list(users.values()), 'count': len(users)}, to=room)
            break

@socketio.on('send_message')
def on_message(data):
    room = data['room']
    msg = ChatMessage(
        room_id=room,
        username=data.get('username', 'Anonymous'),
        message=data.get('message', ''),
        file_url=data.get('file_url'),
        file_name=data.get('file_name')
    )
    db.session.add(msg)
    db.session.commit()
    emit('new_message', {
        'username': data.get('username', 'Anonymous'),
        'message': data.get('message', ''),
        'file_url': data.get('file_url'),
        'file_name': data.get('file_name'),
        'ts': msg.created_at.isoformat()
    }, to=room)

@socketio.on('timer_update')
def on_timer(data):
    room = data.get('room')
    if room:
        emit('peer_timer', data, to=room, include_self=False)

@socketio.on('typing')
def on_typing(data):
    room = data.get('room')
    if room:
        emit('user_typing', {'username': data.get('username')}, to=room, include_self=False)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
