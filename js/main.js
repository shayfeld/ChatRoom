const chatFrom = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const usersMessage = document.getElementById('MessageTo');

const username = document.getElementById("username").value;
const room = document.getElementById("room").value;


const socket = io();

//Join chatroom
socket.emit('joinRoom', {username, room});

//Get room and users
socket.on('roomUsers',({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

//Message from server 
socket.on('message', message =>{
    outputMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chatFrom.addEventListener('submit', (e)=>{
    e.preventDefault();

    //Get message text
    const msg = e.target.elements.msg.value;
    const MessageTo = e.target.elements.MessageTo.value;
    //Emit message to server
    socket.emit('chatMessage', {MessageTo, msg});

    //Clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})

//OutPut message DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//Add room name to DOM
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user =>`<li>${user.username}</li>`).join('')}
    `;
    usersMessage.innerHTML = `
    <option value="all">all</option>
    ${users.map(user =>`<option value="${user.username}">${user.username}</option>`).join('')}
    `;
}