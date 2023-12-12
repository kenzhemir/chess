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
 * @returns { {error?: string, result?: string[][]} }
 */
export function whiteMove(chessBoard, move) {
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
    return moveWhitePawn(chessBoard, toRankIndex, toFileIndex);
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
        return moveWhitePawn(chessBoard, toRankIndex, toFileIndex);
      case "R":
        return moveWhiteRook(chessBoard, toRankIndex, toFileIndex);
      case "N":
        return moveWhiteKnight(chessBoard, toRankIndex, toFileIndex);
      case "B":
        return moveWhiteBishop(chessBoard, toRankIndex, toFileIndex);
      case "K":
        return moveWhiteKing(chessBoard, toRankIndex, toFileIndex);
      case "Q":
        return moveWhiteQueen(chessBoard, toRankIndex, toFileIndex);
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
function moveWhitePawn(chessBoard, toRankIndex, toFileIndex) {
  let fromRankIndex = chessBoard.findIndex(
    (rank) => rank[toFileIndex] === white.Pawn
  );

  if (
    toRankIndex - fromRankIndex !== 1 &&
    (toRankIndex - fromRankIndex !== 2 || fromRankIndex !== 1)
  ) {
    return { error: "Incorrect pawn move" };
  }
  chessBoard[fromRankIndex][toFileIndex] = empty;
  chessBoard[toRankIndex][toFileIndex] = white.Pawn;
  return { result: chessBoard };
}

/**
 *
 * @param {string[][]} chessBoard
 * @param {string} move
 * @returns { {error?: string, result?: string[][]} }
 */
function moveWhiteRook(chessBoard, toRankIndex, toFileIndex) {
  let possibleRooks = [];
  // rank up
  for (let i = toRankIndex + 1; i < 8; i++) {
    const piece = chessBoard[i][toFileIndex];
    const location = [i, toFileIndex];
    if (piece === empty) continue;
    if (piece === white.Rook) possibleRooks.push(location);
    break;
  }

  // rank down
  for (let i = toRankIndex - 1; i >= 0; i--) {
    const piece = chessBoard[i][toFileIndex];
    const location = [i, toFileIndex];
    if (piece === empty) continue;
    if (piece === white.Rook) possibleRooks.push(location);
    break;
  }

  // file up
  for (let j = toFileIndex + 1; j < 8; j++) {
    const piece = chessBoard[toRankIndex][j];
    const location = [toRankIndex, j];
    if (piece === empty) continue;
    if (piece === white.Rook) possibleRooks.push(location);
    break;
  }

  // file down
  for (let j = toFileIndex - 1; j >= 0; j--) {
    const piece = chessBoard[toRankIndex][j];
    const location = [toRankIndex, j];
    if (piece === empty) continue;
    if (piece === white.Rook) possibleRooks.push(location);
    break;
  }

  if (possibleRooks.length === 1) {
    const loc = possibleRooks[0];
    chessBoard[loc[0]][loc[1]] = empty;
    chessBoard[toRankIndex][toFileIndex] = white.Rook;
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
 * @returns { {error?: string, result?: string[][]} }
 */
function moveWhiteKnight(chessBoard, toRankIndex, toFileIndex) {
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
    ([i, j]) => chessBoard[i][j] === white.Knight
  );

  if (possibleKnights.length === 1) {
    const loc = possibleKnights[0];
    chessBoard[loc[0]][loc[1]] = empty;
    chessBoard[toRankIndex][toFileIndex] = white.Knight;
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
 * @returns { {error?: string, result?: string[][]} }
 */
function moveWhiteBishop(chessBoard, toRankIndex, toFileIndex) {
  let possibleBishops = [];

  for (let i = toRankIndex + 1, j = toFileIndex + 1; i < 8 && j < 8; i++, j++) {
    const piece = chessBoard[i][j];
    const location = [i, j];
    if (piece === empty) continue;
    if (piece === white.Bishop) possibleBishops.push(location);
    break;
  }

  for (
    let i = toRankIndex + 1, j = toFileIndex - 1;
    i < 8 && j >= 0;
    i++, j--
  ) {
    const piece = chessBoard[i][j];
    const location = [i, j];
    if (piece === empty) continue;
    if (piece === white.Bishop) possibleBishops.push(location);
    break;
  }

  for (
    let i = toRankIndex - 1, j = toFileIndex + 1;
    i >= 0 && j < 8;
    i--, j++
  ) {
    const piece = chessBoard[i][j];
    const location = [i, j];
    if (piece === empty) continue;
    if (piece === white.Bishop) possibleBishops.push(location);
    break;
  }

  for (
    let i = toRankIndex - 1, j = toFileIndex - 1;
    i >= 0 && j >= 0;
    i--, j--
  ) {
    const piece = chessBoard[i][j];
    const location = [i, j];
    if (piece === empty) continue;
    if (piece === white.Bishop) possibleBishops.push(location);
    break;
  }

  if (possibleBishops.length === 1) {
    const loc = possibleBishops[0];
    chessBoard[loc[0]][loc[1]] = empty;
    chessBoard[toRankIndex][toFileIndex] = white.Bishop;
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
