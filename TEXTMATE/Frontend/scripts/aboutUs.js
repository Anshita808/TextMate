function reveal() {
	var reveals = document.querySelectorAll(".reveal");

	for (var i = 0; i < reveals.length; i++) {
		var windowHeight = window.innerHeight;
		var elementTop = reveals[i].getBoundingClientRect().top;
		var elementVisible = 150;

		if (elementTop < windowHeight - elementVisible) {
			reveals[i].classList.add("active");
		} else {
			reveals[i].classList.remove("active");
		}
	}
}

window.addEventListener("scroll", reveal);


let userInfo = JSON.parse(localStorage.getItem('userInfo')) 
if(userInfo){
    console.log(userInfo);

    let name = userInfo.name.split(" ")[0];
    let div = document.getElementById("userLogin")
    div.innerHTML = name;
	div.style.color="white"

    div.addEventListener("click" , ()=>{
        window.location.href ="../pages/profile.html"
    })
}else{
    let div = document.getElementById("name")

    div.addEventListener("click" , ()=>{
        window.location.href = "../pages/signin.html"
    })

}