let userid=document.getElementById("admin-userid");
let button=document.getElementById("admin-btn");
let password=document.getElementById("admin-password");
button.addEventListener("click",(e)=>{
    e.preventDefault();
    fetch("/admindetail.json")
    .then((data)=>{
        return data.json();
    })
    .then((res)=>{
        fetchdata=res;
        adminsignin(res);
    })  
    .catch((error)=>{
        console.log(error);
    })
});
function adminsignin(data){
    data.forEach((element)=>{
        if(userid.value===element.EmailID){
            if(password.value===element.Password){
               alert("Welcome Back Admin !");
               window.location.href="./adminpage.html";
            }else{
                alert("Wrong Password. Re-Enter your Password !");
            }
        }else{
            alert("You are not an Admin !");
        }
    })
}
