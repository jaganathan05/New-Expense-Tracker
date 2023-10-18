const express = require('express');
const router = express.Router();
const front_page_controller = require('../controller/front_page')

router.post('/signup',front_page_controller.PostSignup);

router.get('/signup',front_page_controller.getSignup);

router.get('/login',front_page_controller.getLogin);

router.post('/Home',front_page_controller.PostLogin)

router.post('/expenses',front_page_controller.CreateExpense);

router.get('/expense',front_page_controller.GetExpenses);

router.get('/expenses',front_page_controller.GetCreatePage);



router.post('/expenses/:id',front_page_controller.DeleteExpense)

module.exports=router;