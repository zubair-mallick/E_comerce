import  express  from "express";
import { isAdmin } from "../middleware/auth.js";
import { allReviewsOfProduct, deleteProduct, deleteReview, getAdminProducts, getAllCategories, getAllProducts, getlatestProducts, getSingleProduct, newProduct, newReview, updateProduct } from "../controllers/product.js";
import { multiUpload } from "../middleware/multer.js";


const app = express.Router();

app.post(`/new`,isAdmin,multiUpload,newProduct)

app.get(`/all`,getAllProducts)
app.get(`/latest`,getlatestProducts)
app.get(`/categories`,getAllCategories)
app.get(`/admin-products`,isAdmin,getAdminProducts)

app.route(`/:id`).get(getSingleProduct).put(isAdmin,multiUpload,updateProduct).delete(isAdmin,deleteProduct)



app.get("/reviews/:id", allReviewsOfProduct);
app.post("/review/new/:id", newReview);
app.delete("/review/:id", deleteReview);



export default app;