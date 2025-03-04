import { FaTrash } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { responseToast, transformImage } from "../../../utils/features.ts";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Skeleton } from "../../../components/Loader";
import { useDeleteOrderMutation, useOrderDetailsQuery, useUpdateOrderMutation } from "../../../redux/api/orderAPI";
import { customError } from "../../../types/api-types";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { OrderItem } from "../../../types/types";

const defaultOrderItems ={
shippingInfo: {
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: 0,
 },
 status: "",
 subtotal: 0,
 discount: 0,
 shippingCharges: 0,
 tax: 0,
 total: 0,
 orderItems:[],
 user:{
  _id: "",
  name: "",
},
_id:""
}


const TransactionManagement = () => {

  const { user } = useSelector((state:{userReducer:UserReducerInitialState}) => state.userReducer);

  const params = useParams();

  const navigate = useNavigate();

  const { isLoading, data, isError, error } = useOrderDetailsQuery(params.id!);
  const {shippingInfo:{address,city,state,country,pincode},orderItems,user:{name},status,tax,subtotal,total,discount,shippingCharges} = data?.order || defaultOrderItems
// console.log(data?.order)
 


 const [updateOrder] = useUpdateOrderMutation()
 const [deleteOrder] = useDeleteOrderMutation()

  const updateHandler =async()=> {
   const res  = await updateOrder({
    userId: user?._id!,
    orderId: data?.order._id!,
   })
   responseToast(res,navigate,"/admin/transaction")
   
  };
  const deleteHandler = async() => {
    const res  = await deleteOrder({
      userId: user?._id!,
      orderId: data?.order._id!,
     })
     responseToast(res,navigate,"/admin/transaction")
  };
  useEffect(()=>{
    if (isError) {
      const statusCode = (error as customError).status; // Assuming 'status' contains the HTTP status code
      if (statusCode === 404 || statusCode ===400) {
        toast.error("Product not found.");
        navigate("/404");  
        return;
      }
  
      const currentError = (error as { data: { message: string } }).data.message;
      if ( currentError) {
        toast.error(currentError);
     
      }
    }
  },[error,data])

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
       { isLoading? <Skeleton /> :<>
        <section
          style={{
            padding: "2rem",
          }}
        >
          <h2>Order Items</h2>

          {orderItems.map((i:any) => {
            // console.log(i)
            return(
            <ProductCard
              key={i._id}
              name={i.name}
              photos={i.photos}
              productId={i.productId}
              _id={i._id}
              quantity={i.quantity}
              price={i.price}
            />
          )})}
        </section>

        <article className="shipping-info-card">
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>
          <h1>Order Info</h1>
          <h5>User Info</h5>
          <p>Name: {name}</p>
          <p>
            Address: {`${address}, ${city}, ${state}, ${country} ${pincode}`}
          </p>
          <h5>Amount Info</h5>
          <p>Subtotal: {subtotal}</p>
          <p>Shipping Charges: {shippingCharges}</p>
          <p>Tax: {tax}</p>
          <p>Discount: {discount}</p>
          <p>Total: {total}</p>

          <h5>Status Info</h5>
          <p>
            Status:{" "}
            <span
              className={
                status === "Delivered"
                  ? "purple"
                  : status === "Shipped"
                  ? "green"
                  : "red"
              }
            >
              {status}
            </span>
          </p>
          <button className="shipping-btn" onClick={updateHandler}>
            Process Status
          </button>
        </article></> }
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photos,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={transformImage(photos[0])} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
