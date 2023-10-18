const path = require('path');
const User = require('../models/user');
const Expenses = require('../models/expense');
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
                res.redirect(`/expenses`)
            }
            else{
                res.status(401).send('User not authorized');
            }
        })
        }).catch(()=>{
            res.status(404).send('User not Found')
        })
        

}

exports.GetCreatePage = (req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','create-expense.html'))
}

exports.CreateExpense = async (req,res)=>{
    const amount = req.body.amount;
    const description = req.body.description;
    const catagory = req.body.catagory
    try{
        await Expenses.create({
            amount,description,catagory
        })
        res.redirect('/expenses');
    }
    catch(err){
        console.log(err);

    }}

exports.GetExpenses = (req,res)=>{
    Expenses.findAll().then((result)=>{
        res.json(result)
    })
}

exports.DeleteExpense = (req,res)=>{
    const Id = req.params.id;
    Expenses.findByPk(Id).then((expense)=>{
        return expense.destroy()

    }).then(()=>{
        res.redirect('/expenses')
    })
    
        
}

