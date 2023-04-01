//import Prisma
const { Prisma } = require('prisma/prisma-client');
const prisma = require('../prisma/client');

module.exports.answer_post = async (req, res) => {
    /**
     * req.body = {
     *   content,
     *   user_id,   //the owner of the answer
     *   question_id, //to which the answer is related
     * }
     */

    try {

        let {content, user_id, question_id} = req.body;
    
        //save the reply to the replies tables
        const answer = await prisma.answer.create({
            data: {
                content,
                date: new Date(),
                upvotes: 0,
                downvotes: 0,
                user_id: user_id,
                question_id: question_id,
            }
        })
        
        res.status(300).json({
            success: true,
            message: "answer created successfully",
            data: answer,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            data: {},
        })
    }

}

module.exports.answer_get = async (req, res) => {
    
    try {

        //get the id from the request body
        let id = req.body.id;

        //search for the answer in the database
        const answer = await prisma.answer.findUnique({
            where: {
                id
            }
        })

        //throw an error if answer is not found
        if(!answer) throw new Error("Answer not found");

        //send the answer in the response
        res.status(200).json({
            success: true,
            message: 'answer successfully retrieved',
            data: answer
        })
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            data: {}
        })        
    }

}