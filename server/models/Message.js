const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
   content: String,
   timeStamp: {type: Date, default: Date.now },
   sender: {
      id: {
         type: mongoose.Schema.Types.ObjectId
      }
   }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message