import jwt from 'jsonwebtoken';

export const createToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            role: user.role
        },
        process.env.SECRET_TOKEN
    )
}

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

        return { success: true, payload: decoded };
    } catch (error) {
        return { success: false, error: error.message };
    }
}