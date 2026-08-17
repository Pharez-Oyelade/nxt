import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
// import { connectDB } from "./config/db.js";
import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { env } from "./config/env.js";
import dns from "node:dns";

// route imports
import authRouter from "./routes/auth.routes.js";
import casestudyRouter from "./routes/casestudy.routes.js";
import blogRouter from "./routes/blog.routes.js";
import leadRouter from "./routes/lead.routes.js";
import clientRouter from "./routes/client.routes.js";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";
import invoiceRouter from "./routes/invoice.routes.js";
import { handlePaystackWebhook } from "./controllers/invoice.controller.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

// middlewares
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

// Webhook route must use raw body before express.json() parses it
app.post("/api/v1/invoices/webhook", express.raw({ type: "application/json" }), handlePaystackWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.get("/", (req, res) => res.json({ message: "API running" }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/casestudies", casestudyRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/leads", leadRouter);
app.use("/api/v1/clients", clientRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/invoices", invoiceRouter);

// error handler
app.use(errorHandler);

const PORT = env.PORT;
const start = async () => {
  await connectDB();
  await cloudinary.config();
  app.listen(PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });
};

// start the server
start();
