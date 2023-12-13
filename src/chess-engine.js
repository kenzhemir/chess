const white = "w";
const black = "b";
const empty = "";
const pieces = {
  [black]: Object.freeze({
    King: `${black}K`,
    Queen: `${black}Q`,
    Rook: `${black}R`,
    Bishop: `${black}B`,
    Knight: `${black}N`,
    Pawn: `${black}P`,
  }),
  [white]: Object.freeze({
    King: `${white}K`,
    Queen: `${white}Q`,
    Rook: `${white}R`,
    Bishop: `${white}B`,
    Knight: `${white}N`,
    Pawn: `${white}P`,
  }),
};

export function getStartingChessBoard() {
  return [
    [
      pieces[white].Rook,
      pieces[white].Knight,
      pieces[white].Bishop,
      pieces[white].Queen,
      pieces[white].King,
      pieces[white].Bishop,
      pieces[white].Knight,
      pieces[white].Rook,
    ],
    Array(8).fill(pieces[white].Pawn),
    ...Array(4)
      .fill(0)
      .map(() => Array(8).fill(empty)),
    Array(8).fill(pieces[black].Pawn),
    [
      pieces[black].Rook,
      pieces[black].Knight,
      pieces[black].Bishop,
      pieces[black].Queen,
      pieces[black].King,
      pieces[black].Bishop,
      pieces[black].Knight,
      pieces[black].Rook,
    ],
  ];
}

const loggingMap = {
  [pieces[black].Pawn]: "♟",
  [pieces[black].Knight]: "♞",
  [pieces[black].Bishop]: "♝",
  [pieces[black].Rook]: "♜",
  [pieces[black].Queen]: "♛",
  [pieces[black].King]: "♚",
  [pieces[white].Pawn]: "♙",
  [pieces[white].Knight]: "♘",
  [pieces[white].Bishop]: "♗",
  [pieces[white].Rook]: "♖",
  [pieces[white].Queen]: "♕",
  [pieces[white].King]: "♔",
  [empty]: "empty",
};
/**
 *
 * @param {string[][]} chessBoard
 * @param {string} move
 * @param {"w" | "b"} color
 * @returns { {error?: string, result?: string[][]} }
 */
export function makeMove(chessBoard, move, color) {
  const moveInfo = move.match(
    /^(?<piece>[NBRQK])?(?<from_file>[a-h])?(?<from_rank>[1-8])?(?<capture>x)?(?<to_file>[a-h])(?<to_rank>[1-8])(?<promotion>=[NBRQ])?(?<threat>[+#]?)?$/
  )?.groups;
  if (!moveInfo) {
    return { error: "Invalid move 🤔" };
  }

  const {
    piece = "P",
    from_rank,
    from_file,
    to_rank,
    to_file,
    capture,
    promotion,
    threat,
  } = moveInfo;

  console.log(moveInfo);

  let toRankIndex = to_rank.charCodeAt(0) - "1".charCodeAt(0);
  let toFileIndex = to_file.charCodeAt(0) - "a".charCodeAt(0);
  let destSquare = chessBoard[toRankIndex][toFileIndex];

  if (capture && destSquare === empty) {
    return { error: "Nothing to capture" };
  }

  if (destSquare !== empty && destSquare.charAt(0) === color) {
    return {
      error: `Location is occupied by ${
        loggingMap[chessBoard[toRankIndex][toFileIndex]]
      }${capture ? " (p.s. do not eat your own pieces)" : ""}`,
    };
  }

  if (destSquare !== empty && destSquare.charAt(0) !== color) {
    if (!capture) {
      return {
        error: `You must specify captures with "x"`,
      };
    }
  }

  let fromRankIndex = from_rank
    ? from_rank.charCodeAt(0) - "1".charCodeAt(0)
    : undefined;
  let fromFileIndex = from_file
    ? from_file.charCodeAt(0) - "a".charCodeAt(0)
    : undefined;
  const moveParams = {
    toRankIndex,
    toFileIndex,
    fromRankIndex,
    fromFileIndex,
    color,
    capture
  };
  switch (piece) {
    case "P":
      return movePawn(chessBoard, moveParams);
    case "R":
      return moveRook(chessBoard, moveParams);
    case "N":
      return moveKnight(chessBoard, moveParams);
    case "B":
      return moveBishop(chessBoard, moveParams);
    case "K":
      return moveKing(chessBoard, moveParams);
    case "Q":
      return moveQueen(chessBoard, moveParams);
    default:
      return { error: `unknown piece: ${piece}` };
  }
}

/**
 *
 * @param {string[][]} chessBoard
 * @param {string} move
 * @param {"w" | "b"} color
 * @returns { {error?: string, result?: string[][]} }
 */
function movePawn(
  chessBoard,
  { toRankIndex, toFileIndex, fromRankIndex, fromFileIndex, color, capture }
) {
  let possiblePawns = [];
  const piece = pieces[color].Pawn;
  if (!capture) {
    if (color === white) {
      if (chessBoard[toRankIndex - 1][toFileIndex] === piece) {
        possiblePawns.push([toRankIndex - 1, toFileIndex]);
      }
      if (
        toRankIndex === 3 &&
        chessBoard[2][toFileIndex] === empty &&
        chessBoard[1][toFileIndex] === piece
      ) {
        possiblePawns.push([1, toFileIndex]);
      }
    } else {
      if (chessBoard[toRankIndex + 1][toFileIndex] === piece) {
        possiblePawns.push([toRankIndex + 1, toFileIndex]);
      }
      if (
        toRankIndex === 4 &&
        chessBoard[5][toFileIndex] === empty &&
        chessBoard[6][toFileIndex] === piece
      ) {
        possiblePawns.push([6, toFileIndex]);
      }
    }
  } else {
    if (color === white) {
      if (chessBoard[toRankIndex - 1][toFileIndex - 1] === piece) {
        possiblePawns.push([toRankIndex - 1, toFileIndex - 1]);
      }
      if (chessBoard[toRankIndex - 1][toFileIndex + 1] === piece) {
        possiblePawns.push([toRankIndex - 1, toFileIndex + 1]);
      }
    } else {
      if (chessBoard[toRankIndex + 1][toFileIndex - 1] === piece) {
        possiblePawns.push([toRankIndex + 1, toFileIndex - 1]);
      }
      if (chessBoard[toRankIndex + 1][toFileIndex + 1] === piece) {
        possiblePawns.push([toRankIndex + 1, toFileIndex + 1]);
      }
    }
  }
  possiblePawns = possiblePawns.filter(
    matchFromLocation.bind(null, { fromRankIndex, fromFileIndex })
  );

  if (possiblePawns.length === 1) {
    const loc = possiblePawns[0];
    chessBoard[loc[0]][loc[1]] = empty;
    chessBoard[toRankIndex][toFileIndex] = pieces[color].Pawn;
    return { result: chessBoard };
  } else if (!possiblePawns.length) {
    return {
      error: `No pawn can move there`,
    };
  } else {
    return {
      error: `${possiblePawns.length} pawns can move there`,
    };
  }
}

/**
 *
 * @param {string[][]} chessBoard
 * @param {string} move
 * @param {"w" | "b"} color
 * @returns { {error?: string, result?: string[][]} }
 */
function moveRook(
  chessBoard,
  { toRankIndex, toFileIndex, fromRankIndex, fromFileIndex, color }
) {
  let possibleRooks = linearSearch(
    chessBoard,
    toRankIndex,
    toFileIndex,
    pieces[color].Rook
  ).filter(matchFromLocation.bind(null, { fromRankIndex, fromFileIndex }));

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
 * @param {"w" | "b"} color
 * @returns { {error?: string, result?: string[][]} }
 */
function moveKnight(
  chessBoard,
  { toRankIndex, toFileIndex, fromRankIndex, fromFileIndex, color }
) {
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
  let possibleKnights = knightMoves
    .filter(([i, j]) => chessBoard[i][j] === pieces[color].Knight)
    .filter(matchFromLocation.bind(null, { fromRankIndex, fromFileIndex }));

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
 * @param {"w" | "b"} color
 * @returns { {error?: string, result?: string[][]} }
 */
function moveBishop(
  chessBoard,
  { toRankIndex, toFileIndex, fromRankIndex, fromFileIndex, color }
) {
  let possibleBishops = diagonalSearch(
    chessBoard,
    toRankIndex,
    toFileIndex,
    pieces[color].Bishop
  ).filter(matchFromLocation.bind(null, { fromRankIndex, fromFileIndex }));

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
 * @param {"w" | "b"} color
 * @returns { {error?: string, result?: string[][]} }
 */
function moveQueen(
  chessBoard,
  { toRankIndex, toFileIndex, fromRankIndex, fromFileIndex, color }
) {
  let possibleQueens = [
    ...linearSearch(chessBoard, toRankIndex, toFileIndex, pieces[color].Queen),
    ...diagonalSearch(
      chessBoard,
      toRankIndex,
      toFileIndex,
      pieces[color].Queen
    ),
  ].filter(matchFromLocation.bind(null, { fromRankIndex, fromFileIndex }));

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
 * @param {"w" | "b"} color
 * @returns { {error?: string, result?: string[][]} }
 */
function moveKing(
  chessBoard,
  { toRankIndex, toFileIndex, fromRankIndex, fromFileIndex, color }
) {
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

  const possibleKings = possibleKingPositions
    .filter(([rank, file]) => chessBoard[rank][file] === pieces[color].King)
    .filter(matchFromLocation.bind(null, { fromRankIndex, fromFileIndex }));

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

function matchFromLocation({ fromRankIndex, fromFileIndex }, [rank, file]) {
  return (
    (fromFileIndex === undefined || file === fromFileIndex) &&
    (fromRankIndex === undefined || fromRankIndex === rank)
  );
}
