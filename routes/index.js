const express = require('express');
const router = express.Router();
const socketio = require('socket.io');
const {getRoomUsers, getSelectedUser} = require('../utils/users');

// Welcome page
router.get('/',(req, res)=>{
    res.render('index')
});

// Welcome page
router.post('/check/',(req, res)=>{
    const {username, room} = req.body;
    let errors = [];

    if(getSelectedUser(username, room)){
        errors.push({msg:'This name already in this chat'});
    }
    if(getRoomUsers(room).length == 2 && room === 'Peer'){
        errors.push({msg:'This room is full'})
    }
    if(errors.length > 0){
        res.render('index',{
            errors
        });
    }else{
        res.redirect(`/chatRoom/${room}/${username}`)
    }   
});

// Welcome page
router.get('/chatRoom/:room/:username',(req, res)=>{
    const {room, username} = req.params;
    res.render('chat',{
        username:username,
        room:room
    })
});

module.exports = router;