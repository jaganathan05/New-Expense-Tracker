async function forgetpassword(event){
    event.preventDefault();
    const password = document.getElementById('password').value;
    const url = window.location.href;
    const id = url.substr(url.lastIndexOf('/') + 1);
    const data = {
        password,id
    };
    console.log(data);
    try{
        const response = await axios.post('http://3.109.157.131:3000/resetpassword',data);
        alert(`${response.data.message}`);
        window.location.href='/login';
    }
    catch{

    }
    
}