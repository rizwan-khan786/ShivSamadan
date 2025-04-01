const express = require('express');
const { submitComplaint, getUserComplaints, getComplaintById, updateComplaintStatus, getAllComplaintsForAdmin ,
    assignComplaintToDepartment, 
    updateDepartmentStatus, 
    getDepartmentComplaints,
    getUserComplaintCount, // Import the new function
    getAdminComplaintCount, // Import the new function
    getDepartmentComplaintCount // Import the new function
} = require('../controllers/complaintController');
const passport = require('passport');
const upload = require('../middlewares/upload'); // Import multer config

const router = express.Router();

// ✅ User Routes
router.post('/submit', upload.array('attachments', 5), passport.authenticate('jwt', { session: false }), submitComplaint); // User submits a complaint
router.get('/my-complaints', passport.authenticate('jwt', { session: false }), getUserComplaints); // Get complaints of logged-in user
router.get('/:id', passport.authenticate('jwt', { session: false }), getComplaintById); // Get single complaint details
router.get('/my-complaints/count', passport.authenticate('jwt', { session: false }), getUserComplaintCount); // Get complaint count for logged-in user

// ✅ Admin Routes
router.get('/admin/all', passport.authenticate('jwt', { session: false }), getAllComplaintsForAdmin); // Get all complaints (Admin)
router.put('/admin/update-status/:id', passport.authenticate('jwt', { session: false }), updateComplaintStatus); // Admin updates complaint status
router.put('/admin/assign/:id', passport.authenticate('jwt', { session: false }), assignComplaintToDepartment); // Admin assigns complaint to department
router.get('/admin/count', passport.authenticate('jwt', { session: false }), getAdminComplaintCount); // Get complaint count for admin

// ✅ Department Routes
router.get('/department/all', passport.authenticate('jwt', { session: false }), getDepartmentComplaints); // Get complaints assigned to department
router.put('/department/update-status/:id', passport.authenticate('jwt', { session: false }), updateDepartmentStatus); // Department updates complaint status
router.get('/department/count', passport.authenticate('jwt', { session: false }), getDepartmentComplaintCount); // Get complaint count for assigned department

module.exports = router;
