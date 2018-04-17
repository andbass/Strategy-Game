
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

from sock import sio
sio.init_app(app)

from db import db, User, Game
db.init_app(app)

from auth import bcrypt, login_manager, login_user, login_required, logout_user
bcrypt.init_app(app)
login_manager.init_app(app)

@sio.on("message")
def message(msg):
    print("GOT: {}".format(msg))

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

    game = Game(name=name, map_name=map_name, state=State(tilemap=[]))

    db.session.add(game)
    db.session.commit()

    return fl.redirect(fl.url_for("index"))

@app.route("/register", methods=["POST"])
def register():
    pass

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

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return fl.redirect(fl.url_for("index"))

@app.cli.command()
def initdb():
    db.drop_all()
    db.create_all()
