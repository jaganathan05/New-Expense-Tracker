const Sequelize= require('sequelize');
const sequelize = require('../helper/database');

const user = sequelize.define('user',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    TotalAmount:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    TotalIncome:{
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue: 0
    }
})

module.exports= user;