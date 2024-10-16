import { useState } from "react"
import {FcGoogle} from "react-icons/fc" 
const login = () => {

  const [gender,setGender] = useState("")
  const [date,setDate] = useState("")

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
           <button>
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
