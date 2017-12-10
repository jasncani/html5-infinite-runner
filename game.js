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

var obstacles = [];

function Obstacle() {
  this.width = 30;
  this.height = 30;
  this.x = CANVAS_WIDTH;
  this.y = CANVAS_HEIGHT - this.height;
  this.xVelocity = -12;
  this.context = canvas.getContext("2d");
  this.context.fillStyle = "blue";
  this.draw = function() {
    this.context.fillRect(this.x, this.y, this.width, this.height);
  };
  this.colidesWith = function(otherObj) {
    var myLeft = this.x;
    var myRight = this.x + (this.width);
    var myTop = this.y;
    var myBottom = this.y + (this.height);
    var otherLeft = otherObj.x;
    var otherRight = otherObj.x + (otherObj.width);
    var otherTop = otherObj.y;
    var otherBottom = otherObj.y + (otherObj.height);
    if ((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || (myLeft > otherRight)) {
      return false;
    }
    return true;
  };
}

function loop() {
  game.frame += 1;
  if (game.frame % 30 == 0) { obstacles.push(new Obstacle()); }
  if (game.key && (game.key == KEYS.SPACEBAR || game.key == KEYS.UP_ARROW || game.key == KEYS.W) && character.y == canvas.height - character.height) {
    character.yVelocity = -12;
  }
  character.y += character.yVelocity;
  if (character.y < character.yMin) { character.yVelocity = -1 * character.yVelocity; }
  if (character.y > canvas.height - character.height) {
    character.y = canvas.height - character.height;
    character.yVelocity = 0;
  }
  character.render();
  character.update();
  for (var i = 0; i < obstacles.length; i++) {
    obstacles[i].x += obstacles[i].xVelocity;
    obstacles[i].draw();
    if (obstacles[i].colidesWith(character)) {
      game.stop();
    }
  }
}

var game = {
  start: function() {
    this.frame = 0;
    this.interval = setInterval(loop, 60);
    window.addEventListener('keydown', function (e) {
      game.key = e.keyCode;
    });
    window.addEventListener('keyup', function (e) {
      game.key = false;
    });
  },
  stop : function() {
    clearInterval(this.interval);
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

game.start();
