const prisma = require("../../prisma/client");

module.exports.create_answer = async (req, res) => {
    try {
        const thread_id = Number(req.params.id);
        const {user_id, content} = req.body;

        const date = new Date()

        const answer = await prisma.answer.create({
            data: {
                thread_id, user_id, content, likes: 0, date,
            }
        })

        res.status(200).json({
            success: true,
            message: "answer created successfully",
            data: answer,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "answer creation failed: " + error.message,
            data: {},
        })
    }
}

module.exports.get_all_answers = async (req, res) => {
    try {
        const thread_id = Number(req.params.id);

        const answers = await prisma.answer.findMany({
            where: {
                thread_id,
            }
        })

        res.status(200).json({
            success: true,
            message: "answers fetched successfully",
            data: answers,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "answers fetch failed: " + error.message,
            data: {},
        })
    }
}

module.exports.update_answer = async (req, res) => {
    try {
        const id = Number(req.params.answerId);
        const content = req.body.content;

        const answer = await prisma.answer.findUnique({
            where: {
                id,
            }
        })

        if(answer){
            const updatedAnswer = await prisma.answer.update({
                where: {
                    id,
                },
                data: {
                    content: content || answer.content,
                }
            })
    
            res.status(200).json({
                success: true,
                message: 'Answer updated successfully',
                data: updatedAnswer,
            })

        }else{
            res.status(404).json({
                success: false,
                message: 'Answer not found',
                data: {},
            })
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'answer update failed: ' + error.message,
            data: {}
        })
    }
}

module.exports.delete_answer = async (req, res) => {
    try {
        const id = Number(req.params.answerId);

        const answer = await prisma.answer.delete({
            where: {
                id,
            }
        })

        res.status(200).json({
            success: true,
            message: "Answer deleted successfully",
            data: answer,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Answer deletion failed: " + error.message,
            data: {}
        })
    }
}

module.exports.like_answer = async (req, res) => {
    try {
        const answer_id = Number(req.params.answerId);
        const user_id = req.body.user_id;

        let like = await prisma.like.findUnique({
            where: {
                user_id_answer_id: {
                    user_id, answer_id,
                }
            }
        })

        if(!like){
            like = await prisma.like.create({
                data: {
                    user_id, answer_id
                }
            })
        }

        res.status(200).json({
            success: true,
            message: "like added successfully",
            data: like,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "like add failed: " + error.message,
            data: {},
        })
    }
}

module.exports.unlike_answer = async (req, res) => {
    try {
        const answer_id = Number(req.params.answerId);
        const user_id = req.body.user_id;

        const like = await prisma.like.delete({
            where: {
                user_id_answer_id: {
                    user_id, answer_id,
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "like removed successfully",
            data: like,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "like removal failed: " + error.message,
            data: {},
        })
    }
}