const getChats = async () => {
   axios.get('http://localhost:3000/get-chats')
      .then(res => res)
      .then(data => {
               const chatList = document.querySelector('.chats');

               data.data.forEach((chat) => {
                  const chatName = document.createElement('a')
                  chatName.dataset.chatId = chat._id
                  chatName.textContent = chat.name
                  chatName.classList.add('chat-room')
                  chatList.appendChild(chatName)
               })
            })
}

const generateOptions = async () => {
   const select = document.querySelector("#chat-participants")

   let response = await fetch('http://localhost:3000/getusers')
   //TODO Talvez tornar essa uma rota privada e passar token

   if(!response){
      throw new Error("Erro ao fazer request")
   }

   const users = await response.json()

   users.forEach(user => {
      const option = document.createElement('option')
      option.value = user._id;
      option.textContent = user.name;
      option.selected = false;
      select.appendChild(option);
   });

   // for (let i = 0; i < users.length; i++) {
   //    const option = document.createElement('option')
   //    option.value = users[i]._id;
   //    option.textContent = users[i].name;
   //    select.appendChild(option);      
   // }  
}

const removeOptions = () => {
   const select = document.querySelector("#chat-participants")
   
   while (select.firstChild) { 
      select.removeChild(select.firstChild);
   }
}

const toogleModal = () => {
   const form = document.querySelector('.create-form')
   const button = document.querySelector(".open-modal")

   if(form.classList.contains('open')){
      form.classList.remove('open')
      button.style.display = "flex"
      form.classList.add('close')
      removeOptions()
   } else {
      form.classList.remove('close')
      form.classList.add('open')
      button.style.display = "none"
      generateOptions();
   }
}


document.querySelector('.chat-form').addEventListener('submit', async (e) => {
   e.preventDefault();

   const chatName = document.querySelector('#chat-name').value
   const chatParticipants = Array.from(document.querySelector('#chat-participants').selectedOptions).map(option => option.value)
   const data = { chatName, chatParticipants };

   axios.post('http://localhost:3000/create-room', data)
      .then(res => {
         // window.location.href = res.data.redirectUrl
         console.log(res.data)
         // toogleModal()
      })
      .catch(err => {
         console.log("Erro ao criar a sala", err)
      })
   
});
document.querySelector('.open-modal').addEventListener('click', toogleModal);
document.querySelector('.close-modal').addEventListener('click', toogleModal);

document.addEventListener('DOMContentLoaded', () => {
   const socket = io();
   const inputBtn = document.querySelector("#submit-button");
   // let messages = [];
   getChats()
   
   socket.on('connect', () => {
      console.log('Conectado ao servidor')
   })

   socket.on('reload', () => {
      console.log("Chat room criado, recarregar página")
      getChats()
   })
   
   
   // socket.on('previousMessages', (messages) => {
   //    const messageList = document.querySelector("#message-container");
   //    messages.forEach((message) => {
   //       const item = document.createElement('p');
   //       item.textContent = message.text;
   //       messageList.appendChild(item);
   //    })
   // })

   // socket.on('message', (data) => {
   //    const messageList = document.querySelector("#message-container");
   //       const item = document.createElement('p');
   //       item.textContent = data.text;
   //       messageList.appendChild(item);
   // })

   // function sendMessage(e) {
   //    e.preventDefault();
   //    let inputText = document.querySelector("#message-input");
   //    // console.log("sent");
      
   //    const message = inputText.value;
   //    socket.emit('sendMessage', { text: message });
   //    // messages.push(message);
   //    inputText.value = "";
   // }

   // inputBtn.addEventListener("click", sendMessage);
})

//TODO melhorar a função para mudar de chat
setInterval(() => {
   document.querySelectorAll('.chat-room').forEach((chatRoom) => {
      chatRoom.addEventListener("click", async () => {
         axios.get(`http://localhost:3000/enter-room/:roomId=${chatRoom.dataset.chatId}`)
         .then(res => {
            // console.log(res) //DEBUG
            document.querySelector("body").innerHTML = res.data
         })
         .catch(err => console.log(err))
      })
   })
}, 2000)