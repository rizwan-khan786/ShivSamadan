// const express = require('express');
// const { register, sendOTP, verifyOTP,getProfile, sendPasswordResetOTP, updatePassword ,getAllUsers} = require('../controllers/authController');
// const router = express.Router();
// const authMiddleware = require('../middlewares/authMiddleware');

// router.post('/register', register);
// router.post('/send-otp', sendOTP);
// router.post('/verify-otp', verifyOTP);
// router.get('/profile', authMiddleware, getProfile); // ✅ Fix here
// router.post('/send-password-reset-otp', sendPasswordResetOTP);
// router.post('/update-password', updatePassword);
// router.get('/allusers', authMiddleware, getAllUsers); // ✅ Fix here


// module.exports = router;


const express = require('express');
const { 
    register, 
    sendOTP, 
    verifyOTP, 
    getProfile, 
    sendPasswordResetOTP, 
    updatePassword, 
    getAllUsers, 
    loginWithEmail,
    deleteUser // ✅ Added email/password login route,

} = require('../controllers/authController');

const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginWithEmail); // ✅ Added email & password login
router.get('/profile', authMiddleware, getProfile);
router.post('/send-password-reset-otp', sendPasswordResetOTP);
router.post('/update-password', updatePassword);
router.get('/allusers', authMiddleware, getAllUsers);
router.delete('/delete/:id', authMiddleware, deleteUser); // ✅ Protected route

module.exports = router;
