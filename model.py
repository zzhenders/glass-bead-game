from flask import Flask
from flask_sqlalchemy import SQLAlchemy

DB_URI = "postgresql:///glassbeads"

db=SQLAlchemy()

class Post(db.Model):
	"""Post."""

	__tablename__ = "posts"

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	title = db.Column(db.String(80), nullable=False)
	content = db.Column(db.Text, nullable=False)
	uid = db.Column(db.Integer, db.ForeignKey('users.id'))

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
