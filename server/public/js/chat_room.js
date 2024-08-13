document.addEventListener("DOMContentLoaded", (e) => {
   const socket = io("http://localhost:3000");

   const urlParams = new URLSearchParams(window.location.search);
   const roomId = urlParams.get("roomId");

   if(roomId) {
      socket.emit('joinRoom', roomId)
   } else {
      console.error('Parâmetro roomId não fornecido na URL');
   }
})

//! NÃO TESTADO