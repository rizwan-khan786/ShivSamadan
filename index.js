require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
const complaintRoutes = require('./routes/complaintRoutes');

const app = express();
app.use(express.json());
app.use(cors());

connectDB();
require('./config/passport')(passport);
app.use(passport.initialize());
app.use('/uploads', express.static('uploads'));


app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaint', complaintRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
