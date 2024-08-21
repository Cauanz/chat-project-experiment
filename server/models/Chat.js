const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   participants: [{
      id: { 
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User' 
      },
      name: String
   }],
   messages: [{
      content: String,
      sender: { 
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User' 
      }, 
      timestamp: {
         type: Date,
         default: Date.now
      }
   }]
})

const Chat = mongoose.model('Chat', chatSchema)
module.exports = Chat