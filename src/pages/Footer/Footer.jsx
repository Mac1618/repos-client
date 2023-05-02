import React from 'react'
import './Footer.css'

//react-icons
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io5";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className='footer'>
      <div className='header'>
        <h3>Ctrl Alt Elite tech.</h3>
        <p>Copyright &copy; {currentYear} ctrl alt elite team. All Rights Reserved.</p>
      </div>
     
      
      <div className='social'>
        <p>Socials</p>
        <div className='logos'>
          <a href="https://web.facebook.com/plspccst">
            <FaIcons.FaFacebookF size={30}/>
          </a>
          
          <a href="https://twitter.com/">
            <FaIcons.FaTwitter size={30}/>
          </a>
          
          <a href="https://www.instagram.com/">
            <FaIcons.FaInstagram size={30}/>
          </a>
          
          <a href="https://www.youtube.com/">
            <FaIcons.FaYoutube size={30}/>
          </a>

          <a href="https://plsp.edu.ph/">
            <IoIcons.IoSchool size={30}/>
          </a>

        </div>
      </div>
      
    </div>
  )
}

export default Footer