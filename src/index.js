import { getChessBoard, whiteMove } from "./engine.js";

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
const chessBoard = getChessBoard();
renderChessBoard(root, chessBoard);

document.getElementById("move-form").addEventListener("submit", (e) => {
  document.getElementById("display").innerText = "";
  e.preventDefault();
  const formData = new FormData(e.target);
  const { error, result } = whiteMove(chessBoard, formData.get("move"));
  if (error) {
    document.getElementById("display").innerText = error;
  } else {
    renderChessBoard(root, result);
  }
});
