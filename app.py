from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
import os
from app_functions import favourite_route
from models import User

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

app.config['TEMPLATES_AUTO_RELOAD'] = True
app.debug = True

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("Postgres.DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
if app.config['SQLALCHEMY_DATABASE_URI'] is None:
    raise RuntimeError("Postgres database URL not set in environment variables")

db = SQLAlchemy(app)


@app.route("/", methods=["GET", "POST"])
def index():
    #return homepage
    return favourite_route("/", "HOMEPAGE", "index.html", "bluetext")

@app.route("/chemistry", methods=["GET", "POST"])
def chemistry():
    #return chemistry
    return favourite_route("/chemistry", "CHEMISTRY", "chemistry.html", "purpletext")

@app.route("/chem1", methods=["GET", "POST"])
def chem1():
    #return molecule visualiser
    return favourite_route("/chem1", "MOLECULE VISUALISER", "chem1.html", "purpletext")

@app.route("/chem2", methods=["GET", "POST"])
def chem2():
    #return animation viewer
    return favourite_route("/chem2", "FRACTIONAL DISTILLATION", "chem2.html", "purpletext")
    

@app.route("/login", methods=["GET", "POST"])
def login():
    #Provide login service
    try:
        if session["user_id"]:
            return redirect("/")
    except:
        session.clear()
    session.clear()
    if request.method == "POST":
        if not request.form.get("username"):
            return render_template("login.html", problem="You must input a username")
        if not request.form.get("password"):
            return render_template("login.html", problem="You must input a password")
        data = User.query.filter_by(username=request.form.get("username").lower()).first()

        if data is None:
            return render_template("login.html", problem="Invalid username")
        elif not check_password_hash(data.hash, request.form.get("password")):
            return render_template("login.html", problem="Incorrect password")
        session["user_id"] = data.id
        return redirect("/")
    else:
        return render_template("login.html", problem="")
    
@app.route("/register", methods=["GET", "POST"])
def register():
    #Register user for new account
    try:
        if session["user_id"]:
            return redirect("/")
    except:
        session.clear()
    if request.method == "POST":
        if not request.form.get("username"):
            return render_template("register.html", problem="You must input a username")
        if not request.form.get("password"):
            return render_template("register.html", problem="You must input a password")
        if not request.form.get("confirmation"):
            return render_template("register.html", problem="You must input your password twice")
        if request.form.get("password") != request.form.get("confirmation"):
            return render_template("register.html", problem="Your passwords must match")
        hash = generate_password_hash(request.form.get("password"))
        if User.query.filter_by(username=request.form.get("username").lower()).first():
            db.session.add(User(username=request.form.get("username").lower(), hash=hash))
            db.session.commit()
        else:
            return render_template("register.html", problem="Username already taken!")
        
        session["user_id"] = (User.query.filter_by(username=request.form.get("username").lower())).id
        return redirect("/")
    else:
        return render_template("register.html", problem="")

@app.route("/profile")
def profile():
    return render_template("profile.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")