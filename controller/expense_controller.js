const path = require('path');
const User = require('../models/user');
const Expenses = require('../models/expense');
const FileUrl = require('../models/Save_FileUrl');
const bcrypt = require('bcrypt');
const Order = require('../models/order');
const Sequelize = require('sequelize');
const sequelize = require('../helper/database');
const UserServices = require('../services/userservice');
const S3service = require('../services/S3service');
require('dotenv').config();
const AWS = require('aws-sdk');


exports.GetCreatePage = (req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','create-expense.html'))
}

exports.CreateExpense = async (req,res)=>{
    const { amount, description, catagory } = req.body;
    const t = await sequelize.transaction();
    try{
      
        const expenses = await Expenses.create({
            amount,description,catagory,userId : req.user.id
        },{transaction:t})
        Total_Amount=Number( req.user.TotalAmount) + Number(amount);
        
        await User.update({
          TotalAmount : Total_Amount
        },{where:{
          id: req.user.id
        },
        transaction:t})
         await t.commit();
       return res.status(200).json({expenses});
    }
    catch(err){
      await t.rollback();
      return res.json({err});
    }
  }


    exports.GetExpenses = async (req, res) => {
      try {
        const expenses = await Expenses.findAll({
          where: {
            UserId: req.user.id
          }
        });
    
        const order = await Order.findOne({
          where: {
            UserId: req.user.id,
            status: "SUCCESSFULL"
          }
        });
    
    
        if (!order) {
          return res.json({ result: expenses, message: 'No Premium' });
        } else {
          return res.json({ result: expenses, message: 'SUCCESSFULL' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    }
    
      

exports.DeleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
    try {
        const Id = req.params.id;
        const expense = await Expenses.findByPk(Id);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        if (expense.userId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this expense' });
        }

        const UpdatedAmount = Number(req.user.TotalAmount) - Number(expense.amount);
        expense.destroy({transaction:t});
        await User.update({
          TotalAmount : UpdatedAmount
        },{where:{
          id: req.user.id
        },
        transaction:t})
        await t.commit();
        return res.status(200).json({ success: true, message: 'Expense successfully Deleted' });
    } catch (error) {
        await t.rollback();
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.DownloadExpenses= async (req,res)=>{
  
    try{
      const UserId = req.user.id  
      const Expense = await UserServices.getExpenses(req);
      const stringifyExpenses = JSON.stringify(Expense);
      const filename = `Expense${UserId}${new Date()}.txt`;
      const fileurl = await S3service.uploadToS3(stringifyExpenses,filename);
      const response = await FileUrl.create({
        fileUrl: fileurl,
        userId : req.user.id 
      })
      res.status(200).json({fileurl,success:true})
    }
    catch(err){
      console.log(err)
      res.status(500).json({fileurl, success:false, err: err})
    }
    
    
}

  
  