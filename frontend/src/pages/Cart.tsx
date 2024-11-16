import { useEffect, useState } from 'react'
import { VscError } from 'react-icons/vsc'
import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'
import { useDispatch, useSelector } from 'react-redux'
import { cartReducerInitialState } from '../types/reducer-types'
import { addToCart, calculatePrice, removeCartItem } from '../redux/reducer/cartReducer'
import { cartItem } from '../types/types'
import toast from 'react-hot-toast'

const Cart = () => {
  const {cartItems,subtotal,tax,total,shippingCharges,discount} = useSelector((state:{ cartReducer:cartReducerInitialState})=> state.cartReducer)
  const [couponCode,setCouponCode]= useState<string>("")
  const [isValidCouponCode,setIsValidCouponCode]= useState<boolean>(true)

  const dispatch = useDispatch();

  useEffect(() =>{
    const timeOutId = setTimeout(() =>{
      if(Math.random()>.5){
        setIsValidCouponCode(true) 
       }
       else{
         setIsValidCouponCode(false)
       }

    },1000)
     
    return ()=>{
      clearTimeout(timeOutId)
      setIsValidCouponCode(false)
    }
  })

  const addToCartHandler = (cartItem:cartItem) => {
    if(cartItem.quantity>=cartItem.stock) {
      toast.error("Out of Stock");
      return;
    }
    dispatch(addToCart(cartItem));
  };
  const removeFromCartHandler = (cartItem:cartItem) => {
    
    dispatch(removeCartItem(cartItem));
  };
   useEffect(() =>{
    dispatch(calculatePrice())
   },[cartItems,dispatch])
  
  return (
    <div className='cart'>
      <main>
        {cartItems.length>0? (cartItems.map((item,idx)=> <CartItem key={idx} cartItem={item}removeFromCartHandler={removeFromCartHandler}  addToCartHandler={addToCartHandler}/>)) : <h1>No Items Added</h1>  }
      </main>
      <aside>
          <p>Subtotatal:₹{subtotal} </p>
          <p>Shipping Charges:₹{shippingCharges} </p>
          <p>Tax:₹{tax} </p>
          <p>discount:<em className='red'>-₹{discount}</em></p> 
          <p>total:₹{total}</p>

        <input type="text"
        placeholder='Coupon Code'
        value={couponCode} onChange={(e)=>setCouponCode(e.target.value)} 
        />
        {
          couponCode && (isValidCouponCode? (<span className='green'>₹{discount} off using the <code >{couponCode}</code> </span>) :( <span className='red'>Invalid coupon <VscError/></span>))
        }

        {
          cartItems.length>0 && <Link to='/shipping'>Checkout</Link>
        }

      </aside>
    </div>
  )
}

export default Cart
