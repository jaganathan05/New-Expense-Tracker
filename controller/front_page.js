const path = require('path');
const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getSignup=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','signup.html'))
}

exports.PostSignup=(req,res,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.psw;

    bcrypt.hash(password,10, async(err,result)=>{
        await User.create({
            name: name,
            email:email,
            password:result
        }).then(()=>{
            
            res.redirect('/login');
        }).catch(()=>{
            res.send('This email already have a account');
        })
    })

    
}

exports.getLogin=(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','login.html'))
}

exports.PostLogin = (req,res)=>{
    const Email = req.body.email;
    const psw = req.body.password;
    User.findAll({where:{
        email:Email
    }}).then((user)=>{
        bcrypt.compare(psw,user[0].password, async(err,result)=>{
            if(result===true){
                res.send('Login Succesful')
            }
            else{
                res.status(401).send('User not authorized');
            }
        })
        }).catch(()=>{
            res.status(404).send('User not Found')
        })
        

}