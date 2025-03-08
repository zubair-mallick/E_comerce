import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { server } from "../redux/api/productAPI";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { cartReducerInitialState, UserReducerInitialState } from "../types/reducer-types";
import { shippingInfo } from "../types/types";

const Shipping = () => {
  const { cartItems } = useSelector(
    (state: { cartReducer: cartReducerInitialState }) => state.cartReducer
  );
  const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shippingInfo, setShippingInfo] = useState<shippingInfo>({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(saveShippingInfo({...shippingInfo}));

    try {
      const { data } = await axios.post(
        `${server}/api/v1/payment/create?id=${user?._id}`,
        {
          items: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          shippingInfo,
          //get coupon from local storage
           coupon: localStorage.getItem("couponCode")?JSON.parse(localStorage.getItem("couponCode")!):"",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/pay", {
        state: data.clientSecret,
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (cartItems.length <= 0) return navigate("/cart");
  }, [cartItems, navigate]);

  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>

      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>

        <input required type="text" placeholder="Address" name="address" value={shippingInfo.address} onChange={changeHandler} />
        <input required type="text" placeholder="City" name="city" value={shippingInfo.city} onChange={changeHandler} />
        <input required type="text" placeholder="State" name="state" value={shippingInfo.state} onChange={changeHandler} />
        <select name="country" required value={shippingInfo.country} onChange={changeHandler}>
          <option value="">Choose Country</option>
          <option value="india">India</option>
        </select>
        <input required type="text" placeholder="Pin Code" name="pincode" value={shippingInfo.pincode} onChange={changeHandler} />

        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Shipping;
