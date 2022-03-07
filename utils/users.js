const users = [];

//Join user to chat
function userJoin(id, username, room){
    const user={id, username, room};
    const existUser = getSelectedUser(username, room)
    users.push(user);
    return user;
}

//Get current user
function getCurrentUser(id){
    return users.find(user=> user.id === id);
}

//User leave
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

//Get user inside the room
function getSelectedUser(username, room){
    return users.find(user=> user.username === username && user.room === room);
}

//Get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getSelectedUser
}