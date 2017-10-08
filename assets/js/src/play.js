$(document).ready(function() {
	const $creditspanel = $('#creditspanel');
	const $playpanel = $('#playpanel');
	
	const gamepanel = $('#gamepanel')[0];
	const context = gamepanel.getContext('2d');
	
	let game = new Game(gamepanel, context, function() {
		document.removeEventListener("keydown", game.keyDownHandler, false);
		document.removeEventListener("keyup", game.keyUpHandler, false);
		game = null;
		
		$playpanel.slideUp(500, function() {
			$creditspanel.slideDown(500);
		});
	});
	
	document.addEventListener("keydown", game.keyDownHandler, false);
	document.addEventListener("keyup", game.keyUpHandler, false);
	
	game.draw();
});
