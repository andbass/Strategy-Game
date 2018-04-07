
import flask as fl
from flask import Flask

from flask_socketio import SocketIO


app = Flask(__name__)
app.config.from_envvar("STRATEGY_CFG")

sio = SocketIO(app)

@app.route("/")
def test():
    return fl.render_template("index.html", name="Andrew")
