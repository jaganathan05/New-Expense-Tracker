const express = require('express');
const router = express.Router();
const front_page_controller = require('../controller/front_page')

router.post('/',front_page_controller.PostData);

router.get('/',front_page_controller.getData);

module.exports=router;