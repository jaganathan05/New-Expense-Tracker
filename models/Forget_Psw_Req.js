const sequelize = require('../helper/database');
const Sequelize = require('sequelize');

const FPR = sequelize.define('forgetpasswordrequests',{
    id:{
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    isActive:{
        type: Sequelize.STRING,
        allowNull:false
    }
})

module.exports=FPR;