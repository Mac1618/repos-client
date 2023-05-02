import React from 'react';
import './Register.css';
import InputForm from '../../components/Register/InputForm';

//react-router-dom v6
import { Link } from "react-router-dom";


function Register() {
  return (
    <div className='register'>
        <div className='form' action="">
            <h2>Register</h2>
            
            <InputForm />
            <p>Already have an account? <Link to={'/login'}>Login now</Link></p>
        </div>

    </div>
  )
}

export default Register