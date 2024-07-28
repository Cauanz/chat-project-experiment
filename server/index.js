const jwt = require('jsonwebtoken');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')

const Message = require('./models/Message');
const User = require('./models/User');

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

mongoose.connect('mongodb+srv://cauanzelazo:dIsJALWHdKh31XyQ@cluster0.efug1zl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2')


app.use(express.static(path.join(__dirname, 'public')));

const SECRET = 'aofjuihgqwhrt982htg9G9ghv78qhbggb9uG9VBQ8G9vgV9gv9GHV9h9*G&rtTRB7BE5R7';

app.get('/', (req, res) => {
   console.log('Server running');
   // res.write("Server running");
   // res.end();
   res.sendFile(path.join(__dirname, 'public', '/html/index.html'))
})


app.get('/register', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', '/html/register.html'));
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


app.get('/login', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', '/html/login.html'));
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

      const token = jwt.sign({ userId: user._id }, SECRET)

      console.log({ token: token })
      res.redirect('/')
   } catch (error) {
      console.log('Ocorreu um erro ao tentar fazer login:', error)
   }
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


server.listen(port, '0.0.0.0', () => {
   console.log('Running on port: ', port)
})