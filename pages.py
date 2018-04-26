
import flask as fl
import form

from db import db, Game
from auth import current_user

from sample_states import collection

def index(login_form=None, game_form=None, bad_login=False, bad_register=False, register_form=None):
    current_game = current_user.is_authenticated and current_user.get_game()

    if current_game:
        games = Game.query.filter(Game.id != current_game.id).all()
    else:
        games = Game.query.all()

    games = [game for game in games
             if not game.is_full()]

    return fl.render_template("index.html",
                              game_form=game_form or form.GameCreateForm(),
                              login_form=login_form or form.LoginForm(),
                              register_form=register_form or form.RegisterForm(),
                              bad_login=bad_login, bad_register=bad_register,
                              games=games)
