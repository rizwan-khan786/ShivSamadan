const express = require('express');
const { submitComplaint, getUserComplaints, getComplaintById, updateComplaintStatus, getAllComplaintsForAdmin ,
    assignComplaintToDepartment, 
    updateDepartmentStatus, 
    getDepartmentComplaints
} = require('../controllers/complaintController');
const passport = require('passport');

const router = express.Router();

// ✅ User Routes
router.post('/submit', passport.authenticate('jwt', { session: false }), submitComplaint); // User submits a complaint
router.get('/my-complaints', passport.authenticate('jwt', { session: false }), getUserComplaints); // Get complaints of logged-in user
router.get('/:id', passport.authenticate('jwt', { session: false }), getComplaintById); // Get single complaint details

// ✅ Admin Routes
router.get('/admin/all', passport.authenticate('jwt', { session: false }), getAllComplaintsForAdmin); // Get all complaints (Admin)
router.put('/admin/update-status/:id', passport.authenticate('jwt', { session: false }), updateComplaintStatus); // Admin updates complaint status
router.put('/admin/assign/:id', passport.authenticate('jwt', { session: false }), assignComplaintToDepartment); // Admin assigns complaint to department

// ✅ Department Routes
router.get('/department/all', passport.authenticate('jwt', { session: false }), getDepartmentComplaints); // Get complaints assigned to department
router.put('/department/update-status/:id', passport.authenticate('jwt', { session: false }), updateDepartmentStatus); // Department updates complaint status

module.exports = router;
