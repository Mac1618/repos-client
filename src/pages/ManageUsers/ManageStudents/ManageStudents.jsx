import React,{useState} from 'react'
import "./ManageStudents.css";

// components
import StudentAdvisee from "../../../components/ManageUsers/StudentAdvisee/StudentAdvisee";
import GroupAdvisee from "../../../components/ManageUsers/GroupAdvisee/GroupAdvisee";

//react-router-dom
import { useLocation } from 'react-router-dom';

// context hook
import { useAuthContext } from '../../../Hooks/Auth/useAuthContext';

function ManageStudents() {
  const { user } = useAuthContext()

   // Check if user is dean
   const isDean = user.authorization === 'superadmin';

   //react-router state
   const location = useLocation();
   const admin_id = isDean ? location.state.admin_id : null;

  const [navbar, setNavbar] = useState(true);
  return (
    <div className='manage-students'>
        <div className="header">
            <div className="title">
              <h1>Manage Students</h1>
            </div>

            <div className='content-nav'>
              <ul> 
                <li 
                  className={navbar ? 'active-nav-link' : ''}
                  onClick={() => {
                      setNavbar(true);
                  } }>Capstone Groups</li>

                <li 
                  className={navbar ? '' : 'active-nav-link'}
                  onClick={() => {
                      setNavbar(false);
                  } }>Students</li>
              </ul>
            </div>

        </div>

        
        {navbar ? <GroupAdvisee admin_id={ admin_id }/> : <StudentAdvisee admin_id={ admin_id }/>}
        
    </div>
  )
}

export default ManageStudents