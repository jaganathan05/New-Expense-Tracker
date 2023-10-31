const path = require('path');
const User = require('../models/user');
const Expenses = require('../models/expense');
const Order = require('../models/order');
const sequelize = require('../helper/database');

exports.ShowLeaderBoard=async(req,res,next)=>{
    try{
        const UserLeaderBoardDetails = await User.findAll({
            order :[["TotalAmount","DESC"]]
                });
        return res.status(200).json(UserLeaderBoardDetails);
    }
    catch(err){
        console.log(err);
    }

}