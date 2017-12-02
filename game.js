var character;
var obstacles = [];
var keys = [];
keys["spacebar"] = 32;
keys["w"] = 87;
keys['upArrow'] = 38;
var xSpeed = 1;
var ySpeed = 1;
var spawnInterval = 50;
var characterSize = 30;

var gameArea = {
  canvas : document.createElement("canvas"),
  start : function() { // create a <canvas> html element
    this.canvas.width = 720;
    this.canvas.height = 480;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 1); // call updateGameArea function every 1ms
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
  if (gameArea.key && (gameArea.key == keys["spacebar"] || gameArea.key == keys["upArrow"] || gameArea.key == keys["w"])) {
    character.speedY = -ySpeed;
  }
  else { character.speedY = ySpeed; }
  var x, y;
  for (i = 0; i < obstacles.length; i += 1) {
    if (character.crashWith(obstacles[i])) {
      gameArea.stop();
      return;
    }
  }
  gameArea.clear();
  gameArea.frameNo += 1;
  if (gameArea.frameNo == 1 || framesPassed(spawnInterval)) {
    x = gameArea.canvas.width;
    y = Math.random() * gameArea.canvas.height;
    obstacles.push(new component(characterSize, characterSize, "green", x, y));
  }
  for (i = 0; i < obstacles.length; i += 1) {
    obstacles[i].x += -xSpeed;
    obstacles[i].update();
  }
  character.newPos();
  character.update();
}

function framesPassed(n) {
  if ((gameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  // draws the component
  this.update = function(){
    ctx = gameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  this.newPos = function() {
    this.y += this.speedY;
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
  character = new component(characterSize, characterSize, "red", gameArea.canvas.width / 2, gameArea.canvas.height / 2);
  gameArea.start();
}

startGame();
