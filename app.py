from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from cs50 import SQL;
from app_functions import favourites
app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.debug = True

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///learning.vfx.db")

@app.route("/", methods=["GET", "POST"])
def index():
    #return homepage
    return favourites("/", "HOMEPAGE", "index.html", "bluetext")

@app.route("/chemistry", methods=["GET", "POST"])
def chemistry():
    #return chemistry
    return favourites("/chemistry", "CHEMISTRY", "chemistry.html", "purpletext")

@app.route("/chem1", methods=["GET", "POST"])
def chem1():
    #return molecule visualiser
    return favourites("/chem1", "MOLECULE VISUALISER", "chem1.html", "purpletext")

@app.route("/chem2", methods=["GET", "POST"])
def chem2():
    #return animation viewer
    return favourites("/chem2", "ANIMATION VIEWER", "chem2.html", "purpletext")
    

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
        data = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username").lower())
        if len(data) == 0:
            return render_template("login.html", problem="Invalid username")
        elif not check_password_hash(data[0]["hash"], request.form.get("password")):
            return render_template("login.html", problem="Incorrect password")
        session["user_id"] = data[0]["id"]
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
        try:
            db.execute("INSERT INTO users (username, hash) VALUES (?, ?)", request.form.get("username").lower(), hash)
        except:
            return render_template("register.html", problem="Username already taken!")
        session["user_id"] = db.execute("SELECT id FROM users WHERE hash = ? AND username = ?", hash, request.form.get("username"))[0]["id"]
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