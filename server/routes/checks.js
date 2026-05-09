const express = require('express');
const router = express.Router();
const checkController = require('../controllers/checkController');
const auth = require('../middlewares/auth');

router.post('/', auth, checkController.predictAndSave);
router.get('/history', auth, checkController.getHistory);
router.delete('/:id', auth, checkController.deleteCheck);

module.exports = router;
