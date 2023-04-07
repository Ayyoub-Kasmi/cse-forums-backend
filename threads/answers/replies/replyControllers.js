const prisma = require("../../../prisma/client");

module.exports.create_reply = async (req, res) => {
    try {
        
        const answer_id = Number(req.params.answerId);
        const {user_id, content, parent_id} = req.body;

        const date = new Date();

        const reply = await prisma.reply.create({
            data: {
                user_id, answer_id, content, parent_id, date,
            }
        });

        res.status(200).json({
            success: true,
            message: "Reply created successfully",
            data: reply,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Reply creation failed: " + error.message,
            data: {},
        });
    }
}

module.exports.get_all_replies = async (req, res) => {
    try {
        const answer_id = Number(req.params.answerId);

        const replys = await prisma.reply.findMany({
            where: {
                answer_id,
            }
        })

        res.status(200).json({
            success: true,
            message: "Replies fetched successfully",
            data: replys,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Replies fetch failed: " + error.message,
            data: {},
        })
    }
}

module.exports.update_reply = async (req, res) => {
    try {
        const id = Number(req.params.replyId);
        const content = req.body.content;

        const reply = await prisma.reply.update({
            where: {
                id,
            },
            data: {
                content,
            }
        })

        res.status(200).json({
            success: true,
            message: 'reply updated successfully',
            data: reply,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'reply update failed: ' + error.message,
            data: {}
        })
    }
}

module.exports.delete_reply = async (req, res) => {
    try {
        const id = Number(req.params.replyId);

        const reply = await prisma.reply.delete({
            where: {
                id,
            }
        })

        res.status(200).json({
            success: true,
            message: "Reply deleted successfully",
            data: reply,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Reply deletion failed: " + error.message,
            data: {}
        })
    }
}

module.exports.like_reply = async (req, res) => {
    try {
        const reply_id = Number(req.params.replyId);
        const user_id = req.body.user_id;

        let like = await prisma.like.findUnique({
            where: {
                user_id_reply_id: {
                    user_id, reply_id,
                }
            }
        })

        if(!like){
            like = await prisma.like.create({
                data: {
                    user_id, reply_id
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

module.exports.unlike_reply = async (req, res) => {
    try {
        const reply_id = Number(req.params.replyId);
        const user_id = req.body.user_id;

        const like = await prisma.like.delete({
            where: {
                user_id_reply_id: {
                    user_id, reply_id,
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