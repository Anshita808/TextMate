
// scripts for design

var x=document.getElementById("signin");
var y=document.getElementById("signup");
var z=document.getElementById("btn");
function signup(){
    x.style.left="-400px";
    y.style.left="50px";
    z.style.left="110px";
}
function signin(){
    x.style.left="50px";
    y.style.left="450px";
    z.style.left="0";
}

// scripts for sign up
let emailS = document.getElementById('signup-email');
let passwords = document.getElementById("signup-password")
let name = document.getElementById("signup-name");
let signupBtn = document.getElementById("signup-btn");

signupBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let popup = document.getElementById("popup")
            popup.classList.add("openpopup")

            let otp = document.getElementById("otp")
            let otpNumber = Math.floor(1000 + Math.random() * 9000);
            otp.innerText = otpNumber

            
            let otpButton = document.getElementById("otpButton")
                otpButton.addEventListener("click" , (e)=>{
                    let i1 = document.getElementById("otpInput1")
                    let i2 = document.getElementById("otpInput2")
                    let i3 = document.getElementById("otpInput3")
                    let i4 = document.getElementById("otpInput4")

                    let otpInput = i1.value + i2.value + i3.value + i4.value
                
                    if(otpInput == otpNumber){
                        // popup.classList.remove("openpopup")

                        popup.innerHTML=`
                            <div id="load">
                                <div class="loading"></div>
                                <p>LOADING</p>
                            </div>
                        `

                        singUpFunction()
                        
                    }else{
                        document.querySelector("#otpInput>h3").innerHTML="WRONG OPT"
                        document.querySelector("#otpInput>h3").style.color="red"
                    }
            })
    
})

function singUpFunction(){
    let newUser = {
        email: emailS.value,
        password: passwords.value,
        name: name.value
    }
    fetch("https://ill-trousers-crab.cyclic.app/users/register",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
    })
    .then(res=>res.json())
    .then(res=>{
        console.log(res)
        window.location.href = "../pages/login.html"
        
    })
    .catch(err=>console.log(err))
}

// scripts for sign in

const email = document.getElementById('signin-email');
const password = document.getElementById('signin-password');
const loginBtn = document.getElementById('signin-btn');


loginBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let popup = document.getElementById("popup")
            popup.classList.add("openpopup")

            let otp = document.getElementById("otp")
            let otpNumber = Math.floor(1000 + Math.random() * 9000);
            otp.innerText = otpNumber

            
            let otpButton = document.getElementById("otpButton")
                otpButton.addEventListener("click" , (e)=>{
                    let i1 = document.getElementById("otpInput1")
                    let i2 = document.getElementById("otpInput2")
                    let i3 = document.getElementById("otpInput3")
                    let i4 = document.getElementById("otpInput4")

                    let otpInput = i1.value + i2.value + i3.value + i4.value
                
                    if(otpInput == otpNumber){
                        // popup.classList.remove("openpopup")

                        popup.innerHTML=`
                            <div id="load">
                                <div class="loading"></div>
                                <p>LOADING</p>
                            </div>
                        `

                        loginFunction()
                        
                    }else{
                        document.querySelector("#otpInput>h3").innerHTML="WRONG OPT"
                        document.querySelector("#otpInput>h3").style.color="red"
                    }
            })
    
})

function loginFunction(){
    let newUser = {
        email: email.value,
        password: password.value
    }

    console.log(newUser)

    fetch("https://ill-trousers-crab.cyclic.app/users/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
    })
    .then(res=>res.json())
    .then(res=>{
        localStorage.setItem("token", res.token)
        localStorage.setItem("userInfo",JSON.stringify(res.user))
        window.location.href = "../index.html"
    })
    .catch(err=>console.log(err))
}