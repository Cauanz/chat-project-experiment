const socket = io("http://localhost:3000");
const inputBtn = document.querySelector("#submit-button");

socket.on('connect', () => {
   console.log('Conectado ao servidor')
})

function sendMessage(e) {
   e.preventDefault();
   console.log("sent");
   let inputText = document.querySelector("#message-input");
   const message = inputText.value;
   socket.emit('sendMessage', message);
   inputText.value = "";
}

document.addEventListener('DOMContentLoaded', () => {
   let storagedMessages = JSON.parse(localStorage.getItem('messages'))
   // const messageField = document.querySelector("#message-container");
   // for (let i = 0; i < messages.length; i++) {
   //    const messageElement = document.createElement("p");
   //    messageElement.textContent = messages;
   //    messageField.appendChild(messageElement);
   //    }
   console.log(storagedMessages)
})

socket.on("receiveMessage", (data) => {
   const messageField = document.querySelector("#message-container");
   const messageElement = document.createElement("p");
   messageElement.textContent = data;
   messageField.appendChild(messageElement);
   let messages = [];
   messages.push(data);
   localStorage.setItem('messages', JSON.stringify(messages));
});

inputBtn.addEventListener("click", sendMessage);
