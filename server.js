const express = require("express");
const app = express();
const router = express.Router();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers, getSelectedUser} = require('./utils/users');
const server = http.createServer(app);
const io = socketio(server);

// EJS
app.set('view engine', 'ejs');

//Use public directory as /static in server
app.use('/static', express.static('./'));

// Bodyparser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routes
app.use('/', require('./routes/index'));

const serverMsg = 'Server message';
//Run when client connect
io.on('connection', socket =>{

    socket.on('joinRoom', ({username, room}) =>{
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        //Welcome current user
        socket.emit('message',formatMessage(serverMsg,`Welcome to ${user.room} chat`));

        //Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message',formatMessage(serverMsg,`${user.username} has join the chat`));

        //Send users and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users:getRoomUsers(user.room)
        });
    });

    //Listen for chatMessage
    socket.on('chatMessage', (result)=>{
        const user = getCurrentUser(socket.id);
        if(result.MessageTo === "all"){
            io.to(user.room).emit('message', formatMessage(user.username,result.msg));
        }
        else{
            const userTo = getSelectedUser(result.MessageTo,user.room);
            io.to(user.id).emit('message', formatMessage(user.username,`To ${userTo.username}: ` + result.msg));
            io.to(userTo.id).emit('message', formatMessage(user.username,"Private message: " + result.msg));
        }
    });

    //Client disconnects
    socket.on('disconnect', () =>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(serverMsg,`${user.username} has left the chat`));
            
            //Send users and room info
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users:getRoomUsers(user.room)
            });
        }
        
    });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, ()=> console.log(`server running on port ${PORT}`));