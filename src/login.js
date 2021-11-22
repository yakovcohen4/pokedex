const loginBtn = document.getElementById('login')

const uesrInput = document.getElementById('username')


loginBtn.addEventListener('click' , takeUserName);


function takeUserName(e){
    
    const username = uesrInput.value;
    console.log(username)
}
