# server.py
#
# Flask server for Glassbeads. Contains routes.

from flask import Flask, redirect, request, render_template, session, jsonify
from flask import abort, json
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from base64 import urlsafe_b64encode as b64encode
from base64 import urlsafe_b64decode as b64decode
from datetime import datetime, timedelta
from os import environ
from model import User, Post, Bookmark, Reference, Follower, Session
from model import connect_to_db, DB_URI, db
from security import check_password, make_hash, make_salt, validate_password
from security import generate_session, validate_session_id

SESSION_DURATION = 30  # Number of minutes a user session should exist.

app = Flask(__name__)
app.secret_key = environ['SECRET_KEY']
app.config.update(
    SESSION_COOKIE_NAME='id',
    )

CORS(app, supports_credentials=True)


#################################
#  REACT IMPLEMENTATION (TODO)  #
#################################


@app.route("/")
def index():
    """Serves index, and by extension the app."""

    return render_template('index.html')


#################################################
#  DECORATOR-LESS SESSION MANAGEMENT FUNCTIONS  #
#################################################


def auth_change(client_ip, user_agent, uid):
    """Generates user session."""

    session_id, salt = generate_session(client_ip, user_agent)
    expiration = datetime.now() + timedelta(minutes=SESSION_DURATION)

    new_session = Session(session_id=session_id,
                          salt=salt,
                          expiration=expiration,
                          user_id=uid)
    db.session.add(new_session)
    db.session.commit()

    return b64encode(session_id)


def session_check(session_id, client_ip, user_agent, uid):
    """Checks authorization."""

    session_id = b64decode(session_id)
    session = Session.query.filter(Session.session_id == session_id).first()

    if session is None:
        return ''
    else:
        validated = validate_session_id(session.session_id,
                                        session.salt,
                                        client_ip,
                                        user_agent)
    if not validated:
        'In production, log anomaly here for possible security threat'
        return ''
    elif session.user_id != uid:
        'In production, log anomaly here for possible security threat'
        return ''
    else:
        # Check against expiration
        time_now = datetime.now()
        if time_now >= session.expiration:
            return ''
        elif session.expiration - time_now < timedelta(minutes=5):
            Session.query.filter(Session.session_id == session_id).delete()
            session_id, salt = generate_session(client_ip, user_agent)
            expiration = time_now + timedelta(minutes=SESSION_DURATION)

            new_session = Session(session_id=session_id,
                                  salt=salt,
                                  expiration=expiration,
                                  user_id=uid)
            db.session.add(new_session)
            db.session.commit()

            return b64encode(session_id)
        else:
            return b64encode(session_id)



#################
#  API BACKEND  #
#################


@app.route("/users/unames")
def users():
    """The usernames associated with user ids."""
    
    user_ids = request.args.get('userids')
    user_ids = user_ids.split('.')
    user_ids = [int(user_id) for user_id in user_ids]
    users = User.query.filter(User.id.in_(user_ids)).all()
    return jsonify({user.id: user.uname
                    for user in users})


@app.route("/users/create", methods=['POST'])
def create_user():
    """Add a user."""

    data = json.loads(request.data)
    uname = data.get('uname')
    password = data.get('pass')

    if not uname:
        abort(401, 'Username already registered.')  # Bad request
    elif not validate_password(uname, password):
        abort(401, 'Password too short or too simple.')  # Bad request
    elif uname.isprintable():
        uname = uname.lower()
        salt = make_salt()
        pass_hash = make_hash(password, salt)
        new_user = User(uname=uname,
                        salt=salt,
                        pass_hash=pass_hash,
                        )
        db.session.add(new_user)
        db.session.commit()

        user_id = new_user.id
        session['id'] = auth_change(request.remote_addr,
                                    request.user_agent,
                                    user_id)
        return jsonify({'uid': user_id})
    else:
        abort(400)  # Bad request


@app.route("/users/login", methods=['POST'])
def login_user():
    """User login."""

    data = json.loads(request.data)
    uname = data.get('uname')
    password = data.get('pass')

    dummy = True  # If problem with implementation, fails closed.

    if not uname:
        dummy = True
    else:
        user = User.query.filter(User.uname == uname.lower()).first()
        if user is None:
            dummy = True
        elif user.deleted:
            dummy = True
        else:
            dummy = False

    if dummy == True:  # Helps prevent side channel timing attacks.
        check_password(password)
        abort(403)
    else:
        hash_match = check_password(password, user.salt, user.pass_hash)
        if hash_match is True:
            return jsonify({'uid': user.id})
        else:
            abort(403)


@app.route("/users/<user_id>/posts")
def user_posts_all(user_id):
    """All posts by a particular user."""

    mode = request.args.get('mode', 'full')
    posts = Post.query.filter(Post.user_id == user_id
                              ).all()
    if mode == 'full':
        dict_of_posts = {post.id: post.to_dictionary()
                         for post in posts}
        return jsonify(dict_of_posts)
    elif mode == 'short':
        dict_of_posts = {post.id: post.title
                         for post in posts}
        return jsonify(dict_of_posts)
    else:
        abort(400)  # Bad request


@app.route("/users/<user_id>/posts/root")
def user_posts_root(user_id):
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

    data = json.loads(request.data)
    uname = data.get('uname')

    if not uname:
        abort(400)  # Bad request
    elif uname.isprintable():
        user = User.query.filter(User.id == user_id).one()
        user.uname = uname.lower()
        db.session.add(user)
        db.session.commit()

        return ('', 204)  # status 204: success, no content
    else:
        abort(400)  # Bad request


@app.route("/users/<user_id>/delete", methods=['POST'])
def delete_user(user_id):
    """Remove user."""

    user = User.query.filter(User.id == user_id
                             ).options(db.joinedload('posts')).one()

    if user.deleted:
        abort(403, 'Cannot delete a deleted user.')
    else:
        # Append the user's id to the end of their (deleted) username.
        user.uname = f'{user.uname} (deleted) {user.id}'
        user.deleted = True

        for post in user.posts:
            post.title, post.content= '', ''
            post.erased = True

        Follower.query.filter(Follower.follower_id == user.id).delete()
        Bookmark.query.filter(Bookmark.user_id == user_id).delete()
        
        db.session.commit()

        return ('', 204) # status 204: success, no content


@app.route("/users/<user_id>/follow", methods=['POST'])
def follow_user(user_id):
    """Follow the user identified by `user_id`."""

    follower_id = request.form.get('uid')  # uid: the user making the request

    if not follower_id:
        abort(400)  # Bad request
    elif User.query.filter(User.id == user_id).one().deleted:
        abort(403, 'Cannot follow a deleted user.')
    elif Follower.query.filter(Follower.user_id == user_id,
                               Follower.follower_id == follower_id).first():
        abort(403, 'User already followed.')
    else:
        new_follow = Follower(user_id=user_id, follower_id=follower_id)

        db.session.add(new_follow)
        db.session.commit()

        return ('', 204)  # status 204: success, no content


@app.route("/users/<user_id>/unfollow", methods=['POST'])
def unfollow_user(user_id):
    """Unollow the user identified by `user_id`."""

    follower_id = request.form.get('uid')  # uid: the user making the request
    if not follower_id:
        abort(400)  # Bad request

    follower = Follower.query.filter(Follower.user_id == user_id,
                              Follower.follower_id == follower_id).first()
    if not follower:
        abort(403, "User not followed or doesn't exist.")
    else:
        Follower.query.filter(Follower.user_id == user_id,
                              Follower.follower_id == follower_id).delete()
        db.session.commit()

        return ('', 204)  # status 204: success, no content


@app.route("/users/<user_id>/bookmarks")
def bookmarks(user_id):
    """Bookmarks a user has saved."""

    mode = request.args.get('mode', 'full')
    user = User.query.filter(User.id == user_id
                             ).options(db.joinedload('bookmarks')).one()
    if mode == 'full':
        dict_of_posts = {post.id: post.to_dictionary()
                         for post in user.bookmarks}
    elif mode == 'short':
        dict_of_posts = {post.id: post.title
                         for post in user.bookmarks}
    else:
        abort(400)  # Bad request

    return jsonify(dict_of_posts)

@app.route("/users/<user_id>/bookmarks/create", methods=['POST'])
def create_bookmark(user_id):
    """Adds a bookmark to the user's bookmarks."""

    post_id = int(request.form.get('post_id'))

    if not post_id:
        abort(400)  # Bad request
    elif Post.query.filter(Post.id == post_id).one().erased:
        abort(403, 'Cannot bookmark erased post.')
    elif Bookmark.query.filter(Bookmark.post_id == post_id,
                               Bookmark.user_id == user_id).first():
        abort(403, 'Post already bookmarked.')
    else:
        new_bookmark = Bookmark(user_id=user_id, post_id=post_id)
        db.session.add(new_bookmark)
        db.session.commit()

        return ('', 204)  # status 204: success, no content


@app.route("/users/<user_id>/bookmarks/delete", methods=['POST'])
def delete_bookmark(user_id):
    """Adds a bookmark to the user's bookmarks."""

    post_id = int(request.form.get('post_id'))

    if not (post_id and user_id):
        abort(400)  # Bad request
    else:
        Bookmark.query.filter(Bookmark.post_id == post_id,
                              Bookmark.user_id == user_id).delete()
        db.session.commit()

        return ('', 204)  # status 204: success, no content


@app.route("/users/<user_id>/followers")
def user_followers(user_id):
    """Users following user specified."""

    mode = request.args.get('mode', 'full')
    user = User.query.filter(User.id == user_id
                             ).options(db.joinedload('followers')).one()
    if mode == 'full':
        dict_of_users = {follower.id: follower.to_dictionary()
                         for follower in user.followers}
    elif mode == 'short':
        dict_of_users = {follower.id: follower.uname
                         for follower in user.followers}
    else:
        abort(400)  # Bad request

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

    mode = request.args.get('mode', 'full')
    user = User.query.filter(User.id == user_id
                             ).options(db.joinedload('followed')).one()

    if mode == 'full':
        dict_of_users = {followed.id: followed.to_dictionary()
                         for followed in user.followed}
    elif mode == 'short':
        dict_of_users = {followed.id: followed.uname
                         for followed in user.followed}
    else:
        abort(400)  # Bad request

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

@app.route("/posts/bookmarked")
def bookmarked():
    """Returns boolean dictionary of whether a post has been bookmarked."""

    uid = request.args.get('uid')
    post_ids = request.args.get('postids')
    post_ids = post_ids.split('.')
    response = {int(post_id): False for post_id in post_ids}
    bookmarked = Bookmark.query.filter(Bookmark.post_id.in_(post_ids),
                                  Bookmark.user_id == uid).all()
    response.update({bookmark.post_id: True
                    for bookmark in bookmarked})
    print(response)
    return jsonify(response)


@app.route("/posts/search")
def search_posts():
    """Search for posts matching given criteria."""

    search_terms = request.args.get("terms")

    if not search_terms:
        abort(400)  # Bad request
    else:
        list_of_posts = Post.search_for(search_terms)  #list of Post objects 
        dict_of_posts = {post.id: post.to_dictionary()
                         for post in list_of_posts
                         if not post.erased}
        return jsonify(dict_of_posts)


@app.route("/posts/create", methods=['POST'])
def create_post():
    """Create a new post."""

    data = json.loads(request.data)

    title = data.get('title')
    content = data.get('content')
    user_id = data.get('user_id')

    if not (title and content and user_id):
        abort(400)  # Bad request        
    else:
        references = data.get('references', [])
        if len(references) > 4:
            abort(400)  # Bad request
        references = list(set(references))
        references = Post.query.filter(Post.id.in_(references)).all()

        new_post = Post(title=title, content=content, references=references,
                        user_id=user_id, created=datetime.utcnow())
        db.session.add(new_post)
        db.session.commit()
        post_id = new_post.id

        return ('', 204)  # status 204: success, no content


@app.route("/posts/<post_id>")
def post(post_id):
    """A particular post."""

    mode = request.args.get('mode', 'full')
    post = Post.query.filter(Post.id == post_id).one()

    if mode == 'full':
        if post.erased:
            return jsonify(post.was_erased())
        else:
            return jsonify(post.to_dictionary())
    elif mode == 'short':
        if post.erased:
            return jsonify({post_id: 'erased'})
        else:
            return jsonify({post_id: post.title})
    else:
        abort(400)  # Bad request


@app.route("/posts/<post_id>/edit", methods=['POST'])
def edit_post(post_id):
    """Update a post."""

    data = json.loads(request.data)
 
    title = data.get('title')
    content = data.get('content')
    user_id = data.get('user_id')

    if not (title and content and user_id):
        abort(400)  # Bad request        
    else:
        references = data.get('references', [])
        if len(references) > 4:
            abort(400)  # Bad request
        references = list(set(references))
        references = Post.query.filter(Post.id.in_(references)).all()

        post = Post.query.filter(Post.id == post_id).one()

        if post.erased:
            abort(403, 'Cannot update erased post.')

        post.title, post.content, post.references = title, content, references
        db.session.commit()

        return ('', 204)  # status 204: success, no content


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

    mode = request.args.get('mode', 'full')
    post = Post.query.filter(Post.id == post_id).one()

    if mode == 'full':
        dict_of_posts = {post.id: post.to_dictionary()
                         for post in post.responses
                         if not post.erased}
    elif mode == 'short':
        dict_of_posts = {post.id: post.title
                         for post in post.responses
                         if not post.erased}
    else:
        abort(400)  # Bad request

    return jsonify(dict_of_posts)


@app.route("/posts/<post_id>/references")
def references(post_id):
    """References by a particular post."""

    mode = request.args.get('mode', 'full')
    post = Post.query.filter(Post.id == post_id).one()

    if mode == 'full':
        dict_of_posts = {post.id: post.to_dictionary()
                         for post in post.references}
    elif mode == 'short':
        dict_of_posts = {post.id: post.title
                         for post in post.references}
    else:
        abort(400)  # Bad request

    return jsonify(dict_of_posts)


if __name__ == '__main__':
    connect_to_db(app, DB_URI)
    app.run(debug=True, host="0.0.0.0")
