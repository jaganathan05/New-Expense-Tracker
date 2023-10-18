const sequelize = require('../helper/database');
const Sequelize = require('sequelize');

const Expenses = sequelize.define('expenses',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    amount:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    description:{
        type: Sequelize.STRING,
        allowNull: false
    },
    catagory:{
        type:Sequelize.STRING,
        allowNull:false
    }

})

module.exports=Expenses;