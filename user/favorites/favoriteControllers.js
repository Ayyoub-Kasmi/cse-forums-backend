const prisma = require("../../prisma/client");

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
            message: 'Favorite deletion failed: ' + error.message,
            data: {},
        })
    }
}
