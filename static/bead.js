window.UserIds = new Set()

function panelPostsHandler(url='', direction='') {
	return fetch(url, {method: 'GET'})
	.then(response => {return response.json()})
	.then(data => {
		// console.log(data);
		let posts = '';
		Object.entries(data).forEach(([key, post]) => {
			// console.log(key, post);
			posts +=
				`<section class="post-tile">
					<a href="/bead?postid=${post.id}">
						<h1>${post.title}</h1>
					</a>
					<p>${post.content}</p>
					<a href="aggregate?api=.users.${post.user_id}.posts"
					class="u${post.user_id}"></a>
				</section>`;
			UserIds.add(post.user_id);	
		});
		$(direction).html(posts);
	});
}

function extendedPostHandler(url) {
	return fetch(url, {method: 'GET'})
	.then(response => {return response.json()})
	.then(data => {
		const extPost =
				`<section class="post-extended">
					<h1>${data.title}</h1>
					<p>${data.content}</p>
					<a href="aggregate?api=.users.${data.user_id}.posts"
					class="u${data.user_id}"></a>
					<a href="/editpost?postid=${data.id}">edit</a>
				</section>`;
		$('.view').html(extPost);
		UserIds.add(data.user_id);
	});
}

function getUsernames() {
	if (UserIds.size != 0) {
		return fetch(`/users/unames?userids=${Array.from(UserIds).join('.')}`)
		.then(response => {return response.json()})
		.then(data => {
			Object.entries(data).forEach(([key, user]) => {
				$(`.u${key}`).html(user);
			});
		});
	}
}

a = panelPostsHandler(`/posts/${postid}/references`, '.references');
b = panelPostsHandler(`/posts/${postid}/responses`, '.responses');
c = extendedPostHandler(`/posts/${postid}`)

Promise.all([a, b, c])
.then(getUsernames)
