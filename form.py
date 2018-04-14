
from flask_wtf import FlaskForm

import wtforms as wtf
import wtforms.validators as valid
from wtforms.fields.html5 import EmailField

class LoginForm(FlaskForm):
    email = EmailField('Email', validators=[valid.DataRequired(), valid.Email()])
    password = wtf.PasswordField('Password', validators=[valid.DataRequired()])

class GameCreateForm(FlaskForm):
    name = wtf.StringField('Name', validators=[valid.DataRequired()])
    map_name = wtf.StringField('Map', validators=[valid.DataRequired()])

