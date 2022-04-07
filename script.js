const formElement = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const messagesList = document.querySelector(".messages");
const newUser = prompt("What is your name?");

appendMessage("you joined");
socket.emit("new-user", newUser);

formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  if (message) {
    socket.emit("send-chat-message", message);
    appendMessage(`You: ${message}`);
    messageInput.value = "";
  }
});

socket.on("chat-message", ({ message, userName }) => {
  appendMessage(`${userName}: ${message}`);
});

socket.on("user-connected", (user) => {
  appendMessage(`${user}: connected`);
});

socket.on("user-disconnected", (user) => {
  appendMessage(`${user}: disconnected`);
});

function appendMessage(message) {
  let item = document.createElement("li");
  item.textContent = message;
  messagesList.appendChild(item);
}
