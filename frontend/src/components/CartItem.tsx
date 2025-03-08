import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { cartItem } from "../types/types";

type CartItemProps ={
  cartItem:any;
  addToCartHandler:(cartItem: cartItem) => void;
  removeFromCartHandler:(cartItem: cartItem) => void;
}

const CartItem = ({cartItem,addToCartHandler,removeFromCartHandler}:CartItemProps ) => {
  const {productId, photos,name,price,quantity } = cartItem;

  console.log(productId, photos, name, price, quantity)
  return (
    <div className="cart-item">
       <Link to={`/product/${productId}`}><img  src={photos[0]} alt={name} /></Link>
        
        <article>
          <Link to={`/product/${productId}`}>{name}</Link>
          <span>₹{price}</span>
        </article>

        <div>
          <button onClick={()=>removeFromCartHandler(cartItem)}>-</button>
          <p>{quantity}</p>
          <button onClick={()=>addToCartHandler(cartItem)}>+</button>
        </div>

        <button onClick={()=>removeFromCartHandler({...cartItem,quantity:0})}><FaTrash/></button>

    </div>
  )
}

export default CartItem
