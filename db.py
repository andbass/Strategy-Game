
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)

    current_game_id = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=True)
    current_game = db.relationship('Game', backref=db.backref('players', lazy=True))

    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)

class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)

    active_player_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    active_player = db.relationship('Player')

    state = db.Column(db.PickleType(protocol=3), nullable=False)
