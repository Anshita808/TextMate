const socket = io("http://localhost:8080/",{transports:["websocket"]});
    const roomName=document.querySelector("h1>span")
    const total=document.querySelector("h3>span")
    const userList=document.querySelector("#allUsers")
    const joinAlert=document.querySelector("#typewriter")
    const text = document.querySelector("textarea")
    const typing = document.querySelector("h4");
    const lastChange = document.querySelector("h5")

    const username =prompt('What is your name?');
    micOff()
    text.addEventListener("keyup",(e)=>{
        socket.emit('typing', username);
        setTimeout(() => {
            socket.emit('chatMessage', text.value);
        }, 3000);
    })
    socket.on("typing",(user)=>{
        typing.innerHTML=`${user} is typing...`;
    })
    socket.on('chatMessage', (msg) => {
        text.value=msg.text
        lastChange.innerHTML=`last changed at ${msg.time} by ${msg.username}`;
        typing.innerHTML=``;
    })

    socket.on('connect', () => {
        const room ="dsa501"
        socket.emit('joinRoom', {username,room});
    });

    socket.on("message",(message)=>{
        typewriter(message);
    })

    function typewriter(message){
        var typewriterText = ""
        typewriterText = message
        joinAlert.style.visibility="visible"

        const typewriterDelay = 100;
        const typewriterElement = document.getElementById("typewriter");
        typewriterElement.innerHTML = ""
        let i = 0;
        typeWriter();
        function typeWriter() {
            if (i < typewriterText.length) {
                typewriterElement.innerHTML += typewriterText.charAt(i);
                i++;
                setTimeout(typeWriter, typewriterDelay);
            }
        }
        setTimeout(function(){
            document.getElementById("alert").style.visibility="hidden"
        }, 3000)
    }

    socket.on("roomUsers",({room,users})=>{
        roomName.innerText= room;
        outputRoomUsers(users)
    })

    function outputRoomUsers(users){
        userList.innerHTML = '';
        total.innerHTML=users.length
        let html=""
        users.forEach(user => {
            let firstLetter = user.username.toUpperCase()[0]
            html+=`<div>
                        <h1>${firstLetter}</h1>
                        <p>${user.username}</p>
                    </div>`
        });
        userList.innerHTML = html
    }


    function micOff(){
        console.log("micOff")
        document.getElementById("micOff").style.display="block"
        document.getElementById("micOn").style.display="none"
    }
    function micOn(){
        console.log("micOn")
        document.getElementById("micOff").style.display="none"
        document.getElementById("micOn").style.display="block"
    }

    document.querySelector("#allChats~input").addEventListener("change", ()=>{
        socket.emit('chat', document.querySelector("#allChats~input").value);
        document.querySelector("#allChats~input").value=""
    })
    socket.on("chat",(chat)=>{
        appendChat(chat)
    })
    function appendChat(chat) {
        const div = document.createElement("div")
        div.classList.add("chat-div")
        const name = document.createElement("p")
        name.innerHTML = `${chat.username} at ${chat.time}`
        const p = document.createElement('p');
        p.innerText = chat.text;
        div.append(name,p)
        document.getElementById('allChats').appendChild(div);
        const allChats = document.getElementById('allChats');
        allChats.scrollTop = allChats.scrollHeight;
    }
      