
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)

class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    current_player = db.Column(db.Integer, nullable=False)
    state = db.Column(db.PickleType(protocol=3), nullable=False)
