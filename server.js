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
const message = require('./routes/message');
//



//Initializing routes
app.use('/users', users);
app.use('/chat', chat);
app.use('/message', message);
//




//Server creation
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
//