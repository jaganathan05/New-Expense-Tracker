const path = require('path');
const User = require('../models/user');
const Expenses = require('../models/expense');
const Order = require('../models/order');

exports.ShowLeaderBoard=async(req,res,next)=>{
    try{const expenses = await Expenses.findAll();
        const users = await User.findAll();
        var tempLB = {}
        expenses.forEach((expense)=>{
            if(tempLB[expense.userId]){
                tempLB[expense.userId]+= expense.amount;
            }
            else{
                tempLB[expense.userId]= expense.amount;
            }
        })
        console.log(tempLB);
        var UserLeaderBoardDetails = []
        
        users.forEach((user)=>{
                UserLeaderBoardDetails.push({name : user.name,TotalAmount : tempLB[user.id] })
        })
        console.log(UserLeaderBoardDetails)
        UserLeaderBoardDetails.sort((a,b)=> b.TotalAmount - a.TotalAmount);
        console.log(UserLeaderBoardDetails)
        return res.status(200).json(UserLeaderBoardDetails);
    }
    catch(err){
        console.log(err);
    }

}