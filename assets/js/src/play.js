$(document).ready(function() {
	const gamepanel = $('#gamepanel')[0];
	const context = gamepanel.getContext('2d');
	
	const game = new Game(gamepanel, context);
	
	document.addEventListener("keydown", game.keyDownHandler, false);
	document.addEventListener("keyup", game.keyUpHandler, false);
	
	game.draw();
	
	// show_alert('Gebuisd!', 'Je hebt gefaalt. Maar geen nood, je krijgt nog een herkansing. Het herexamen begint nu.');
	// show_alert('Game over.', 'Ja, kijk euh … ge hebt het, of ge hebt het niet, éh. En gij hebt het duidelijk niet. Vakken meenemen, daar doet Tobiah niet aan mee.');
});
