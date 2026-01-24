from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
import os
from cs50 import SQL;

DATABASE_URL = os.environ.get("postgresql://postgres:tNozOohHVJQxUQZPLRAKnQYoSietpVtV@postgres.railway.internal:5432/railway")
app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

db = SQL(DATABASE_URL)


def favourites(route, name, html, colour_text):
    if request.method == "POST":
        #Check if anyone is logged in
        try:
            if session["user_id"]:
                #Test for any current data
                table_data = db.execute("SELECT * FROM favourites WHERE user_id = ? and route = ?", session["user_id"], route)
                if len(table_data) == 0:
                    db.execute("INSERT INTO favourites (route, name, user_id, colour) VALUES(?, ?, ?, ?)", route, name.upper(), session["user_id"], colour_text)
                elif len(table_data) != 0:
                    db.execute("DELETE FROM favourites WHERE user_id = ? AND route = ?", session["user_id"], route)
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
                favourites = db.execute("SELECT * FROM favourites WHERE user_id = ?", session["user_id"])
                active = "0"
                if len(favourites) != 0:
                    for favourite in favourites:
                        if favourite["route"] == route:
                            active = "1"
        except:
            user = 0
            favourites=""
            active = "0"
        return render_template(html, user=user, error="", favourites=favourites, active=active, colour=colour_text)
