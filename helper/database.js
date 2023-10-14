const Sequelize = require('sequelize');

const sequelize = new Sequelize('projects','root','Jaguar@05', {
    dialect:'mysql',
    host:'localhost'})

    module.exports=sequelize;