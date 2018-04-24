
import functools

from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_user, login_required, logout_user, current_user

from db import User

bcrypt = Bcrypt()
login_manager = LoginManager()

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

def auth_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            return dict(message="login")

        return f(*args, **kwargs)

    return wrapped

def active_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            return dict(message="login")

        if not current_user.is_active():
            return dict(message="wait")

        return f(*args, **kwargs)

    return wrapped
