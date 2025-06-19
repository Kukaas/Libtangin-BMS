import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js"

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

export default app;
