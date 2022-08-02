"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showWord = exports.showControls = exports.resetCanvas = exports.resetAnswer = exports.hideWord = exports.hideControls = exports.handleStrokedPath = exports.handleFilled = exports.handleBeganPath = exports.enableCanvas = exports.disableCanvas = void 0;

var _sockets = require("./sockets.js");

var canvas = document.getElementById("jsCanvas");
var word = document.getElementById("jsWord");
var answer = document.getElementById("jsAnswer");
var controls = document.getElementById("jsControls");
var colors = document.getElementsByClassName("jsColor");
var mode = document.getElementById("jsMode");
var lineWidth = document.getElementById("lineWidth");
var ctx = canvas.getContext("2d");
var INITIAL_COLOR = "#2c2c2c";
var CANVAS_SIZE = 700;
var LINE_WIDTH = 2.5;
canvas.width = CANVAS_SIZE;
canvas.heigth = CANVAS_SIZE;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = LINE_WIDTH;
var painting = false;
var filling = false;

var appendWord = function appendWord(text) {
  var p = document.createElement("p");
  p.innerHTML = "<strong>".concat(text, "</strong>");
  answer.appendChild(p);
}; //그리기 여부 적용


function stopPainting() {
  painting = false;
}

function startPainting() {
  painting = true;
} //그리기 시작점 가져오기


var beginPath = function beginPath(x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y);
}; //실질적 그림 그리


var strokePath = function strokePath(x, y) {
  var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var currentColor = ctx.strokeStyle; //선택한 색깔이 있다면

  if (color !== null) ctx.strokeStyle = color;
  ctx.lineTo(x, y);
  ctx.stroke(); //기본색 변환

  ctx.strokeStyle = currentColor;
}; //마우스 이동에 따라
//위치를 받는것인지, 그리고 있는것인지 적용


function onMouseMove(event) {
  var x = event.offsetX;
  var y = event.offsetY;

  if (!painting) {
    beginPath(x, y);
    (0, _sockets.getSocket)().emit("beginPath", {
      x: x,
      y: y
    });
  } else {
    strokePath(x, y);
    (0, _sockets.getSocket)().emit("strokePath", {
      x: x,
      y: y,
      color: ctx.strokeStyle
    });
  }
} //단어 입력 받기


var handleWordSetting = function handleWordSetting(event) {
  event.preventDefault();
  var input = word.querySelector("input");
  var value = input.value;
  (0, _sockets.getSocket)().emit("setWord", {
    word: value
  });
  input.value = "";
  hideWord();
  appendWord(value);
}; //색상 변경


function handleColorClick(event) {
  var color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
} //모드 변경 버튼


function handleModeClick() {
  if (filling === true) {
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "Paint";
  }
} //폭 변경하기


function handleWidthChange(e) {
  var value = e.target.value;
  ctx.lineWidth = value;
  lineWidth.value = value;
} //전체 채우기


var fill = function fill() {
  var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var currentColor = ctx.fillStyle;

  if (color !== null) {
    ctx.fillStyle = color;
  }

  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = currentColor;
}; //그리기 영역에서 모드에 따라 동작


function handleCanvasClick() {
  if (filling) {
    fill();
    (0, _sockets.getSocket)().emit("fill", {
      color: ctx.fillStyle
    });
  }
}

function handleCM(event) {
  event.preventDefault();
} //동일한 클래스로 적용한 색깔들에 대해서(배열로 받아옴)
//각 색깔마다 eventhandler 적용시키기 위해


Array.from(colors).forEach(function (color) {
  return color.addEventListener("click", handleColorClick);
}); //모드 변경 적용

if (mode) {
  mode.addEventListener("click", handleModeClick);
} //폭 변경 적용


if (lineWidth) {
  lineWidth.addEventListener("input", handleWidthChange);
} //외부 socket에서 작용


var handleBeganPath = function handleBeganPath(_ref) {
  var x = _ref.x,
      y = _ref.y;
  return beginPath(x, y);
};

exports.handleBeganPath = handleBeganPath;

var handleStrokedPath = function handleStrokedPath(_ref2) {
  var x = _ref2.x,
      y = _ref2.y,
      color = _ref2.color;
  return strokePath(x, y, color);
};

exports.handleStrokedPath = handleStrokedPath;

var handleFilled = function handleFilled(_ref3) {
  var color = _ref3.color;
  return fill(color);
};

exports.handleFilled = handleFilled;

var disableCanvas = function disableCanvas() {
  canvas.removeEventListener("mousemove", onMouseMove);
  canvas.removeEventListener("mousedown", startPainting);
  canvas.removeEventListener("mouseup", stopPainting);
  canvas.removeEventListener("mouseleave", stopPainting);
  canvas.removeEventListener("click", handleCanvasClick);
};

exports.disableCanvas = disableCanvas;

var enableCanvas = function enableCanvas() {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick);
};

exports.enableCanvas = enableCanvas;

var hideControls = function hideControls() {
  controls.style.display = "none";
};

exports.hideControls = hideControls;

var showControls = function showControls() {
  controls.style.display = "inline";
};

exports.showControls = showControls;

var resetCanvas = function resetCanvas() {
  return fill("#fff");
};

exports.resetCanvas = resetCanvas;

var resetAnswer = function resetAnswer() {
  var del = answer.querySelector("p");
  del.remove();
};

exports.resetAnswer = resetAnswer;

var hideWord = function hideWord() {
  word.style.display = "none";
  var input = word.querySelector("input");
  input.style.display = "none";
};

exports.hideWord = hideWord;

var showWord = function showWord() {
  word.style.display = "inline";
  var input = word.querySelector("input");
  input.style.display = "inline";
};

exports.showWord = showWord;

if (canvas) {
  canvas.addEventListener("contextmenu", handleCM);
  hideControls();
}

if (word) {
  word.addEventListener("submit", handleWordSetting);
}