const express = require("express");
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

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
    socket.on('chatMessage', (msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username,msg));
    });

    //Client disconnects
    socket.on('disconnect', () =>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(serverMsg,`ba has left the chat`));
            
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