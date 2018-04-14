
import flask as fl
from flask import Flask, jsonify
from flask_bootstrap import Bootstrap

import form

app = Flask(__name__)
app.config.from_envvar("STRATEGY_CFG")

Bootstrap(app)

from sock import sio
sio.init_app(app)

from db import db
db.init_app(app)

from auth import bcrypt, login_manager
bcrypt.init_app(app)
login_manager.init_app(app)

@sio.on("message")
def message(msg):
    print("GOT: {}".format(msg))

@app.route("/")
def index():
    return fl.render_template("index.html", game_form=form.GameCreateForm())

@app.route("/game", methods=["POST"])
def create_game():
    game_form = form.GameCreateForm()
    if not game_form.validate_on_submit():
        print(game_form.errors)
        return jsonify(errors=game_form.errors)

    return jsonify(message="ok")
