import { getChessBoard, whiteMove } from "./engine.js";

import "./chess-elements.js";

function renderChessBoard(root, chessBoard) {
  const board = document.createElement("div");
  board.classList.add("board");
  chessBoard.forEach((row, i) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("board-row");
    row.forEach((cell, j) => {
      const cellDiv = document.createElement("chess-square");
      if ((i + j) % 2 == 0) {
        cellDiv.classList.add("dark");
      }
      cellDiv.setAttribute("piece", cell);
      rowDiv.appendChild(cellDiv);
    });
    board.appendChild(rowDiv);
  });
  root.innerHTML = "";
  root.appendChild(board);
}

const root = document.getElementById("root");
const chessBoard = getChessBoard();
renderChessBoard(root, chessBoard);

document.getElementById("move-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const { error, result } = whiteMove(chessBoard, formData.get("move"));
  if (error) {
    document.getElementById("display").innerText += error;
  } else {
    renderChessBoard(root, result);
  }
});
