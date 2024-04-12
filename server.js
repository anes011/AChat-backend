const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 8000;

app.use(cors());
app.use(express.json());

//Routes
const users = require('./routes/users');
const chat = require('./routes/chat');
//



//Initializing routes
app.use('/users', users);
app.use('/chat', chat);
//




//Server creation
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
//