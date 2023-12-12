import { getStartingChessBoard, makeMove } from "./engine.js";

import "./chess-elements.js";

function fileRow() {
  let rowDiv = document.createElement("div");
  rowDiv.classList.add("board-row");
  " abcdefgh ".split("").forEach((letter) => {
    let fileDiv = document.createElement("chess-square");
    fileDiv.setAttribute("piece", letter);
    fileDiv.classList.add("darker");
    rowDiv.appendChild(fileDiv);
  });
  return rowDiv;
}

function getRankDiv(rank) {
  let rankDiv = document.createElement("chess-square");
  rankDiv.setAttribute("piece", rank);
  rankDiv.classList.add("darker");
  return rankDiv;
}

function renderChessBoard(root, chessBoard) {
  const board = document.createElement("div");
  board.classList.add("board");
  board.appendChild(fileRow());
  chessBoard.forEach((row, i) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("board-row");
    rowDiv.appendChild(getRankDiv(i + 1));
    row.forEach((cell, j) => {
      const cellDiv = document.createElement("chess-square");
      if ((i + j) % 2 == 0) {
        cellDiv.classList.add("dark");
      }
      cellDiv.setAttribute("piece", cell);
      rowDiv.appendChild(cellDiv);
    });
    rowDiv.appendChild(getRankDiv(i + 1));
    board.appendChild(rowDiv);
  });

  board.appendChild(fileRow());
  root.innerHTML = "";
  root.appendChild(board);
}

const root = document.getElementById("root");
const labelElement = document.getElementById("move-label");
const movesForm = document.getElementById("move-form");
var currentTurn = new Proxy(
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
    set(target, prop, value) {
      labelElement.innerText =
        value === "w" ? "White to move" : "Black to move";
      return Reflect.set(...arguments);
    },
  }
);

const chessBoard = getStartingChessBoard();
renderChessBoard(root, chessBoard);

movesForm.addEventListener("submit", (e) => {
  document.getElementById("display").innerText = "";
  e.preventDefault();
  const formData = new FormData(e.target);
  e.target.reset();
  const { error, result } = makeMove(
    chessBoard,
    formData.get("move"),
    currentTurn.color
  );

  if (error) {
    document.getElementById("display").innerText = error;
  } else {
    renderChessBoard(root, result);
    currentTurn.next();
  }
});
