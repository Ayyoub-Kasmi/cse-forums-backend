/** Configure Environment variables */
require('dotenv').config();

/** Required Node.js modules */
const Prisma = require('prisma/prisma-client');
const Joi = require('joi');

/** Initialize Express */
const Express = require('express');
const app = Express();

/** Setup midleware */
app.use(Express.json());
const joiMiddleware = require('express-joi-validation').createValidator({})

/** Supplier validation schema for Joi */
const supplierSchema = Joi.object({
    Id: Joi.number().greater(0),
    name: Joi.string().alphanum().min(1).max(191).required(),
    contact: Joi.string().alphanum().min(1).max(191).required(),
    email: Joi.string().email().max(191).required(),
    phone_num: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    address: Joi.string().alphanum().min(1).max(191).required(),
  });
  
/** Routes */
app.get('/', (req, res) => {
    res.send("Hello, API server!");
});

/** Server */
const PORT = process.env.PORT || 5000;
const prisma = new Prisma.PrismaClient();
app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});
