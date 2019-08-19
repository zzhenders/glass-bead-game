window.UserIds = new Set()

function panelPostsHandler(direction) {
	return function (results) {
		let posts = '';
		Object.entries(results).forEach(([key, post]) => {
			posts +=
				`<section class="post-tile">
					<a href="/bead?postid=${post.id}">
						<h1>${post.title}</h1>
					</a>
					<p>${post.content}</p>
					<b id="u${post.user_id}">${post.user_id}</b>
				</section>`
			;
			UserIds.add(post.user_id);	
		});
		$(direction).html(posts)
	}
}

function extendedPostHandler(results) {
	const extPost =
			`<section class="post-extended">
				<h1>${results.title}</h1>
				<p>${results.content}</p>
				<b>${results.user_id}</b>
				<a href="/editpost?postid=${postid}">edit</a>
			</section>`;
	$('.view').html(extPost);
	UserIds.add(results.user_id);
}

$.get(`/posts/${postid}/references`, panelPostsHandler('.references'));
$.get(`/posts/${postid}`, extendedPostHandler);
$.get(`/posts/${postid}/responses`, panelPostsHandler('.responses'));
$.get('/users/unames',
		   {'userids': Array.from(UserIds).join('.')},
		   (response) => {
		   		console.log(response);
				Object.entries(response).forEach(([key, user]) => {
					$($`u{user.id}`).html(user.uname);
				}
				);
			});
