const { register, login, getAllData, updatedate, editData, deleteData, verifyUser } = require('../controllers/userControllers');

const router = require('express').Router();


router.post('/register', register);
router.post('/login', login);
router.get('/getAll', verifyUser, getAllData);
router.post('/updateData', verifyUser,  updatedate);
router.post('/editByData', verifyUser, editData);
router.post('/deleteUser', verifyUser, deleteData)

module.exports = router;
