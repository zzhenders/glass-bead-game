function aggregatePostsHandler(results){
	let posts = '';
	Object.entries(results).forEach(([key, post]) => {
		posts +=
			`<section class="post">
				<a href="/bead?postid=${post.id}">
					<h1>${post.title}</h1>
				</a>
				<p>${post.content}</p>
				<b>${post.user_id}</b>
			</section>`
		;	
	});
	$('#main').html(posts)
}

$.get(api, (results) => {aggregatePostsHandler(results)});
