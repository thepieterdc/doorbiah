$(document).ready(function() {
	const gamepanel = $('#gamepanel')[0];
	const context = gamepanel.getContext('2d');
	
	context.imageSmoothingEnabled = false;
	
	const game = new Game(gamepanel, context);
	
	document.addEventListener("keydown", game.keyDownHandler, false);
	document.addEventListener("keyup", game.keyUpHandler, false);
	
	game.draw();
});