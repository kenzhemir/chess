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

export function renderChessBoard(root, chessBoard) {
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
  return board;
}
