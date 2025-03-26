import { Router } from "express";
import asyncHandler from "express-async-handler";
import { getOutletTables } from "../controllers/table.controller";

const router = Router();

router.get("/:id", asyncHandler(getOutletTables));

export { router as tableRoutes };
