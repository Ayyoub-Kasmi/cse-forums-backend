const prisma = require('../prisma/client');

//Defining the filters
const filters = ["Time"];

//Constants for the search controller
const WORD_IN_TITLE_WEIGHT = 20;
const OCCURRENCE_WEIGHT = 4;
const TAG_WEIGHT = 2;
const POPULARITY_WEIGHT = 1;

module.exports.create_thread = async (req, res) => {
    try {
        const user_id = Number(req.body.user_id);
        const {title, content} = req.body;

        const date = new Date();


        const thread = await prisma.thread.create({
            data: {
                user_id, title, content, date
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
         *      ?filter
         * }
         */

        const user_id =  req.body.user_id ? Number(req.body.user_id) : undefined;

        const filter = req.query.filter;

        let threads = null;
        threads = await prisma.thread.findMany({
            where: {
                AND: [
                    {
                        user_id: user_id,
                    },
                ]
            }
        })

        res.status(200).json({
            success: true,
            message: "threads fetched successfully",
            data: threads,
        })
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

module.exports.search_thread = async (req, res) => {
    try {
        const searchQuery = req.query.searchQuery.toLowerCase();

        //fetch threads that contain the desired search query
        const threads = await prisma.thread.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: searchQuery,
                        }
                    },
                    {
                        content: {
                            contains: searchQuery,
                        }
                    }
                ]
            },
            include: {
                threads_tags: {
                    include: {
                        tag: true,
                    }
                },
            }
        })

        //implement the score system and sort the threads accordingly
        if(threads){
            const queryRegEx = new RegExp(searchQuery, "gi");

            threads.sort( (threadA, threadB) => {
                console.log(threadB.threads_tags);

                const scoreA = 
                    threadA.title.toLowerCase().includes(searchQuery) ? WORD_IN_TITLE_WEIGHT : 0
                    + (threadA.content.match(queryRegEx) || []).length * OCCURRENCE_WEIGHT
                    + (threadA.upvotes - threadA.downvotes) * POPULARITY_WEIGHT
                    + (threadA.threads_tags.filter( ( {tag} ) => tag.toLowerCase().includes(searchQuery) || []).length) * TAG_WEIGHT;
                    
                
                const scoreB =
                    threadB.title.includes(searchQuery) ? WORD_IN_TITLE_WEIGHT : 0
                    + (threadB.content.match(queryRegEx) || []).length * OCCURRENCE_WEIGHT
                    + (threadB.upvotes - threadB.downvotes) * POPULARITY_WEIGHT
                    + (threadB.threads_tags.filter( ( {tag} ) => tag.toLowerCase().includes(searchQuery) || []).length) * TAG_WEIGHT;

                return scoreB - scoreA; //Descending sort
            })
    
            res.status(200).json({
                success: true,
                message: "thread search processed successfully",
                data: threads,
            })

        }else{
            res.status(200).json({
                success: true,
                message: "thread search processed successfully",
                data: [],
            })
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "thread search failed: " + error.message,
            data: {},
        })
    }
}

module.exports.get_saved_threads = async (req, res) => {
    try {
        const user_id = Number(req.query.user);
        const threads = await prisma.saved_threads.findMany({
            where: {
                user_id,
            }
        })

        res.status(200).json({
            success: true,
            message: 'Saved thread fetched successfully',
            data: threads,
        })

    }catch(error){
        res.status(400).json({
            success: false,
            message: "Save threads fetch failed: " + error.message,
            data: {}
        })
    }
}

module.exports.save_thread = async (req, res) => {
    try {
        const user_id = Number(req.body.user_id);
        const thread_id = Number(req.params.threadId);
        console.log(user_id, thread_id)

        await prisma.saved_threads.create({
            data: {
                thread_id,
                user_id,
            }
        })

        res.status(200).json({
            success: true,
            message: "Thread saved successfully",
            data: {}
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Thread save failed: " + error.message,
            data: {}
        })
    }
}

module.exports.unsave_thread = async (req, res) => {
    try {
        const user_id = Number(req.body.user_id);
        const thread_id = Number(req.params.threadId);

        await prisma.saved_threads.delete({
            where: {
                thread_id_user_id: {
                    user_id,
                    thread_id,
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Thread unsaved successfully",
            data: {}
        })

        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Thread unsave failed: " + error.message,
            data: {}
        })
    }
}

module.exports.approve_thread = async (req, res) => {
    try {
        const thread_id = req.query.threadId;
        let thread = await prisma.thread.findUnique({
            where: {
                thread_id,
            }
        })

        if(!thread.isApproved){
            thread = await prisma.thread.update({
                where: {
                    thread_id
                },
                data: {
                    isApproved: true,
                }
            })
        }

        res.status(200).json({
            success: true,
            message: "Thread approved successfully",
            data: thread,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Thread approve failed: " + error.message,
            data: {}
        })
    }
}

module.exports.disapprove_thread = async (req, res) => {
    try {
        const thread_id = req.query.threadId;
        let thread = await prisma.thread.findUnique({
            where: {
                thread_id,
            }
        })

        if(thread.isApproved){
            thread = await prisma.thread.update({
                where: {
                    thread_id
                },
                data: {
                    isApproved: false,
                }
            })
        }

        res.status(200).json({
            success: true,
            message: "Thread disapproved successfully",
            data: thread,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Thread disapprove failed: " + error.message,
            data: {}
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
        
        console.log("type: ", type, type === "upvote")
        if(type !== "upvote" && type !== "downvote") throw new Error('Type must be "upvote" or "downvote"');

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