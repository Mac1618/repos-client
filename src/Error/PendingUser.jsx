import React, { useEffect } from 'react'
import './PendingUser.css'

//dependencies 
import * as FcIcons from "react-icons/fc";

function PendingUser() {
  
  return (
    <>
      <div className='pending-user'>
          <div>
            <FcIcons.FcInfo size={70} />
            <h1>
              <span>Your Account</span> is still on <span>pending</span> please wait...
            </h1>
          </div>
      </div>

    </>
  )
}

export default PendingUser