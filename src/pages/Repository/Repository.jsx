import React, { useState, useEffect } from 'react'
import './Repository.css'

// Dependencies
import Axios from "axios";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";

//react-router-dom v6
import { Link } from "react-router-dom";

//Context Hooks
import { useAuthContext } from '../../Hooks/Auth/useAuthContext';

function Repository() {
  //context
  const { user } = useAuthContext()

  // search bar
  const [ searchBar, setSearchBar ] = useState('');
  
  // useState variables
  const [searchBtn, setSearchBtn] = useState(false);
  const [ error, setError ] = useState('')

  // changes the archive page
  const [ ArchivedList, setArchivedList ] = useState(false);
  const [ filteredAdminAccounts, setFilteredAdminAccounts ] = useState([]);
  
  const response = async() => {
    const Auth = {
        headers:{
          'Authorization': `Bearer ${user.token}`
        }
    }
    await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/admin/advisers`, Auth).then((response) => {
        if(response.data){
            // Filter based on the button stored inArchivedList
            setFilteredAdminAccounts(
              response.data.filter(post => !ArchivedList && !post.isArchived)
            );

            setError('')
        }
    // catch error
    }).catch((error) => {
        if (error.response) {
            setError(error.response.data)
        } 
    })
}

  //reading query to database
  useEffect( () => {
    if(!filteredAdminAccounts){
      response()
    }
  }, [ user, filteredAdminAccounts ]);

  return (
    <div className='repository'>

      <div className='content'>
    
        <h2>Academic Year:</h2>
        <div className='yearly'>

        { filteredAdminAccounts && 
            filteredAdminAccounts.map((adviser, index) => {
                const { name, section, _id, isArchived } = adviser;
                return(
                    <div key={index}>
                        <h3>{name}</h3>  
                        <p>{section}</p>    
                        <span className='btns'>
                              <Link 
                                  className='link' 
                                  to='/repository/groups'
                                  state={{ admin_id: _id, name: name }}
                              ><p>view</p></Link>

                        </span>
                    </div>
                )
            })}

            {error ? <p className='error'>{error}</p> : null}
        </div>
      </div>

      <div className='control'>
        <h1>Repository</h1>

        <div className='search-bar'>
          <input 
            onChange={(e) => setSearchBar(e.target.value)}
            type="text" 
            placeholder='Search a group...' />

          <span 
            className="search-button"
            onMouseEnter={() => setSearchBtn(true)}
            onMouseLeave={() => setSearchBtn(false)}
          >
            <AiIcons.AiOutlineSearch size="30px"
              color={searchBtn ? 'black' : 'white'}
            />
          </span>
        </div>

        <div className='files-btn'>
          <h3>Manuscript: </h3>
          <Link className='link' to='/repository/files'><button>Show files</button></Link>
        </div>

      </div>
    </div>
  )
}

export default Repository