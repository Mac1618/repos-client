import React, { useState, useEffect } from 'react'
import './RepositoryFiles/RepositoryFiles.css'

// icons
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

//Dependencies
import Axios from "axios";
import download from 'downloadjs';

//Context
import { useAuthContext } from '../../Hooks/Auth/useAuthContext';

function RepositoryGroups() {
  const { user } = useAuthContext()

  //useState varaible
  const [ handleGroups, setHandleGroups ] = useState()
  const [searchBtn, setSearchBtn] = useState(false);
  const [ searchBar, setSearchBar ] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  
  //store Error
  const [ error, setError ] = useState('')

   //reading query to database
  const response = async() => {
    const Auth = {
        headers:{
          'Authorization': `Bearer ${user.token}`
        }
    }
    await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/upload/manuscript`, Auth).then((response) => {
        if(response.data){
            setHandleGroups(response.data)
            setError('')
        }
    // catch error
    }).catch((error) => {
        if (error.response) {
            setError(error.response.data)
        } 
    })
  }

  useEffect( () => {
    if(!handleGroups){
      response();
    }
  }, [ user ]);


// MANUSCRIPT FILES 
  // Download an manuscript file
  const handleManuscriptDownload = async( id, path, mimetype) => {
    setIsLoading(true)

    // Authorization
    const Auth = {
      responseType: 'blob',
      headers:{
        'Authorization': `Bearer ${user.token}`
      }
    }

    //API call
    await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/upload/manuscript/${id}`, Auth).then((response) => {
        if(response.data){
            const split = path.split('\\');
            const filename = split[split.length - 1];

            // reset state
            setError('')
            setIsLoading(false)

            //downloadjs dependency
            return download(response.data, filename, mimetype);

        } // catch error
    }).catch((error) => {
        if (error.response) {
            setError(error.response.data.error)
            setIsLoading(false)
        } 
    })

  }


// ABSTRACT FILES 
  // Download an abstract file
  const handleAbstractDownload = async( id, path, mimetype) => {
    setIsLoading(true)

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

            //reset state
            setError('')
            setIsLoading(false)
             
            //downloadjs dependency
            return download(response.data, filename, mimetype);
            
        } // catch error
    }).catch((error) => {
        if (error.response) {
            setError(error.response.data.error)
            setIsLoading(false)
        } 
    })

  }

  return (
    <div className='repository-files'>

    <div className='header'>
      <h2>Manuscript and Abstract Files: </h2>
      <div className='search-bar'>
        <input 
          onChange={(e) => {setSearchBar(e.target.value)}}
          type="text" 
          placeholder='Search a title, group or academic year...' />

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
              <th>Group Names</th>
              <th>Year</th>
              <th>Adviser</th>
              <th>Handler</th>
            </tr>
          </thead>

          <tbody>
          {handleGroups && handleGroups.filter(files => {
            if (searchBar === '') {
              return files.isArchived;
            } else if ( 
              files.manuscript.toLowerCase().includes(searchBar.toLowerCase()) && files.isArchive || 
              files.abstract.toLowerCase().includes(searchBar.toLowerCase()) && files.isArchived ||
              (files.groupName.toLowerCase().includes(searchBar.toLowerCase()) || 
              files.academicYear.includes(searchBar))
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
                      disabled={isLoading}
                      onClick={() => handleManuscriptDownload( _id, manuscriptPath, manuscriptMimetype )}
                      className='link'><IoIcons.IoMdDownload color='blue' size={30}/>
                    </button>
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
                      disabled={isLoading}
                      onClick={() => handleAbstractDownload(_id, abstractPath, abstractMimetype )}
                      className='link'><IoIcons.IoMdDownload color='blue' size={30}/>
                    </button>
                      </div>
                  </td>
                </tr>
              </>
            ) 
          })
          }
        </tbody>
      </table>

  </div>
  )
}

export default RepositoryGroups