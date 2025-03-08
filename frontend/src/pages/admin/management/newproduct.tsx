import { useFileHandler } from "6pp";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import { UserReducerInitialState } from "../../../types/reducer-types";

const NewProduct = () => {
  interface ApiError {
    data: {
      message: string;
    };
  }

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // New state for form submission

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState<string>("");

  const [newProduct] = useNewProductMutation();
  const navigate = useNavigate();

  // Handle image file change
  const photos = useFileHandler("multiple", 10, 5);

  // Handle form submission
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Set isSubmitting to true when form is submitted
    try {
      if (!name || !price || stock < 0 || !category || !description) return;
      if (!photos || !photos.file) return;

      const formData = new FormData();
      formData.set("name", name);
      formData.set("description", description);
      formData.set("price", price.toString());
      formData.set("stock", stock.toString());
      formData.set("category", category);

      // Add photos to form data
      photos.file.forEach((file) => {
        formData.append("photos", file);
      });

      const res = await newProduct({ id: user?._id!, formData });

      if ("error" in res) {
        throw res.error;
      } else {
        toast.success(res.data?.message!);
        navigate(`/admin/product`);
      }
    } catch (error) {
      if (
        (error as ApiError) &&
        (error as ApiError).data &&
        (error as ApiError).data.message
      ) {
        toast.error((error as ApiError).data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false); // Set isSubmitting to false once response is received
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                required
                placeholder="Description"
                value={description}
                className="textarea"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input
                multiple
                required
                type="file"
                accept="image/*"
                onChange={photos.changeHandler}
              />
            </div>
            {photos.error && <p>{photos.error}</p>}

            {photos.preview && (
              <div className="image-preview-container">
                {photos.preview.map((img, index) => (
                  <div className="image-preview" key={index}>
                    <img src={img} alt="Preview" />
                  </div>
                ))}
              </div>
            )}

            <button
              disabled={isSubmitting} // Disable button when form is submitting
              type="submit"
              className={isSubmitting ? "button-disabled" : ""}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
