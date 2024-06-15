const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors')
// const jwt = require('jsonwebtoken');

const port = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
   cors: {
      origin: '*',
      methods: ['GET', 'POST']
   }
});

app.use(cors({
   origin: ['http://localhost:3000', 'http://localhost:8080'],
   credentials: true
}));
// ['http://localhost:3000', 'http://localhost:8080']

mongoose.connect('mongodb+srv://cauanzelazo:dIsJALWHdKh31XyQ@cluster0.efug1zl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2')

const messageSchema = mongoose.Schema({
   text: String,
   timeStamp: {type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

app.get('/', (req, res) => {
   console.log('Server running')
   res.write("Server running");
   res.end();
})

io.on('connection', (socket) => {
   console.log('Um usuario se conectou');

   Message.find().sort('timestamp').exec()
      .then((messages) => {
         socket.emit('previousMessages', messages);
      })
      .catch((err) => {
         console.log(err);
      })

   socket.on('sendMessage', (data) => {
      console.log(data);
      const message = new Message({ text: data.text });
      message.save()
         .then((data) => {
            io.emit('message', data);
         })
         .catch((err) => {
            console.log(err);
         });
      // socket.broadcast.emit('receiveMessage', data); //*TALVEZ REMOVER O BROADCAST, PARA PEGAR A MENSAGEM QUE A PESSOA ENVIOU TAMBÉM
   });
});
// app.get('/create', (req, res) => {
//    res.redirect(302, '/create.html')
// })


server.listen(port, () => {
   console.log('Running on port: ', port)
})