document.addEventListener('DOMContentLoaded', () => {
   const socket = io("http://localhost:3000");
   const inputBtn = document.querySelector("#submit-button");
   // let messages = [];
   
   socket.on('connect', () => {
      console.log('Conectado ao servidor')
   })
   
   socket.on('previousMessages', (messages) => {
      const messageList = document.querySelector("#message-container");
      messages.forEach((message) => {
         const item = document.createElement('p');
         item.textContent = message.text;
         messageList.appendChild(item);
      })
   })

   socket.on('message', (data) => {
      const messageList = document.querySelector("#message-container");
         const item = document.createElement('p');
         item.textContent = data.text;
         messageList.appendChild(item);
   })

   function sendMessage(e) {
      e.preventDefault();
      let inputText = document.querySelector("#message-input");
      // console.log("sent");
      
      const message = inputText.value;
      socket.emit('sendMessage', { text: message });
      // messages.push(message);
      inputText.value = "";
   }

   inputBtn.addEventListener("click", sendMessage);
})


