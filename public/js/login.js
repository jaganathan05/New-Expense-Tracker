function login(event){
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const logindata={
        email , password
    }
    console.log(logindata)
    axios.post('http://localhost:3000/user/login',logindata).then((Response)=>{
        alert(Response.data.message);
        localStorage.setItem('token',Response.data.token)
        window.location.href='/expenses'
    }).catch((err)=>{
        console.error(err);
    })

}