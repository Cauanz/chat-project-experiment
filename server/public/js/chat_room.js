const socket = io();

document.addEventListener("DOMContentLoaded", (e) => {

   const pathname = window.location.pathname;
   const roomId = pathname.split('/').pop();

   console.log(roomId)

   if(roomId) {
      socket.emit('joinRoom', roomId)
   } else {
      console.error('Parâmetro roomId não fornecido na URL');
   }
})

const sendMessage = () => {
   const messageTxt = document.querySelector('#message-input').value;
   socket.emit('new_message', messageTxt);
}


//!PROBLEMA QUE QUANDO ENVIA A MENSAGEM A PÁGINA RECARREGA, DESCONECTA E RECONECTA AO SERVER E NÃO CHAMA FUNÇÃO DO SOCKET.IO DO LADO DO SERVIDOR
document.querySelector('#message-form').addEventListener('submit', (e) => {
   e.preventDefault();
   console.log('Evento de submit prevenido');
   sendMessage();
});
