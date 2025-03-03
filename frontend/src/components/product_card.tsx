import { FaExpandAlt, FaPlus } from "react-icons/fa";
import { cartItem } from "../types/types";
import { Link } from "react-router-dom";
import { transformImage } from "../utils/features";

type productsProp={
    productId:string;
    photos:string[];
    name:string;
    price:number;
    stock:number;
    handler:(cartItem: cartItem) => string | undefined
}


const product_card = ({productId,price,name,photos,stock,handler}:productsProp) => {
  return (
   <div className="product-card">
       <img src={transformImage(photos[0],300)} alt={name} /> 
       <p>{name}</p>
       <span>{price + " ₹"}</span>

       <div>
          <button onClick={()=>handler({productId,price,name,photos,stock,quantity:1})}>
            <FaPlus/>
          </button>
          <Link to={`/product/${productId}`}>
          <FaExpandAlt />
        </Link>
       </div>
   </div>
  )
}

export default product_card
