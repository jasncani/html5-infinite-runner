var GRAVITY = 10;
var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 240;
var KEYS = {SPACEBAR : 32, W: 87, UP_ARROW: 38};
var CHARACTER_WIDTH = 56;
var CHARACTER_HEIGHT = 77;

function sprite (options) {
  this.width = options.width;
  this.height = options.height;
  this.image = options.image;
  this.numFrames = options.numFrames;
  this.x = options.x;
  this.y = options.y;
  this.yVelocity = options.yVelocity;
  this.yMin = options.yMin;
  this.frameIndex = 1;
  this.render = function () {
    game.context.drawImage(
      this.image,                               // The image sprite sheet
      this.frameIndex * this.width,             // The x coordinate where to start clipping on the sprite sheet
      0,                                        // The y coordinate where to start clipping on the sprite sheet
      this.width,                               // The width of the clipped image
      this.height,                              // The height of the clipped image
      this.x,                                   // The x coordinate where to place the image on the canvas
      this.y,                                   // The y coordinate where to place the image on the canvas
      this.width,                               // The width of the image to use (stretch or reduce the image)
      this.height                               // The height of the image to use (stretch or reduce the image)
    );
  };
  this.update = function() {
    this.frameIndex = (this.frameIndex + 1) % this.numFrames;
  };
}

function loop() {
  if (game.key && (game.key == KEYS.SPACEBAR || game.key == KEYS.UP_ARROW || game.key == KEYS.W) && character.y == game.canvas.height - character.height) {
    character.yVelocity = -12;
  }
  character.update();
  character.y += character.yVelocity;
  if (character.y < character.yMin) { character.yVelocity = -1 * character.yVelocity; }
  if (character.y > game.canvas.height - character.height) {
    character.y = game.canvas.height - character.height;
    character.yVelocity = 0;
  }
  game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
  character.render();
}

var game = {
  canvas: document.getElementById("charTestCanvas"),
  start: function() {
    this.context = this.canvas.getContext("2d");
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.interval = setInterval(loop, 70);
    window.addEventListener('keydown', function (e) {
      game.key = e.keyCode;
    });
    window.addEventListener('keyup', function (e) {
      game.key = false;
    });
  }
};

var characterImage = new Image();
characterImage.src = "running-man-animation-sprite-8-frame-loop.png";

var character = new sprite(
  {
    width: CHARACTER_WIDTH,
    height: CHARACTER_HEIGHT,
    image: characterImage,
    numFrames: 8,
    x: 0,
    y: CANVAS_WIDTH - CHARACTER_HEIGHT,
    yVelocity: 0,
    yMin: CANVAS_HEIGHT - 1.5 * CHARACTER_HEIGHT
  }
);

game.start();