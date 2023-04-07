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
        const {username, email, password, title, bio,
            facebook_id, instagram_id, github_id} = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id,
            }
        })

        if(user){
            if(password){
                const salt = await bcrypt.genSalt();
                password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await prisma.user.update({
                where: {
                    id,
                },
                data: {
                    username: username || user.username,
                    email: email || user.email,
                    password: password || user.password,
                    title: title || user.title,
                    bio: bio || user.bio,
                    facebook_id: facebook_id || user.facebook_id,
                    instagram_id: instagram_id || user.instagram_id,
                    github_id: github_id || user.github_id,
                },
            })
    
            res.status(200).json({
                success: true,
                message: "profile updated successfully",
                data: user,
            })
            
        }else{
            res.status(404).json({
                success: true,
                message: "User not found",
                data: {},
            })
        }

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
