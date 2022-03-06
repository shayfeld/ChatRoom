const users = [];

//Join user to chat
function userJoin(id, username, room){
    const user={id, username, room};
    users.push(user);
    return user;
}

//Get current user
function getCurrentUser(id){
    return users.find((user)=>{
        user.id === id
    });
}

//User leave
function userLeave(id){
    const index = user.findIndex((user)=>{
        user.id === id
    });
    if(index !== -1){
        return user.splice(index, 1);
    }
}

//Get room users
function getRoomUsers(room){
    return users.filter((user)=>{
        user.room === room
    });
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}