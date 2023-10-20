const path = require('path');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

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

exports.PostLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email,password);

        const user = await User.findOne({ where: { email: email } });

        if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result === true) {
                return res.status(200).json({
                    success: true,
                    message: "Logged In Successfully",
                    token: generateAccesstoken(user.id, user.email)
                });
            } else {
                return res.status(401).send('User not authorized');
            }
        } else {
            return res.status(404).send('User not Found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

    

    
        
function generateAccesstoken(id,email){
    return jwt.sign({userId : id , Email:email},'5kdsojj2jb43bjds023j23jln32')
}
