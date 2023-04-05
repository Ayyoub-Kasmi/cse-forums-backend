/** Configure Environment variables */
require('dotenv').config();

/** Initialize Express */
const express = require('express');
const app = express();

/** Setup midleware */
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());
/** Routes */
const authRoutes = require('./auth/authRoutes');
const userRoutes = require('./user/userRoutes');
// const answerRoutes = require('./routes/answerRoutes');

app.get('/', (req, res) => {
    res.send("Welcome to the CSE Forums platform!");
});

// app.use(answerRoutes);
app.use('/user', userRoutes);
app.use(authRoutes);

/** Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});
/**
 * Check some material on how Frontend and Backend are linked
 * Should the redirection happen from the front or the back side?
 * Time stamps for prisma schemas
 */