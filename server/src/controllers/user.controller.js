import User from '../models/user.model.js'


export const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No profile picture uploaded" })
        }
        const user = await User.findByIdAndUpdate(req.user.id,
            { profilePicture: req.file.path }, { new: true })
        res.status(200).json({
            message: "profile picture upload successfully",
            profilePicture: user.profilePicture,
        })
    } catch (err) {
        console.error(500).json({ message: error.massage })
    }
}