const $scoreDisplay = $("#score-display");

const Head = function(canvas) {
	const self = this;
	
	this.height = 30;
	this.width = 24.9;
	this.x = canvas.width / 2;
	this.y = canvas.height /2;
	this.loaded = false;
	this.closed_image = null;
	this.open_image = null;
	this.mouth_status = false;
	
	this.getImage = function() {
		return self.mouth_status ? self.open_image : self.closed_image;
	};
	
	this.load_images = function() {
		self.closed_image = new Image();
		self.closed_image.src = 'assets/images/tobiah_closed.png';
		self.closed_image.onload = function() {
			console.log("woehoew");
			self.open_image = new Image();
			self.open_image.src = 'assets/images/tobiah_open.png';
			self.open_image.onload = function() {
				self.loaded = true;
			}
		}
	};
	
	this.toggle_mouth = function(status) {
		self.mouth_status = status;
	};
	
	this.load_images();
};

const Game = function(canvas, ctx) {
	const self = this;
	this.canvas = canvas;
	this.ctx = ctx;
	this.score = 0;
	this.lives = 2;
	
	this.head = new Head(canvas);
	
	this.drawHead = function() {
		if(self.head.loaded) {
			self.ctx.drawImage(self.head.getImage(), self.head.x, self.head.y, self.head.width, self.head.height);
		}
	};
	
	this.keyDownHandler = function(e) {
		if(e.keyCode === 32) {
			self.head.toggle_mouth(true);
		}
	};
	
	this.keyUpHandler = function(e) {
		if(e.keyCode === 32) {
			self.head.toggle_mouth(false);
		}
	};
	
	this.updateScore = function() {
		$scoreDisplay.text(self.score);
	};
	
	this.draw = function() {
		self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
		
		self.drawHead();
		self.updateScore();
		
		requestAnimationFrame(self.draw);
	}
};

window.Game = Game;