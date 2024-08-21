const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
   content: String,
   timeStamp: {type: Date, default: Date.now },
   sender: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
      }
   }
});

messageSchema.pre('save', function(next){
   this.timeStamp = moment().tz('America/Sao_Paulo').toDate();
   next();
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message