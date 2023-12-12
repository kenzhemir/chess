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
    return moveWhitePawn(chessBoard, move);
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
export function moveWhitePawn(chessBoard, move) {
  let fileIndex = move.charCodeAt(0) - "a".charCodeAt(0);
  let toRankIndex = move.charCodeAt(1) - "1".charCodeAt(0);
  let fromRankIndex = chessBoard.findIndex(
    (rank) => rank[fileIndex] === white.Pawn
  );

  if (
    toRankIndex - fromRankIndex !== 1 &&
    (toRankIndex - fromRankIndex !== 2 || fromRankIndex !== 1)
  ) {
    return { error: "Incorrect pawn move" };
  }
  chessBoard[fromRankIndex][fileIndex] = empty;
  chessBoard[toRankIndex][fileIndex] = white.Pawn;
  return { result: chessBoard };
}
/**
 *
 * @param {string[][]} chessBoard
 * @param {string} move
 * @returns { {error?: string, result?: string[][]} }
 */
export function moveWhiteRook(chessBoard, toRankIndex, toFileIndex) {
  let possibleRooks = [];
  // rank up
  for (let i = toRankIndex + 1; i < 8; i++) {
    const piece = chessBoard[i][toFileIndex];
    const location = [i, toFileIndex];
    if (piece === white.Rook) {
      possibleRooks.push(location);
      break;
    }
    if (piece !== empty) {
      break;
    }
  }

  // rank down
  for (let i = toRankIndex - 1; i >= 0; i--) {
    const piece = chessBoard[i][toFileIndex];
    const location = [i, toFileIndex];
    if (piece === white.Rook) {
      possibleRooks.push(location);
      break;
    }
    if (piece !== empty) {
      break;
    }
  }

  // file up
  for (let j = toFileIndex + 1; j < 8; j++) {
    const piece = chessBoard[toRankIndex][j];
    const location = [toRankIndex, j];
    if (piece === white.Rook) {
      possibleRooks.push(location);
      break;
    }
    if (piece !== empty) {
      break;
    }
  }

  // file down
  for (let j = toFileIndex - 1; j >= 0; j--) {
    const piece = chessBoard[toRankIndex][j];
    const location = [toRankIndex, j];
    if (piece === white.Rook) {
      possibleRooks.push(location);
      break;
    }
    if (piece !== empty) {
      break;
    }
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
      error: `Both rooks can move there`,
    };
  }
}
