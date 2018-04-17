
import flask as fl
import form

from db import db, Game

def index(login_form=None, game_form=None, bad_login=False):
    return fl.render_template("index.html",
            game_form=game_form or form.GameCreateForm(), 
            login_form=login_form or form.LoginForm(),
            bad_login=bad_login, games=Game.query.all())
