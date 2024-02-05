let userInfo = JSON.parse(localStorage.getItem("userInfo"));
// let userInfo = null
const baseURL = `http://localhost:8080`;
if (userInfo) {
	console.log(userInfo);

	let name = userInfo.name.split(" ")[0];
	let div = document.getElementById("userLogin");
	div.innerHTML = name;
	div.style.color = "white";

	div.addEventListener("click", () => {
		window.location.href = "../pages/profile.html";
	});
} else {
	let div = document.getElementById("name");

	div.addEventListener("click", () => {
		window.location.href = "../pages/signin.html";
	});
}
const socket = io(`${baseURL}/`, { transports: ["websocket"] });
const roomName = document.querySelector("h1>span");
const total = document.querySelector("h3>span");
const userList = document.querySelector("#allUsers");
const joinAlert = document.querySelector("#typewriter");
const text = document.querySelector("textarea");
const typing = document.querySelector("h4");
const lastChange = document.querySelector("h5");

// var userInfo = JSON.parse(localStorage.getItem('userInfo')) || null ;
// userInfo.type = userInfo.type|| "free"
var username = userInfo.name || "Anonymous";
var roomdetails = null;
var room;

const urlParams = new URLSearchParams(window.location.search);

document.querySelector("#join-form>input[type=text]").value =
	urlParams.get("room") || "";
document.querySelector("#join-form>input[type=password]").value =
	urlParams.get("pass") || "";

const join = document.getElementById("join");
const create = document.getElementById("create");
join.addEventListener("click", () => {
	document.getElementById("join-form").style.display = "block";
	document.getElementById("create-form").style.display = "none";

	join.classList.add("curr");
	create.classList.remove("curr");
});
create.addEventListener("click", () => {
	document.getElementById("join-form").style.display = "none";
	document.getElementById("create-form").style.display = "block";

	create.classList.add("curr");
	join.classList.remove("curr");
});

const join_btn = document.getElementById("join-btn");
const create_btn = document.getElementById("create-btn");

join_btn.addEventListener("click", (e) => {
	e.preventDefault();
	join_btn.innerHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;

	room = document.querySelector("#join-form>input[type=text]").value;
	console.log(room);

	//get room
	fetch(`${baseURL}/rooms/${room}`)
		// .then(res=>{
		//     res.json()
		//     console.log(res)
		// })
		.then((data) => {
			console.log(data);
			roomdetails = data;
			socket.emit("joinRoom", { username, room });
			document.getElementById("mainContaint").style.display = "block";
			document.getElementById("form").style.display = "none";
		})
		.catch((err) => {
			console.log(err);
		});
});

create_btn.addEventListener("click", (e) => {
	e.preventDefault();
	create_btn.innerHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;

	room = document.querySelector("#create-form>input[type=text]").value;
	console.log(room);

	roomdetails = {
		roonName: room,
		createrName: userInfo.name,
		createrID: userInfo._id,
		roomType: userInfo.type,
		data: "",
	};
	console.log(roomdetails);
	//create room
	fetch(`${baseURL}/rooms/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(roomdetails),
	})
		.then((data) => {
			console.log(data);
			socket.emit("joinRoom", { username, room });
			document.getElementById("mainContaint").style.display = "block";
			document.getElementById("form").style.display = "none";
		})
		.catch((err) => {
			console.log(err);
		});
});

const userStatus = {
	microphone: false,
	mute: false,
	username,
	online: true,
};

//prompt('What is your name?') ||
var flag = false;
text.addEventListener("keyup", (e) => {
	socket.emit("typing", username);
	setTimeout(() => {
		socket.emit("chatMessage", text.value);
	}, 3000);
});
let check = document.getElementById("autoSave");
let lastTextValue = text.value;

setInterval(() => {
	if (check.checked && lastTextValue !== text.value) {
		console.log(text.value);
		lastTextValue = text.value;
		fetch(`${baseURL}/rooms/${room}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(text.value),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("data saved");
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});
	}
}, 10000);
socket.on("typing", (user) => {
	typing.innerHTML = `${user} is typing...`;
});
socket.on("chatMessage", (msg) => {
	text.value = msg.text;
	lastChange.innerHTML = `last changed at ${msg.time} by ${msg.username}`;
	typing.innerHTML = ``;
});

socket.on("message", (message) => {
	typewriter(message);
});

function typewriter(message) {
	var typewriterText = message;

	const typewriterDelay = 100;
	const typewriterElement = document.getElementById("typewriter");
	typewriterElement.innerHTML = "";
	document.getElementById("alert").style.visibility = "visible";
	let i = 0;
	typeWriter();
	function typeWriter() {
		if (i < typewriterText.length) {
			typewriterElement.innerHTML += typewriterText.charAt(i);
			i++;
			setTimeout(typeWriter, typewriterDelay);
		}
	}
	setTimeout(function () {
		document.getElementById("alert").style.visibility = "hidden";
	}, 5000);
}

socket.on("roomUsers", ({ room, users }) => {
	roomName.innerText = room;
	outputRoomUsers(users);
});

function outputRoomUsers(users) {
	userList.innerHTML = "";
	total.innerHTML = users.length;
	let html = "";
	users.forEach((user) => {
		let firstLetter = user.username.toUpperCase()[0];
		let userName = user.username.split(" ")[0];
		html += `<div>
                        <h1 id="${user.username}">${firstLetter}</h1>
                        <p>${userName}</p>
                    </div>`;
	});
	userList.innerHTML = html;
}

var localStream;
var remoteStream;

function videoOn() {
	typewriter("TextMate Bot :- This feature is currently unavailable");
}

function micOff() {
	document.getElementById("micOff").style.display = "block";
	document.getElementById("micOn").style.display = "none";
	userStatus.microphone = false;
	emitUserInformation();
}
function micOn() {
	mainFunction(1000);
	document.getElementById("micOff").style.display = "none";
	document.getElementById("micOn").style.display = "block";
	userStatus.microphone = true;
	emitUserInformation();
}
socket.on("stream", ({ user, status }) => {
	if (status) {
		document.getElementById(`${user.username}`).style.border =
			"5px solid #61f83c";
	} else {
		document.getElementById(`${user.username}`).style.border =
			"2px solid #0efd8e";
	}
});

document.querySelector("#allChats~input").addEventListener("change", () => {
	if (document.querySelector("#allChats~input").value != "") {
		socket.emit("chat", document.querySelector("#allChats~input").value);
		document.querySelector("#allChats~input").value = "";
	}
});
document
	.querySelector("#allChats~input~ion-icon")
	.addEventListener("click", () => {
		if (document.querySelector("#allChats~input").value != "") {
			socket.emit("chat", document.querySelector("#allChats~input").value);
			document.querySelector("#allChats~input").value = "";
		}
	});
socket.on("chat", (chat) => {
	appendChat(chat);
});
function appendChat(chat) {
	const div = document.createElement("div");
	div.classList.add("chat-div");
	const name = document.createElement("p");
	name.innerHTML = `${chat.username} at ${chat.time}`;
	const p = document.createElement("p");
	p.innerText = chat.text;
	div.append(name, p);
	document.getElementById("allChats").appendChild(div);
	const allChats = document.getElementById("allChats");
	allChats.scrollTop = allChats.scrollHeight;
}

function updateClock() {
	const now = new Date();
	let hours = now.getHours();
	let minutes = now.getMinutes();
	let seconds = now.getSeconds();
	let amPm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12 || 12;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;
	const timeString = hours + ":" + minutes + ":" + seconds + " " + amPm;
	const dateString = now.toLocaleString("default", {
		month: "long",
		day: "numeric",
	});
	document.getElementById("clock").innerHTML =
		timeString + " " + "-" + " " + dateString;
}

setInterval(updateClock, 1000);

document.getElementById("invite-btn").addEventListener("click", () => {
	document.getElementById("rightDiv").style.display = "none";
	document.getElementById("inviteDiv").style.display = "block";
});
document.getElementById("done-btn").addEventListener("click", () => {
	document.getElementById("rightDiv").style.display = "block";
	document.getElementById("inviteDiv").style.display = "none";
});

var inviteArray = [];
function send(Name) {
	console.log(Name);
	document.querySelector(
		"#invUsers>div>p:nth-child(2)"
	).innerHTML = `Invite Sent`;
	let text = `TextMate Bot :- Invite sent to ${Name}`;
	if (!inviteArray.includes(Name)) {
		inviteArray.push(Name);
		typewriter(text);
	} else {
		text = `TextMate Bot :- Invite already sent to ${Name}`;
		typewriter(text);
	}
}

document.getElementById("copyLink").addEventListener("click", function () {
	let link = window.location.href;
	link += `?room=${room}&pass=${username.split(" ")[0]}`;

	navigator.clipboard.writeText(link).then(
		function () {
			typewriter("TextMate Bot :- Link copied");
		},
		function () {
			typewriter("TextMate Bot :- Failed to copy link");
		}
	);
});

window.onload = (e) => {
	emitUserInformation();
};
function mainFunction(time) {
	navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
		var madiaRecorder = new MediaRecorder(stream);
		madiaRecorder.start();

		var audioChunks = [];

		madiaRecorder.addEventListener("dataavailable", function (event) {
			audioChunks.push(event.data);
		});

		madiaRecorder.addEventListener("stop", function () {
			var audioBlob = new Blob(audioChunks);

			audioChunks = [];

			var fileReader = new FileReader();
			fileReader.readAsDataURL(audioBlob);
			fileReader.onloadend = function () {
				if (!userStatus.microphone || !userStatus.online) return;

				var base64String = fileReader.result;
				socket.emit("voice", base64String);
			};

			madiaRecorder.start();

			setTimeout(function () {
				madiaRecorder.stop();
			}, time);
		});

		setTimeout(function () {
			madiaRecorder.stop();
		}, time);
	});
}
socket.on("send", function (data) {
	var audio = new Audio(data);
	audio.play();
});

function emitUserInformation() {
	socket.emit("userInformation", userStatus);
}

window.addEventListener("DOMContentLoaded", () => {
	const fr = new FaceRating("#face-rating");
});

class FaceRating {
	constructor(qs) {
		this.input = document.querySelector(qs);
		this.input?.addEventListener("input", this.update.bind(this));
		this.face = this.input?.previousElementSibling;
		this.update();
	}
	update(e) {
		let value = this.input.defaultValue;

		// when manually set
		if (e) value = e.target?.value;
		// when initiated
		else this.input.value = value;

		const min = this.input.min || 0;
		const max = this.input.max || 100;
		const percentRaw = ((value - min) / (max - min)) * 100;
		const percent = +percentRaw.toFixed(2);

		this.input?.style.setProperty("--percent", `${percent}%`);

		// face and range fill colors
		const maxHue = 120;
		const hueExtend = 30;
		const hue = Math.round((maxHue * percent) / 100);

		let hue2 = hue - hueExtend;
		if (hue2 < 0) hue2 += 360;

		const hues = [hue, hue2];
		hues.forEach((h, i) => {
			this.face?.style.setProperty(`--face-hue${i + 1}`, h);
		});

		this.input?.style.setProperty("--input-hue", hue);

		// emotions
		const duration = 1;
		const delay = (-(duration * 0.99) * percent) / 100;
		const parts = ["right", "left", "mouth-lower", "mouth-upper"];

		parts.forEach((p) => {
			const el = this.face?.querySelector(`[data-${p}]`);
			el?.style.setProperty(`--delay-${p}`, `${delay}s`);
		});

		// aria label
		const faces = [
			"Sad face",
			"Slightly sad face",
			"Straight face",
			"Slightly happy face",
			"Happy face",
		];
		let faceIndex = Math.floor((faces.length * percent) / 100);
		if (faceIndex === faces.length) --faceIndex;

		this.face?.setAttribute("aria-label", faces[faceIndex]);
	}
}

var flag = false;
document.querySelector("#submit").addEventListener("click", (e) => {
	console.log(document.querySelector(".fr__input").value);
	window.location.href = "../index.html";
});
document.getElementById("rejoin").addEventListener("click", (e) => {
	flag = false;

	document.getElementById("mainContaint").style.display = "block";
	document.getElementById("feedback").style.display = "none";
});
document.getElementById("tohome").addEventListener("click", (e) => {
	flag = false;
	window.location.href = "../index.html";
});

function feedback() {
	flag = true;

	document.getElementById("mainContaint").style.display = "none";
	document.getElementById("feedback").style.display = "block";

	const timerEl = document.getElementById("timer");

	let time = 60;

	const timerInterval = setInterval(() => {
		time--;
		if (!flag) {
			clearInterval(timerInterval);
		}

		if (time === 0) {
			clearInterval(timerInterval);

			window.location.href = "../index.html";
		} else {
			const minutes = Math.floor(time / 60);
			const seconds = time % 60;

			const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

			timerEl.textContent = formattedTime;
		}
	}, 1000);
}

const showPassword = document.querySelector("#eye>ion-icon:nth-child(2)");
const hidePassword = document.querySelector("#eye>ion-icon:nth-child(1)");

showPassword.addEventListener("click", function () {
	document.querySelector("#password").setAttribute("type", "text");

	showPassword.style.display = "none";
	hidePassword.style.display = "block";
});
hidePassword.addEventListener("click", function () {
	document.querySelector("#password").setAttribute("type", "password");

	showPassword.style.display = "block";
	hidePassword.style.display = "none";
});

const show = document.querySelector("#show");
const hide = document.querySelector("#hide");

show.addEventListener("click", function () {
	document.querySelector("#passwordCreate").setAttribute("type", "text");

	show.style.display = "none";
	hide.style.display = "block";
});
hide.addEventListener("click", function () {
	document.querySelector("#passwordCreate").setAttribute("type", "password");

	show.style.display = "block";
	hide.style.display = "none";
});
