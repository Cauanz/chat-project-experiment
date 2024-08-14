import Message from "../../models/Message";
const socket = io();

document.addEventListener("DOMContentLoaded", (e) => {

   const urlParams = new URLSearchParams(window.location.search);
   const roomId = urlParams.get('roomId');

   console.log(roomId)

   if(roomId) {
      socket.emit('joinRoom', roomId)
   } else {
      console.error('Parâmetro roomId não fornecido na URL');
   }
})


//TODO terminar sistema de envio de mensagens
// const sendMessage = () => {

//    const messageTxt = document.querySelector('.message-input').value;
//    let userId  ; //NÃO SEI


//    const message = new Message({
//       content: messageTxt,
//       timeStamp,
//       sender: userId
//    })


//    socket.emit()
// }




//! NÃO TESTADO