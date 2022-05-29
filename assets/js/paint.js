import { getSocket } from "./sockets";

const word = document.getElementById("jsWord");
const answer = document.getElementById("jsAnswer");
const canvas = document.getElementById("jsCanvas");
const controls = document.getElementById("jsControls");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const mode = document.getElementById("jsMode");
const lineWidth = document.getElementById("lineWidth");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;
const LINE_WIDTH = 2.5;

canvas.width = CANVAS_SIZE;
canvas.heigth = CANVAS_SIZE;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = LINE_WIDTH;

let painting = false;
let filling = false;

const appendWord = (text) => {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${text}</strong>`;
  answer.appendChild(p);
};
//그리기 여부 적용
function stopPainting() {
  painting = false;
}
function startPainting() {
  painting = start;
}

//그리기 시작점 가져오기
const beginPath = (x, y) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
};

//실질적 그림 그리
const strokePath = (x, y, color = null) => {
  let currentColor = ctx.strokeStyle;
  //선택한 색깔이 있다면
  if (color !== null) ctx.strokeStyle = color;
  ctx.lineTo(x, y);
  ctx.stroke();
  //기본색 변환
  ctx.strokeStyle = currentColor;
};

//마우스 이동에 따라
//위치를 받는것인지, 그리고 있는것인지 적용
function onMouseMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    beginPath(x, y);
    getSocket().emit("beginPath", { x, y });
  } else {
    strokePath(x, y);
    getSocket().emit("strokePath", { x, y, color: ctx.strokeStyle });
  }
}

//단어 입력 받기
function handleWordSetting(event) {
  event.preventDefault();
  const input = word.querySelector("input");
  const { value } = input;
  getSocket().emit("setWord", { word: value });
  input.value = "";
  appendWord(value);
}

//색상 변경
function handleColorClick(event) {
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

//모드 변경 버튼
function handleModeClick() {
  if (filling === true) {
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "Paint";
  }
}

//폭 변경하기
function handleWidthChange(e) {
  const {
    target: { value },
  } = e;
  ctx.lineWidth = value;
  lineWidth.value = value;
}

//전체 채우기
const fill = (color = null) => {
  let currentColor = ctx.fillStyle;
  if (color !== null) {
    ctx.fillStyle = color;
  }
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = currentColor;
};

//그리기 영역에서 모드에 따라 동작
function handleCanvasClick() {
  if (filling) {
    fill();
    getSocket().emit("fill", { color: ctx.fillStyle });
  }
}

function handleCM(event) {
  event.preventDefault();
}

//동일한 클래스로 적용한 색깔들에 대해서(배열로 받아옴)
//각 색깔마다 eventhandler 적용시키기 위해
Array.from(colors).forEach((color) =>
  color.addEventListener("click", handleColorClick)
);

//모드 변경 적용
if (mode) {
  mode.addEventListener("click", handleModeClick);
}

//폭 변경 적용
if (lineWidth) {
  lineWidth.addEventListener("input", handleWidthChange);
}
if (word) {
  word.addEventListener("submit", handleWordSetting);
}

//외부 socket에서 작용
export const handleBeganPath = ({ x, y }) => beginPath(x, y);
export const handleStrokedPath = ({ x, y, color }) => strokePath(x, y, color);
export const handleFilled = ({ color }) => fill(color);

export const disableCanvas = () => {
  canvas.removeEventListener("mousemove", onMouseMove);
  canvas.removeEventListener("mousedown", startPainting);
  canvas.removeEventListener("mouseup", stopPainting);
  canvas.removeEventListener("mouseleave", stopPainting);
  canvas.removeEventListener("click", handleCanvasClick);
};

export const enableCanvas = () => {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick);
};

export const hideControls = () => {
  controls.style.display = "none";
};
export const showControls = () => {
  controls.style.display = "flex";
};

export const resetCanvas = () => fill("#fff");

export const hideWord = () => {
  word.style.display = "none";
};
export const showWord = () => {
  word.style.display = "flex";
};

if (canvas) {
  canvas.addEventListener("contextmenu", handleCM);
  hideControls();
}
