const path = require('path');
const User = require('../models/user');

exports.getSignup=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','signup.html'))
}

exports.PostSignup=(req,res,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.psw;

    User.create({
        name: name,
        email:email,
        password:password
    }).then(()=>{
        console.log('user created');
        res.redirect('/');
    }).catch(()=>{
        res.send('This email already have a account');
    })
}

exports.getLogin=(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','login.html'))
}