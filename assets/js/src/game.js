const $scoreDisplay = $("#score-display");

const Branddeur = function (canvas, w, h, x, y, dx, dy) {
	const self = this;

	this.width = w;
	this.height = h;

	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	
	this.loaded = false;
	this.image = null;
	
	this.out_of_bounds = false;
	
	this.load_image = function () {
		self.image = new Image();
		self.image.src = 'assets/images/brantdeur.png';
		self.image.onload = function () {
			self.loaded = true;
		}
	};
	
	this.updatePosition = function () {
		self.x += self.dx;
		self.y += self.dy;
		
		if (self.x < -self.width || self.x > canvas.width) {
			self.out_of_bounds = true;
		}
		if (self.y < -self.height || self.y > canvas.height) {
			self.out_of_bounds = true;
		}
	};

	let collideRect = function (head, c1, c2, c3, c4) {
		return (
			head.x + c1*head.width  > self.x  &&  head.x + c2*head.width  < self.x + self.width  &&
			head.y + c3*head.height > self.y  &&  head.y + c4*head.height < self.y + self.height
		);
	};

	this.collides = function (head) {
		return (
			collideRect(head, 0.8, 0.2, 1  , 0  ) ||
			collideRect(head, 0.9, 0.1, 0.2, 0.1) ||
			collideRect(head, 1  , 0  , 0.7, 0.2)
		);
	};
	
	this.load_image();
};
Branddeur.RATIO = 1024 / 1138;

const Head = function (canvas) {
	const self = this;
	
	this.height = 60;
	this.width = 49.8;
	this.x = canvas.width / 2 - this.width / 2;
	this.y = canvas.height / 2 - this.height / 2;
	this.loaded = false;
	this.closed_image = null;
	this.open_image = null;
	this.mouth_status = false;
	
	this.DX = 4;
	this.DY = 4;
	
	this.INACTIVE = 0;
	this.SUPPRESSED = 1;
	this.ACTIVE = 2;
	
	this.movement = {
		"left": this.INACTIVE,
		"right": this.INACTIVE,
		"up": this.INACTIVE,
		"down": this.INACTIVE
	};
	this.OPPOSITES = {
		"left": "right",
		"right": "left",
		"up": "down",
		"down": "up"
	};
	
	this.getImage = function () {
		return self.mouth_status ? self.open_image : self.closed_image;
	};
	
	this.load_images = function () {
		self.closed_image = new Image();
		self.closed_image.src = 'assets/images/tobiah_closed.png';
		self.closed_image.onload = function () {
			self.open_image = new Image();
			self.open_image.src = 'assets/images/tobiah_open.png';
			self.open_image.onload = function () {
				self.loaded = true;
			}
		}
	};
	
	this.toggle_mouth = function (status) {
		self.mouth_status = status;
	};
	
	this.activateDirection = function (direction) {
		this.movement[direction] = this.ACTIVE;
		
		// If the opposite direction is active, suppress it
		let opDir = this.OPPOSITES[direction];
		if (this.movement[opDir] === this.ACTIVE) {
			this.movement[opDir] = this.SUPPRESSED;
		}
	};
	
	this.deactivateDirection = function (direction) {
		this.movement[direction] = this.INACTIVE;
		
		// If the opposite direction is still suppressed, re-activate it
		let opDir = this.OPPOSITES[direction];
		if (this.movement[opDir] === this.SUPPRESSED) {
			this.movement[opDir] = this.ACTIVE;
		}
	};
	
	this.updatePosition = function () {
		let dx, dy;
		
		if (this.movement["left"] === this.ACTIVE)
			dx = -this.DX;
		else if (this.movement["right"] === this.ACTIVE)
			dx = this.DX;
		if (self.x + dx > 0 && self.x + dx + self.width < canvas.width) {
			self.x += dx;
		}
		
		if (this.movement["up"] === this.ACTIVE)
			dy = -this.DY;
		else if (this.movement["down"] === this.ACTIVE)
			dy = this.DY;
		if (self.y + dy > 0 && self.y + dy + self.height < canvas.height) {
			self.y += dy;
		}
	};
	
	this.load_images();
};

const Game = function (canvas, ctx, doneFn) {
	const self = this;
	this.canvas = canvas;
	this.ctx = ctx;
	this.firstScore = undefined;
	this.score = 0;
	this.lives = 2;
	
	this.head = new Head(canvas);
	
	this.herexamen = false;
	this.paused = false;
	
	this.branddeuren = [];
	this.branddeur_counter = 60;
	
	this.started = false;
	
	this.startScreenImageLoaded = false;
	this.startScreenImage = new Image();
	this.startScreenImage.src = 'assets/images/startscreen.png';
	this.startScreenImage.onload = function () {
		self.startScreenImageLoaded = true;
	};
	
	this.addBranddeur = function () {
		if (self.branddeur_counter === 0) {
			let width, height;
			let start_x, start_y;
			let speed_x, speed_y;

			width = Math.ceil( Math.random()*20 + 65 );
			height = width / Branddeur.RATIO;

			start_x = Math.random() > 0.5 ? -width : canvas.width;
			start_y = Math.random() > 0.5 ? -height : canvas.height;

			speed_x = 0;
			speed_y = 0;
			while (speed_x === 0 && speed_y === 0) {
				speed_x = Math.random() * 6 * (start_x === -width  ? 1 : -1);
				speed_y = Math.random() * 6 * (start_y === -height ? 1 : -1);
			}

			self.branddeuren.push(new Branddeur(canvas, width, height, start_x, start_y, speed_x, speed_y));

			self.branddeur_counter = 60;
		} else {
			self.branddeur_counter--;
		}
	};
	
	this.drawBranddeuren = function () {
		self.branddeuren.forEach(function (i) {
			if (i.loaded) {
				self.ctx.drawImage(i.image, i.x, i.y, i.width, i.height);
			}
		});
	};
	
	this.drawHead = function () {
		if (self.head.loaded) {
			self.ctx.drawImage(self.head.getImage(), self.head.x, self.head.y, self.head.width, self.head.height);
		}
	};
	
	this.drawStartScreen = function () {
		if (self.startScreenImageLoaded) {
			self.ctx.drawImage(self.startScreenImage, 0, 0, canvas.width, canvas.height);
		}
	};
	
	this.keyDownHandler = function (e) {
		if (e.keyCode === 32) { // Space
			if (self.started) {
				self.head.toggle_mouth(true);
			} else {
				self.started = true;
			}
		}
		
		if (e.keyCode === 37) { // ←
			self.head.activateDirection("left");
		}
		
		if (e.keyCode === 38) { // ↑
			self.head.activateDirection("up");
		}
		
		if (e.keyCode === 39) { // →
			self.head.activateDirection("right");
		}
		
		if (e.keyCode === 40) { // ↓
			self.head.activateDirection("down");
		}
	};
	
	this.keyUpHandler = function (e) {
		if (e.keyCode === 32) { // Space
			self.head.toggle_mouth(false);
		}
		
		if (e.keyCode === 37) { // ←
			self.head.deactivateDirection("left");
		}
		
		if (e.keyCode === 38) { // ↑
			self.head.deactivateDirection("up");
		}
		
		if (e.keyCode === 39) { // →
			self.head.deactivateDirection("right");
		}
		
		if (e.keyCode === 40) { // ↓
			self.head.deactivateDirection("down");
		}
	};
	
	this.updateBranddeuren = function () {
		for (let i = self.branddeuren.length - 1; i >= 0; i--) {
			let deur = self.branddeuren[i];
			if (deur.out_of_bounds) {
				self.branddeuren.splice(i, 1);
			} else {
				deur.updatePosition();
			}
		}
	};
	
	this.updateHead = function () {
		self.head.updatePosition();
	};
	
	this.updateScore = function () {
		self.score += 0.03;
		if (self.score !== 0) {
			if (self.herexamen) {
				$scoreDisplay.text(Math.ceil(self.score) + '/' + Math.ceil(self.score * 1.42857143) + ' (= 14/20)');
			} else {
				$scoreDisplay.text(Math.ceil(self.score) + '/' + (Math.ceil(self.score) * 10) + ' (= 2/20)');
			}
		} else {
			if (self.herexamen) {
				$scoreDisplay.text('14/20');
			} else {
				$scoreDisplay.text('2/20');
			}
		}
	};
	
	this.checkCollision = function () {
		self.branddeuren.forEach(branddeur => branddeur.collides(self.head) && self.gameOver());
	};
	
	this.gameOver = function () {
		self.paused = true;
		self.lives--;
		if (self.lives === 1) {
			show_alert('Gebuisd!', 'Je hebt gefaalt. Maar geen nood, je krijgt nog een herkansing. Het herexamen begint nu.', function () {
				self.paused = false;
			});
			self.firstScore = self.score;
			self.score = 0;
			self.herexamen = true;
			self.branddeuren.length = 0;
		} else if (self.lives === 0) {
			show_alert('Game over.', 'Ja, kijk euh … ge hebt het, of ge hebt het niet, éh. En gij hebt het duidelijk niet. Vakken meenemen, daar doet Tobiah niet aan mee.');
			if (typeof doneFn !== "undefined") {
				let firstScore = Math.ceil(self.firstScore) + '/' + (Math.ceil(self.firstScore) * 10) + ' <span class="scoreEquiv">(= 2/20)</span">',
					secondScore = Math.ceil(self.score) + '/' + Math.ceil(self.score * 1.42857143) + ' <span class="scoreEquiv">(= 14/20)</span">';
				doneFn(firstScore, secondScore);
			}
		}
	};
	
	this.draw = function () {
		self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
		if (self.started) {
			if (!self.paused) {
				self.addBranddeur();
				self.updateHead();
				self.updateBranddeuren();
				
				self.checkCollision();
				
				self.updateScore();
				
				self.drawBranddeuren();
			}
			self.drawHead();
		} else {
			self.drawStartScreen();
		}
		requestAnimationFrame(self.draw);
	};
};

window.Game = Game;
