window.UserIds = new Set();
window.PostIds = new Set();

function aggregatePostsHandler(api='') {
	return fetch(api, {method: 'GET'})
	.then(response => {return response.json()})
	.then(data => {
		let posts = '';
		Object.entries(data).forEach(([key, post]) => {
			posts +=
				`<section class="post">
					<a href="/bead?postid=${post.id}">
						<h1>${post.title}</h1>
					</a>
					<p>${post.content}</p>
					<a href="aggregate?api=.users.${post.user_id}.posts"
					class="u${post.user_id}"></a>
					<i class="bookmarker"
					id="pb${post.id}"
					post-id="${post.id}"></i>
				</section>`;
			UserIds.add(post.user_id);
			PostIds.add(post.id);
		});
		$('#main').html(posts);
	});
}

function getUsernames() {
	if (UserIds.size != 0) {
		return fetch(`/users/unames?userids=${Array.from(UserIds).join('.')}`)
		.then(response => {return response.json()})
		.then(data => {
			Object.entries(data).forEach(([key, user]) => {
				$(`.u${key}`).html(user);
			})
		});
	}
}

function bookmarker(evt) {
	post_id = evt.target.attributes['post-id'].value;
	if (evt.target.innerHTML === "unbookmark") {
		return fetch(`/users/${uid}/bookmarks/delete`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: `post_id=${post_id}`,
		}).then(() => $(`#pb${post_id}`).html('bookmark'));
	} else if (evt.target.innerHTML === "bookmark") {
		return fetch(`/users/${uid}/bookmarks/create`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: `post_id=${post_id}`,
		}).then(() => $(`#pb${post_id}`).html('unbookmark'));
	}
}

function getBookmarks() {
	if (PostIds.size != 0) {
		uid = parseInt(document.cookie.slice(4));
		return fetch(`/posts/bookmarked?postids=${Array.from(PostIds).join('.')}&uid=${uid}`)
		.then(response => {return response.json()})
		.then(data => {
			Object.entries(data).forEach(([key, value]) => {
				if (value) {
					console.log(value);
					$(`#pb${key}`).html('unbookmark');
				} else {
					$(`#pb${key}`).html('bookmark');
				}
				$(`#pb${key}`).click(bookmarker);
			})
		})
	}
}

aggregatePostsHandler(api)
.then(getUsernames).then(getBookmarks);
