class Square extends HTMLElement {
  static observedAttributes = ["piece"];
  #container;

  constructor() {
    super();
    this.#container = document.createElement("div");
  }

  connectedCallback() {
    this.appendChild(this.#container);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "piece":
        this.modifyPiece(newValue);
    }
  }

  modifyPiece(piece) {
    this.#container.innerText = piecesMap[piece] ?? piece;
  }
}

const piecesMap = {
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
};

customElements.define("chess-square", Square);
