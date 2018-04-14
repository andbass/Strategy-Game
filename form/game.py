
from flask_wtf import FlaskForm

import wtforms as wtf
import wtforms.validators as valid

class GameCreateForm(FlaskForm):
    name = wtf.StringField('Name', validators=[valid.DataRequired()])
    map_name = wtf.StringField('Map', validators=[valid.DataRequired()])

