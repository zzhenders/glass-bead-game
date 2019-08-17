function panelPostsHandler(results, direction) {
	let posts = '';
	Object.entries(results).forEach(([key, post]) => {
		posts +=
			`<section class="post-tile">
				<a href="/bead?postid=${post.id}">
					<h1>${post.title}</h1>
				</a>
				<p>${post.content}</p>
			</section>`
		;	
	});
	$(direction).html(posts)
}

function extendedPostHandler(results) {
	const extPost =
			`<section class="post-extended">
				<h1>${results.title}</h1>
				<p>${results.content}</p>
			</section>`
	$('.view').html(extPost)
}

$.get(`/posts/${postid}/references`, (results) => {panelPostsHandler(results, '.references')});
$.get(`/posts/${postid}`, (results) => {extendedPostHandler(results)});
$.get(`/posts/${postid}/responses`, (results) => {panelPostsHandler(results, '.responses')});
