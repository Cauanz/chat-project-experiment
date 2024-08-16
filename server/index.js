const jwt = require('jsonwebtoken');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
require('dotenv').config();
const cookieParser = require('cookie-parser');

const Message = require('./models/Message');
const User = require('./models/User');
const Chat = require('./models/Chat');

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
app.use(bodyParser.urlencoded({ extended: true }));
// ['http://localhost:3000', 'http://localhost:8080']
app.use(cookieParser());
app.use(express.json());

mongoose.connect('mongodb+srv://cauanzelazo:dIsJALWHdKh31XyQ@cluster0.efug1zl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2')

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
   console.log('Um usuario se conectou');

   socket.on('joinRoom', async (roomId) => {

      //TODO fazer o processo sei lá para entrar na sala e usar o array de mensagens para armazenar as mensagens 
      // try {
      //    const room = await Chat.findOne({ roomId })
      // } catch (error) {
         
      // }

      socket.join(roomId);
      console.log(`Cliente entrou na sala: ${roomId}`)
   })

   //*CRIEI ESSA FUNÇÃO, QUE CRIA O OBJETO MENSAGEM AQUI E DAI SIM ENVIA PARA O SERVIDOR, NA ARRAY DE MENSAGENS E TRANSMITE PARA OS OUTROS
   //!AINDA EM PRODUÇÃO
   socket.on('new_message', async (messageTxt) => {
      
      // const userId = User.findOne

      console.log(socket.userId);


      // const message = new Message({
      //    content: messageTxt,
      //    timeStamp,
      //    sender: {
      //       id: 
      //    }
      // })
   })

   socket.on('disconnect', () => {
      console.log('Cliente desconectado');
   });


   //* COISAS RELACIONADAS A ENVIO DE MENSAGENS
   // Message.find().sort('timestamp').exec()
   //    .then((messages) => {
   //       socket.emit('previousMessages', messages);
   //    })
   //    .catch((err) => {
   //       console.log(err);
   //    })

   // socket.on('sendMessage', (data) => {
   //    console.log(data);
   //    const message = new Message({ text: data.text });
   //    message.save()
   //       .then((data) => {
   //          io.emit('message', data);
   //       })
   //       .catch((err) => {
   //          console.log(err);
   //       });
   //    // socket.broadcast.emit('receiveMessage', data); //*TALVEZ REMOVER O BROADCAST, PARA PEGAR A MENSAGEM QUE A PESSOA ENVIOU TAMBÉM
   // });
   //* COISAS RELACIONADAS A ENVIO DE MENSAGENS
   
});


const authenticateToken = (req, res, next) => {
   const token = req.cookies.authToken;

   if(!token){
      return res.redirect('/register')
   }

   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if(err) return res.sendStatus(403);
      req.user = user;
      next();
   });
};


app.get('/', authenticateToken, (req, res) => {
   console.log('Server running');
   // res.write("Server running");
   // res.end();
   res.sendFile(path.join(__dirname, 'public', '/html/index.html'))
})

app.get('/enter-room/:roomId', authenticateToken, async (req, res) => {
   try {
      const chatId = await req.params.roomId;
      const chatTitle = await Chat.findById(chatId);
      // console.log(chatTittle.name)
      // res.sendFile(path.join(__dirname, 'public', `/html/chat_room.html`));
      return res.json({"link": path.join(__dirname, 'public', '/html/chat_room.html'), "chatId": chatId, "title": chatTitle})
   } catch (error) {
      res.status(500).send('Erro ao tentar entrar no chat');
   }

})

app.get('/register', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', '/html/register.html'));
})

app.get('/login', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', '/html/login.html'));
})

app.post('/register', async (req, res) => {
   const { email, password, name } = req.body;

   console.log(email, password, name);

   if(!email) {
      return res.status(400).json({ error: 'O email é obrigatório.' });
   }
   
   if(!name) {
      return res.status(400).json({ error: 'O name é obrigatório.' });
   }
   
   if(!password) {
      return res.status(400).json({ error: 'O password é obrigatório.' });
   }

   try {

      const saltRounds = 10;
      const saltedPassword = await bcrypt.hash(password, saltRounds);

      const user = new User({
         name: name,
         email: email,
         password: saltedPassword
      })

      await user.save();

      console.log("Usuario criado com sucesso!")
      res.redirect('/login');

   } catch (error) {
      console.log('Ocorreu um erro ao tentar se cadastrar:', error)
   }

})

app.post('/login', async (req, res) => {
   const { email, password } = req.body;

   console.log(email, password);

   const user = await User.findOne({ email: email })

   if(!user) {
      return res.status(404).json("Usuario não encontrado");
   }

   try {

      const match = await bcrypt.compare(password, user.password);
      
      if(!match){
         return res.status(401).json("Senha incorreta");
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

      console.log({ token: token })

      res.cookie('authToken', token, { httpOnly: true, secure: true })
      res.redirect('/')
   } catch (error) {
      console.log('Ocorreu um erro ao tentar fazer login:', error)
   }
})

app.get('/getusers', async (req, res) => {

   const users = await User.find();

   return res.json(users)
   
})

app.get('/get-chats', authenticateToken, async (req, res) => {

   try {
      const chatRooms = await Chat.find();
      res.send(chatRooms)
   } catch (error) {
      console.log("Ocorreu um erro ao tentar recuperar as salas de chat", error)
   }
})

app.post('/create-room', authenticateToken, async (req, res) => {

   const {chatName, chatParticipants} = req.body;
   console.log(chatName, chatParticipants);
   
   try {

      //TODO talvez responder para o chat novo aparecer no UI, talvez somente responder para recarregar
      
      const users = await Promise.all(chatParticipants.map(async(userId) => {
         const user = await User.findById(userId)
         return { _id: user._id, name: user.name };
      }))

      const newChat = new Chat({
         name: chatName,
         participants: users,
         messages: [],
      })

      await newChat.save();

      console.log("Chat criado com sucesso")
      // res.redirect('/')
      // res.status(201).json({ redirectUrl: '/' })
      io.emit('reload')
      
   } catch (error) {
      console.log("Houve um erro ao tentar criar a sala", error)
   }

})


server.listen(port, '0.0.0.0', () => {
   console.log('Running on port: ', port)
})