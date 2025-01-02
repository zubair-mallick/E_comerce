import { FaPlus } from "react-icons/fa";
import { cartItem } from "../types/types";

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
       <img src={photos[0]} alt={name} /> 
       <p>{name}</p>
       <span>{price}</span>

       <div>
          <button onClick={()=>handler({productId,price,name,photos,stock,quantity:1})}>
            <FaPlus/>
          </button>
       </div>
   </div>
  )
}

export default product_card
