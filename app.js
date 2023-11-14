const express = require('express');
const path = require('path');
const cors = require('cors');
const body_parser= require('body-parser'); 
const app = express() ;
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');

app.use(express.json());
const sequelize = require('./helper/database');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const Files = require('./models/Save_FileUrl');
const FPR = require('./models/Forget_Psw_Req');
const router = require('./routes/route');
const purchase_router = require('./routes/purchase');
app.use(express.static(path.join(__dirname,'public')))
app.use(body_parser.urlencoded({ extended: false }));
app.use(router);
app.use('/purchase',purchase_router);
app.use(cors());
app.use(helmet());// set secure headers

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags: 'a'}
)

app.use(compression());
app.use(morgan('combined',{stream:accessLogStream }));

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);

User.hasMany(FPR);
FPR.belongsTo(User);

User.hasMany(Files);
Files.belongsTo(User)

sequelize.sync().then(()=>{
    app.listen(3000);
})
