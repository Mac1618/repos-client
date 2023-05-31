import React, {useState, useEffect} from 'react';
import './ManageUsers.css';

import * as AiIcons from "react-icons/ai";
import Axios from "axios";
import { Link } from "react-router-dom";

//context hook
import { useAuthContext } from '../../Hooks/Auth/useAuthContext';

function ManageUsers() {
  //context
  const { user } = useAuthContext()

  //usestate variables
  const [ searchBar, setSearchBar ] = useState('');
  const [searchBtn, setSearchBtn] = useState(false);
  const [ adminAccounts, setAdminAccounts ] = useState(null)
  const [ error, setError ] = useState(null)
  
   //reading query to database
   useEffect( () => {
    const response = async() => {
        const Auth = {
            headers:{
              'Authorization': `Bearer ${user.token}`
            }
        }
        await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/admin/advisers`, Auth).then((response) => {
            if(response.data){
                setAdminAccounts(response.data)
                setError('')
            }
        // catch error
        }).catch((error) => {
            if (error.response) {
                setError(error.response.data)
            } 
        })
    }


      response();
}, [ user ]);

  return (
    <div className='manage-users'>
      <div className="header">
        <h1>Manage Users</h1>
        <div className='search'>
          <input 
            onChange={(e) => setSearchBar(e.target.value)}
            type="text" 
            placeholder='Search advicers name...' />
          <span
            onMouseEnter={() => setSearchBtn(true)}
            onMouseLeave={() => setSearchBtn(false)}>
            <AiIcons.AiOutlineSearch size='30' color={searchBtn ? 'orange' : 'black'} />
          </span>
        </div>
      </div>

      <h2>Advisers Account</h2>
      <div className="content">
    
        <table >
        <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {adminAccounts ? adminAccounts
              .filter(admins => {
                      if (searchBar === '') {
                          return admins
                      } else if (  
                          admins.name.toLowerCase().includes(searchBar.toLowerCase())
                      ) {
                          return admins;
                      }
                      return false;
                  })
              .map((adviser, index) => {
                const { name, _id } = adviser
                return(
                  <tr>
                    <td key={index}>{index + 1}</td>
                    <td>{name}</td>
                    <td>
                      <div className='btn'>
                        <Link to={'/manageadvisers/managestudents'} 
                          state={{ admin_id: _id }} 
                          className='link'>
                          <button>Advisee</button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              ): null}
          </tbody>
        </table>

  
      </div>
    </div>
  )
}

export default ManageUsers