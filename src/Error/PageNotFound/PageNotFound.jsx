import React from 'react'
import './PageNotFound.css';

//dependencies 
    //react-icons
import * as BiIcons from "react-icons/bi";

//BiError
function PageNotFound() {
  return ( 
        <div className='page-not-found'>
            <BiIcons.BiError color='red' size={250}/>
            <h1>Error 404 Page Not Found!</h1>
            <h4>The page your are looking for doesn't exist or has been removed!</h4>
        </div>
  )
}

export default PageNotFound