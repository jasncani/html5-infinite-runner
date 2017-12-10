var GRAVITY = 10;
var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 240;
var KEYS = {SPACEBAR : 32, W: 87, UP_ARROW: 38};
var CHARACTER_WIDTH = 56;
var CHARACTER_HEIGHT = 77;

function sprite (options) {
  var that = {};
  that.context = options.context;
  that.width = options.width;
  that.height = options.height;
  that.image = options.image;
  that.numFrames = options.numFrames;
  that.x = options.x;
  that.y = options.y;
  that.frameIndex = 0;
  that.render = function () {
    that.context.clearRect(0, 0, canvas.width, canvas.height);
    that.context.drawImage(
      that.image,                               // The image sprite sheet
      that.frameIndex * this.width,             // The x coordinate where to start clipping on the sprite sheet
      0,                                        // The y coordinate where to start clipping on the sprite sheet
      that.width,                               // The width of the clipped image
      that.height,                              // The height of the clipped image
      that.x,                                   // The x coordinate where to place the image on the canvas
      that.y,                                   // The y coordinate where to place the image on the canvas
      that.width,                               // The width of the image to use (stretch or reduce the image)
      that.height                               // The height of the image to use (stretch or reduce the image)
    );
  };
  that.update = function() {
    that.frameIndex = (this.frameIndex + 1) % this.numFrames;
  };
  return that;
}

function loop() {
  if (game.key && (game.key == KEYS.SPACEBAR || game.key == KEYS.UP_ARROW || game.key == KEYS.W) && character.y == canvas.height - character.height) {
    character.yVelocity = -12;
  }
  character.y += character.yVelocity;
  if (character.y < character.yMin) { character.yVelocity = -1 * character.yVelocity; }
  if (character.y > canvas.height - character.height) {
    character.y = canvas.height - character.height;
    character.yVelocity = 0;
  }
  obstacle.x += obstacle.xVelocity;
  character.render();
  obstacle.render();
  character.update();
}

var game = {
  start: function() {
    this.interval = setInterval(loop, 75);
    window.addEventListener('keydown', function (e) {
      game.key = e.keyCode;
    });
    window.addEventListener('keyup', function (e) {
      game.key = false;
    });
  }
};

var canvas = document.getElementById("charTestCanvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

var characterImage = new Image();
characterImage.src = "running-man-animation-sprite-8-frame-loop.png";

var character = sprite(
  {
    context: canvas.getContext("2d"),
    width: CHARACTER_WIDTH,
    height: CHARACTER_HEIGHT,
    image: characterImage,
    numFrames: 8,
    x: 0,
    y: CANVAS_HEIGHT - CHARACTER_HEIGHT,
  }
);
character.yVelocity = 0;
character.yMin = CANVAS_HEIGHT - 2 * CHARACTER_HEIGHT;

function obstacle() {
  this.width = 30;
  this.height = 30;
  this.x = CANVAS_WIDTH;
  this.y = CANVAS_HEIGHT - this.height;
  this.xVelocity = -10;
  context = canvas.getContext("2d");
  context.fillStyle = "blue";
  this.render = function() {
    context.fillRect(this.x, this.y, this.width, this.height);
  };
}

obstacle = new obstacle();
game.start();
