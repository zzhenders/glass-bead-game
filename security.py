from os import urandom;
import argon2;

TIME = 4   # Number of iterations of argon2 hash.
MEM = 16    # Memory usage of argon2 hash.
PAR = 2     # Parallelism of threads of argon2 hash.
SIZE = 128  # Bitlength of outputted hashes/salts.
ARGON_TYPE = argon2.Argon2Type.Argon2_d

def make_salt():
	"""Generate a cryptographically secure salt."""
	return urandom(SIZE)


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

	return computed_hash
