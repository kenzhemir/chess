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
      .map(() => Array(8).fill("")),
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

/**
 *
 * @param {string[][]} chessBoard
 * @param {string} move
 * @returns { {error?: string, result?: string[][]} }
 */
export function whiteMove(chessBoard, move) {
  if (move.length == 2) {
    // pawn move
    let fileIndex = move.charCodeAt(0) - "a".charCodeAt(0);
    let toRankIndex = move.charCodeAt(1) - "1".charCodeAt(0);
    let fromRankIndex = chessBoard.findIndex(
      (rank) => rank[fileIndex] === white.Pawn
    );

    console.log({
      toRankIndex,
      fromRankIndex,
      fileIndex,
      diff: toRankIndex - fromRankIndex,
      a: toRankIndex - fromRankIndex !== 1,
      b: toRankIndex - fromRankIndex === 2,
      c: fromRankIndex !== 1,
      res:
        toRankIndex - fromRankIndex !== 1 ||
        (toRankIndex - fromRankIndex === 2 && fromRankIndex !== 1),
    });
    if (
      toRankIndex - fromRankIndex !== 1 &&
      (toRankIndex - fromRankIndex !== 2 || fromRankIndex !== 1)
    ) {
      return { error: "Incorrect pawn move" };
    }
    chessBoard[fromRankIndex][fileIndex] = null;
    chessBoard[toRankIndex][fileIndex] = white.Pawn;
    return { result: chessBoard };
  }
}
