import React, {useState} from 'react'
import './Navbar.css';

//Images
import CCST_LOGO from '../../Logo/CCST_LOGO.jpg'
import PLSP_LOGO from '../../Logo/PLSP_LOGO.jpg'

// react-router-domv6
import { Link } from "react-router-dom";

// react-icons  
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as MdIcons from "react-icons/md";
import { IconContext } from 'react-icons';

// Navbar routes data
import { SidebarData, LoginAndSignup, StudentView, AdminView } from "./SidebarData";

// Logout Custom Context Hook
import { useLogout } from '../../Hooks/Auth/useLogout';
import { useAuthContext } from '../../Hooks/Auth/useAuthContext';

function Navbar() {
    const { logout } = useLogout()
    const { user } = useAuthContext() 

    // funtion to logout the user
    const handleLogout = () => {
        logout()
    }

    // "sidebar" variable
    const [sidebar, setSidebar] = useState(false);

    // "sidebar" function
    const showSidebar = () => {
        // changes the value to what ever the opposite value or "sidebar"
        setSidebar(!sidebar);
    }

    const POV = () => {
        //check if there is no user
        if (!user) {
            return LoginAndSignup.map((item, index) => {
                return(
                    <li key={index} className={item.className}>
                        <Link to={item.path}>
                            {item.icons}
                            <span>{item.title}</span>
                        </Link>
                    </li> 
                )
            })
        }

        // check if there is a user
        if (user) {
            if(user.hasOwnProperty('authorization')){
                if(user.authorization === 'pending'){
                    return(
                        <li className='nav-text'>
                            <Link to='/pending'>
                                <MdIcons.MdPending />
                                <span>Pending Account</span>
                            </Link>
                        </li> 
                    )
                }
                
                //Student Point of View
                if( user.authorization === 'student' ){
                     return StudentView.map((item, index) => {
                        return(
                            <li key={index} className={item.className}>
                                <Link to={item.path}>
                                    {item.icons}
                                    <span>{item.title}</span>
                                </Link>
                            </li> 
                        )
                    })
                }

                 //Admin Point of View
                 if(user.authorization === 'admin'){
                    return AdminView.map((item, index) => {
                       return(
                           <li key={index} className={item.className}>
                               <Link to={item.path}>
                                   {item.icons}
                                   <span>{item.title}</span>
                               </Link>
                           </li> 
                       )
                   })
               }


            }


            //Dean
            if(user.authorization === 'superadmin'){
                return SidebarData.map((item, index) => {
                    return(
                        <li key={index} className={item.className}>
                            <Link to={item.path}>
                                {item.icons}
                                <span>{item.title}</span>
                            </Link>
                        </li> 
                    )
                })
            }
        }
    }

  return (
    <>  
        < IconContext.Provider value={{color: '#fff'}}>
            {/* burger menu to show the nav-items */}
            <div className="navbar">
                < div className='menu-bars' >
                    {/* react-icons */}
                    <FaIcons.FaBars onClick={showSidebar}/>
                </div>

                <div className='nav-content'>
                    <div>
                        <img className='logo' src={CCST_LOGO} alt="CCST_LOGO" />
                        <img className='logo' src={PLSP_LOGO} alt="PLSP_LOGO" />
                    </div>
                
                    {user && (
                        <div>
                            <Link to={'/settings'}>
                                <span><FaIcons.FaUserGraduate 
                                    className='profile' 
                                    color='orange' 
                                    size={15}/>
                                {user.name}</span>
                            </Link>

                            <Link to={'/login'}>
                                <button
                                    onClick={handleLogout}
                                >Logout</button>
                            </Link>
                        </div>
                    )}
                </div>
                
            </div>

            {/* when ever the burger menu clicked these routes will pop-up! */}
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' onClick={showSidebar}>
                    <li className='navbar-toggle'>
                        <div className='menu-bars'>
                            {/* react-icons */}
                            <AiIcons.AiOutlineClose size={20} />
                        </div>
                    </li>
                    { POV() }
                </ul>
            </nav>
        </IconContext.Provider>
    </>
  )
}

export default Navbar