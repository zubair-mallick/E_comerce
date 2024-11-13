import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import { UserReducerInitialState } from "../../../types/reducer-types";
import toast from "react-hot-toast";


const NewProduct = () => {

  interface ApiError {
    data: {
      message: string;
    };
  }
 
  const {user}= useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState<string>("");
  
  const [photoPrev, setPhotoPrev] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);

  const [newProduct] = useNewProductMutation();
  const navigate = useNavigate();

  // Handle image file change
  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoPrev(reader.result);
          setPhoto(file);
        }
      };
    }
  };

  // Handle form submission
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!name || !price || stock < 0 || !category || !description) return;
      if (!photo) return;

      const formData = new FormData();
      formData.set("name", name);
      formData.set("description", description);
      formData.set("price", price.toString());
      formData.set("stock", stock.toString());
      formData.set("category", category);

      formData.append("photo", photo); // Add photo to form data

      const res = await newProduct({ id: user?._id!, formData });
      
      if("error" in res){
       throw res.error
      }
      else{
        toast.success(res.data?.message!);
        navigate(`/admin/product`);
      }
      
    } catch (error ) {
      if ((error as ApiError) && (error as ApiError).data && (error as ApiError).data.message) {
        toast.error((error as ApiError).data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
     
    } finally {
      setIsLoading(false);
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
                required
                type="file"
                accept="image/*"
                onChange={changeImageHandler}
              />
            </div>

            {photoPrev && <img src={photoPrev} alt="Preview" width={100} />}

            <button disabled={isLoading} type="submit">
              {isLoading ? "Creating..." : "Create"}
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
