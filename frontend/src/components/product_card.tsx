import { FaPlus } from "react-icons/fa";

type productsProp={
    productId:string;
    picture:string;
    name:string;
    price:number;
    stock:number;
    handler:()=>void
}


const product_card = ({productId,price,name,picture,stock,handler}:productsProp) => {
  return (
   <div className="product-card">
       <img src={picture} alt={name} /> 
       <p>{name}</p>
       <span>{price}</span>

       <div>
          <button onClick={()=>handler}>
            <FaPlus/>
          </button>
       </div>
   </div>
  )
}

export default product_card
