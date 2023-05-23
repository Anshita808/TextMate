const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const nameBold = document.getElementById("userName");
const nameP = document.getElementById("userName-p");
const email = document.getElementById("userEmail-p");
const logout = document.getElementById("logout");

const editNameBtn = document.getElementById("editName");
const editEmailBtn = document.getElementById("editEmail");
const editPassBtn = document.getElementById("editPass");

const editEmailSection = document.querySelector(".editEmailSection");
const editNameSection = document.querySelector(".editNameSection");
const editPassSection = document.querySelector(".editPassSection");

editEmailBtn.addEventListener("click", () => {
	// console.log(editEmailSection);
	editEmailSection.style.display = "block";
});
editNameBtn.addEventListener("click", () => {
	// console.log(editEmailSection);
	editNameSection.style.display = "block";
});
editPassBtn.addEventListener("click", () => {
	// console.log(editEmailSection);
	editPassSection.style.display = "block";
});

window.addEventListener("load", () => {
	nameBold.textContent = userInfo.name || "John Doe";
	nameP.textContent = userInfo.name || "John Doe";
	email.textContent = userInfo.email || "doejohn@gmail.com";
});

const token = localStorage.getItem("token");

logout.addEventListener("click",()=>{
	console.log(token);
		fetch("http://localhost:8080/user/logout", {
		  method: "GET",
		  headers: {
			"Content-Type": "application/json",
			Authorization: token,
		  },
		})
		  ////////ok
	  
		  .then((res) => res.json())
		  .then((res) => {
			// body: JSON.stringify(data)
			console.log(res);
			setTimeout(() => {
			  window.location.href = "index.html";
			}, 1000);
		  })
		  .catch((error) => {
			console.log(error.message);
		  });
	  
})