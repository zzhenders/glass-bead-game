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

	# Relationships

	# self.user: the User who made this post.

	references = db.relationship('Post',
								 secondary='references',
								 primaryjoin='Post.id==Reference.post_id',
								 secondaryjoin='Post.id==Reference.post_ref',
								 backref='responses')

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

	def to_dictionary(self):
		"""Returns a dictionary representation of the Post instance."""

		return {key: value
				for key, value in [('id', self.id),
								   ('title', self.title),
								   ('content', self.content),
								   ('uid', self.uid)]}


class User(db.Model):
	"""A user."""

	__tablename__ = "users"

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	uname = db.Column(db.String(30), nullable=False, unique=True)

	# Relationships 
	bookmarks = db.relationship('Bookmark', backref='user')
	posts = db.relationship('Post', backref='user')

class Reference(db.Model):
	"""A post reference.

	A single reference linking a post and the post it is responding to.
	"""

	__tablename__ = "references"

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
	post_ref = db.Column(db.Integer, db.ForeignKey('posts.id'))

class Bookmark(db.Model):
	"""A bookmark a user has made."""

	__tablename__ = "bookmarks"

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

	# self.user: the User who made this bookmark

def connect_to_db(app, database_uri):
	app.config['SQLALCHEMY_DATABASE_URL'] = database_uri
	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
	app.config['SQLALCHEMY_ECHO'] = True
	db.app = app
	db.init_app(app)

	db.create_all()
