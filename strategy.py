
import click
import flask as fl

from flask import Flask, jsonify
from flask_bootstrap import Bootstrap

import sqlalchemy.orm.exc as exc

import form
import pages

from state import State

app = Flask(__name__)
app.config.from_envvar("STRATEGY_CFG")

Bootstrap(app)

from sock import sio, join_room, leave_room
sio.init_app(app)

from db import db, User, Game, UserGames
db.init_app(app)

from auth import bcrypt, login_manager, login_user, login_required, logout_user, current_user
bcrypt.init_app(app)
login_manager.init_app(app)

@app.route("/")
def index():
    return pages.index()

@app.route("/game", methods=["POST"])
def create_game():
    game_form = form.GameCreateForm()
    if not game_form.validate_on_submit():
        return jsonify(errors=game_form.errors)

    name = game_form.name.data
    map_name = game_form.map_name.data

    game = Game(name=name, map_name=map_name, state=State.sample())

    db.session.add(game)
    db.session.commit()

    return fl.redirect(fl.url_for("index"))

@app.route("/register", methods=["POST"])
def register():
    register_form = form.RegisterForm()
    if not register_form.validate_on_submit():
        return jsonify(errors=register_form.errors)

    name = register_form.name.data
    email = register_form.email.data
    password = register_form.password.data

    user = User.query.filter_by(email=email).first()
    if user is None:
        user = User(email=email, name=name, password=password)

        db.session.add(user)
        db.session.commit()

        login_user(user)
        return fl.redirect(fl.url_for("index"))

    return pages.index(bad_login=True)

@app.route("/login", methods=["POST"])
def login():
    login_form = form.LoginForm()
    if not login_form.validate_on_submit():
        return jsonify(errors=login_form.errors)

    email = login_form.email.data
    password = login_form.password.data

    try:
        user = User.query.filter_by(email=email, password=password).one()
    except exc.NoResultFound:
        return pages.index(login_form=login_form, bad_login=True)

    login_user(user)
    return fl.redirect(fl.url_for("index"))

@app.route("/join/<game_id>", methods=["GET"])
@login_required
def join(game_id):
    game = Game.query.get(game_id)
    if game is None:
        # TODO tell user if game was deleted?
        return fl.redirect(fl.url_for("index"))

    if game.num_players == 2:
        # TODO tell user if game was full?
        return fl.redirect(fl.url_for("index"))

    # TODO ensure user isnt in other games
    usergames = UserGames.query.filter_by(user_id=current_user.id)
    if usergames.count() > 0:
        return fl.redirect(fl.url_for("index"))

    connection = UserGames(game_id=game_id,
                           user_id=current_user.id,
                           team=game.num_players())

    db.session.add(connection)
    db.session.commit()

    return fl.redirect(fl.url_for("index"))

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return fl.redirect(fl.url_for("index"))

@app.cli.command()
def initdb():
    db.drop_all()
    db.create_all()

if __name__ == "__main__":
    sio.run(app, host=app.config.get("HOST"), port=app.config.get("PORT"))

