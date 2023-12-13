import "./chess-elements.js";
import { getStartingChessBoard, makeMove } from "./chess-engine.js";
import { renderChessBoard } from "./chess-render.js";

// Dom setup
const root = document.getElementById("root");
function renderBoard(chessBoard) {
  root.innerHTML = "";
  root.appendChild(renderChessBoard(root, chessBoard));
}

// game
const chessBoard = getStartingChessBoard();
renderBoard(chessBoard);

// Controls
const labelElement = document.getElementById("move-label");
const movesForm = document.getElementById("move-form");
const currentTurn = new Proxy(
  {
    color: "w",
    get isWhite() {
      return this.color === "w";
    },
    next() {
      if (this.isWhite) {
        this.color = "b";
      } else {
        this.color = "w";
      }
    },
  },
  {
    set(_, property, value) {
      if (property === "color") {
        labelElement.innerText =
          value === "w" ? "White to move" : "Black to move";
      }
      return Reflect.set(...arguments);
    },
  }
);

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

movesForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const move = formData.get("move");
  e.target.reset();
  display.content = "";
  const { error, result } = makeMove(chessBoard, move, currentTurn.color);

  if (error) {
    display.content = error;
  } else {
    renderBoard(result);
    currentTurn.next();
  }
});
