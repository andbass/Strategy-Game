
import flask as fl
from flask import Flask

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
def test():
    return fl.render_template("index.html")

@app.route("/game", methods=["POST"])
def create_game():
    pass
