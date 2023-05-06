const socket = io("http://localhost:8080/",{transports:["websocket"]});
    const roomName=document.querySelector("h1>span")
    const total=document.querySelector("h3>span")
    const userList=document.querySelector("#allUsers")
    const joinAlert=document.querySelector("#typewriter")
    const text = document.querySelector("textarea")
    const typing = document.querySelector("h4");
    const lastChange = document.querySelector("h5")
    
    var username = "Anonymous"
    var room;

    const urlParams =  new URLSearchParams(window.location.search)

    document.querySelector("#join-form>input[type=text]").value = urlParams.get("room") || ""
    document.querySelector("#join-form>input[type=password]").value = urlParams.get("pass") || ""

    const join = document.getElementById('join');
    const create = document.getElementById('create');
    join.addEventListener('click',()=>{
        document.getElementById("join-form").style.display="block"
        document.getElementById("create-form").style.display="none"

        join.classList.add("curr")
        create.classList.remove("curr")
    })
    create.addEventListener('click',()=>{
        document.getElementById("join-form").style.display="none"
        document.getElementById("create-form").style.display="block"

        create.classList.add("curr")
        join.classList.remove("curr")
    })

    const join_btn = document.getElementById('join-btn');
    const create_btn = document.getElementById('create-btn');

    join_btn.addEventListener('click',(e)=>{
        e.preventDefault()

        document.getElementById("mainContaint").style.display="block"
        document.getElementById("form").style.display="none"

        room = document.querySelector("#join-form>input[type=text]").value
        console.log(room)

        socket.emit('joinRoom', {username,room});
    })


    create_btn.addEventListener('click',(e)=>{
        e.preventDefault()

        document.getElementById("mainContaint").style.display="block"
        document.getElementById("form").style.display="none"

        room = document.querySelector("#create-form>input[type=text]").value
        console.log(room)

        socket.emit('joinRoom', {username,room});
    })

    //prompt('What is your name?') ||
    
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

    

    socket.on("message",(message)=>{
        typewriter(message)
    })

    function typewriter(message){
        var typewriterText = message

        const typewriterDelay = 100;
        const typewriterElement = document.getElementById("typewriter");
        typewriterElement.innerHTML = ""
        document.getElementById("alert").style.visibility="visible"
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
        }, 5000)
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
                        <h1 id="${user.username}">${firstLetter}</h1>
                        <p>${user.username}</p>
                    </div>`
        });
        userList.innerHTML = html
    }

    var localStream;
    var remoteStream;

    function micOff(){
        document.getElementById("micOff").style.display="block"
        document.getElementById("micOn").style.display="none"

        localStream.getTracks().forEach(track => {
            track.stop();
        });
        const status = false
        socket.emit('stream', { room,status });
    }
    function micOn(){
        document.getElementById("micOff").style.display="none"
        document.getElementById("micOn").style.display="block"

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                localStream = stream;
                document.getElementById("localAudio").srcObject = stream;

                const status = true
                socket.emit('stream', { room,status });
            })
            .catch(error => {
                console.log(error);
            });
    }
    socket.on("stream",({user,status})=>{
        if(status){
            document.getElementById(`${user.username}`).style.border = "5px solid #61f83c";
        }else{
            document.getElementById(`${user.username}`).style.border = "2px solid #0efd8e";
        }
    })

    document.querySelector("#allChats~input").addEventListener("change", ()=>{
        if(document.querySelector("#allChats~input").value!=""){
            socket.emit('chat', document.querySelector("#allChats~input").value);
            document.querySelector("#allChats~input").value=""
        }
    })
    document.querySelector("#allChats~input~ion-icon").addEventListener("click", ()=>{
        if(document.querySelector("#allChats~input").value!=""){
            socket.emit('chat', document.querySelector("#allChats~input").value);
            document.querySelector("#allChats~input").value=""
        }
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
    
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let amPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const timeString = hours + ':' + minutes + ' ' + amPm;
        const dateString = now.toLocaleString('default', { month: 'long', day: 'numeric' });
        document.getElementById('clock').innerHTML = timeString +" "+"-" +" "+ dateString;
      }
      
      setInterval(updateClock,1000);
      
      
      document.getElementById("invite-btn").addEventListener("click",()=>{
        document.getElementById("rightDiv").style.display="none";
        document.getElementById("inviteDiv").style.display="block"
      })
      document.getElementById("done-btn").addEventListener("click",()=>{
        document.getElementById("rightDiv").style.display="block";
        document.getElementById("inviteDiv").style.display="none";
      })

      var inviteArray =[]
      function send(Name){
        console.log(Name)
        document.querySelector("#invUsers>div>p:nth-child(2)").innerHTML=`Invite Sent`
        let text= `Chat AI :- Invite sent to ${Name}`
        if(!inviteArray.includes(Name)){
            inviteArray.push(Name)
            typewriter(text)
        }else{
            text=`Chat AI :- Invite already sent to ${Name}`
            typewriter(text)
        }
      }

      document.getElementById('copyLink').addEventListener('click', function() {
        let link = window.location.href;
        link+=`?room=${room}&pass=${username}`
        
        navigator.clipboard.writeText(link).then(function() {
            typewriter('Chat AI :- Link copied');
        }, function() {
            typewriter('Chat AI :- Failed to copy link');
        });
      });