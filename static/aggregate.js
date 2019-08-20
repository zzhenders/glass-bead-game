window.UserIds = new Set()

function aggregatePostsHandler(api='') {
	return fetch(api, {method: 'GET'})
	.then(response => {return response.json()}).then(data => {
		// console.log(data);
		let posts = '';
		Object.entries(data).forEach(([key, post]) => {
			// console.log(key, post);
			posts +=
				`<section class="post">
					<a href="/bead?postid=${post.id}">
						<h1>${post.title}</h1>
					</a>
					<p>${post.content}</p>
					<b class="u${post.user_id}">${post.user_id}</b>
					<i id="bookmarker pb${post.id}"></i>
				</section>`;
			UserIds.add(post.user_id);
		});
		$('#main').html(posts);
	});
}

function getUsernames() {
	return fetch(`/users/unames?userids=${Array.from(UserIds).join('.')}`)
	.then(response => {return response.json()}).then(data => {
		Object.entries(data).forEach(([key, user]) => {
					$(`.u${key}`).html(user);});
	});
}

aggregatePostsHandler(api).then(getUsernames)
