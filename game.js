var character;
var obstacles = [];
var keys = [];
keys["spacebar"] = 32;
keys["w"] = 87;
keys['upArrow'] = 38;
var xSpeed = 3;
var ySpeed = 3;
var spawnInterval = 150;
var characterWidth = 30;
var characterHeight = 30;
var gameFps = 120;
var canvasWidth = 720;
var canvasHeight = 240;

var gameArea = {
  canvas : document.createElement("canvas"),
  start : function() { // create a <canvas> html element
    this.canvas.width = 720;
    this.canvas.height = 240;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 1000 / gameFps); // call updateGameArea on an interval
    window.addEventListener('keydown', function (e) {
      gameArea.key = e.keyCode;
    })
    window.addEventListener('keyup', function (e) {
      gameArea.key = false;
    })
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
  if (gameArea.frameNo == 1 || framesPassed(spawnInterval)) {
    var obstacleHeight = (Math.random() * characterHeight) + characterHeight;
    var x = gameArea.canvas.width;
    var y = gameArea.canvas.height - obstacleHeight;
    obstacles.push(new component(characterWidth, obstacleHeight, "green", x, y));
  }
  for (i = 0; i < obstacles.length; i += 1) {
    obstacles[i].x += -xSpeed;
    obstacles[i].update();
  }
  character.update();
  if (gameArea.key && (gameArea.key == keys["spacebar"] || gameArea.key == keys["upArrow"] || gameArea.key == keys["w"])) {
    character.y = gameArea.canvas.height - 4 * characterHeight;
  }
  else { character.y = gameArea.canvas.height - characterHeight; }
  for (i = 0; i < obstacles.length; i += 1) {
    if (character.crashWith(obstacles[i])) {
      gameArea.stop();
      return;
    }
  }
}

function framesPassed(n) {
  if ((gameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}

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
  }
  this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}

function startGame() {
  character = new component(characterWidth, characterHeight, "red", canvasWidth / 4, canvasHeight - characterHeight);
  gameArea.start();
}

startGame();
