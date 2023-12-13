import { pushMessageToFirebase } from "./firebase.js";

const display = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const message = formData.get("message");
  e.target.reset();
  pushMessageToFirebase(window.app.roomId, `${window.app?.name}: ${message}`);
});

export function renderTheMessages(messages) {
  display.innerHTML = "";
  messages.forEach((message) => {
    const messageDiv = document.createElement("div");
    messageDiv.innerText = message;
    display.appendChild(messageDiv);
  });
}
