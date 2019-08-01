# server.py
#
# Flask server for Glass Bead Game. Contains routes.

from flask import Flask, redirect, request, render_template, session
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


@app.route("/users")
def users():
	"""All users."""

@app.route("/users/create", methods=['POST'])
def create_user():
	"""Add a user."""

@app.route("/users/<userid>")
def user_root():
	"""User root directory and information."""

@app.route("/users/<userid>/update", methods=['POST'])
def update_user():
	"""Update user information."""

@app.route("/users/<userid>/delete", methods=['POST'])
def delete_user():
	"""Remove user."""

@app.route("/users/<userid>/bookmarks")
def bookmarks():
	"""Bookmarks a user has saved."""

@app.route("/users/<userid>/followers")
def user_followers():
	"""Users following user specified."""

@app.route("/users/<userid>/followers/recent-posts")
def user_followers_recent():
	"""Most recent posts by user's followers."""

@app.route("/users/<userid>/following")
def user_following():
	"""Users followed by user specified."""

@app.route("/users/<userid>/following/recent-posts")
def user_following_recent():
	"""Most recent posts by users followed by user."""

@app.route("/posts")
def posts():
	"""I don't know yet but this seems important to have."""

@app.route("/posts/create", methods=['POST'])
def create_post():
	"""Create a new post."""

@app.route("/posts/<postid>")
def post():
	"""A particular post."""

@app.route("/posts/<postid>/edit", methods=['POST'])
def edit_post():
	"""Update a post."""

@app.route("/posts/<postid>/erase", methods=['POST'])
def erase_post():
	"""Void a post.

	Deletes content of a post. References will still exist until changed by
	the relevant users.
	"""

@app.route("/posts/<postid>/responses")
def responses():
	"""Responses to a particular post."""

@app.route("/posts/<postid>/origins")
def origins():
	"""Origins of a particular post."""