
import flask as fl
from flask import Flask

from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_envvar("STRATEGY_CFG")

sio = SocketIO(app)
db = SQLAlchemy(app)

@app.route("/")
def test():
    return fl.render_template("index.html", name="Andrew")
