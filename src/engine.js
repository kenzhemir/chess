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
