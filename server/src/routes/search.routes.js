import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { globalSearch } from "../controllers/search.controller.js";

const searchRouter = Router();

searchRouter.get("/", protect, globalSearch);

export default searchRouter;
