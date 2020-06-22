const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  file_name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  file_type: {
    type: String,
    required: true,
    trim: true,
  },
  file_path: {
    type: String,
    required: true,
    trim: true,
  },
  date_modified: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('file', fileSchema);
