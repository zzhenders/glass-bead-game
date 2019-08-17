function aggregatePostsHandler(results){
	let posts = '';
	Object.entries(results).forEach(([key, post]) => {
		posts +=
			`<section class="post">
				<h1>${post.title}</h1>
				<p>${post.content}</p>
			</section>`
		;	
	});
	$('#main').html(posts)
}

$.get(api, (results) => {aggregatePostsHandler(results)});
