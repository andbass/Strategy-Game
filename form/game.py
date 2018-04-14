
from flask_wtf import FlaskForm

import wtforms as wtf
import wtfroms.validators as valid

class GameCreateForm(FlaskForm):
    name = wtf.StringField('name', validators=[valid.DataRequired()])

