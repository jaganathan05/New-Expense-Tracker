const express = require('express');
const router = express.Router();
const expense_controller= require('../controller/expense_controller')
const user_controller = require('../controller/user_controller');
const auth_middleware = require('../Middleware/auth');

router.post('/signup',user_controller.PostSignup);

router.get('/signup',user_controller.getSignup);

router.get('/login',user_controller.getLogin);

router.post('/user/login',user_controller.PostLogin)

router.post('/expenses',auth_middleware.authentication,expense_controller.CreateExpense);

router.get('/expense',auth_middleware.authentication,expense_controller.GetExpenses);

router.get('/expenses',expense_controller.GetCreatePage);

router.delete('/expenses/:id',auth_middleware.authentication,expense_controller.DeleteExpense)

module.exports=router;