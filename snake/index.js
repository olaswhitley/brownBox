const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let initialSpeed = 5;
let currentSpeed = initialSpeed;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 0;

let appleX = 5;
let appleY = 5;
let radius = tileSize/2;

let xVelocity = 0;
let yVelocity = 0;

let previousXVelocity = 0;
let previousYVelocity = 0;

let score = 0;

// Game Loop
function drawGame() {
    //Was moving right and try to move left
    if (previousXVelocity === 1 && xVelocity === -1) {
        xVelocity = previousXVelocity;
    }

    //Was moving left and try to move right
    if (previousXVelocity === -1 && xVelocity === 1) {
        xVelocity = previousXVelocity;
    }

    //Was moving up and try to move down
    if (previousYVelocity === -1 && yVelocity === 1) {
        yVelocity = previousYVelocity;
    }

    //Was moving down and try to move up
    if (previousYVelocity === 1 && yVelocity === -1) {
        yVelocity = previousYVelocity;
    }

    previousXVelocity = xVelocity;
    previousYVelocity = yVelocity;

    changeSnakePosition();
    let result = isGameOver();
    if(result){
        return;
    }
    clearScreen();
    checkAppleCollision();
    drawApple();
    drawSnake();
    updateScore();
    setTimeout(drawGame, 1000 / currentSpeed);

}

function isGameOver() {
    let gameOver = false;

    if(yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    //walls
    if(headX < 0) {
        gameOver = true;
    }
    else if(headX === tileCount) {
        gameOver = true;
    }

    else if(headY < 0) {
        gameOver = true;
    }

    else if(headY === tileCount) {
        gameOver = true;
    }

    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if(part.x == headX && part.y === headY){
            gameOver = true;
            break;
        }
    }

    if (gameOver) {
        document.getElementById("gameOver").innerHTML = "Game Over";
    }

    return gameOver;
}

function updateScore() {
    document.getElementById("score").innerHTML = score;
}

function clearScreen() {
    ctx.fillStyle = "rgb(189,154,122)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {

    // This draws the snake parts
    ctx.fillStyle = "black";
    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }

    // This updates the snakeParts array
    snakeParts.push(new SnakePart(headX, headY)); // Put snake part at the end of list right next to head
    while(snakeParts.length > tailLength) {
        snakeParts.shift(); // Remove snake part at the beginning of list furthest from head
    }

    // This draws the head
    ctx.fillStyle = "black";
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
    ctx.fillStyle = "rgb(189,154,122)";
    ctx.fillRect(headX * tileCount + 3, headY * tileCount + 3, tileSize - 6, tileSize - 6)
}

function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function checkAppleCollision() {
    if(appleX === headX && appleY === headY) {
        generateApplePosition();
        tailLength++;
        score++;
        currentSpeed = initialSpeed + (1 * Math.floor(score/5));
    }
}

function generateApplePosition() {
    let newAppleX = Math.floor(Math.random() * tileCount);
    let newAppleY = Math.floor(Math.random() * tileCount);
  
    const isAppleCollidingWithSnakePart = snakeParts.some(
      (part) => part.x === newAppleX || part.y === newAppleY
    );
  
    if (headX == newAppleX && headY == newAppleY) {
      console.log("Bad apple position head");
      generateApplePosition();
    } else if (isAppleCollidingWithSnakePart) {
      console.log("Bad apple position part");
      generateApplePosition();
    } else {
      appleX = newAppleX;
      appleY = newAppleY;
    }
  }

function drawApple() {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(appleX * tileCount + tileSize/2 , appleY * tileCount + tileSize/2, radius, 0, Math.PI * 2);
    ctx.fill();
}

document.body.addEventListener('keydown', keyDown);

function keyDown(event) {

    if(event.keyCode == 38 || event.keyCode == 87) {
        yVelocity = -1;
        xVelocity = 0;
    }

    if(event.keyCode == 40 || event.keyCode == 83) {
        yVelocity = 1;
        xVelocity = 0;
    }

    if(event.keyCode == 37 || event.keyCode == 65) {
        yVelocity = 0;
        xVelocity = -1;
    }

    if(event.keyCode == 39 || event.keyCode == 68) {
        yVelocity = 0;
        xVelocity = 1;
    }
    
}

drawGame();


