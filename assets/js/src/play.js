$(document).ready(function () {
	const $creditspanel = $('#creditspanel');
	const $playpanel = $('#playpanel');
	
	const gamepanel = $('#gamepanel')[0];
	const gamepanel_parent = $('#gamepanel-container')[0];
	const context = gamepanel.getContext('2d');
	
	context.imageSmoothingEnabled = true;
	
	gamepanel.width = gamepanel_parent.offsetWidth;
	gamepanel.height = gamepanel_parent.offsetWidth / 2;
	
	let game = new Game(gamepanel, context, function (firstScore, secondScore) {
		document.removeEventListener("keydown", game.keyDownHandler, false);
		document.removeEventListener("keyup", game.keyUpHandler, false);
		game = null;
		
		$("[data-content=firstscore]").html(firstScore);
		$("[data-content=secondscore]").html(secondScore);
		$playpanel.slideUp(500, function () {
			$creditspanel.slideDown(500);
		});
	});
	
	document.addEventListener("keydown", game.keyDownHandler, false);
	document.addEventListener("keyup", game.keyUpHandler, false);
	
	game.draw();
});
