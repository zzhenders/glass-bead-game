window.UserIds = new Set()

function panelPostsHandler(url='', direction='') {
	return fetch(url, {method: 'GET'})
	.then(response => {return response.json()}).then(data => {
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
					<b class="u${post.user_id}">${post.user_id}</b>
				</section>`;
			UserIds.add(post.user_id);	
		});
		$(direction).html(posts);
	});
}

function extendedPostHandler(url) {
	return fetch(url, {method: 'GET'})
	.then(response => {return response.json()}).then(data => {
		console.log(data);
		const extPost =
				`<section class="post-extended">
					<h1>${data.title}</h1>
					<p>${data.content}</p>
					<b class="u${data.user_id}">${data.user_id}</b>
					<a href="/editpost?postid=${data.id}">edit</a>
				</section>`;
		$('.view').html(extPost);
		UserIds.add(data.user_id);
	});
}

function getUsernames() {
	return fetch(`/users/unames?userids=${Array.from(UserIds).join('.')}`)
	.then(response => {return response.json()}).then(data => {
		Object.entries(data).forEach(([key, user]) => {
					$(`.u${key}`).html(user);});
	});
}

a = panelPostsHandler(`/posts/${postid}/references`, '.references');
b = panelPostsHandler(`/posts/${postid}/responses`, '.responses');
c = extendedPostHandler(`/posts/${postid}`)

Promise.all([a, b, c]).then(getUsernames);
