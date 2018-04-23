
from flask_wtf import FlaskForm

import wtforms as wtf
import wtforms.validators as valid
from wtforms.fields.html5 import EmailField

class LoginForm(FlaskForm):
    email = EmailField('Email', validators=[valid.DataRequired(), valid.Email()])
    password = wtf.PasswordField('Password', validators=[valid.DataRequired()])
    
    submit = wtf.SubmitField('Login')

class RegisterForm(FlaskForm):
    name = wtf.TextField('Name',validators=[valid.DataRequired()])
    email = EmailField('Email', validators=[valid.DataRequired(), valid.Email()])
    password = wtf.PasswordField('Password', validators=[valid.DataRequired()])
    submit = wtf.SubmitField('Register')

class GameCreateForm(FlaskForm):
    name = wtf.TextField('Name', validators=[valid.DataRequired()])
    map_name = wtf.TextField('Map', validators=[valid.DataRequired()])
