from app import db 

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    hash = db.Column(db.String, nullable=False)

class Favourite(db.Model):
    __tablename__ = 'favourites'
    id = db.Column(db.Integer, primary_key=True)
    route = db.Column(db.String)
    name = db.Column(db.String)
    colour = db.Column(db.String)
    user_id = db.Column(db.Integer, nullable=False)