from flask import Flask
from flask_sqlalchemy import SQLAlchemy

DB_URI = "postgresql:///glassbeads"

db=SQLAlchemy()

class Post(db.Model):
	pass

class User(db.Model):
	pass

class Reference(db.model):
	pass

class Bookmark(db.model):
	pass

def connect_to_db(app):
	app.config['SQLALCHEMY_DATABASE_URL'] = DB_URI
	app.config['SQLALCHEMY_ECHO'] = True
	db.app = app
	db.init_app(app)
	
	db.create_all()
