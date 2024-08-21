const socket = io('http://localhost:3000');
const pathname = window.location.pathname;
const roomId = pathname.split('/').pop();


//TODO talvez eu tenha que criar aquilo de apagar e refazer a lista de mensagens para não ter mensagens duplicadas
//!NÃO FUNCIONANDO
document.addEventListener('DOMContentLoaded', (e) => {
   socket.on('message', (message) => {
      const messageList = document.querySelector('#message-container');
      const element = document.createElement('p')
      element.textContent = message.content
      messageList.appendChild(element)
   })
})




//TODO terminar essa função para recuperar e renderizar mensagens do chat atual que também é chamado a cada nova mensagem enviada tanto por voce quanto por outros participantes ou talvez não porque o socket.io já garante uma conexão que faz voce receber a mensagem na hora (eu achei que precisava pegar do DB mas não)
const getMessages = async () => {
   axios.get(`http://localhost:3000/get-messages?roomId=${roomId}`)
   .then(res => res)
   .then(data => {
      const messageList = document.querySelector('#message-container');

      data.data.forEach(message => {
         const element = document.createElement('p')
         element.textContent = message.content
         messageList.appendChild(element)
      });
   })
}


//TODO Criar função para definir lados das mensangens, comparar por IDs, se o sender sou eu as mensagens ficam divididas entre minhas mensagens e dos outros e assim definir qual lado elas ficam



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
      if(response){
         document.querySelector('#message-input').value = '';
      }
   });
}

document.querySelector('#message-form').addEventListener('submit', (e) => {
   e.preventDefault();
   sendMessage();
});
