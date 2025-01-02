import  express  from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/user.js";
import { isAdmin } from "../middleware/auth.js";

const app= express.Router();

app.post("/new", newUser);

app.get("/all",isAdmin, getAllUsers);
app.route("/:id").get(getUser).delete(isAdmin,deleteUser)




export default app