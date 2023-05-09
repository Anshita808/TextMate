var popup = document.getElementById("popup")
// document.getElementById("sub").addEventListener("click",()=>{
 
// })

 const oderplace=()=>{
    // e.preventDefault();
    console.log("hi")

// document.getElementById('forEmail1').style.visibility="hidden"
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
                        <p>Verifying Details</p>
                    </div>
                `
                let userInfo = JSON.parse(localStorage.getItem('userInfo')) 
                if(userInfo){
                    userInfo.type=document.getElementById("plan").value || "pro"
                }
                localStorage.setItem("userInfo",JSON.stringify(userInfo))
               setTimeout(()=>{
                window.location.href="../index.html"
               },3000)
                
            }else{
                document.querySelector("#otpInput>h3").innerHTML="WRONG OPT"
                document.querySelector("#otpInput>h3").style.color="red"
            }
        })
}


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
    let div = document.getElementById("userLogin")

    div.addEventListener("click" , ()=>{
        window.location.href = "../pages/signin.html"
    })

}