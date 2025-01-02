import  express  from "express";
import { isAdmin } from "../middleware/auth.js";
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getlatestProducts, getSingleProduct, newProduct, updateProduct } from "../controllers/product.js";
import { singleUpload } from "../middleware/multer.js";

const app = express.Router();

app.post(`/new`,isAdmin,singleUpload,newProduct)

app.get(`/all`,getAllProducts)
app.get(`/latest`,getlatestProducts)
app.get(`/categories`,getAllCategories)
app.get(`/admin-products`,isAdmin,getAdminProducts)

app.route(`/:id`).get(getSingleProduct).put(isAdmin,singleUpload,updateProduct).delete(isAdmin,deleteProduct)






export default app;