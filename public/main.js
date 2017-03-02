$(document).ready(function(){		//when the page loads...





	/*function update(){
		//$(".questions").empty()
		$.ajax({method: "GET", url: 'http://localhost:3000/api/questions'}) //uses get method from index.js
			.done(function(questions){
				questions.sort(function(a,b){
					return b.votes-a.votes;
				})		
				$('.questions').empty().append(questions.map(function(question){	//adds ?s to question div in index.html
					return question.question + "<span><input type='button' class='vote' value='vote' questionId='" + question._id + "'> &nbsp; Current Votes: "+ (question.votes.length) +"<br></span>";
				}))

				if (document.cookie) {  
					$('.loginDisplay').hide();
					$('.logoutDisplay').show();
					$('.vote').show();
				} else if (!document.cookie) {
					$('.logoutDisplay').hide();
					$('.loginDisplay').show();
					$('.vote').hide();
				}

				$('.vote').on('click', function(){
					var id = $(this).attr("questionId");
					var body = {token: document.cookie}
		 			$.ajax({
		 				method: "PUT", 
		 				url: "api/questions/" + id,
		 				data: body
		 			})
		 				.done(update);
				})
			})
	};
	update();

	
  	$(".logoutDisplay").on('click', function(event){
  		event.preventDefault();
  		document.cookie = "";
  		window.location.replace("./index.html");
  	})

	$('#submit-button').on('click', function(){			//when submit button pressed, do this...
		var question = { question : $('#question-text').val() };	//whatever typed in box, assign to value for question
		$.ajax({method: "POST", url: '/api/questions', data: JSON.stringify(question), contentType: 'application/json'})
			.done(function(data){						// redirects to index page
				window.location.replace("./index.html");	
			})		
	})*/

	$(".login").on("click", function(event){
		event.preventDefault();
		var login = {
			name: $('#username').val(),
			password: $('#password').val()
		};

		$.ajax({method: "POST", url: '/api/authenticate', data: JSON.stringify(login), contentType: 'application/json' })
			.done(function(data){
				document.cookie = data.token;
				document.cookie2 = data.name ;
				if (data.token) {
					window.location.replace("./index.html");
				} else {
					alert("You sure that's the right login?");
				}
				//console.log(data);
			})
	})

})

