import jwt from "jsonwebtoken";

export const generateAccessToken = (res, userId) => {
    try {
        const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        });
    } catch (error) {
        console.log(error);
    }
}

export const generateRefreshToken = (res, userId) => {
    try {
        const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    } catch (error) {
        console.log(error);
    }
}
