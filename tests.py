from unittest import TestCase
from server import app
from model import db, Post, User, Reference, Bookmark, connect_to_db

TEST_DB_URI = "postgresql:///testdb"

class FlaskTests(TestCase):

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
        Post.query.delete()
        User.query.delete()
        Reference.query.delete()
        Bookmark.query.delete()

    def test_user_root(self):

        user = User.query.filter(User.uname=='lemongrab'
                                 ).options(db.joinedload('posts')).one()
        result = self.client.get(f"/users/{user.id}")
        self.assertIn(b'million', result.data)

class ModelTests(TestCase):

    def setUp(self):
        """Do this before each test."""

        print('\n\n...setting up...\n\n')
        self.client = app.test_client()
        app.config['TESTING'] = True

        connect_to_db(app, TEST_DB_URI)
        db_test_data()

    def test_post_references(self):

        print('\n\n\ntest post references\n\n\n')
        self.assertIn('million',
                      Post.query.filter(
                                        Post.title=='Poor Lemongrab'
                                        ).first().references[0].title)

    def test_post_responses(self):

        print('\n\n\ntest post responses\n\n\n')
        self.assertIn('Lemon',
                      Post.query.filter(
                                        Post.title=='One million years dungeon'
                                        ).first().responses[0].title)

    def test_post_author(self):
        print('\n\n\ntest post author\n\n\n')
        self.assertIn('lemon',
                      Post.query.filter(
                                        Post.title=='One million years dungeon'
                                        ).first().user.uname)

    def tearDown(self):
        """Do this after each test."""

        print('\n\n\n...tearing down...\n\n\n')
        Post.query.delete()
        User.query.delete()
        Reference.query.delete()
        Bookmark.query.delete()


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
              user=u1)
    p2 = Post(title="Poor Lemongrab",
              content="You try your best",
              user=u2,
              references=[p1])

    db.session.add_all([u1, u2, u3, u4, p1, p2])
    db.session.commit()

if __name__ == "__main__":
    import unittest
    unittest.main()