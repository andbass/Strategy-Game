
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

from db import User

bcrypt = Bcrypt()
login_manager = LoginManager()

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))


