
import flask as fl
from flask import Flask

import form

app = Flask(__name__)
app.config.from_envvar("STRATEGY_CFG")

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
    if game_form.validate_on_submit():
        return "ALKJADSLK:AS:KLDJASD:JKAS:D"

    return "FAIL"
