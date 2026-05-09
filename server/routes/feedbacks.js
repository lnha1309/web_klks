const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middlewares/auth');

router.post('/', auth, feedbackController.createFeedback);

module.exports = router;
