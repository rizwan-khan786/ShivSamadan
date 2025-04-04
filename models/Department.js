const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema);
