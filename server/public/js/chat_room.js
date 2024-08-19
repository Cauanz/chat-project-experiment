const socket = io();
const pathname = window.location.pathname;
const roomId = pathname.split('/').pop();



//TODO terminar essa função para recuperar e renderizar mensagens do chat atual que também é chamado a cada nova mensagem enviada tanto por voce quanto por outros participantes ou talvez não porque o socket.io já garante uma conexão que faz voce receber a mensagem na hora (eu achei que precisava pegar do DB mas não)
const getMessages = async () => {

   axios.get('http://localhost:3000/get-messages')
   .then(res => res)
   .then(data => {
      const messageList = document.querySelector('#message-container');

      console.log(data)
   })
}






document.addEventListener("DOMContentLoaded", (e) => {
   console.log(roomId)
   getMessages();

   if(roomId) {
      socket.emit('joinRoom', roomId)
   } else {
      console.error('Parâmetro roomId não fornecido na URL');
   }
})

const sendMessage = () => {
   const messageTxt = document.querySelector('#message-input').value;
   socket.emit('new_message', messageTxt, (response) => {
      document.querySelector('#message-input').value = '';
   });
}

document.querySelector('#message-form').addEventListener('submit', (e) => {
   e.preventDefault();
   sendMessage();
});
