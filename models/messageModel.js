const { timeStamp } = require('console');
const mongoose = require('mongoose');
const { type } = require('os');

const messageModel = mongoose.Schema({
 sender:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
 },
 content:{
    type: String,
    trim: true
 },
 chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat"
 }


}, {timeStamp: true})


const Message = mongoose.model('Message', messageModel);

module.exports = Message;