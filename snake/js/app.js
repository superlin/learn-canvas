/*jshint browser:true*/

var canvas = document.getElementById("the-game");
var context = canvas.getContext("2d");

// game
var game = {
  // 得分
  score: 0,
  // 帧数
  fps: 8,
  // 游戏是否已经结束
  over: false,
  // 提示消息
  message: null,

  // 开始游戏
  start: function () {
    game.over = false;
    game.message = null;
    game.score = 0;
    game.fps = 8;
    snake.init();
    food.set();
  },

  // 结束游戏
  stop: function () {
    game.over = true;
    game.message = 'GAME OVER - PRESS SPACE';
  },

  // 绘制小方块（snake food）
  drawBox: function (x, y, size, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x - (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y + (size / 2));
    context.lineTo(x - (size / 2), y + (size / 2));
    context.closePath();
    context.fill();
  },

  // 画布中绘制分数
  drawScore: function () {
    context.fillStyle = '#999';
    context.font = (canvas.height) + 'px Impact, sans-serif';
    context.textAlign = 'center';
    context.fillText(game.score, canvas.width / 2, canvas.height * 0.9);
  },

  // 输出提示信息
  drawMessage: function () {
    if (game.message !== null) {
      context.fillStyle = '#00F';
      context.strokeStyle = '#FFF';
      context.font = (canvas.height / 10) + 'px Impact';
      context.textAlign = 'center';
      context.fillText(game.message, canvas.width / 2, canvas.height / 2);
      context.strokeText(game.message, canvas.width / 2, canvas.height / 2);
    }
  },

  // 重置画布
  resetCanvas: function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

};

// snake
var snake = {
  // snake的单位大小
  size: canvas.width / 40,
  // 头部节点的位置
  x: null,
  y: null,
  // 小块颜色
  color: '#0F0',
  // 运动方向
  direction: 'left',
  // snake的组成小块
  sections: [],

  // 初始化
  init: function () {
    snake.sections = [];
    snake.direction = 'left';
    snake.x = canvas.width / 2 + snake.size / 2;
    snake.y = canvas.height / 2 + snake.size / 2;
    for (var i = snake.x + (5 * snake.size); i >= snake.x; i -= snake.size) {
      snake.sections.push(i + ',' + snake.y);
    }
  },

  // 移动snake
  move: function () {
    switch (snake.direction) {
    case 'up':
      snake.y -= snake.size;
      break;
    case 'down':
      snake.y += snake.size;
      break;
    case 'left':
      snake.x -= snake.size;
      break;
    case 'right':
      snake.x += snake.size;
      break;
    }
    snake.checkCollision();
    snake.checkGrowth();
    snake.sections.push(snake.x + ',' + snake.y);
  },

  // 绘制snake当前的状态
  draw: function () {
    for (var i = 0; i < snake.sections.length; i++) {
      snake.drawSection(snake.sections[i].split(','));
    }
  },

  // 绘制snake的组成小块
  drawSection: function (section) {
    game.drawBox(parseInt(section[0]), parseInt(section[1]), snake.size, snake.color);
  },

  // 检测冲突
  checkCollision: function () {
    if (snake.isCollision(snake.x, snake.y) === true) {
      game.stop();
    }
  },

  // 是否冲突
  isCollision: function (x, y) {
    // 越界或者撞上自己
    if (x < snake.size / 2 ||
      x > canvas.width ||
      y < snake.size / 2 ||
      y > canvas.height ||
      snake.sections.indexOf(x + ',' + y) >= 0) {
      return true;
    }
  },

  // 检查是否吃上food
  checkGrowth: function () {
    if (snake.x == food.x && snake.y == food.y) {
      game.score++;
      if (game.score % 5 === 0 && game.fps < 60) {
        game.fps++;
      }
      food.set();
    } else {
      snake.sections.shift();
    }
  }

};

// food
var food = {
  // food的大小（和snake的大小一样）
  size: null,
  // 位置
  x: null,
  y: null,
  // 颜色
  color: '#0FF',

  // 找到合适的地方设置food的位置
  set: function () {
    food.size = snake.size;
    food.x = (Math.ceil(Math.random() * 10) * snake.size * 4) - snake.size / 2;
    food.y = (Math.ceil(Math.random() * 10) * snake.size * 3) - snake.size / 2;
  },

  // 绘制food
  draw: function () {
    game.drawBox(food.x, food.y, food.size, food.color);
  }

};

// helpers
var inverseDirection = {
  'up': 'down',
  'left': 'right',
  'right': 'left',
  'down': 'up'
};

var keys = {
  up: [38, 75, 87],
  down: [40, 74, 83],
  left: [37, 65, 72],
  right: [39, 68, 76],
  start_game: [13, 32]
};

Object.prototype.getKey = function (value) {
  for (var key in this) {
    if (this[key] instanceof Array && this[key].indexOf(value) >= 0) {
      return key;
    }
  }
  return null;
};

// event listen
// 保证每一帧只响应一次按键
var pressed = false;
addEventListener("keydown", function (e) {
  if (pressed) {
    return;
  }

  var lastKey = keys.getKey(e.keyCode);
  if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0 && lastKey != inverseDirection[snake.direction]) {
    snake.direction = lastKey;
  } else if (['start_game'].indexOf(lastKey) >= 0 && game.over) {
    game.start();
  }
  pressed = true;
}, false);

// game loop
window.requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame;

function loop() {
  if (game.over === false) {
    game.resetCanvas();
    game.drawScore();
    snake.move();
    food.draw();
    snake.draw();
    game.drawMessage();
  }
  setTimeout(function () {
    requestAnimationFrame(loop);
    pressed = false;
  }, 1000 / game.fps);
}

requestAnimationFrame(loop);
