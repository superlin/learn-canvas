/*jshint browser: true*/
var canvas = document.getElementById("breakout-canvas");
var ctx = canvas.getContext("2d");

// game
var game = {
  // 砖块的行数
  brickRowCount: 5,
  // 砖块的列数
  brickColumnCount: 3,
  // 剩余命数
  lives: 3,
  // 当前得分
  score: 0,
  // 所有的砖块
  bricks: [],
  // 游戏是否已结束
  over: false,
  // 得分和命数的颜色
  color: '#0095DD',

  // 清除画布
  clear: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },
  start: function () {

  },
  stop: function () {

  },
  // 初始化游戏
  init: function () {
    var brickX, brickY;
    for (var c = 0; c < this.brickColumnCount; c++) {
      this.bricks[c] = [];
      for (var r = 0; r < this.brickRowCount; r++) {
        brickX = (r * (Brick.width + Brick.padding)) + Brick.offsetLeft;
        brickY = (c * (Brick.height + Brick.padding)) + Brick.offsetTop;
        this.bricks[c][r] = new Brick(brickX, brickY);
      }
    }

    ball.reset();
    paddle.reset();
  },
  // 绘制砖块
  drawBricks: function () {
    for (var c = 0; c < this.brickColumnCount; c++) {
      for (var r = 0; r < this.brickRowCount; r++) {
        this.bricks[c][r].draw();
      }
    }
  },
  // 绘制命数
  drawLives: function () {
    ctx.font = "16px Arial";
    ctx.fillStyle = this.color;
    ctx.fillText("Lives: " + this.lives, canvas.width - 65, 20);
  },
  // 绘制得分
  drawScore: function () {
    ctx.font = "16px Arial";
    ctx.fillStyle = this.color;
    ctx.fillText("Score: " + this.score, 8, 20);
  },
  // 检测冲突
  checkCollision: function () {
    for (var c = 0; c < this.brickColumnCount; c++) {
      for (var r = 0; r < this.brickRowCount; r++) {
        var b = this.bricks[c][r];
        if (b.status === 1) {
          if (ball.x > b.x && ball.x < b.x + Brick.width && ball.y > b.y && ball.y < b.y + Brick.height) {
            ball.dy = -ball.dy;
            b.status = 0;
            this.score++;
            if (this.score === this.brickRowCount * this.brickColumnCount) {
              alert("YOU WIN, CONGRATS!");
              document.location.reload();
            }
          }
        }
      }
    }
  }
};

// ball
var ball = {
  // 球的半径
  radius: 10,
  // 位置
  x: null,
  y: null,
  // 移动速度
  dx: 2,
  dy: -2,
  // 球的颜色
  color: '#0095DD',

  // 重置球
  reset: function () {
    this.x = canvas.width / 2;
    this.y = canvas.height - 30;
  },
  // 绘制球
  draw: function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  },
  // 球移动位置
  move: function () {
    this.x += this.dx;
    this.y += this.dy;
  }

};

// paddle
var paddle = {
  // 位置
  x: null,
  // 大小
  width: 75,
  height: 10,
  // 挡板颜色
  color: '#0095DD',

  // 重置挡板
  reset: function () {
    this.x = (canvas.width - this.width) / 2;
  },
  // 绘制挡板
  draw: function () {
    ctx.beginPath();
    ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

};

// bricks
function Brick(x, y) {
  // 位置
  this.x = x;
  this.y = y;
  // 状态：是否已经被消除
  this.status = 1;
}

// 常量：大小，间隔，颜色等
Brick.width = 75;
Brick.height = 20;
Brick.padding = 10;
Brick.offsetLeft = 30;
Brick.offsetTop = 30;
Brick.color = '#0095DD';

// 绘制砖块
Brick.prototype.draw = function () {
  if (this.status == 1) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, Brick.width, Brick.height);
    ctx.fillStyle = Brick.color;
    ctx.fill();
    ctx.closePath();
  }
};

// event listener
var rightPressed = false;
var leftPressed = false;
addEventListener("keydown", keyDownHandler, false);
addEventListener("keyup", keyUpHandler, false);
addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2;
  }
}

// game loop
function loop() {
  game.clear();
  game.drawBricks();
  ball.draw();
  paddle.draw();
  game.drawScore();
  game.drawLives();
  game.checkCollision();
  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ball.radius) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy;
    } else {
      game.lives--;
      if (!game.lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
        ball.dx = 3;
        ball.dy = -3;
        paddle.x = (canvas.width - paddle.width) / 2;
      }
    }
  }
  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += 7;
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= 7;
  }
  ball.move();
  requestAnimationFrame(loop);
}

game.init();
loop();
