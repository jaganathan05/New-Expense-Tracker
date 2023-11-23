const path = require('path');
const User = require('../models/user');
const FPR = require('../models/Forget_Psw_Req');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const Sib = require('sib-api-v3-sdk');
const{v4: UUID} = require('uuid');
const sequelize = require('../helper/database');

const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.Email_API_KEY 

exports.getSignup=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','signup.html'))
}

exports.PostSignup = (req, res, next) => {
    const { name, email, password } = req.body;

    User.findOne({where:{ email: email }}).then(existingUser => {
        if (existingUser) {
            return res.status(200).json({ success: false, message: 'This email already has an account' });
        }

        bcrypt.hash(password, 10, async (err, result) => {
            await User.create({
                name: name,
                email: email,
                password: result
            }).then(response => {
                return res.status(200).json({ success: true, message: 'Signup successful' });
            }).catch(err => {
                return res.status(500).json({ success: false, message: 'Signup failed' });
            });
        });
    });
};


exports.getLogin=(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','login.html'))
}

exports.PostLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Email is', email,password);

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
                return res.status(401).json({success:false,message: 'User not authorized'});
            }
        } else {
            return res.status(404).send({success:false,message:'User not Found'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

    

    
        
function generateAccesstoken(id,email){
    const secretKey = process.env.Token_SecretKey;
    console.log(secretKey);

    return jwt.sign({userId : id , Email:email},secretKey)
}


exports.Forgetpassword = async (req,res,next)=>{
    const Id = UUID();
    console.log('this is uuid',Id)
    const forgetpswemail = req.body.email;
    const user = await User.findOne({where:{
        email:forgetpswemail
    }});
    
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
    email: 'jaganathanv888@gmail.com',
    name: 'Jaganathan',
}
    const receivers = [
    {
        email: forgetpswemail,
    },
]
try{
    
    const createFPL =  await FPR.create({
        id:Id,
        isActive: 'true',
        userId: user.id
    }) 
    console.log(forgetpswemail);
    console.log(receivers);
    const sendmail = await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Forget Password Using Email Verification',
        htmlContent:`
        <h1>verification link</h1>
        <a href='http://13.200.1.178:3000/password/resetpassword/${Id}'>Visit</a>`
    })
    console.log('email sended')
    return res.json(sendmail)
    
}catch(err){
    console.log(err)
}


}

exports.GetForgetpasswordLink =async (req,res,next)=>{ 
    const Id = req.params.id;
    console.log(Id)
    const forgetpasswordrequest = await FPR.findOne({where:{
        id : Id
    }})
    console.log(forgetpasswordrequest.isActive);
    if (forgetpasswordrequest.isActive==='true'){
        res.sendFile(path.join(__dirname,'..','views','forgetpassword.html'));
    }
    else{
        res.redirect('/login');
    }

}
exports.PostResetPassword=async(req,res,next)=>{
    const { password, id }= req.body;
    const UserId = await FPR.findOne({where:{
        id: id
    }});
    console.log(UserId.userId)
    const t = await sequelize.transaction();
    try{
        const setnewpassword = await bcrypt.hash(password,10);
        const updatepassword = await User.update({
            password : setnewpassword
        },{
            where:{
                id : UserId.userId
            },transaction : t
        }
        )
        const updateFP_status = await FPR.update({
            isActive:'false'
        },{
            where:{
                id:id
            },transaction:t
        })

        await t.commit();
        return res.status(200).json({message: 'Password Changed successfully'})
    }
    catch(err){
        await t.rollback();
        console.log(err);
        return res.status(200).json({message: 'something wrong'})
    }
}