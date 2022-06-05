const mongoose = require('mongoose');

const { Schema } = mongoose;

const urlSchema = new Schema({
  origin: {
    type: String,
    unique: true,
    required: true,
  },
  shortURL: {
    type: String,
    unique: true,
    required: true,
    
  },
});

const url = mongoose.model('Url', urlSchema);

module.exports = url

