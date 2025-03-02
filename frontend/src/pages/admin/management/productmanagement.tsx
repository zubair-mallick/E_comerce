import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../redux/api/productAPI";
import { customError } from "../../../types/api-types";
import { UserReducerInitialState } from "../../../types/reducer-types";

const Productmanagement = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const params = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useProductDetailsQuery(params.id!);

  const { photos, category, name, price, stock,description  } = data?.product || {
    photos: ["", "", "", ""],
    category: "",
    name: "",
    price: 0,
    stock: 0,
    _id: "",
    description:""
  };

  const [priceUpdate, setPriceUpdate] = useState<number | undefined>(undefined);
  const [stockUpdate, setStockUpdate] = useState<number | undefined>(undefined);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photosUpdate, setPhotosUpdate] = useState<string[]>(photos);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [preverror, setPrevError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track if the form is submitting
  const [descriptionUpdate, setDescriptionUpdate] = useState<string>(description);

  // Mutations
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Handle file input change for multiple images
  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      const filePreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPhotoFiles(filesArray);
      setPhotosUpdate(filePreviews);
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button when submitting
    const formData = new FormData();
    if (nameUpdate) formData.set("name", nameUpdate);
    if (priceUpdate) formData.set("price", priceUpdate.toString());
    if (stockUpdate !== undefined) formData.set("stock", stockUpdate.toString());
    if (categoryUpdate) formData.set("category", categoryUpdate);
    if (descriptionUpdate) formData.set("description", descriptionUpdate);
    // Add selected photo files to FormData
    photoFiles.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const res = await updateProduct({
        formData,
        userId: user?._id!,
        productId: data?.product._id!,
      });
      if (res.error) {
        toast.error("Failed to update product.");
      } else {
        toast.success("Product updated successfully!");
      }
    } catch (error) {
      toast.error("An error occurred while updating the product.");
    } finally {
      setIsSubmitting(false); // Re-enable button after submission
    }
  };

  const deleteHandler = async () => {
    setIsSubmitting(true); // Disable button when deleting
    try {
      const res = await deleteProduct({
        userId: user?._id!,
        productId: data?.product._id!,
      });
      if (res.error) {
        toast.error("Failed to delete product.");
      } else {
        toast.success("Product deleted successfully!");
        navigate("/admin/product");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product.");
    } finally {
      setIsSubmitting(false); // Re-enable button after deletion
    }
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setPhotosUpdate(data.product.photos);
      setCategoryUpdate(data.product.category);
      setDescriptionUpdate(data.product.description);
    }

    if (error) {
      const statusCode = (error as customError).status;
      if (statusCode === 404 || statusCode === 400) {
        toast.error("Product not found.");
        navigate("/404");
        return;
      }

      const currentError = (error as { data: { message: string } }).data.message;
      if (preverror !== currentError) {
        toast.error(currentError);
        setPrevError(currentError);
      }
    }
  }, [data, error, preverror]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <div className="skeleton-loader">
            <Skeleton height={200} width={400} className="skeleton-img" />
            <Skeleton height={30} width={800} className="skeleton-text" />
            <Skeleton height={30} width={850} className="skeleton-text" />
            <Skeleton height={30} width={800} className="skeleton-text" />
          </div>
        ) : (
          <>
            <section>
              <strong>ID - {params.id ? params.id : "loading..."}</strong>
              <div className="image-preview-container">
                <img className="main-image-preview" src={photos[0]} alt={`Product`} />
              </div>
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article>
              <button
                className={`product-delete-btn`}
                style={{
                  backgroundColor: isSubmitting? "gray" : "",
                  cursor: isSubmitting? "not-allowed" : "pointer",
                }}
                onClick={deleteHandler}
                disabled={isSubmitting}
              >
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage Product</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder={name || "Name"}
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Description</label>
                  <textarea
                    required
                    placeholder="Description"
                    value={descriptionUpdate}
                    onChange={(e) => setDescriptionUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder={price === 0 ? "Price" : price.toString()}
                    value={priceUpdate === undefined ? "" : priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder={stock === 0 ? "Stock" : stock.toString()}
                    value={stockUpdate === undefined ? "" : stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder={category || "e.g., laptop, camera etc."}
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Photos</label>
                  <input type="file" multiple onChange={changeImageHandler} />
                </div>
                <div className="image-preview-container">
                  {photosUpdate.map((photo, index) => (
                    <div className="image-preview" key={index}>
                      <img src={photo} alt={`Preview ${index}`} />
                    </div>
                  ))}
                </div>
                <button
                  className={`${isSubmitting ? 'button-disabled' : ''}`}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Update
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Productmanagement;
