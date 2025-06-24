import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js"
import residentRoutes from "./routes/resident.routes.js"
import userRoutes from "./routes/user.routes.js"

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
    origin: [
        ENV.FRONTEND_URL
    ],
    credentials: true,
}));

connectDB();

app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/residents", residentRoutes)
app.use("/api/users", userRoutes);

export default app;
