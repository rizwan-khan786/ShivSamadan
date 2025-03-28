// const mongoose = require('mongoose');

// const ComplaintSchema = new mongoose.Schema({
//     complaintId: { type: String, unique: true }, // Auto-generated Complaint ID
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User model
//     name: { type: String, required: true },
//     mobileNo: { type: String, required: true },
//     emailid: { type: String, required: true },
//     address: { type: String, required: true }, // User can input their own address
//     village: { type: String, required: true },
//     taluka: { type: String, required: true },
//     district: { type: String, required: true },
//     problem: { type: String, required: true },
//     attachments: [{ type: String }], // Array of file paths
//     status: { type: String, enum: ['Pending', 'In Progress', 'Rejected', 'Completed'], default: 'Pending' }, // ✅ Status field
// }, { timestamps: true });

// // Pre-save hook to generate Complaint ID
// ComplaintSchema.pre('save', async function (next) {
//     if (!this.complaintId) {
//         const count = await mongoose.model('Complaint').countDocuments() + 1;
//         this.complaintId = `CMP${new Date().getFullYear()}${String(count).padStart(6, '0')}`;
//     }
//     next();
// });

// module.exports = mongoose.model('Complaint', ComplaintSchema);

const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    complaintId: { type: String, unique: true }, // Auto-generated Complaint ID
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User model
    name: { type: String, required: true },
    mobileNo: { type: String, required: true },
    emailid: { type: String, required: true },
    address: { type: String, required: true }, 
    village: { type: String, required: true },
    taluka: { type: String, required: true },
    district: { type: String, required: true },
    problem: { type: String, required: true },
    attachments: [{ type: String }], // Array of file paths
    status: { type: String, enum: ['Pending', 'In Progress', 'Rejected', 'Completed'], default: 'Pending' }, // ✅ Status field
    assignedDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ✅ Assigned department
    departmentStatus: { type: String, enum: ['Pending', 'Resolved', 'Rejected'], default: 'Pending' } // ✅ Status updated by department
}, { timestamps: true });

// ✅ Pre-save hook to generate Complaint ID
// ComplaintSchema.pre('save', async function (next) {
//     if (!this.complaintId) {
//         const count = await mongoose.model('Complaint').countDocuments() + 1;
//         this.complaintId = `CMP${new Date().getFullYear()}${String(count).padStart(6, '0')}`;
//     }
//     next();
// });

ComplaintSchema.pre('save', async function (next) {
    if (!this.complaintId) {
        const count = await mongoose.model('Complaint').countDocuments() + 1;
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month (01-12)
        const day = String(now.getDate()).padStart(2, '0'); // Day (01-31)
        const hours = String(now.getHours()).padStart(2, '0'); // Hours (00-23)
        const minutes = String(now.getMinutes()).padStart(2, '0'); // Minutes (00-59)
        const seconds = String(now.getSeconds()).padStart(2, '0'); // Seconds (00-59)
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Milliseconds (000-999)

        this.complaintId = `CMP${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}${String(count).padStart(6, '0')}`;
    }
    next();
});


module.exports = mongoose.model('Complaint', ComplaintSchema);
