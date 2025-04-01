

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: { type: String, unique: true }, // ✅ Auto-generated User ID
    name: { type: String, required: true },
    emailid: { type: String, required: true, unique: true },
    mobileNo: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: true }, // ✅ Password stored as plain text
    role: { type: String, enum: ['user', 'Admin', 'Leader', 'Department'], default: 'user' }
}, { timestamps: true });

// ✅ Pre-save Hook for Generating User ID
UserSchema.pre('save', async function (next) {
    if (this.isNew) {
        // Get role prefix (first 3 letters in uppercase)
        const rolePrefix = this.role.substring(0, 3).toUpperCase(); // Example: 'ADM' for Admin
        
        // Count existing users to generate a sequence number
        const count = await mongoose.model('User').countDocuments();
        
        // Generate a unique user ID (e.g., ADM000001)
        this.userId = `${rolePrefix}${(count + 1).toString().padStart(6, '0')}`;
    }
    
    next();
});

module.exports = mongoose.model('User', UserSchema);
