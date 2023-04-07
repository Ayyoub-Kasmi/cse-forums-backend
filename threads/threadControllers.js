const prisma = require('../prisma/client');

module.exports.create_thread = async (req, res) => {
    try {
        const user_id = Number(req.body.user_id);
        const {title, content} = req.body;

        const date = new Date();


        const thread = await prisma.thread.create({
            data: {
                user_id, title, content, views: 0, date
            }
        })

        res.status(200).json({
            success: true,
            message: 'thread created successfully',
            data: thread,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'thread creation failed: ' + error.message,
            data: {}
        })
    }
}

module.exports.get_thread = async (req, res) => {
    try {
        /**
         * req.body = {
         *      ?user_id
         * }
         */

        const id = Number(req.params.id);

        const thread = await prisma.thread.findUnique({
            where: {
                id,
            }
        })

        res.status(200).json({
            success: true,
            message: "thread fetched successfully",
            data: thread,
        })
    } catch (error) {
        
        res.status(400).json({
            success: false,
            message: "thread fetch failed: " + error.message,
            data: {}
        })
    }
}

module.exports.get_all_threads = async (req, res) => {
    try {
        /**
         * req.body = {
         *      ?user_id
         * }
         */

        const user_id = Number(req.body.user_id);
        if(user_id) {
            const threads = await prisma.thread.findMany({
                where: {
                    user_id,
                }
            })

            res.status(200).json({
                success: true,
                message: "threads fetched successfully",
                data: threads,
            })
        }else{

        }
    } catch (error) {
        
        res.status(400).json({
            success: false,
            message: "threads fetch failed: " + error.message,
            data: {}
        })
    }
}

module.exports.update_thread = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const {title, content} = req.body;

        const thread = await prisma.thread.findUnique({
            where: {
                id,
            }
        })

        if(thread){

            const updatedThread = await prisma.thread.update({
                where: {
                    id,
                },
                data: {
                    title: title || thread.title,
                    content: content || thread.content,
                }
            })

            res.status(200).json({
                success: true,
                message: "thread updated successfully",
                data: updatedThread,
            })
        } else{
            res.status(404).json({
                success: false,
                message: "Thread not found",
                data: {},
            })
        }


    } catch (error) {
        res.status(400).json({
            success: false,
            message: "thread update failed: " + error.message,
            data: {},
        })
    }
}

module.exports.delete_thread = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const thread = await prisma.thread.delete({
            where: {
                id,
            }
        })

        res.status(200).json({
            success: true,
            message: "thread deleted successfully",
            data: thread,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "thread deletion failed: " + error.message,
            data: {},
        })
    }
}

module.exports.add_tags = async (req, res) => {
    try {
        const thread_id = Number(req.params.id);
        const tags = req.body.tags;
        
        //insert the new tags to the database
        const promises = tags.map(async (tag) => {
            //search for the tag int he database
            let db_tag = await prisma.tag.findUnique({
                where: {
                    name: tag,
                }
            })
            
            //insert it if not found
            if( !db_tag){
                db_tag = await prisma.tag.create({
                    data: {
                        name: tag,
                    }
                })
            }

            const threadTag = await prisma.threads_tags.findUnique({
                where: {
                    thread_id_tag_id: {
                        thread_id, tag_id: db_tag.id,
                    }
                }
            })
            
            if( !threadTag){
                await prisma.threads_tags.create({
                    data: {
                        thread_id, tag_id: db_tag.id,
                    }
                })
            }
        })

        await Promise.all(promises);
        
        res.status(200).json({
            success: true,
            message: "Tags added successfully",
            data: {}
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Tags add failed: " + error.message,
            data: {}
        })
    }
}

module.exports.remove_tags = async (req, res) => {
    try {
        const thread_id = Number(req.params.id);
        const tags = req.body.tags;

        const promises = tags.map( async(tag) => {
            const db_tag = await prisma.tag.findUnique({
                where: {
                    name: tag,
                }
            })

            if(db_tag){
                await prisma.threads_tags.delete({
                    where: {
                        thread_id_tag_id: {
                            thread_id, tag_id: db_tag.id,
                        }
                    }
                })
            }
        })

        await Promise.all(promises);

        res.status(200).json({
            success: true,
            message: "tags removed successfully",
            data: {},
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "tags remove failed: " + error.message,
            data: {},
        })
    }
}

module.exports.vote_thread = async (req, res) => {
    try {
        const thread_id = Number(req.params.id);
        const {user_id, type} = req.body;

        if(type !== "upvote" || type !== "downvote") throw new Error('Type must be "upvote" or "downvote"');

        let vote = await prisma.vote.findUnique({
            where:{
                user_id_thread_id: {
                    user_id, thread_id,
                }
            }
        })

        if(vote){
            vote = await prisma.vote.update({
                where: {
                    user_id_thread_id: {
                        user_id, thread_id,
                    },
                },
                data: {
                    type,
                }
            })

        }else{

            vote = await prisma.vote.create({
                data: {
                    thread_id, user_id, type,
                }
            })
        }

        res.status(200).json({
            success: true,
            message: 'Vote created successfully',
            data: vote,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Vote creation failed: ' + error.message,
            data: {}
        })
    }
}

module.exports.unvote_thread = async (req, res) => {
    try {
        const thread_id = Number(req.params.id)
        const user_id = req.body.user_id;

        const vote = await prisma.vote.delete({
            where: {
                user_id_thread_id: {
                    user_id, thread_id, 
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "thread unvoted successfully",
            data: vote,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "thread unvote failed: " + error.message,
            data: {}
        })
    }
}