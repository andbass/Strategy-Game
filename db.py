
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

from sqlalchemy.schema import ForeignKeyConstraint

db = SQLAlchemy()
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=False, nullable=False)

    def get_game(self):
        usergame = UserGames.query.filter_by(user_id=self.id).first()
        if usergame is None:
            return None

        return Game.query.get(usergame.game_id)

    def get_team(self):
        usergame = UserGames.query.filter_by(user_id=self.id).one()
        return usergame.team

    def is_active(self):
        team = self.get_team()
        game = self.get_game()

        return game.active_team == team

class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(120), unique=True, nullable=False)
    map_name = db.Column(db.String(120), unique=False, nullable=False)

    state = db.Column(db.PickleType(protocol=3), nullable=False)
    active_team = db.Column(db.Integer, nullable=False, default=0)

    def num_players(self):
        return UserGames.query.filter_by(game_id=self.id).count()

class UserGames(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    game_id = db.Column(db.Integer, db.ForeignKey("game.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    team = db.Column(db.Integer, nullable=False)
