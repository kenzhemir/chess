class Square extends HTMLElement {
  static observedAttributes = ["piece"];
  #container

  constructor() {
    // Always call super first in constructor
    super();
    this.#container = document.createElement('div');
  }

  connectedCallback() {
    console.log("Custom element added to page.");
    this.appendChild(this.#container);
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "piece":
        this.modifyPiece(newValue);
    }
  }

  modifyPiece(piece) {
    this.#container.innerText = piecesMap[piece] ?? "";
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
