# server.py
#
# Flask server for Glass Bead Game. Contains routes.

from flask import Flask, redirect, request, render_template, session, jsonify
from flask import abort
from flask_sqlalchemy import SQLAlchemy
from model import User, Post, Bookmark, Reference, Follower
from model import connect_to_db, DB_URI, db
from datetime import datetime

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

    user_id = new_user.id
    return redirect(f'/users/{user_id}')


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
    user_id = user.id
    user.uname = uname
    db.session.commit()

    return redirect(f'/users/{user_id}')


@app.route("/users/<user_id>/delete", methods=['POST'])
def delete_user(user_id):
    """Remove user."""

    user = User.query.filter(User.id == user_id
                             ).options(db.joinedload('posts')).one()

    if user.deleted:
        abort(403, 'Cannot delete a deleted user.')

    user.uname = f'{user.uname} (deleted)'
    user.deleted = True

    for post in user.posts:
        post.title, post.content= '', ''
        post.erased = True
    
    db.session.commit()

    return ('', 204) # status 204: success, no content

@app.route("/users/<user_id>/follow", methods=['POST'])
def follow_user(user_id):
    """Follow the user identified by `user_id`."""

    follower_id = request.form.get('uid')  # uid: the user making the request
    new_follow = Follower(user_id=user_id, follower_id=follower_id)

    db.session.add(new_follow)
    db.session.commit()

    return ('', 204)  # status 204: success, no content


@app.route("/users/<user_id>/unfollow", methods=['POST'])
def unfollow_user(user_id):
    """Follow the user identified by `user_id`."""

    follower_id = request.form.get('uid')  # uid: the user making the request
    Follower.query.filter(user_id=user_id, follower_id=follower_id).delete()

    db.session.commit()

    return ('', 204)  # status 204: success, no content


@app.route("/users/<user_id>/bookmarks")
def bookmarks(user_id):
    """Bookmarks a user has saved."""

    user = User.query.filter(User.id == user_id
                             ).options(db.joinedload('bookmarks')).one()
    dict_of_posts = {post.id: post.to_dictionary()
                     for post in user.bookmarks}
    return jsonify(dict_of_posts)


@app.route("/users/<user_id>/bookmarks/create", methods=['POST'])
def create_bookmark(user_id):
    """Adds a bookmark to the user's bookmarks."""

    post_id = request.form.get('post_id')

    if Post.query.filter(Post.id == post_id).one().erased:
        abort(403, 'Cannot bookmark erased post.')

    new_bookmark = Bookmark(user_id=user_id, post_id=post_id)
    db.session.add(new_bookmark)
    db.session.commit()

    return ('', 204)  # status 204: success, no content


@app.route("/users/<user_id>/bookmarks/delete", methods=['POST'])
def delete_bookmark(user_id):
    """Adds a bookmark to the user's bookmarks."""

    bookmark_id = request.form.get('bookmark_id')
    Bookmark.query.filter(Bookmark.id == bookmark_id).delete()
    db.session.commit()

    return ('', 204)  # status 204: success, no content


@app.route("/users/<user_id>/followers")
def user_followers(user_id):
    """Users following user specified."""

    user = User.query.filter(User.id == user_id
                             ).options(db.joinedload('followers')).one()
    dict_of_users = {follower.id: follower.to_dictionary()
                     for follower in user.followers}
    return jsonify(dict_of_users)


@app.route("/users/<user_id>/followers/recent-posts")
def user_followers_recent(user_id):
    """Most recent posts by user's followers."""

    # TODO: NEEDS REWORKING, VERY INEFFICIENT!#############################
    #
    user = User.query.filter(User.id == user_id).one()

    dict_of_posts = {follower.id: Post.query.filter(
                                Post.user_id == follower.id,
                                Post.erased == False,
                                ).order_by('created')[-1].to_dictionary()
                     for follower
                     in user.followers}

    return jsonify(dict_of_posts)
    #######################################################################


@app.route("/users/<user_id>/following")
def user_following(user_id):
    """Users followed by user specified.

    Return json of all the users followed by the user specified in the
    URI. Note that route is `...following` but model has the attribute
    `followed`. This is to maintain an English-like relationship in
    the URI and model respectively.
    """

    user = User.query.filter(User.id == user_id
                             ).options(db.joinedload('followed')).one()
    dict_of_users = {followed.id: followed.to_dictionary()
                     for followed in user.followed}
    return jsonify(dict_of_users)


@app.route("/users/<user_id>/following/recent-posts")
def user_following_recent(user_id):
    """Most recent posts by users followed by user."""

    # TODO: NEEDS REWORKING, VERY INEFFICIENT!#############################
    #
    user = User.query.filter(User.id == user_id).one()

    dict_of_posts = {followed.id: Post.query.filter(
                                Post.user_id == followed.id,
                                Post.erased == False,
                                ).order_by('created')[-1].to_dictionary()
                     for followed
                     in user.followed}

    return jsonify(dict_of_posts)
    #######################################################################


@app.route("/posts")
def posts():
    """I don't know yet but this seems important to have."""

@app.route("/posts/search")
def search_posts():
    """Search for posts matching given criteria."""

    search_terms = request.args.get("terms")
    list_of_posts = Post.search_for(search_terms)  #list of Post objects 
    dict_of_posts = {post.id: post.to_dictionary()
                     for post in list_of_posts
                     if not post.erased}
    return jsonify(dict_of_posts)


@app.route("/posts/create", methods=['POST'])
def create_post():
    """Create a new post."""

    title = request.form.get('title')
    content = request.form.get('content')
    user_id = request.form.get('user_id')

    references = request.form.get('references', [])
    references = Post.query.filter(Post.id.in_(references),
                                   Post.erased == False).all()

    new_post = Post(title=title, content=content, references=references,
                    user_id=user_id, created=datetime.utcnow())
    db.session.add(new_post)
    db.session.commit()
    post_id = new_post.id

    return redirect(f'/users/{user_id}/following/recent-posts')


@app.route("/posts/<post_id>")
def post(post_id):
    """A particular post."""

    post = Post.query.filter(Post.id == post_id).one()

    if post.erased:
        return jsonify(post.was_erased())
    else:
        return jsonify(post.to_dictionary())


@app.route("/posts/<post_id>/edit", methods=['POST'])
def edit_post(post_id):
    """Update a post."""

    title = request.form.get('title')
    content = request.form.get('content')
    user_id = request.form.get('user_id')

    references = request.form.get('references', [])
    references = Post.query.filter(Post.id.in_(references)).all()

    post = Post.query.filter(Post.id == post_id).one()

    if post.erased:
        abort(403, 'Cannot update erased post.')

    post.title, post.content, post.references = title, content, references
    db.session.commit()

    return redirect(f'/users/{user_id}/following/recent-posts')


@app.route("/posts/<post_id>/erase", methods=['POST'])
def erase_post(post_id):
    """Void a post.

    Deletes content of a post. Responses will still exist until changed
    by the relevant users.
    """

    post = Post.query.filter(Post.id == post_id).one()

    if post.erased:
        abort(403, 'Cannot erase an erased post.')

    post.title, post.content= '', ''
    post.erased = True
    db.session.commit()

    return ('', 204)  # status 204: success, no content


@app.route("/posts/<post_id>/responses")
def responses(post_id):
    """Responses to a particular post."""

    post = Post.query.filter(Post.id == post_id).one()
    dict_of_posts = {post.id: post.to_dictionary()
                     for post in post.responses
                     if not post.erased}
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