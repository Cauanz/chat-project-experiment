const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');

const port = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
   cors: {
      origin: 'http://localhost:8080'
   }
});

app.get('/', (req, res) => {
   console.log('Server running')
   res.write("Server running");
   res.end();
})

io.on('connection', (socket) => {
   console.log('Um usuario se conectou');

   socket.on('sendMessage', (data) => {
      console.log(data);
      io.emit('receiveMessage', data);
   })
})

// app.get('/create', (req, res) => {
//    res.redirect(302, '/create.html')
// })


// mongoose.connect('mongodb+srv://cauanzelazo:dIsJALWHdKh31XyQ@cluster0.efug1zl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2')


server.listen(port, () => {
   console.log('Running on port: ', port)
})