# server.py
#
# Flask server for Glass Bead Game. Contains routes.

from flask import Flask, redirect, request, render_template, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from model import User, Post, Bookmark, Reference, connect_to_db, DB_URI, db

app = Flask(__name__)


@app.route("/users")
def users():
    """All users."""

@app.route("/users/create", methods=['POST'])
def create_user():
    """Add a user."""

    uname = request.form.get('uname')
    new_user = User(uname=uname)
    db.session.add(new_user)
    db.session.commit()

    uid = new_user.id
    return redirect(f'/users/{uid}')

@app.route("/users/<user_id>")
def user_root(user_id):
    """User root directory."""

    user = User.query.filter(User.id == user_id
                             ).options(db.joinedload('posts')).one()
    dict_of_posts = {post.id: post.to_dictionary()
                     for post in user.posts
                     if not post.references}
    return jsonify(dict_of_posts)

@app.route("/users/<user_id>/update", methods=['POST'])
def update_user(user_id):
    """Update user information."""

    uname = request.form.get('uname')
    user = User.query.filter(uname=uname).one()
    uid = user.id
    user.uname = uname
    db.session.commit()

    return redirect(f'/users/{uid}')


@app.route("/users/<user_id>/delete", methods=['POST'])
def delete_user(user_id):
    """Remove user."""

@app.route("/users/<user_id>/bookmarks")
def bookmarks(user_id):
    """Bookmarks a user has saved."""

    user = User.query.filter(User.id == user_id
                             ).options(db.joinedload('bookmarks')).one()
    dict_of_posts = {post.id: post.to_dictionary()
                     for post in user.bookmarks}
    return jsonify(dict_of_posts)


@app.route("/users/<user_id>/followers")
def user_followers(user_id):
    """Users following user specified."""

@app.route("/users/<user_id>/followers/recent-posts")
def user_followers_recent(user_id):
    """Most recent posts by user's followers."""

@app.route("/users/<user_id>/following")
def user_following(user_id):
    """Users followed by user specified."""

@app.route("/users/<user_id>/following/recent-posts")
def user_following_recent(user_id):
    """Most recent posts by users followed by user."""

@app.route("/posts")
def posts():
    """I don't know yet but this seems important to have."""

@app.route("/posts/search")
def search_posts():
    """Search for posts matching given criteria."""

    search_terms = request.args.get("terms")
    list_of_posts = Post.search_for(search_terms)  #list of Post objects 
    dict_of_posts = {post.id: post.to_dictionary()
                     for post in list_of_posts}
    return jsonify(dict_of_posts)


@app.route("/posts/create", methods=['POST'])
def create_post():
    """Create a new post."""

    title = request.form.get('title')
    content = request.form.get('content')
    uid = request.form.get('uid')

    references = request.form.get('references', [])
    references = Post.query.filter(Post.id.in_(references).all())

    new_post = Post(title=title, content=content,
                    references=references, uid=uid)
    db.session.commit()
    post_id = new_post.id

    return redirect("posts/" + post_id)


@app.route("/posts/<post_id>")
def post(post_id):
    """A particular post."""

    post = Post.query.filter(Post.id == post_id).one()
    return jsonify(post.to_dictionary())


@app.route("/posts/<post_id>/edit", methods=['POST'])
def edit_post(post_id):
    """Update a post."""

    title = request.form.get('title')
    content = request.form.get('content')
    uid = request.form.get('uid')

    references = request.form.get('references', [])
    references = Post.query.filter(Post.id.in_(references).all())

    post = Post.query.filter(Post.id == post_id).one()
    post.title, post.content, post.references = title, content, references
    db.session.commit()

    return redirect(f'/users/{uid}/following/recent-posts')


@app.route("/posts/<post_id>/erase", methods=['POST'])
def erase_post(post_id):
    """Void a post.

    Deletes content of a post. References will still exist until changed by
    the relevant users.
    """

@app.route("/posts/<post_id>/responses")
def responses(post_id):
    """Responses to a particular post."""

    post = Post.query.filter(Post.id == post_id).one()
    dict_of_posts = {post.id: post.to_dictionary()
                     for post in post.responses}
    return jsonify(dict_of_posts)


@app.route("/posts/<post_id>/references")
def references(post_id):
    """References by a particular post."""

    post = Post.query.filter(Post.id == post_id).one()
    dict_of_posts = {post.id: post.to_dictionary()
                     for post in post.references}
    return jsonify(dict_of_posts)


if __name__ == '__main__':
    connect_to_db(app, DB_URI)
    app.run(debug=True, host="0.0.0.0")