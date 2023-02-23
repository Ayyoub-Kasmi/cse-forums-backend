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
const authRoutes = require('./routes/authRoutes');

app.get('/', (req, res) => {
    res.send("Welcome to the CSE Forums platform!");
});
app.use(authRoutes);

/** Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});

/**
 * Supply the repo with a README file as a documentation for the team
 * Create a Google document for the documentation of the backend side (Database Schema & routes)
 * Check if there're hooks in prisma
 * Check some material on how Frontend and Backend are linked
 * Should the redirection happen from the front or the back side?
 */