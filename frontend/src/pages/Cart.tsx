import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { cartReducerInitialState } from "../types/reducer-types";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from "../redux/reducer/cartReducer";
import { cartItem } from "../types/types";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../redux/api/productAPI";


const Cart = () => {
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: cartReducerInitialState }) => state.cartReducer
    );
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(true);

  const dispatch = useDispatch();

  useEffect(() => {

    const {token,cancel} = axios.CancelToken.source()

    const timeOutId = setTimeout(() => {
      if (couponCode) {
        axios
          .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`,{
            cancelToken: token
          })
          .then((res) => {
            dispatch(discountApplied(res.data.discount));
            setIsValidCouponCode(true);
            //store coupon in local storage
            localStorage.setItem("couponCode", couponCode);
            dispatch(calculatePrice());
          })
          .catch((err) => {
            setIsValidCouponCode(false);
            dispatch(discountApplied(0));
            dispatch(calculatePrice());
            toast.error(err.response.data.message || "server error");
          });
      }
    }, 1000);

    return () => {
      cancel();
      clearTimeout(timeOutId);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  const addToCartHandler = (cartItem: cartItem) => {
    if (cartItem.quantity >= cartItem.stock) {
      toast.error("Out of Stock");
      return;
    }
    dispatch(addToCart(cartItem));
  };
  const removeFromCartHandler = (cartItem: cartItem) => {
    dispatch(removeCartItem(cartItem));
  };
  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((item, idx) => {
            console.log("🥳",item)
            return (
          
            <CartItem
              key={idx}
              cartItem={item}
              removeFromCartHandler={removeFromCartHandler}
              addToCartHandler={addToCartHandler}
            />
          )})
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotatal:₹{subtotal} </p>
        <p>Shipping Charges:₹{shippingCharges} </p>
        <p>Tax:₹{tax} </p>
        <p>
          discount:<em className={discount<=0?``:`red`}>{discount<=0?"₹0":"-₹"+discount}</em>
        </p>
        <p>total:₹{total}</p>

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using the code: <code>{couponCode}</code>{" "}
            </span>
          ) : (
            <span className="red">
              Invalid coupon <VscError />
            </span>
          ))}

        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
