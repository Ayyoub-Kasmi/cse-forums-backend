//importing prisma Client
const prisma = require('../prisma/client');


//SignUp controlllers
module.exports.get_profile = async (req, res) => {
    try {
        
        const id = Number(req.params.id);

        const user = await prisma.user.findUnique({
            where: {
                id,
            }
        });

        res.status(200).json({
            success: true,
            message: "user data successfully fetched",
            data: user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error fetching user" + error.message,
            data: {}
        })
    }
}

module.exports.update_profile = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = req.body;

        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {...data},
        })

        res.status(200).json({
            success: true,
            message: "profile updated successfully",
            data: user,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "error updating user info",
            data: {}
        })
    }
}

module.exports.delete_profile = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const user = await prisma.user.delete({
            where: {
                id,
            },
        })

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: user,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error while deleting user' + error.message,
            data: {}
        })
    }
}

module.exports.get_favorites = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const favorites = await prisma.favorite.findMany({
            where: {
                user_id: id,
            }
        })

        res.status(200).json({
            success: true,
            message: 'Favorites fetched successfully',
            data: favorites,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to fetch favorites' + error.message,
            data: {}
        })

    }
}

module.exports.add_favorite = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const favoriteId = Number(req.body.favorite_id);

        
        const favorite = await prisma.favorite.create({
            data: {
                user_id: userId,
                favorite_id: favoriteId,
            }
        })

        res.status(200).json({
            success: true,
            message: 'Favorite added successfully',
            data: favorite,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Adding favorite failed' + error.message,
            data: {}
        })
    }
}

module.exports.delete_favorite = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const favoriteId = Number(req.body.favorite_id);

        const favorite = await prisma.favorite.delete({
            where: {
                user_id_favorite_id: {
                    user_id: userId,
                    favorite_id: favoriteId,
                }
            }
        })

        res.status(200).json({
            success: true,
            message: 'Favorite deleted successfully',
            data: favorite,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Favorite deletion failed' + error.message,
            data: {},
        })
    }
}

module.exports.get_activities = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        const activities = await prisma.activity.findMany({
            where: {
                user_id: userId,
            }
        })

        res.status(200).json({
            success: true,
            message: "Activities fetched successfully",
            data: activities,
        })

    } catch (error) {
        
        res.status(400).json({
            success: false,
            message: "Couldn't fetch activities",
            data: {}
        })
    }
}

module.exports.add_activity = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        
        const activity = await prisma.activity.create({
            data: {
                user_id: userId,
            }
        })

        res.status(200).json({
            success: true,
            message: 'Activity added successfully',
            data: activity,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Adding activity failed' + error.message,
            data: {}
        })
    }
}

module.exports.delete_activity = async (req, res) => {
    try {
        // const userId = Number(req.params.id);
        const activityId = Number(req.body.activity_id);
        console.log(req.body.activity_id, activityId)

        const activity = await prisma.activity.delete({
            where: {
                id: activityId,
            }
        })

        res.status(200).json({
            success: true,
            message: 'Activity deleted successfully',
            data: activity,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Activity deletion failed' + error.message,
            data: {},
        })
    }
}