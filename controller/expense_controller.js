const path = require('path');
const User = require('../models/user');
const Expenses = require('../models/expense');
const bcrypt = require('bcrypt');


exports.GetCreatePage = (req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','create-expense.html'))
}

exports.CreateExpense = async (req,res)=>{
    const { amount, description, catagory } = req.body;
    try{
        await Expenses.create({
            amount,description,catagory,userId : req.user.id
        })
        res.redirect('/expenses');
    }
    catch(err){
        console.log(err);

    }}

exports.GetExpenses = (req,res)=>{
    Expenses.findAll({where:{
        UserId : req.user.id
    }}).then((result)=>{
        return res.json(result)
    })
}

exports.DeleteExpense = async (req, res) => {
    try {
        const Id = req.params.id;
        const expense = await Expenses.findByPk(Id);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        if (expense.userId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this expense' });
        }

        
        expense.destroy();
        return res.status(200).json({ success: true, message: 'Expense successfully Deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

