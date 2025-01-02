import  express  from "express";
import { getBarStats, getDashboardStats, getLineStats, getPieStats } from "../controllers/stats.js";
import { isAdmin } from "../middleware/auth.js";

const app= express.Router();



app.get("/stats",isAdmin, getDashboardStats);
app.get("/pie",isAdmin,getPieStats);
app.get("/bar",isAdmin,getBarStats);
app.get("/line",isAdmin,getLineStats);

export default app