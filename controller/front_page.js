const Path = require('path');
const User = require('../models/user');

exports.getData=(req,res,next)=>{
    res.sendFile(Path.join(__dirname,'..','views','signup.html'))
}

exports.PostData=(req,res,next)=>{
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