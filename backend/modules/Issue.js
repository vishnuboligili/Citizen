const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  description: String,
  category: String,
  location: String,
  image: String,
  AfterImage:{
    type:String,default:null
  },
  pincode:String,
  isAssigned:{type:Boolean,default:false},
  isChecked:{type:Boolean,default:false},
  assignedTo:{type:String,default:null},
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'progress', 'resolved','fake'],
    default: 'pending',
  },
});

module.exports = mongoose.model('Issue', IssueSchema);
