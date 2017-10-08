const $scoreDisplay = $("#score-display");

const Branddeur = function (canvas, x, y, dx, dy) {
	const self = this;
	
	this.width = 28.48;
	this.height = 32;
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
	
	this.load_image();
};

const Head = function (canvas) {
	const self = this;
	
	this.height = 30;
	this.width = 24.9;
	this.x = canvas.width / 2 - this.width / 2;
	this.y = canvas.height / 2 - this.height / 2;
	this.loaded = false;
	this.closed_image = null;
	this.open_image = null;
	this.mouth_status = false;
	
	this.DX = 3;
	this.DY = 3;
	
	this.herexamen = false;
	
	
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

const Game = function (canvas, ctx) {
	const self = this;
	this.canvas = canvas;
	this.ctx = ctx;
	this.score = 0;
	this.lives = 2;
	
	this.head = new Head(canvas);
	
	this.branddeuren = [];
	this.branddeur_counter = 60;
	
	this.addBranddeur = function () {
		let start_x;
		let start_y;
		let speed_x;
		let speed_y;
		if (self.branddeur_counter === 0) {
			start_x = Math.random() > 0.5 ? 0 : canvas.width;
			start_y = Math.random() > 0.5 ? 0 : canvas.height;
			
			speed_x = 0;
			speed_y = 0;
			while (speed_x === 0 && speed_y === 0) {
				speed_x = Math.random() * 4 * (start_x === 0 ? 1 : -1);
				speed_y = Math.random() * 4 * (start_y === 0 ? 1 : -1);
			}
			
			self.branddeuren.push(new Branddeur(canvas, start_x, start_y, speed_x, speed_y));
			
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
	
	this.keyDownHandler = function (e) {
		if (e.keyCode === 32) { // Space
			self.head.toggle_mouth(true);
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
				$scoreDisplay.text(Math.ceil(self.score) + '/' + (Math.ceil(self.score * 1.42857143) + ' (= 14/20)'));
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
	
	this.draw = function () {
		self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
		
		self.addBranddeur();
		self.updateHead();
		self.updateBranddeuren();
		self.updateScore();
		
		self.drawBranddeuren();
		self.drawHead();
		
		requestAnimationFrame(self.draw);
	}
};

window.Game = Game;
