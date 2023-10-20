const express = require('express');
const path = require('path');
const cors = require('cors');
const body_parser= require('body-parser'); 
const app = express() ;
app.use(express.json());

const User = require('./models/user');
const Expense = require('./models/expense');
const router = require('./routes/route');
app.use(express.static(path.join(__dirname,'public')))
app.use(body_parser.urlencoded({ extended: false }));
app.use(router);
app.use(cors());

User.hasMany(Expense);
Expense.belongsTo(User);

const sequelize = require('./helper/database');

sequelize.sync().then(()=>{
    app.listen(3000);
})
