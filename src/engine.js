const black = Object.freeze({
  King: "bK",
  Queen: "bQ",
  Rook: "bR",
  Bishop: "bB",
  Knight: "bN",
  Pawn: "bP",
});

const white = Object.freeze({
  King: "wK",
  Queen: "wQ",
  Rook: "wR",
  Bishop: "wB",
  Knight: "wN",
  Pawn: "wP",
});

const pieces = {
  black,
  white,
};

const empty = "";

export function getChessBoard() {
  return [
    [
      white.Rook,
      white.Knight,
      white.Bishop,
      white.Queen,
      white.King,
      white.Bishop,
      white.Knight,
      white.Rook,
    ],
    Array(8).fill(white.Pawn),
    ...Array(4)
      .fill(0)
      .map(() => Array(8).fill(empty)),
    Array(8).fill(black.Pawn),
    [
      black.Rook,
      black.Knight,
      black.Bishop,
      black.Queen,
      black.King,
      black.Bishop,
      black.Knight,
      black.Rook,
    ],
  ];
}

const loggingMap = {
  bP: "♟",
  bN: "♞",
  bB: "♝",
  bR: "♜",
  bQ: "♛",
  bK: "♚",
  wP: "♙",
  wN: "♘",
  wB: "♗",
  wR: "♖",
  wQ: "♕",
  wK: "♔",
  "": "empty",
};
/**
 *
 * @param {string[][]} chessBoard
 * @param {string} move
 * @param {"white" | "black"} color
 * @returns { {error?: string, result?: string[][]} }
 */
export function makeMove(chessBoard, move, color) {
  if (move.length == 2) {
    let toFileIndex = move.charCodeAt(0) - "a".charCodeAt(0);
    let toRankIndex = move.charCodeAt(1) - "1".charCodeAt(0);
    if (chessBoard[toRankIndex][toFileIndex] !== "") {
      return {
        error: `Location is occupied by ${
          loggingMap[chessBoard[toRankIndex][toFileIndex]]
        }`,
      };
    }
    return movePawn(chessBoard, toRankIndex, toFileIndex, color);
  } else if (move.length == 3) {
    let toFileIndex = move.charCodeAt(1) - "a".charCodeAt(0);
    let toRankIndex = move.charCodeAt(2) - "1".charCodeAt(0);
    if (chessBoard[toRankIndex][toFileIndex] !== "") {
      return {
        error: `Location is occupied by ${
          loggingMap[chessBoard[toRankIndex][toFileIndex]]
        }`,
      };
    }
    switch (move[0]) {
      case "P":
        return movePawn(chessBoard, toRankIndex, toFileIndex, color);
      case "R":
        return moveRook(chessBoard, toRankIndex, toFileIndex, color);
      case "N":
        return moveKnight(chessBoard, toRankIndex, toFileIndex, color);
      case "B":
        return moveBishop(chessBoard, toRankIndex, toFileIndex, color);
      case "K":
        return moveKing(chessBoard, toRankIndex, toFileIndex, color);
      case "Q":
        return moveQueen(chessBoard, toRankIndex, toFileIndex, color);
      default:
        return { error: `unknown piece: ${move[0]}` };
    }
  }
  return { error: "not a valid move" };
}

/**
 *
 * @param {string[][]} chessBoard
 * @param {string} move
 * @returns { {error?: string, result?: string[][]} }
 */
function movePawn(chessBoard, toRankIndex, toFileIndex, color) {
  const sign = color === "white" ? 1 : -1;
  const pawnRow = color === "white" ? 1 : 6;
  let fromRankIndex = chessBoard.findIndex(
    (rank) => rank[toFileIndex] === pieces[color].Pawn
  );

  if (
    toRankIndex - fromRankIndex !== sign &&
    (toRankIndex - fromRankIndex !== sign * 2 || fromRankIndex !== pawnRow)
  ) {
    return { error: "Incorrect pawn move" };
  }
  chessBoard[fromRankIndex][toFileIndex] = empty;
  chessBoard[toRankIndex][toFileIndex] = pieces[color].Pawn;
  return { result: chessBoard };
}

/**
 *
 * @param {string[][]} chessBoard
 * @param {string} move
 * @param {"white" | "black"} color
 * @returns { {error?: string, result?: string[][]} }
 */
function moveRook(chessBoard, toRankIndex, toFileIndex, color) {
  let possibleRooks = linearSearch(
    chessBoard,
    toRankIndex,
    toFileIndex,
    pieces[color].Rook
  );

  if (possibleRooks.length === 1) {
    const loc = possibleRooks[0];
    chessBoard[loc[0]][loc[1]] = empty;
    chessBoard[toRankIndex][toFileIndex] = pieces[color].Rook;
    return { result: chessBoard };
  } else if (!possibleRooks.length) {
    return {
      error: `No rook can move there`,
    };
  } else {
    return {
      error: `${possibleRooks.length} rooks can move there`,
    };
  }
}

/**
 *
 * @param {string[][]} chessBoard
 * @param {string} move
 * @param {"white" | "black"} color
 * @returns { {error?: string, result?: string[][]} }
 */
function moveKnight(chessBoard, toRankIndex, toFileIndex, color) {
  function getPossibleKnightMoves(i, j) {
    return [
      [i - 2, j - 1],
      [i - 1, j - 2],
      [i + 1, j - 2],
      [i + 2, j - 1],
      [i + 2, j + 1],
      [i + 1, j + 2],
      [i - 1, j + 2],
      [i - 2, j + 1],
    ].filter(([i, j]) => i >= 0 && i < 8 && j >= 0 && j < 8);
  }

  let knightMoves = getPossibleKnightMoves(toRankIndex, toFileIndex);
  let possibleKnights = knightMoves.filter(
    ([i, j]) => chessBoard[i][j] === pieces[color].Knight
  );

  if (possibleKnights.length === 1) {
    const loc = possibleKnights[0];
    chessBoard[loc[0]][loc[1]] = empty;
    chessBoard[toRankIndex][toFileIndex] = pieces[color].Knight;
    return { result: chessBoard };
  } else if (!possibleKnights.length) {
    return {
      error: `No knight can move there`,
    };
  } else {
    return {
      error: `${possibleKnights.length} knights can move there`,
    };
  }
}

/**
 *
 * @param {string[][]} chessBoard
 * @param {string} move
 * @param {"white" | "black"} color
 * @returns { {error?: string, result?: string[][]} }
 */
function moveBishop(chessBoard, toRankIndex, toFileIndex, color) {
  let possibleBishops = diagonalSearch(
    chessBoard,
    toRankIndex,
    toFileIndex,
    pieces[color].Bishop
  );

  if (possibleBishops.length === 1) {
    const loc = possibleBishops[0];
    chessBoard[loc[0]][loc[1]] = empty;
    chessBoard[toRankIndex][toFileIndex] = pieces[color].Bishop;
    return { result: chessBoard };
  } else if (!possibleBishops.length) {
    return {
      error: `No bishop can move there`,
    };
  } else {
    return {
      error: `${possibleBishops.length} bishops can move there`,
    };
  }
}

/**
 *
 * @param {string[][]} chessBoard
 * @param {string} move
 * @param {"white" | "black"} color
 * @returns { {error?: string, result?: string[][]} }
 */
function moveQueen(chessBoard, toRankIndex, toFileIndex, color) {
  let possibleQueens = [
    ...linearSearch(chessBoard, toRankIndex, toFileIndex, pieces[color].Queen),
    ...diagonalSearch(
      chessBoard,
      toRankIndex,
      toFileIndex,
      pieces[color].Queen
    ),
  ];

  if (possibleQueens.length === 1) {
    const loc = possibleQueens[0];
    chessBoard[loc[0]][loc[1]] = empty;
    chessBoard[toRankIndex][toFileIndex] = pieces[color].Queen;
    return { result: chessBoard };
  } else if (!possibleQueens.length) {
    return {
      error: `No queen can move there`,
    };
  } else {
    return {
      error: `${possibleQueens.length} queens can move there`,
    };
  }
}

/**
 *
 * @param {string[][]} chessBoard
 * @param {string} move
 * @param {"white" | "black"} color
 * @returns { {error?: string, result?: string[][]} }
 */
function moveKing(chessBoard, toRankIndex, toFileIndex, color) {
  let possibleKingPositions = [
    [toRankIndex - 1, toFileIndex - 1],
    [toRankIndex - 1, toFileIndex],
    [toRankIndex - 1, toFileIndex + 1],
    [toRankIndex, toFileIndex + 1],
    [toRankIndex + 1, toFileIndex + 1],
    [toRankIndex + 1, toFileIndex],
    [toRankIndex + 1, toFileIndex - 1],
    [toRankIndex, toFileIndex - 1],
  ].filter(([rank, file]) => rank >= 0 && rank < 8 && file >= 0 && file < 8);

  const possibleKings = possibleKingPositions.filter(
    ([rank, file]) => chessBoard[rank][file] === pieces[color].King
  );

  if (possibleKings.length === 1) {
    const loc = possibleKings[0];
    chessBoard[loc[0]][loc[1]] = empty;
    chessBoard[toRankIndex][toFileIndex] = pieces[color].King;
    return { result: chessBoard };
  } else if (!possibleKings.length) {
    return {
      error: `No queen can move there`,
    };
  } else {
    return {
      error: `${possibleKings.length} queens can move there`,
    };
  }
}

function linearSearch(chessBoard, rank, file, targetPiece) {
  const foundPieces = [];
  // rank up
  for (let i = rank + 1; i < 8; i++) {
    const piece = chessBoard[i][file];
    const location = [i, file];
    if (piece === empty) continue;
    if (piece === targetPiece) foundPieces.push(location);
    break;
  }

  // rank down
  for (let i = rank - 1; i >= 0; i--) {
    const piece = chessBoard[i][file];
    const location = [i, file];
    if (piece === empty) continue;
    if (piece === targetPiece) foundPieces.push(location);
    break;
  }

  // file up
  for (let j = file + 1; j < 8; j++) {
    const piece = chessBoard[rank][j];
    const location = [rank, j];
    if (piece === empty) continue;
    if (piece === targetPiece) foundPieces.push(location);
    break;
  }

  // file down
  for (let j = file - 1; j >= 0; j--) {
    const piece = chessBoard[rank][j];
    const location = [rank, j];
    if (piece === empty) continue;
    if (piece === targetPiece) foundPieces.push(location);
    break;
  }
  return foundPieces;
}

function diagonalSearch(chessBoard, rank, file, targetPiece) {
  const possiblePieces = [];
  for (let i = rank + 1, j = file + 1; i < 8 && j < 8; i++, j++) {
    const piece = chessBoard[i][j];
    const location = [i, j];
    if (piece === empty) continue;
    if (piece === targetPiece) possiblePieces.push(location);
    break;
  }

  for (let i = rank + 1, j = file - 1; i < 8 && j >= 0; i++, j--) {
    const piece = chessBoard[i][j];
    const location = [i, j];
    if (piece === empty) continue;
    if (piece === targetPiece) possiblePieces.push(location);
    break;
  }

  for (let i = rank - 1, j = file + 1; i >= 0 && j < 8; i--, j++) {
    const piece = chessBoard[i][j];
    const location = [i, j];
    if (piece === empty) continue;
    if (piece === targetPiece) possiblePieces.push(location);
    break;
  }

  for (let i = rank - 1, j = file - 1; i >= 0 && j >= 0; i--, j--) {
    const piece = chessBoard[i][j];
    const location = [i, j];
    if (piece === empty) continue;
    if (piece === targetPiece) possiblePieces.push(location);
    break;
  }
  return possiblePieces;
}
