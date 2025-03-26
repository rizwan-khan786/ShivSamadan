const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

// Register User
exports.register = async (req, res) => {
    try {
        const { name, emailid, mobileNo, address, password, confirmPassword, role } = req.body;
        if (password !== confirmPassword) return res.status(400).json({ error: "Passwords do not match" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, emailid, mobileNo, address, password: hashedPassword, role });
        await newUser.save();

        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Send OTP
exports.sendOTP = async (req, res) => {
    try {
        const { emailid } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.deleteMany({ emailid }); // Remove previous OTPs
        await new OTP({ emailid, otp }).save();

        await sendEmail(emailid, "Your OTP Code", `Your OTP is ${otp}`);
        res.json({ message: "OTP sent successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Verify OTP and Login
exports.verifyOTP = async (req, res) => {
    try {
        const { emailid, otp } = req.body;
        const validOTP = await OTP.findOne({ emailid, otp });

        if (!validOTP) return res.status(400).json({ error: "Invalid or expired OTP" });

        await OTP.deleteMany({ emailid }); // Remove used OTPs

        const user = await User.findOne({ emailid });
        if (!user) return res.status(400).json({ error: "User not found" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.json({ token, user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Send OTP for Password Reset
exports.sendPasswordResetOTP = async (req, res) => {
    try {
        const { emailid } = req.body;
        const user = await User.findOne({ emailid });
        if (!user) return res.status(404).json({ error: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.deleteMany({ emailid }); // Remove previous OTPs
        await new OTP({ emailid, otp }).save();

        await sendEmail(emailid, "Password Reset OTP", `Your OTP is ${otp}`);
        res.json({ message: "OTP sent successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Verify OTP and Update Password
exports.updatePassword = async (req, res) => {
    try {
        const { emailid, otp, newPassword, confirmNewPassword } = req.body;

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const validOTP = await OTP.findOne({ emailid, otp });
        if (!validOTP) return res.status(400).json({ error: "Invalid or expired OTP" });

        await OTP.deleteMany({ emailid }); // Remove used OTPs

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ emailid }, { password: hashedPassword });

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password field
        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
