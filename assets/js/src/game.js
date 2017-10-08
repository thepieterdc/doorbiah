const $scoreDisplay = $("#score-display");

const Branddeur = function (canvas, x, y, dx, dy) {
	const self = this;
	
	this.width = 26.0949033;
	this.height = 29;
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	
	this.loaded = false;
	this.image = null;
	
	this.load_image = function () {
		self.image = new Image();
		self.image.src = 'assets/images/brantdeur.png';
		self.image.onload = function () {
			self.loaded = true;
		}
	};
};

const Head = function (canvas) {
	const self = this;
	
	this.height = 30;
	this.width = 24.9;
	this.x = canvas.width / 2 - this.width / 2;
	this.y = canvas.height / 2 - this.height/2;
	this.loaded = false;
	this.closed_image = null;
	this.open_image = null;
	this.mouth_status = false;
	
	this.herexamen = false;
	
	this.moveLeft = false;
	this.moveRight = false;
	this.moveUp = false;
	this.moveDown = false;
	
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
	
	this.updatePosition = function () {
		let dx = self.moveLeft ? -3 : 0;
		dx = self.moveRight ? 3 : dx;
		
		if (self.x + dx > 0 && self.x + dx + self.width < canvas.width) {
			self.x += dx;
		}
		
		let dy = self.moveUp ? 3 : 0;
		dy = self.moveDown ? -3 : dy;
		
		if (self.y - dy > 0 && self.y - dy + self.height < canvas.height) {
			self.y -= dy;
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
		if (e.keyCode === 32) {
			self.head.toggle_mouth(true);
		}
		
		if (e.keyCode === 37) {
			self.head.moveLeft = true;
		}
		
		if (e.keyCode === 38) {
			self.head.moveUp = true;
		}
		
		if (e.keyCode === 39) {
			self.head.moveRight = true;
		}
		
		if (e.keyCode === 40) {
			self.head.moveDown = true;
		}
	};
	
	this.keyUpHandler = function (e) {
		if (e.keyCode === 32) {
			self.head.toggle_mouth(false);
		}
		
		if (e.keyCode === 37) {
			self.head.moveLeft = false;
		}
		
		if (e.keyCode === 38) {
			self.head.moveUp = false;
		}
		
		if (e.keyCode === 39) {
			self.head.moveRight = false;
		}
		
		if (e.keyCode === 40) {
			self.head.moveDown = false;
		}
	};
	
	this.updateHead = function () {
		self.head.updatePosition();
	};
	
	this.updateScore = function () {
		self.score += 0.03;
		if (self.score !== 0) {
			if(self.herexamen) {
				$scoreDisplay.text(Math.ceil(self.score) + '/' + (Math.ceil(self.score * 1.42857143) + ' (= 14/20)');
			} else {
				$scoreDisplay.text(Math.ceil(self.score) + '/' + (Math.ceil(self.score) * 10) + ' (= 2/20)');
			}
		} else {
			if(self.herexamen) {
				$scoreDisplay.text('14/20');
			} else {
				$scoreDisplay.text('2/20');
			}
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
