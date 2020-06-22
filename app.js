const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fileRouter = require('./routes/fileRouter');

dotenv.config({ path: './config.env' });

const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(cors());

app.use('/files', fileRouter);

module.exports = app;
