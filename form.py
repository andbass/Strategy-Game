
from flask_wtf import FlaskForm

import wtforms as wtf
import wtforms.validators as valid
from wtforms.fields.html5 import EmailField

from sample_states import collection

def map_choices():
    return [
        (name, name.title())
        for name in collection.keys()
    ]

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
    map_name = wtf.SelectField('Map', validators=[valid.DataRequired()],
                               choices=map_choices())
