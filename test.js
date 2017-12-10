function sprite (options) {
  this.context = options.context;
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
    this.context.drawImage(
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
    if (this.y == canvas.height - this.height) { this.frameIndex = (this.frameIndex + 1) % this.numFrames; }
    this.y += this.yVelocity;
    if (this.y < this.yMin) { this.yVelocity = -1 * this.yVelocity; }
    if (this.y > canvas.height - this.height) {
      this.y = canvas.height - this.height;
      this.yVelocity = 0;
    }
  };
}

function loop() {
  if (canvas.key && (canvas.key == keys.spacebar || canvas.key == keys.upArrow || canvas.key == keys.w) && character.y == canvas.height - character.height) {
    character.yVelocity = -12;
  }
  character.update();
  character.context.clearRect(0, 0, canvas.width, canvas.height);
  character.render();
}

var keys = {spacebar : 32, w: 87, upArrow: 38};

var canvas = document.getElementById("charTestCanvas");
canvas.width = 480;
canvas.height = 240;
window.addEventListener('keydown', function (e) {
  canvas.key = e.keyCode;
});
window.addEventListener('keyup', function (e) {
  canvas.key = false;
});

var characterImage = new Image();
characterImage.src = "running-man-animation-sprite-8-frame-loop.png";

var character = new sprite(
  {
    context: canvas.getContext("2d"),
    width: 56,
    height: 77,
    image: characterImage,
    numFrames: 8,
    x: 0,
    y: canvas.height - 77,
    yVelocity: 0,
    yMin: canvas.height - 1.5 * 77
  }
);

canvas.interval = setInterval(loop, 50);
