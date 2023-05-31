import React, { useState, useEffect } from 'react'
import './RepositoryFiles.css'

//Dependencies
import Axios from "axios";
import download from 'downloadjs';

// Confirmation box
import { useConfirm } from "material-ui-confirm";

// Notification
import Toast from '../../../components/Toast/Toast';
import { ToastContainer } from 'react-toastify';

// icons
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";

// Context Hooks
import { useAuthContext } from '../../../Hooks/Auth/useAuthContext';
import { useManuscriptContext } from '../../../Hooks/FileUpload/useManuscriptContext';


function RepositoryFiles() {
  // context hooks
  const { user } = useAuthContext()
  const { manuscript, dispatch } = useManuscriptContext()
  const confirm = useConfirm();

  // usestate
  const [searchBtn, setSearchBtn] = useState(false);
  const [ error, setError ] = useState('')
  const [ searchBar, setSearchBar ] = useState('');


  // get all Manucript Files
  const GetAllManuscriptFiles = async() => {
    const Auth = {
      headers:{
        'Authorization': `Bearer ${user.token}`
      }
    }

    await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/upload/manuscript`, Auth).then((response) => {
        if(response.data){
            dispatch({ type: 'SET_MANUSCRIPT', payload: response.data })
            setError('')
        }

    // catch Error
    }).catch((error) => {
        if (error.response) {
            setError(error.response.data)
        } 
    })
  }
  
  useEffect(() => {
    if(user.authorization === 'admin' || user.authorization === 'superadmin'){
      GetAllManuscriptFiles()
    }
  }, [dispatch, user])

  // funtion to download a Manuscript
  const downloadManuscript = async(id, path, mimetype) => {

      const Auth = {
        responseType: 'blob',
        headers:{
          'Authorization': `Bearer ${user.token}`
        }
      }

      await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/upload/manuscript/${id}`, Auth).then((response) => {
          if(response.data){
              const split = path.split('\\');
              const filename = split[split.length - 1];
              setError('')

              //Notification
              Toast(`You downloaded the manuscript`, 'success');
              
              //downloadjs dependency
              return download(response.data, filename, mimetype);
          } // catch error
      }).catch((error) => {
          if (error.response) {
              setError(error.response.data.error)
          } 
      })
  }

  // funtion to delete a Manuscript
  const deleteManuscript = async(id, manuscript) => {

    confirm({ title: `Do you want to delete both the manscript and abstract of "${manuscript}"?`,
        description: `Please note that this will permanently delete the file of both the manuscript and the abstract!`,
        confirmationText: "Delete"
    }).then(async() => {
        // auth
        const Auth = {
          headers:{
            'Authorization': `Bearer ${user.token}`
          }
        }

        // delete request
        await Axios.delete(`${process.env.REACT_APP_DEV_BASE_URL}/upload/manuscript/${id}`, Auth).then((response) => {
            if(response.data){
                // dispatch({ type: 'DELETE_MANUSCRIPT', payload: response.data });
                GetAllManuscriptFiles()
                setError('');

                //Notification
                Toast(`You deleted both manuscript and abstract of ${manuscript}`, 'success');
            }

        // catch error
        }).catch((error) => {
            if (error.response) {
                setError(error.response.data.error)
            } 
        })
    
    // cancel confirmation
    }).catch(() => {
        //Notification
        Toast(`You cancelled the manuscrpit and abstract deletion`, 'info');
    });
  }

  // ABSTRACT FILES 
  // Download an abstract file
  const handleAbstractDownload = async( id, path, mimetype) => {

    // Authorization
    const Auth = {
      responseType: 'blob',
      headers:{
        'Authorization': `Bearer ${user.token}`
      }
    }

    //API call
    await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/upload/abstract/${id}`, Auth).then((response) => {
        if(response.data){
            const split = path.split('\\');
            const filename = split[split.length - 1];
            setError('')
            
            //Notification
            Toast(`You downloaded the abstract`, 'success');

            //downloadjs dependency
            return download(response.data, filename, mimetype);
        } // catch error
    }).catch((error) => {
        if (error.response) {
            setError(error.response.data.error)
        } 
    })
  }

  return (
    <div className='repository-files'>

      <div className='header'>
        <h2>Manuscript Files: </h2>
        <div className='search-bar'>
          <input 
            onChange={(e) => {setSearchBar(e.target.value)}}
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
      </div>
      {error ? <p className={error ? 'error' : ''}>{error}</p> : null} 
      <table >
        <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Group Name</th>
              <th>Year</th>
              <th>Adviser</th>
              <th>Handler</th>
            </tr>
          </thead>

          <tbody>
          {manuscript && manuscript.filter(files => {
            if (searchBar === '') {
              return files.isArchived === true;
            } else if ( 
              files.manuscript.toLowerCase().includes(searchBar.toLowerCase()) || 
              files.abstract.toLowerCase().includes(searchBar.toLowerCase()) && 
              files.isArchived === true
            ) {
              return files;
            }
              return false;
          })
          .sort((a, b) => a.manuscript.localeCompare(b.manuscript))
          .sort((a, b) => a.abstract.localeCompare(b.abstract))
          .map((group, index) => {
            const { _id, academicYear, groupName, adviserName } = group
            const { manuscript, manuscriptMimetype, manuscriptPath } = group
            const { abstract, abstractMimetype, abstractPath } = group
            return(
              <>
                <tr>
                  <td key={index}>{index + 1}</td>
                  <td>{manuscript}</td>
                  <td>{groupName}</td>
                  <td>{academicYear}</td>
                  <td>{adviserName}</td>
                  <td>
                    <div className="btn">
                    <button 
                      onClick={() => downloadManuscript( _id, manuscriptPath, manuscriptMimetype )}
                      className='link'><IoIcons.IoMdDownload color='blue' size={30}/>
                    </button>

                      {user.authorization === 'admin' ? 
                        <button
                          onClick={() => deleteManuscript(_id, manuscript)}
                          className='link'><FaIcons.FaTrashAlt color='red' size={25}/>
                        </button> : null
                      }
                      </div>
                  </td>
                </tr>

                <tr>
                  <td key={index}>{index + 2}</td>
                  <td>{abstract}</td>
                  <td>{groupName}</td>
                  <td>{academicYear}</td>
                  <td>{adviserName}</td>
                  <td>
                    <div className="btn">
                    <button 
                      onClick={() => handleAbstractDownload(_id, abstractPath, abstractMimetype )}
                      className='link'><IoIcons.IoMdDownload color='blue' size={30}/>
                    </button>

                      {user.authorization === 'admin' ? 
                        <button
                        onClick={() => deleteManuscript(_id, manuscript)}
                          className='link'><FaIcons.FaTrashAlt color='red' size={25}/>
                        </button> : null
                      }
                      </div>
                  </td>
                </tr>
              </>
            ) 
          })
          }
        </tbody>
      </table>
      <ToastContainer />
    </div>
  )
}

export default RepositoryFiles