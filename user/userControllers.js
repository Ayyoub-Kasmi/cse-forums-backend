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
            message: "Error fetching user: " + error.message,
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
            message: "error updating user info: "+error.message,
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
            message: 'Error while deleting user: ' + error.message,
            data: {}
        })
    }
}
