import React, { useState } from 'react'
import { useEffect } from 'react';
import './ArchiveAccounts.css'

// Dependencies
import Axios from "axios";
import * as AiIcons from "react-icons/ai";

//Context Hooks
import { useAuthContext } from '../../Hooks/Auth/useAuthContext';

//Notification
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toast from '../../components/Toast/Toast';

// Confirmation box
import { useConfirm } from "material-ui-confirm";


function ArchiveAccounts() {
  //context
  const { user } = useAuthContext()
  const confirm = useConfirm();

  // search bar
  const [ searchBar, setSearchBar ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false)
  
  // useState variables
  const [ searchBtn, setSearchBtn ] = useState(false);
  const [ ArchivedList, setArchivedList ] = useState(false);
  const [ adminAccounts, setAdminAccounts ] = useState([]);
  const [ error, setError ] = useState('')

  //reading query to database
  useEffect(() => {
      handleAdviser()
  }, [ArchivedList]);


  const handleAdviser = async() => {
    const Auth = {
        headers:{
          'Authorization': `Bearer ${user.token}`
        }
    }
    await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/admin/advisers`, Auth)
    .then((response) => {
            setAdminAccounts(
              response.data.filter(post => !ArchivedList ? !post.isArchived : post.isArchived)
            );
            setError('')

    // catch error
    }).catch((error) => {
        if (error.response) {
          setError(error.response.data);
        } 
    })
  }


  // Archive the adviser account with his students
  const handleArchived = async(id, name) => {
      // setIsLoading(true)

      //stops the program if no user is found!
      if(!user) {
        return setError('You must be logged in!')
      }

      confirm({ title: `Do you want to archive ${name}?`,
                description: `Please note that all his students and the manuscripts are affected by this!`,
                confirmationText: "Archive"
              })
      .then(async() => {
           // post request comment data
            const archiveData = {
        
            }

            // auth
            const Auth = {
              headers:{
                'Authorization': `Bearer ${user.token}`
              }
            }
        
            //saving the data
            await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/dean/archive/${id}`, archiveData, Auth)
            .then((response) => {
              //Notification
              Toast(`${name} account is archived`, 'success');
              
              // clear and call
              handleAdviser()
              setError('')
              setIsLoading(false)

          // catch error
          }).catch((error) =>{
              if (error.response) {
                  setError(error.response.data.error)
                  setIsLoading(false)
              } 
          })
    
      })
      .catch(() => {
        //Notification
        Toast(`${name} account is not archived`, 'info');
      });
  }
  
  // Unarchive the adviser account with his students
  const handleUnarchived = async(id, name) => {
    setIsLoading(true)

    //stops the program if no user is found!
    if(!user) {
      return setError('You must be logged in!')
    }

    confirm({ title: `Do you want remove ${name} from being archived?`,
                description: `Please note that all his students and the manuscripts are affected by this!`,
                confirmationText: "Unarchive"
    }).then( async() => {
         // post request comment data
          const archiveData = {

          }

          // auth
          const Auth = {
            headers:{
              'Authorization': `Bearer ${user.token}`
            }
          }

          //saving the data
          await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/dean/unarchive/${id}`,archiveData ,Auth)
          .then((response) => {
            //Notification
            Toast(`${name} account is unarchived`, 'success');
            
            
            // clear and call
            setError('')
            handleAdviser()
            setIsLoading(false)
        
          // catch error
          }).catch((error) =>{
              if (error.response) {
                setIsLoading(false)
                setError(error.response.data.error)
              } 
          })

    // confirm cancel
    })
    .catch(() => {
      //Notification
      Toast(`${name} account is not removed from being archived`, 'info');
    });

   
  }


  return (
    <div className='archive'>

    <div className='content'>
  
      <h2>Advisers Accounts:</h2> 
      <div className='yearly'>

      <table >
        <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Section</th>
              <th>Handler</th>
            </tr>
          </thead>

          <tbody>
              {adminAccounts && 
                adminAccounts.filter(admins => {
                  if (searchBar === '') {
                      return admins
                  } else if (  
                      admins.name.toLowerCase().includes(searchBar.toLowerCase())
                  ) {
                      return admins;
                  }
                  return false;
              }).map((adviser, index) => {
                const { name, section, _id, isArchived } = adviser;
                return(
                      <tr>
                        <td key={index}>{index + 1}</td>
                        <td>{name}</td>
                        <td>{section}</td>
                        <td>
                          <span className='btns'>
                              {
                                !isArchived ? 
                                <button
                                    disabled={isLoading}
                                    onClick={() => handleArchived(_id, name)} 
                                    className='link'>archive
                                </button>
                                : 
                                <button
                                    disabled={isLoading}
                                    onClick={() => handleUnarchived(_id, name)} 
                                    className='link'>unarchive
                                </button>
                              }   
                          </span>
                        </td>
                      </tr>
                    )}
                  )}
          </tbody>
        </table>
        
      </div>
    </div>

    <div className='control'>
      <h1>Archive Accounts</h1>

      <div className='search-bar'>
        <input 
          onChange={(e) => setSearchBar(e.target.value)}
          value={searchBar}
          type="text" 
          placeholder='Search for adviser name...' />

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

      { <div className="button-container">
          <button className={`button ${!ArchivedList ? 'active' : ''}`} onClick={() => setArchivedList(false)}>Adviser Accounts</button>
          <button className={`button ${ArchivedList ? 'active' : ''}`} onClick={() => setArchivedList(true)}>Archived Accounts</button>
        </div> }

        {error && <div className='error'>{error}</div>}
 
    </div>
    <ToastContainer />
  </div>
  )
}

export default ArchiveAccounts