import { renderTheMessages } from "./chat-room.js";
import "./chess-elements.js";
import { getStartingChessBoard, makeMove } from "./chess-engine.js";
import { renderChessBoard } from "./chess-render.js";
import { onGameSnapshot, pushMoveToFirebase } from "./firebase.js";

window.app = {};

const roomFormContainer = document.getElementById("room-selector");
const roomForm = document.getElementById("room-selector-form");

const gameDiv = document.getElementById("game");
const boardDiv = document.getElementById("board");

const chatRoomDiv = document.getElementById("chat-room");

// room select
roomForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const roomId = formData.get("roomId");
  const name = formData.get("name");
  const color = formData.get("color");
  console.log({ roomId, color });

  window.app.myColor = color;
  window.app.roomId = roomId;
  window.app.name = name;
  roomFormContainer.hidden = true;
  gameDiv.hidden = false;
  chatRoomDiv.hidden = false;
  // game
  const unsub = onGameSnapshot(roomId, (game) => {
    renderTheGame(game);
    renderTheMessages(game?.messages ?? []);
  });
});

function renderBoard(chessBoard) {
  boardDiv.innerHTML = "";
  boardDiv.appendChild(renderChessBoard(boardDiv, chessBoard));
}

// Controls

const labelElement = document.getElementById("move-label");
const movesForm = document.getElementById("move-form");
const moveFormInputs = movesForm.querySelectorAll("input");
function setFormDisabled(value) {
  console.log("toggling form", moveFormInputs, { value });
  for (const inputEl of moveFormInputs) {
    console.log({ inputEl, value });
    inputEl.disabled = value;
  }
}
const displayDiv = document.getElementById("display");
const display = new Proxy(
  {
    content: "",
  },
  {
    set(_, property, value) {
      if (property === "content") {
        displayDiv.innerText = value;
      }
      return Reflect.set(...arguments);
    },
  }
);

function applyMoves(chessBoard, moves) {
  let isWhite = true;
  moves.forEach((move) => {
    makeMove(chessBoard, move, isWhite ? "w" : "b");
    isWhite = !isWhite;
  });
  return { currentTurnColor: isWhite ? "w" : "b" };
}

function renderTheGame(game) {
  const moves = game?.moves?.split(" ").filter(Boolean) ?? [];
  const chessBoard = getStartingChessBoard();
  const { currentTurnColor } = applyMoves(chessBoard, moves);
  window.app.chessBoard = chessBoard;

  // rendering
  renderBoard(chessBoard);
  labelElement.innerText =
    currentTurnColor === "w" ? "White to move" : "Black to move";
  setFormDisabled(currentTurnColor !== window.app.myColor);
}

movesForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const move = formData.get("move");
  e.target.reset();
  display.content = "";
  const { error } = makeMove(window.app.chessBoard, move, window.app.myColor);

  if (error) {
    display.content = error;
  } else {
    pushMoveToFirebase(window.app.roomId, move);
  }
});
