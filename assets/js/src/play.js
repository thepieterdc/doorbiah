$(document).ready(function() {
	const gamepanel = $('#gamepanel')[0];
	const context = gamepanel.getContext('2d');
	
	const game = new Game(gamepanel, context);
	
	document.addEventListener("keydown", game.keyDownHandler, false);
	document.addEventListener("keyup", game.keyUpHandler, false);
	
	game.draw();
	
	// if(window.devicePixelRatio) {
	// 	context.scale(window.devicePixelRatio, window.devicePixelRatio);
	// }
	
	// show_alert('Gebuisd!', 'Je bent gefaald. Maar geen nood, je krijgt nog een herkansing. Het herexamen begint nu.');
	// show_alert('Game over.', 'Ja kijk euh ge hebt het of ge hebt het niet, en gij hebt het duidelijk niet. Vakken meenemen doet Tobiah niet aan.');
});