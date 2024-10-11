import React, { useEffect, useState } from 'react'
import {VscError} from 'react-icons/vsc'
import CartItem from '../components/CartItem'
import { Link } from 'react-router-dom'
import { RiH1 } from 'react-icons/ri'
const cart={
cartItems:[{productid:"asdsd",photo:"https://images-eu.ssl-images-amazon.com/images/G/31/Img23/Budget3/REC-PC_CC_379x304._SY304_CB564096366_.jpg",
  name:"Macbook",
  price:3000,
  quantity:4,
  stock:10
}],
subTotal:4000,
tax:Math.round(4000*.18),
shippingCharges:200,
total:4000 + Math.round(4000*.18),
discount:400
}

const Cart = () => {
  const [couponCode,setCouponCode]= useState<string>("")
  const [isValidCouponCode,setIsValidCouponCode]= useState<boolean>(true)

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
  
  return (
    <div className='cart'>
      <main>
        {cart.cartItems.length>0? (cart.cartItems.map((item,idx)=> <CartItem key={idx} cartItem={item}/>)) : <h1>No Items Added</h1>  }
      </main>
      <aside>
          <p>Subtotatal:₹{cart.subTotal} </p>
          <p>Shipping Charges:₹{cart.shippingCharges} </p>
          <p>Tax:₹{cart.tax} </p>
          <p>discount:<em className='red'>-₹{cart.discount}</em></p> 
          <p>total:₹{cart.total}</p>

        <input type="text"
        placeholder='Coupon Code'
        value={couponCode} onChange={(e)=>setCouponCode(e.target.value)} 
        />
        {
          couponCode && (isValidCouponCode? (<span className='green'>₹{cart.discount} off using the <code >{couponCode}</code> </span>) :( <span className='red'>Invalid coupon <VscError/></span>))
        }

        {
          cart.cartItems.length>0 && <Link to='/shipping'>Checkout</Link>
        }

      </aside>
    </div>
  )
}

export default Cart
