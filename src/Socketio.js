import {io} from "https://cdn.socket.io/4.5.4/socket.io.esm.min.js";

const socketio = io("http://127.0.0.1:8000",{
  withCredentials: true,
  extraHeaders: {
    "Authorization": "abcd"
  },
  query: {
    token:'abc'
  }
});


 var messages = document.getElementById('messages');
 var form = document.getElementById('form');
 var input = document.getElementById('input');

 form.addEventListener('submit', function (e) {
   e.preventDefault();
   if (input.value) {
    socketio.emit('chat message', input.value);
     input.value = '';
   }
 });


  socketio.on('connect', function () {
    console.log('Client io connected');
    let led = document.getElementById('connectorled');
    led.classList.remove('redlight');
    led.classList.add('greenlight');
  
  });

  socketio.on('disconnect', function () {
    console.log('Client disconnected');
    let led = document.getElementById('connectorled');
    led.classList.remove('greenlight');
    led.classList.add('redlight');
  });
  
  
  socketio.on('chat message', function (msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  socketio.on('broadcast', function (msg) {
    var item = document.createElement('li');
    item.style = 'color:red; background-color: bisque; margin-left: 35px; margin: 0px 0px 0px auto;';
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
  

//Object.freeze(socketio);

export default socketio;



