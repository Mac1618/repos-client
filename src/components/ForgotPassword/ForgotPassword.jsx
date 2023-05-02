import React, {useState} from 'react'
import Axios from "axios";

//dependencies 
import * as FaIcons from "react-icons/fa";
import { IconContext } from 'react-icons';

//Notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toast from '../Toast/Toast';

//react-router-dom v6
import { Link } from "react-router-dom";

function ForgotPassword() {
// event listener
  const [ email, setEmail ] = useState('')
  const [isLoading, setIsLoading] = useState(null)
  const [error, setError] = useState(null)

  //handles login button
  const handleSubmit = async(e) => {
    e.preventDefault()

    // post request to signup users
    const emailData = {
        email: email
    }

     // signing up user
     await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/user/forgot-password`, emailData)
     .then((response) => {

          //Notification
          Toast(`We send a link to your email: ${email}. Open the link to change password`, 'success');
  
         if(response.data) {
            setError('')
         }

     // catch error
     }).catch((error) =>{
        //Notification
        Toast(`The system failed to send link to your email: ${email}. Please check again your email`, 'error');

         if (error.response) {
             setError(error.response.data.error)
         } 
     })

    
  }

  return (
    <>
      <IconContext.Provider value={{color: 'maroon'}}>
        <div className='login'>
            <form onSubmit={handleSubmit}>
                <h2>Forgot Password</h2>
                
                <div className='form-logo'>
                  <FaIcons.FaUser size={20} className="logo" />
                  <input 
                    onChange={(e) => {
                      setEmail(e.target.value)
                    }}
                    type="text" 
                    placeholder='Type your email...'/>
                </div>

                  <button type="submit">Submit</button>
                  {error && <div className='error'>{error}</div>}
                  <p>Already have an account? <Link to={'/login'}>Login now</Link></p>
            </form>

        </div>
        <ToastContainer />
      </IconContext.Provider>
    </>
  )
}

export default ForgotPassword