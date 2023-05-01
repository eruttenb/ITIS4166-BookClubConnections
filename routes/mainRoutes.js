const express = require('express');
const controller = require('../controllers/mainController');

const router = express.Router();

//GET / homepage
router.get('/', controller.index);

//GET /about send about page
router.get('/about', controller.about);

//GET /contact: contact page
router.get('/contact', controller.contact);

module.exports = router;