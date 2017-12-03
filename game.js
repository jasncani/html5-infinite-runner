var character;
var obstacles = [];
var keys = {spacebar : 32, w: 87, upArrow: 38};
var xSpeed = 10;
var ySpeed = 0;
var spawnInterval = 50;
var characterWidth = 30;
var characterHeight = 30;
var gameFps = 50;
var canvasWidth = 720;
var canvasHeight = 240;
var jumpHeight = 4 * characterHeight;

// the canvas object
var gameArea = {
  canvas : document.createElement("canvas"),
  start : function() { // create a <canvas> html element
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 1000 / gameFps); // call updateGameArea on an interval
    window.addEventListener('keydown', function (e) {
      gameArea.key = e.keyCode;
    });
    window.addEventListener('keyup', function (e) {
      gameArea.key = false;
    });
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval);
  }
}

function updateGameArea() {
  gameArea.clear();
  gameArea.frameNo += 1;
  if (gameArea.frameNo == 1 || framesPassed(spawnInterval)) {createNewObstacle();}
  if (gameArea.key && (gameArea.key == keys.spacebar || gameArea.key == keys.upArrow || gameArea.key == keys.w) && character.y == gameArea.canvas.height - characterHeight) {
    ySpeed = -5;
  }
  if (character.y == canvasHeight - jumpHeight) {ySpeed = 5;}
  character.y += ySpeed;
  if (character.y > canvasHeight - characterHeight) {character.y = canvasHeight - characterHeight;}
  updateObstaclePositions();
  character.update();
  checkForCollisions();
}

function checkForCollisions() {
  for (i = 0; i < obstacles.length; i += 1) {
    if (character.colidesWith(obstacles[i])) {
      gameArea.stop();
    }
  }
}

function updateObstaclePositions() {
  for (i = 0; i < obstacles.length; i += 1) {
    obstacles[i].x += -xSpeed;
    obstacles[i].update();
  }
}

function createNewObstacle() {
  var obstacleHeight = (Math.random() * characterHeight/2) + characterHeight;
  var x = gameArea.canvas.width;
  var y = gameArea.canvas.height - obstacleHeight;
  obstacles.push(new component(characterWidth, obstacleHeight, "green", x, y));
}

function framesPassed(n) {
  if ((gameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}

// the character/obstacle object
function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  // draws the component
  this.update = function(){
    ctx = gameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
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

function startGame() {
  character = new component(characterWidth, characterHeight, "red", canvasWidth / 4, canvasHeight - characterHeight);
  gameArea.start();
}

startGame();
