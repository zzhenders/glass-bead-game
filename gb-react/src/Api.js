let apiBase = 'http://localhost:5000'
if (process.env.NODE_ENV === 'production') {
	apiBase = '';
}

export function getPosts(api) {
	let uri = `${apiBase}${api}`
	return fetch(uri, {
	}).then(response => {
		return response.json()
	});
}

export function writePost(api, data) {
	let uri = `${apiBase}${api}`;
	return fetch(uri, {
		method: 'POST',
		headers: {
			'Content-Type':  'application/json',
		},
		body: JSON.stringify(data),
	});
}

export function getUsernames(arrayOfUsernames) {

	let uri = `${apiBase}/users/unames?userids=${arrayOfUsernames.join('.')}`
	return fetch(uri)
	.then(response => {
		return response.json()
	});
}

export function getBookmarks(arrayOfPostIds, uid) {
	let uri = `${apiBase}/posts/bookmarked?postids=${arrayOfPostIds.join('.')}&uid=${uid}`
	return fetch(uri)
	.then(response => {
		return response.json()
	});
}

export function updateBookmark(uid, post_id, action) {
	let uri = `${apiBase}/users/${uid}/bookmarks/${action}`
	return fetch(uri, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: `post_id=${post_id}`,
		});
}
