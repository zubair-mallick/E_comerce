
import { useState } from 'react'
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const user={_id:"a",role:"admin"}
const header = () => {
    const [isOpen,setIsOpen] = useState<boolean>(false)
    const logoutHandler =()=>{
        console.log('\x1b[34m%s\x1b[0m', `loggedout`);
        setIsOpen(false)
    }



  return (
   <nav  className='header' >
         <Link to={"/"} onClick={()=>setIsOpen(false)} >Home</Link>
         <Link to={"/seacrh"} onClick={()=>setIsOpen(false)} ><FaSearch/></Link>
         <Link to={"/cart"} onClick={()=>setIsOpen(false)}><FaShoppingBag/></Link>

        { user?._id ? (<>
         <button onClick={()=>setIsOpen(prev=>!prev)}> 
            <FaUser/> 
        </button>
        <dialog open={isOpen}>
            <div>
                {user.role === "admin" && (
                  <Link to={"/admin/dashboard"} >Admin</Link>
                   
                )}
                <Link to ={"/orders"}>
                    Orders
                </Link>
                <button onClick={logoutHandler}>
                    <FaSignOutAlt/>
                </button>
            </div>
        </dialog>
         </>) 
         : 
         <Link to={"login"}>Login <FaSignInAlt/></Link>  }
   </nav>
  )
}

export default header
