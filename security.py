from os import urandom;
from base64 import urlsafe_b64encode as b64encode
from base64 import urlsafe_b64decode as b64decode
from hashlib import sha256
import argon2

TIME = 4000   # Number of iterations of argon2 hash.
MEM = 64    # Memory usage of argon2 hash.
PAR = 2     # Parallelism of threads of argon2 hash.
SIZE = 128  # Bytelength of outputted hashes/salts.
ARGON_TYPE = argon2.Argon2Type.Argon2_d


##############################
#  AUTHENTICATION FUNCTIONS  #
##############################

def check_password(password, salt=urandom(SIZE), stored_hash=urandom(SIZE)):
	"""Check that a password matches a salt and hash.

	Authenticates a password. If either salt or hash does not exist,
	returns False, but still performs the operations in order to defend
	against side channel attacks.
	"""

	computed_hash = argon2.argon2_hash(
						password=password,
						salt=salt,
						t=TIME,
						m=MEM,
						p=PAR,
						buflen=SIZE,
						argon_type=ARGON_TYPE)

	return computed_hash == stored_hash


def make_hash(password, salt):
	"""Generate a hash from a password and a salt."""

	computed_hash = argon2.argon2_hash(
						password=password,
						salt=salt,
						t=TIME,
						m=MEM,
						p=PAR,
						buflen=SIZE,
						argon_type=ARGON_TYPE)


def make_salt():
	"""Generate a cryptographically secure salt."""
	return urandom(SIZE)
	return computed_hash


def validate_password(uname, password):
	"""Validate that password meets minimum standards."""

	# This is an example of a check against blacklisted weak passwords.
	# On a production-level system, this would need to be beefed up.
	bad_password_set = set(['password',
							'PASSWORD',
							uname,
							f'{uname}1',
							f'{uname}!'])

	if len(password) > 128 or len(password) < 8:
		return False
	elif password in bad_password_set:
		return False
	else:
		return True


##################################
#  SESSION MANAGEMENT FUNCTIONS  #
##################################

def generate_session(client_ip, user_agent):
	"""Generates a session tuple of the form (session_id, salt)."""

	salt = urandom(32)  #  32 bytes = 256 bits
	session_id = sha256()
	session_id.update(f'{client_ip}'.encode('utf-8'))
	session_id.update(f'{user_agent}'.encode('utf-8'))
	session_id.update(b64encode(salt))
	session_id = session_id.digest()
	return (session_id, salt)

def verify_session_id(session_id, salt, client_ip, user_agent):
	"""Checks integrity of given session ID."""

	generated_id = sha256()
	generated_id.update(f'{client_ip}'.encode('utf-8'))
	generated_id.update(f'{user_agent}'.encode('utf-8'))
	generated_id.update(b64encode(salt))
	generated_id = generated_id.digest()
	return generated_id == session_id
