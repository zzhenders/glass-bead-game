from unittest import TestCase
from server import app
from model import db, Post, User, Reference, Bookmark, Follower, connect_to_db
from datetime import datetime

TEST_DB_URI = "postgresql:///testdb"

class FlaskTests(TestCase):
    """Implementations tests for Flask API"""

    def setUp(self):
        """Do this before each test."""

        print('\n\n...setting up...\n\n')
        self.client = app.test_client()
        app.config['TESTING'] = True

        connect_to_db(app, TEST_DB_URI)
        db_test_data()


    def tearDown(self):
        """Do this after each test."""

        print('\n\n\n...tearing down...\n\n\n')
        db.session.remove()
        db.drop_all()
        db.engine.dispose()


    def test_user_root(self):
        """Test `/users/<user_id>` route."""

        print('\n\n\ntest user root\n\n\n')
        user = User.query.filter(User.uname=='lemongrab'
                                 ).one()
        result = self.client.get(f"/users/{user.id}")
        self.assertIn(b'million', result.data)


    def test_delete_user(self):
        """Test `/users/<user_id>/delete"""

        print('\n\n\ntest delete user\n\n\n')
        user_id = User.query.filter(User.uname=='lemongrab').one().id
        result = self.client.post(f'/users/{user_id}/delete')
        self.assertEqual(204, result.status_code)

        check_post = Post.query.filter(Post.user_id == user_id).first()
        self.assertEqual('', check_post.title)


    def test_user_bookmarks(self):
        """Test for `/users/<user_id>/bookmarks` route."""

        print('\n\n\ntest user bookmarks\n\n\n')
        user = User.query.filter(User.uname=='marceline'
                                 ).one()
        result = self.client.get(f'/users/{user.id}/bookmarks')
        self.assertIn(b'million', result.data)


    def test_user_followers(self):
        """Test for `/users/<user_id>/followers` route."""

        print('\n\n\ntest user followers\n\n\n')
        user = User.query.filter(User.uname == 'bubblegum').one()
        result = self.client.get(f'/users/{user.id}/followers')
        self.assertIn(b'simon', result.data)


    def test_user_followers_recent(self):
        """Test for `/users/<user_id>/followers/recent-posts` route."""

        print('\n\n\ntest user followers recent\n\n\n')
        user = User.query.filter(User.uname == 'lemongrab').one()
        result = self.client.get(f'/users/{user.id}/followers/recent-posts')
        self.assertNotIn(b'best', result.data)
        self.assertIn(b'favorite', result.data)


    def test_user_followed(self):
        """Test for `/users/<user_id>/followed` route."""

        print('\n\n\ntest user followed\n\n\n')
        user = User.query.filter(User.uname == 'marceline').one()
        result = self.client.get(f'/users/{user.id}/following')
        self.assertIn(b'bubblegum', result.data)


    def test_erase_post(self):
        """Test for erase post."""

        print('\n\n\ntest erase post\n\n\n')
        post = Post.query.filter(Post.title == 'Poor Lemongrab').one()
        post_id = post.id
        result = self.client.post(f'/posts/{post.id}/erase')
        self.assertEqual(204, result.status_code)

        check_post = Post.query.filter(Post.id == post_id).one()
        self.assertEqual('', check_post.title)


    def test_updated_erased_post(self):
        """Test that an erased post cannot be updated."""

        print('\n\n\ntest update erased post\n\n\n')
        post_id = Post.query.filter(Post.title == 'Poor Lemongrab'
                                 ).one().id
        self.client.post(f'/posts/{post_id}/erase')
        result = self.client.post(f'/posts/{post_id}/edit',
                         data={'title':'abc', 'content':'content'})
        self.assertEqual(403, result.status_code)


class ModelTests(TestCase):
    """Database tests."""

    def setUp(self):
        """Do this before each test."""

        print('\n\n...setting up...\n\n')
        self.client = app.test_client()
        app.config['TESTING'] = True

        connect_to_db(app, TEST_DB_URI)
        db_test_data()


    def tearDown(self):
        """Do this after each test."""

        print('\n\n\n...tearing down...\n\n\n')
        db.session.remove()
        db.drop_all()
        db.engine.dispose()


    def test_post_references(self):
        """Test that post.references returns the correct object(s)."""

        print('\n\n\ntest post references\n\n\n')
        self.assertIn('million',
                      Post.query.filter(
                                        Post.title=='Poor Lemongrab'
                                        ).first().references[0].title)


    def test_post_responses(self):
        """Test that post.responses returns the correct object(s)."""

        print('\n\n\ntest post responses\n\n\n')
        self.assertIn('Lemon',
                      Post.query.filter(
                                        Post.title=='One million years dungeon'
                                        ).first().responses[0].title)


    def test_post_author(self):
        """Test that post.user returns the correct User object."""

        print('\n\n\ntest post author\n\n\n')
        self.assertIn('lemon',
                      Post.query.filter(
                                        Post.title=='One million years dungeon'
                                        ).first().user.uname)


    def test_followers(self):
        """Test that user.followers returns the correct User(s)."""

        print('\n\n\ntest followers\n\n\n')
        self.assertIn('simon',
                      [follower.uname
                       for follower
                       in User.query.filter(User.uname=='bubblegum'
                                            ).first().followers])

    def test_followed(self):
        """Test that user.following returns the correct User(s)."""

        print('\n\n\ntest following\n\n\n')
        self.assertIn('bubblegum',
                      [followed.uname
                       for followed
                       in User.query.filter(User.uname=='marceline'
                                            ).first().followed])


def db_test_data():
    """Create sample data for test database."""

    # Add sample users
    u1 = User(uname='lemongrab')
    u2 = User(uname='bubblegum')
    u3 = User(uname='marceline')
    u4 = User(uname='simon')

    # Add sample posts
    p1 = Post(title="One million years dungeon",
              content="One million years dungeon",
              user=u1,
              created=datetime.utcnow())
    p2 = Post(title="Poor Lemongrab",
              content="You try your best",
              user=u2,
              references=[p1],
              created=datetime.utcnow())
    p3 = Post(title="Candy Kingdom",
              content="It's my favorite kingdom!",
              user=u2,
              created=datetime.utcnow())

    db.session.add_all([u1, u2, u3, u4, p1, p2, p3])
    db.session.commit()

    # Add bookmarks
    b1 = Bookmark(user=u3, post_id=p1.id)

    # Add followers
    f1 = Follower(user_id=u1.id, follower_id=u2.id)
    f2 = Follower(user_id=u2.id, follower_id=u3.id)
    f3 = Follower(user_id=u2.id, follower_id=u4.id)

    db.session.add_all([b1, f1, f2, f3])
    db.session.commit()


if __name__ == "__main__":
    import unittest
    unittest.main()