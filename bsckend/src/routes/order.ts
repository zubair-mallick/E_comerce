import  express  from "express";
import { isAdmin } from "../middleware/auth.js";
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder } from "../controllers/order.js";
import {generateOrders} from "../routes/populate.js"

const app= express.Router();

app.post("/new", newOrder);
app.get("/populate",isAdmin,generateOrders)

app.get("/my",myOrders)
app.get("/all",isAdmin,allOrders)
app.get("/process/:id",processOrder)

app.route("/:id").get(getSingleOrder).delete(isAdmin,deleteOrder);




export default app