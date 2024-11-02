import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useState } from "react"
import toast from "react-hot-toast"
import {FcGoogle} from "react-icons/fc" 
import { auth } from "../firebase"
import { useLoginMutation } from "../redux/api/userAPI"
const login = () => {

  const [gender,setGender] = useState("")
  const [date,setDate] = useState("")

  const [login] = useLoginMutation()

  const loginHandler =async()=>{
    try 
    {
      const provider= new GoogleAuthProvider()
      const {user}=  await signInWithPopup(auth,provider)
      await login({
        name:"as",
        email:"asas",
        photo:"asas",
        gender:"asds",
        dob:"asdsdsa",
        role:"user",
        _id:"sads"

      })
      console.log(user)
    } catch (error) {
      toast.error("Failed to login")
    }

  }
  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>
        <div>
          <label>Gender</label>
          <select value={gender} onChange={e=>setGender(e.target.value)} >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label >date of birth</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}/>
        </div>

        <div>
          <p>already a User</p>
           <button onClick={loginHandler}>
              <FcGoogle/>
              <span>Sign in with Google</span>
           </button>
        </div>
      </main>
      login
    </div>
  )
}

export default login
