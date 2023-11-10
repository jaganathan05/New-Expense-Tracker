const Sequelize = require("sequelize");
const sequelize = require("../helper/database");

const FileUrl = sequelize.define("fileurls", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fileUrl :{
    type: Sequelize.STRING,
    allowNull:false
  }
});

module.exports = FileUrl;