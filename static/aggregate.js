window.UserIds = new Set()

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
					<i id="bookmarker pb${post.id}"></i>
				</section>`;
			UserIds.add(post.user_id);
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

aggregatePostsHandler(api)
.then(getUsernames);
