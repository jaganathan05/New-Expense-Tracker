function signup(event){
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const signupdata = {
        name,email,password
    }
    console.log(signupdata);
    
         axios.post('http://13.200.1.178:3000/signup',signupdata).then((response)=>{
            alert(response.data.message);
            window.location.href='/login';

         }).catch((err)=>{
            console.log(err);
            })
        

   

}