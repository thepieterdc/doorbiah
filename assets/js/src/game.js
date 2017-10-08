const $scoreDisplay = $("#score-display");

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
	
	this.INACTIVE   = 0;
	this.SUPPRESSED = 1;
	this.ACTIVE     = 2;

	this.movement = {
		"left":  this.INACTIVE,
		"right": this.INACTIVE,
		"up":    this.INACTIVE,
		"down":  this.INACTIVE
	};
	this.OPPOSITES = {
		"left":  "right",
		"right": "left",
		"up":    "down",
		"down":  "up"
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
	
	this.updateHead = function () {
		self.head.updatePosition();
	};
	
	this.updateScore = function () {
		self.score += 0.03;
		if (self.score !== 0) {
			$scoreDisplay.text(Math.ceil(self.score) + '/' + (Math.ceil(self.score) * 10) + ' (= 2/20)');
		} else {
			$scoreDisplay.text('2/20');
		}
	};
	
	this.draw = function () {
		self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
		
		self.updateHead();
		self.updateScore();
		
		self.drawHead();
		
		requestAnimationFrame(self.draw);
	}
};

window.Game = Game;
