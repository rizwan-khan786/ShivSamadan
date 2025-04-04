

const Complaint = require('../models/Complaint');
const sendEmail = require('../utils/sendEmail');
const complaintSubmittedTemplate = require('../utils/complaintSubmitted');
const statusUpdatedTemplate = require('../utils/statusUpdated');
const complaintAssignedTemplate = require('../utils/complaintAssigned'); // ✅ Email Template
const mongoose = require('mongoose'); // ✅ Import mongoose
const User = require('../models/User'); // ✅ Import User model
const moment = require('moment');
// exports.submitComplaint = async (req, res) => {
//     try {
//         const { name, mobileNo, address, emailid, village, taluka, district, problem } = req.body;

//         if (!req.user) {
//             return res.status(401).json({ error: "Unauthorized: No user found" });
//         }

//         if (!name || !mobileNo || !problem || !emailid) {
//             return res.status(400).json({ error: "Required fields are missing" });
//         }

//         const attachments = req.files ? req.files.map(file => file.path) : [];

//         const newComplaint = new Complaint({
//             user: req.user._id,
//             name,
//             mobileNo,
//             address,
//             emailid,
//             village,
//             taluka,
//             district,
//             problem,
//             attachments,
//             status: 'Pending'
//         });

//         await newComplaint.save();

//         // ✅ Send Email with Template
//         await sendEmail(
//             emailid,
//             `Complaint Submitted: ${newComplaint.complaintId}`,
//             `Your complaint has been submitted successfully. Complaint ID: ${newComplaint.complaintId}. Status: Pending.`,
//             complaintSubmittedTemplate(name, newComplaint.complaintId, problem) // ✅ HTML Template
//         );

//         res.json({ message: "Complaint submitted successfully", complaintId: newComplaint.complaintId });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.submitComplaint = async (req, res) => {
//     try {
//         const { name, mobileNo, address, emailid, village, taluka, district, problem } = req.body;

//         if (!req.user) {
//             return res.status(401).json({ error: "Unauthorized: No user found" });
//         }

//         // ✅ Collect missing fields
//         const missingFields = [];
//         if (!name) missingFields.push("name");
//         if (!mobileNo) missingFields.push("mobileNo");
//         if (!problem) missingFields.push("problem");
//         if (!emailid) missingFields.push("emailid");
//         if (!village) missingFields.push("village");
//         if (!taluka) missingFields.push("taluka");
//         if (!district) missingFields.push("district");
//         if (!problem) missingFields.push("problem");
//         if (!attachments) missingFields.push("attachments");



//         // ✅ If any required fields are missing, return an error
//         if (missingFields.length > 0) {
//             return res.status(400).json({ 
//                 error: "Required fields are missing", 
//                 missingFields 
//             });
//         }

//         const attachments = req.files ? req.files.map(file => file.path) : [];

//         const newComplaint = new Complaint({
//             user: req.user._id,
//             name,
//             mobileNo,
//             address,
//             emailid,
//             village,
//             taluka,
//             district,
//             problem,
//             attachments,
//             status: 'Pending'
//         });

//         await newComplaint.save();

//         // ✅ Send Email with Template
//         await sendEmail(
//             emailid,
//             `Complaint Submitted: ${newComplaint.complaintId}`,
//             `Your complaint has been submitted successfully. Complaint ID: ${newComplaint.complaintId}. Status: Pending.`,
//             complaintSubmittedTemplate(name, newComplaint.complaintId, problem) // ✅ HTML Template
//         );

//         res.json({ message: "Complaint submitted successfully", complaintId: newComplaint.complaintId });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };


// ✅ Get All Complaints for Logged-in User

exports.submitComplaint = async (req, res) => {
    try {
        const { name, mobileNo, address, emailid, village, taluka, district, problem } = req.body;

        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: No user found" });
        }

        // ✅ Collect missing fields
        const missingFields = [];
        if (!name) missingFields.push("name");
        if (!mobileNo) missingFields.push("mobileNo");
        if (!problem) missingFields.push("problem");
        if (!emailid) missingFields.push("emailid");

        if (missingFields.length > 0) {
            return res.status(400).json({ 
                error: "Required fields are missing", 
                missingFields 
            });
        }

        // ✅ Handle attachments (image files)
        const attachments = req.files && req.files.length > 0 ? req.files.map(file => file.path) : [];

        const newComplaint = new Complaint({
            user: req.user._id,
            name,
            mobileNo,
            address,
            emailid,
            village,
            taluka,
            district,
            problem,
            attachments,
            status: 'Pending'
        });

        await newComplaint.save();

        // ✅ Send Email with Template
        await sendEmail(
            emailid,
            `Complaint Submitted: ${newComplaint._id}`,
            `Your complaint has been submitted successfully. Complaint ID: ${newComplaint._id}. Status: Pending.`,
            complaintSubmittedTemplate(name, newComplaint._id, problem) // ✅ HTML Template
        );

        res.json({ 
            message: "Complaint submitted successfully", 
            complaintId: newComplaint._id, 
            attachments 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getUserComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get Complaint by ID
exports.getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({ _id: req.params.id, user: req.user._id });
        if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

        res.json(complaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get All Complaints for Admin
exports.getAllComplaintsForAdmin = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ error: "Unauthorized: Admin access required" });
        }

        const complaints = await Complaint.find().populate('user', 'name emailid').sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// ✅ Update Complaint Status (Admin Only)
exports.updateComplaintStatus = async (req, res) => {
    try {
        // ✅ Ensure only Admin can update complaint status
        if (!req.user || req.user.role !== "Admin") {
            return res.status(403).json({ error: "Forbidden: Only admin can update complaint status" });
        }

        const { status } = req.body;

        if (!['Pending', 'In Progress', 'Rejected', 'Completed'].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

        complaint.status = status;
        await complaint.save();

        // ✅ Send Email with Template
        await sendEmail(
            complaint.emailid,
            `Complaint Status Updated: ${complaint.complaintId}`,
            statusUpdatedTemplate(complaint.name, complaint.complaintId, complaint.problem, status) // ✅ HTML Template
        );

        res.json({ message: "Complaint status updated successfully", status: complaint.status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// exports.assignComplaintToDepartment = async (req, res) => {
//     try {
//         if (req.user.role !== 'Admin') {
//             return res.status(403).json({ error: "Unauthorized: Only Admin can assign complaints" });
//         }

//         const { departmentId } = req.body;
//         if (!mongoose.Types.ObjectId.isValid(departmentId)) {
//             return res.status(400).json({ error: "Invalid department ID" });
//         }

//         const complaint = await Complaint.findById(req.params.id);
//         if (!complaint) {
//             return res.status(404).json({ error: "Complaint not found" });
//         }

//         const department = await User.findById(departmentId);
//         if (!department || department.role !== 'Department') {
//             return res.status(404).json({ error: "Department not found" });
//         }

//         // ✅ Assign Complaint to Department
//         complaint.assignedDepartment = new mongoose.Types.ObjectId(departmentId);
//         await complaint.save();

//         // ✅ Send Email Notification to Department
//         await sendEmail(
//             department.emailid, // 📩 Department Email
//             `New Complaint Assigned: ${complaint.complaintId}`,
//             `A new complaint (ID: ${complaint.complaintId}) has been assigned to your department.`,
//             complaintAssignedTemplate(
//                 department.name, // Department name
//                 complaint.complaintId, // Complaint ID
//                 complaint.problem, // Problem
//                 complaint.name, // Complainant name
//                 complaint.mobileNo, // Complainant mobileNo
//                 complaint.emailid, // Complainant emailid
//                 complaint.address, // Complainant address
//                 complaint.village, // Complainant village
//                 complaint.taluka, // Complainant taluka
//                 complaint.district // Complainant district
//             ) // ✅ HTML Email
//         );

//         res.json({ message: "Complaint assigned and email sent to department", complaint });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

exports.assignComplaintToDepartment = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ error: "Unauthorized: Only Admin can assign complaints" });
        }

        const { departmentId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({ error: "Invalid department ID" });
        }

        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        const department = await User.findById(departmentId);
        if (!department || department.role !== 'Department') {
            return res.status(404).json({ error: "Department not found" });
        }

        // ✅ Assign Complaint to Department
        complaint.assignedDepartment = new mongoose.Types.ObjectId(departmentId);
        complaint.isAssigned = true; // ✅ Mark as Assigned
        await complaint.save();

        // ✅ Send Email Notification to Department
        await sendEmail(
            department.emailid, 
            `New Complaint Assigned: ${complaint.complaintId}`,
            `A new complaint (ID: ${complaint.complaintId}) has been assigned to your department.`,
            complaintAssignedTemplate(
                department.name,
                complaint.complaintId,
                complaint.problem,
                complaint.name,
                complaint.mobileNo,
                complaint.emailid,
                complaint.address,
                complaint.village,
                complaint.taluka,
                complaint.district
            ) 
        );

        res.json({ message: "Complaint assigned successfully", complaint });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateDepartmentStatus = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "Department") {
            return res.status(403).json({ error: "Forbidden: Only department users can update status" });
        }

        const { departmentStatus } = req.body;

        if (!['Pending', 'Resolved', 'Rejected'].includes(departmentStatus)) {
            return res.status(400).json({ error: "Invalid department status" });
        }

        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

        // ✅ Ensure the complaint is assigned to the department
        if (!complaint.assignedDepartment.equals(req.user._id)) {
            return res.status(403).json({ error: "Unauthorized: This complaint is not assigned to you" });
        }

        complaint.departmentStatus = departmentStatus;
        await complaint.save();

        res.json({ message: "Department status updated successfully", departmentStatus });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDepartmentComplaints = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "Department") {
            return res.status(403).json({ error: "Unauthorized: Only department users can access this" });
        }

        const complaints = await Complaint.find({ assignedDepartment: req.user._id }).sort({ createdAt: -1 });

        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};







//counts
//✅ Get Complaint Count for Logged-in User
exports.getUserComplaintCount = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: No user found" });
        }

        // Aggregate to count complaints by status for the logged-in user
        const statusCounts = await Complaint.aggregate([
            { $match: { user: req.user._id } }, // Match complaints for the logged-in user
            { 
                $group: { 
                    _id: "$status", // Group by complaint status
                    count: { $sum: 1 } // Count the number of complaints for each status
                }
            }
        ]);

        // Prepare counts for each status, with a fallback to 0 if the status is not found
        const counts = {
            totalComplaints: await Complaint.countDocuments({ user: req.user._id }), // Total complaints count
            pending: statusCounts.find(s => s._id === "Pending")?.count || 0,
            inProgress: statusCounts.find(s => s._id === "In Progress")?.count || 0,
            rejected: statusCounts.find(s => s._id === "Rejected")?.count || 0,
            completed: statusCounts.find(s => s._id === "Completed")?.count || 0
        };

        res.json(counts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// ✅ Get Complaint Count for Admin Dashboard
// exports.getAdminComplaintCount = async (req, res) => {
//     try {
//         if (req.user.role !== "Admin") {
//             return res.status(403).json({ error: "Unauthorized: Admin access required" });
//         }

//         const statusCounts = await Complaint.aggregate([
//             { $group: { _id: "$status", count: { $sum: 1 } } }
//         ]);

//         const counts = {
//             totalComplaints: await Complaint.countDocuments(),
//             pending: statusCounts.find(s => s._id === "Pending")?.count || 0,
//             inProgress: statusCounts.find(s => s._id === "In Progress")?.count || 0,
//             rejected: statusCounts.find(s => s._id === "Rejected")?.count || 0,
//             completed: statusCounts.find(s => s._id === "Completed")?.count || 0
//         };

//         res.json(counts);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// ✅ Get Complaint Count for Assigned Department
exports.getDepartmentComplaintCount = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "Department") {
            return res.status(403).json({ error: "Unauthorized: Only department users can access this" });
        }

        const departmentCounts = await Complaint.aggregate([
            { $match: { assignedDepartment: req.user._id } },
            { $group: { _id: "$departmentStatus", count: { $sum: 1 } } }
        ]);

        const counts = {
            totalAssigned: await Complaint.countDocuments({ assignedDepartment: req.user._id }),
            pending: departmentCounts.find(s => s._id === "Pending")?.count || 0,
            resolved: departmentCounts.find(s => s._id === "Resolved")?.count || 0,
            rejected: departmentCounts.find(s => s._id === "Rejected")?.count || 0
        };

        res.json(counts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// exports.getUserComplaintCount = async (req, res) => {
//     try {
//         if (!req.user) {
//             return res.status(401).json({ error: "Unauthorized: No user found" });
//         }

//         // Get the date filter from query params, default to "Today"
//         const { filter, startDate, endDate } = req.query;

//         let dateFilter = {};
//         const currentDate = moment(); // Get current date using moment.js

//         // Apply date filters based on filter type
//         if (filter) {
//             switch (filter) {
//                 case "today":
//                     dateFilter = { createdAt: { $gte: currentDate.startOf('day').toDate(), $lt: currentDate.endOf('day').toDate() } };
//                     break;
//                 case "yesterday":
//                     dateFilter = { createdAt: { $gte: currentDate.subtract(1, 'days').startOf('day').toDate(), $lt: currentDate.subtract(1, 'days').endOf('day').toDate() } };
//                     break;
//                 case "week":
//                     dateFilter = { createdAt: { $gte: currentDate.startOf('week').toDate(), $lt: currentDate.endOf('week').toDate() } };
//                     break;
//                 case "month":
//                     dateFilter = { createdAt: { $gte: currentDate.startOf('month').toDate(), $lt: currentDate.endOf('month').toDate() } };
//                     break;
//                 case "year":
//                     dateFilter = { createdAt: { $gte: currentDate.startOf('year').toDate(), $lt: currentDate.endOf('year').toDate() } };
//                     break;
//                 case "custom":
//                     if (startDate && endDate) {
//                         dateFilter = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };
//                     }
//                     break;
//                 default:
//                     dateFilter = {}; // No filter if the filter is invalid
//             }
//         } else {
//             // Default to "today" if no filter is provided
//             dateFilter = { createdAt: { $gte: currentDate.startOf('day').toDate(), $lt: currentDate.endOf('day').toDate() } };
//         }

//         // Aggregate to count complaints by status for the logged-in user and within the date filter
//         const statusCounts = await Complaint.aggregate([
//             { $match: { user: req.user._id, ...dateFilter } },  // Apply the date filter here
//             { 
//                 $group: { 
//                     _id: "$status", // Group by complaint status
//                     count: { $sum: 1 } // Count the number of complaints for each status
//                 }
//             }
//         ]);

//         // Prepare the final counts
//         const counts = {
//             totalComplaints: await Complaint.countDocuments({ user: req.user._id, ...dateFilter }), // Total complaints count
//             pending: statusCounts.find(s => s._id === "Pending")?.count || 0,
//             inProgress: statusCounts.find(s => s._id === "In Progress")?.count || 0,
//             rejected: statusCounts.find(s => s._id === "Rejected")?.count || 0,
//             completed: statusCounts.find(s => s._id === "Completed")?.count || 0
//         };

//         res.json(counts);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };


// exports.getAdminComplaintCount = async (req, res) => {
//     try {
//         if (req.user.role !== "Admin") {
//             return res.status(403).json({ error: "Unauthorized: Admin access required" });
//         }

//         // Get filter from query parameters
//         const { filter, startDate, endDate, status } = req.query;

//         let dateFilter = {};
//         const currentDate = moment();

//         // Apply date filters based on the selected filter type
//         if (filter) {
//             switch (filter) {
//                 case "today":
//                     dateFilter = { createdAt: { $gte: currentDate.startOf('day').toDate(), $lt: currentDate.endOf('day').toDate() } };
//                     break;
//                 case "yesterday":
//                     dateFilter = { createdAt: { $gte: currentDate.subtract(1, 'days').startOf('day').toDate(), $lt: currentDate.subtract(1, 'days').endOf('day').toDate() } };
//                     break;
//                 case "week":
//                     dateFilter = { createdAt: { $gte: currentDate.startOf('week').toDate(), $lt: currentDate.endOf('week').toDate() } };
//                     break;
//                 case "month":
//                     dateFilter = { createdAt: { $gte: currentDate.startOf('month').toDate(), $lt: currentDate.endOf('month').toDate() } };
//                     break;
//                 case "year":
//                     dateFilter = { createdAt: { $gte: currentDate.startOf('year').toDate(), $lt: currentDate.endOf('year').toDate() } };
//                     break;
//                 case "custom":
//                     if (startDate && endDate) {
//                         dateFilter = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };
//                     }
//                     break;
//                 default:
//                     dateFilter = {}; // No filter if the filter is invalid
//             }
//         }

//         // Aggregation to count complaints by status, with date filtering if applied
//         const statusCounts = await Complaint.aggregate([
//             { $match: { ...dateFilter } },  // Apply the date filter
//             { $group: { _id: "$status", count: { $sum: 1 } } }
//         ]);

//         // If status filter is provided, apply it
//         let filterStatus = {};
//         if (status) {
//             filterStatus = { status };
//         }

//         // Prepare the count of complaints applying status filter and date filter
//         const totalComplaints = await Complaint.countDocuments({ ...dateFilter, ...filterStatus });

//         // Fetch the count of users and departments
//         const userCount = await User.countDocuments();
//         const departmentCount = await User.countDocuments({ role: "Department" });

//         // Prepare the final counts with status filters applied
//         const counts = {
//             totalComplaints: totalComplaints || await Complaint.countDocuments(), // Default count if no filter applied
//             pending: statusCounts.find(s => s._id === "Pending")?.count || 0,
//             inProgress: statusCounts.find(s => s._id === "In Progress")?.count || 0,
//             rejected: statusCounts.find(s => s._id === "Rejected")?.count || 0,
//             completed: statusCounts.find(s => s._id === "Completed")?.count || 0,
//             userCount,  // Total number of users
//             departmentCount  // Total number of departments
//         };

//         res.json(counts);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: err.message });
//     }
// };

exports.getAdminComplaintCount = async (req, res) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json({ error: "Unauthorized: Admin access required" });
        }

        // Get filter from query parameters
        const { filter, startDate, endDate, status } = req.query;

        let dateFilter = {};
        const currentDate = moment();

        // Apply date filters based on the selected filter type
        if (filter) {
            switch (filter) {
                case "today":
                    dateFilter = { createdAt: { $gte: currentDate.startOf('day').toDate(), $lt: currentDate.endOf('day').toDate() } };
                    break;
                case "yesterday":
                    dateFilter = { createdAt: { $gte: currentDate.subtract(1, 'days').startOf('day').toDate(), $lt: currentDate.subtract(1, 'days').endOf('day').toDate() } };
                    break;
                case "week":
                    dateFilter = { createdAt: { $gte: currentDate.startOf('week').toDate(), $lt: currentDate.endOf('week').toDate() } };
                    break;
                case "month":
                    dateFilter = { createdAt: { $gte: currentDate.startOf('month').toDate(), $lt: currentDate.endOf('month').toDate() } };
                    break;
                case "year":
                    dateFilter = { createdAt: { $gte: currentDate.startOf('year').toDate(), $lt: currentDate.endOf('year').toDate() } };
                    break;
                case "custom":
                    if (startDate && endDate) {
                        dateFilter = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };
                    }
                    break;
                default:
                    dateFilter = {}; // No filter if the filter is invalid
            }
        }

        // Aggregation to count complaints by status, with date filtering if applied
        const statusCounts = await Complaint.aggregate([
            { $match: { ...dateFilter } },  // Apply the date filter
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // If status filter is provided, apply it
        let filterStatus = {};
        if (status) {
            filterStatus = { status };
        }

        // Prepare the count of complaints applying status filter and date filter
        const totalComplaints = await Complaint.countDocuments({ ...dateFilter, ...filterStatus });

        // Fetch the count of users and departments
        const userCount = await User.countDocuments();
        const departmentCount = await User.countDocuments({ role: "Department" });

        // Fetch the count of users whose role is 'user'
        const usersCount = await User.countDocuments({ role: "user" });

        // Prepare the final counts with status filters applied
        const counts = {
            totalComplaints: totalComplaints || await Complaint.countDocuments(), // Default count if no filter applied
            pending: statusCounts.find(s => s._id === "Pending")?.count || 0,
            inProgress: statusCounts.find(s => s._id === "In Progress")?.count || 0,
            rejected: statusCounts.find(s => s._id === "Rejected")?.count || 0,
            completed: statusCounts.find(s => s._id === "Completed")?.count || 0,
            // userCount,  // Total number of users
            usersCount, // Total number of users with role "user"
            departmentCount  // Total number of departments
        };

        res.json(counts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


// exports.getDepartmentComplaintCount = async (req, res) => {
//     try {
//         if (!req.user || req.user.role !== "Department") {
//             return res.status(403).json({ error: "Unauthorized: Only department users can access this" });
//         }

//         const { filter, startDate, endDate } = req.query;
//         let dateFilter = {};
//         const currentDate = moment(); // Get current date using moment.js

//         // Apply date filters based on filter type
//         if (filter) {
//             switch (filter) {
//                 case "today":
//                     dateFilter = { createdAt: { $gte: currentDate.startOf('day').toDate(), $lt: currentDate.endOf('day').toDate() } };
//                     break;
//                 case "yesterday":
//                     dateFilter = { createdAt: { $gte: currentDate.subtract(1, 'days').startOf('day').toDate(), $lt: currentDate.subtract(1, 'days').endOf('day').toDate() } };
//                     break;
//                 case "week":
//                     dateFilter = { createdAt: { $gte: currentDate.startOf('week').toDate(), $lt: currentDate.endOf('week').toDate() } };
//                     break;
//                 case "month":
//                     dateFilter = { createdAt: { $gte: currentDate.startOf('month').toDate(), $lt: currentDate.endOf('month').toDate() } };
//                     break;
//                 case "year":
//                     dateFilter = { createdAt: { $gte: currentDate.startOf('year').toDate(), $lt: currentDate.endOf('year').toDate() } };
//                     break;
//                 case "custom":
//                     if (startDate && endDate) {
//                         dateFilter = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };
//                     }
//                     break;
//                 default:
//                     dateFilter = {}; // No filter if the filter is invalid
//             }
//         } else {
//             // Default to "today" if no filter is provided
//             dateFilter = { createdAt: { $gte: currentDate.startOf('day').toDate(), $lt: currentDate.endOf('day').toDate() } };
//         }

//         // Aggregate to count complaints by department status for the assigned department
//         const departmentCounts = await Complaint.aggregate([
//             { $match: { assignedDepartment: req.user._id, ...dateFilter } },  // Apply the date filter here
//             { 
//                 $group: { 
//                     _id: "$departmentStatus", // Group by department status
//                     count: { $sum: 1 } // Count the number of complaints for each status
//                 }
//             }
//         ]);

//         // Prepare the final counts
//         const counts = {
//             totalAssigned: await Complaint.countDocuments({ assignedDepartment: req.user._id, ...dateFilter }), // Total complaints count
//             pending: departmentCounts.find(s => s._id === "Pending")?.count || 0,
//             resolved: departmentCounts.find(s => s._id === "Resolved")?.count || 0,
//             rejected: departmentCounts.find(s => s._id === "Rejected")?.count || 0
//         };

//         res.json(counts);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };



