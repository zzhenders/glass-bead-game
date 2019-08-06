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

	@classmethod
	def search_for(cls, search_terms):
		"""Get all posts matching search terms.

		Returns a list of Post objects where the search terms are present
		either in the title or the body. All search terms must be present, and
		search terms must be in order, but they may be anywhere.

		Currently case-sensitive.
		"""

		search_terms = '%' + '%'.join(search_terms.strip().split()) + '%'
		return cls.query.filter(db.or_(cls.title.like(search_terms),
									   cls.content.like(search_terms)
									   )).all()


class User(db.Model):
	"""A user."""

	__tablename__ = "users"

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	uname = db.Column(db.String(30), nullable=False, unique=True)

class Reference(db.Model):
	"""A post reference.

	A single reference linking a post and the post it is responding to.
	"""

	__tablename__ = "references"

	post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
	post_ref = db.Column(db.Integer, db.ForeignKey('posts.id'))

class Bookmark(db.Model):
	pass

def connect_to_db(app):
	app.config['SQLALCHEMY_DATABASE_URL'] = DB_URI
	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
	app.config['SQLALCHEMY_ECHO'] = True
	db.app = app
	db.init_app(app)

	db.create_all()
