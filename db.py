
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

from sqlalchemy.schema import ForeignKeyConstraint

db = SQLAlchemy()
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=False, nullable=False)

class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(120), unique=True, nullable=False)
    map_name = db.Column(db.String(120), unique=False, nullable=False)

    state = db.Column(db.PickleType(protocol=3), nullable=False)
    active_team = db.Column(db.Integer, nullable=False, default=0)

    num_players = db.Column(db.Integer, nullable=False, default=0)

class UserGames(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    game_id = db.Column(db.Integer, db.ForeignKey("game.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    team = db.Column(db.Integer, nullable=False)
