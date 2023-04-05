const prisma = require("../../prisma/client");

module.exports.get_activities = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        console.log(req.params.id);

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
            message: "Couldn't fetch activities: "+error.message,
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
            message: 'Adding activity failed: ' + error.message,
            data: {}
        })
    }
}

module.exports.delete_activity = async (req, res) => {
    try {
        // const userId = Number(req.params.id);
        const activityId = Number(req.body.activity_id);

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
            message: 'Activity deletion failed: ' + error.message,
            data: {},
        })
    }
}