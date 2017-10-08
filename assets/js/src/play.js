$(document).ready(function () {
	const gamepanel = $('#gamepanel')[0];
	const gamepanel_parent = $('#gamepanel-container')[0];
	const context = gamepanel.getContext('2d');
	
	context.imageSmoothingEnabled = true;
	
	gamepanel.width = gamepanel_parent.offsetWidth;
	gamepanel.height = gamepanel_parent.offsetWidth/2;
	
	const game = new Game(gamepanel, context);
	
	document.addEventListener("keydown", game.keyDownHandler, false);
	document.addEventListener("keyup", game.keyUpHandler, false);
	
	game.draw();
});