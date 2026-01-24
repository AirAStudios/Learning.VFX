from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
import os
from models import Favourite

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('Postgres.DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

def favourites_route(route, name, html, colour_text):
    if request.method == "POST":
        #Check if anyone is logged in
        try:
            if session["user_id"]:
                #Test for any current data
                table_data = Favourite.query.filter_by(user_id=session["user_id"], route=route).first()
                if table_data is None:
                    db.session.add(Favourite(route=route, name=name.upper(), user_id=session["user_id"], colour=colour_text))
                    db.session.commit()
                else:
                    Favourite.query.filter_by(user_id=session["user_id"], route=route).delete()
                return redirect(route)
            else:
                return render_template(html, user=0, error="You cannot favourite pages until you sign in", favourites="", active=0, colour=colour_text)
        except:
            return render_template(html, user=0, error="You cannot favourite pages until you sign in", favourites="", active=0, colour=colour_text)
    else:
        user = 0
        try:
            if session["user_id"]:
                user = 1
                favourites = Favourite.query.filter_by(user_id=session["user_id"]).all()
                active = "0"
                for favourite in favourites:
                    if favourite.route == route:
                        active = "1"
                        break
        except:
            user = 0
            favourites=""
            active = "0"
        return render_template(html, user=user, error="", favourites=favourites, active=active, colour=colour_text)
