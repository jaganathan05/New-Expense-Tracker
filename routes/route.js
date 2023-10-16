const express = require('express');
const router = express.Router();
const front_page_controller = require('../controller/front_page')

router.post('/signup',front_page_controller.PostSignup);

router.get('/signup',front_page_controller.getSignup);

router.get('/login',front_page_controller.getLogin);

router.post('/login',front_page_controller.PostLogin)

module.exports=router;