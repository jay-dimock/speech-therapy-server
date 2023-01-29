const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require("dotenv").config();

const PORT = process.env.PORT || 8000;
const app = express();
const helmet = require("helmet");

require('./config/mongoose.config');

app.use(cookieParser());
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(helmet()); // helps protect app from well-known web vulnerabilities

const SpeechRoutes = require('./routes/speech.routes');
SpeechRoutes(app);

const server = app.listen(PORT, () => console.log("Now listening on port " + PORT));