from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)
    label = db.Column(db.String(100), default='Untitled')
    mode = db.Column(db.String(20), default='pomodoro')
    duration_mins = db.Column(db.Integer, default=25)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50))
    text = db.Column(db.String(200))
    done = db.Column(db.Boolean, default=False)

class Reminder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50))
    text = db.Column(db.String(200))
    remind_time = db.Column(db.String(10))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.String(50))
    username = db.Column(db.String(50))
    message = db.Column(db.Text)
    file_url = db.Column(db.String(300), nullable=True)
    file_name = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
