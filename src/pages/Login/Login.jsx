import React, {useState} from 'react';
import './Login.css';

//dependencies 
import * as FaIcons from "react-icons/fa";
import { IconContext } from 'react-icons';

//react-router-dom v6
import { Link } from "react-router-dom";

// Login hook
import { useLogin } from '../../Hooks/Auth/useLogin';

function Login() {
  const { login, error, isLoading } = useLogin()

  // event listener
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  //handles login
  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
  }


  return (
    <>
      <IconContext.Provider value={{color: 'maroon'}}>
        <div className='login'>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                
                <div className='form-logo'>
                  <FaIcons.FaUser size={20} className="logo" />
                  <input 
                    onChange={(e) => {
                      setEmail(e.target.value)
                    }}
                    type="text" 
                    placeholder='Type your Student-ID or email...'/>
                </div>

                <div className='form-logo'>
                  <FaIcons.FaLock size={20} className="logo" />
                  <input 
                    onChange={(e) => {  
                      setPassword(e.target.value)
                    }}
                    type="password" 
                    placeholder='Type your password...'/>
                </div>


                  <button disabled={isLoading} type="submit">Login Now</button>


                {error && <div className='error'>{error}</div>}
                <p>Don't have an account? <Link to='/register'>Signup now</Link></p>
                <p><Link to='/forgot-password'>Forgot password</Link></p>
            </form>

        </div>
      </IconContext.Provider>
    </>
  )
}

export default Login;