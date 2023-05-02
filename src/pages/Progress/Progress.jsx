import React, {useState, useEffect}from 'react'
import './Progress.css';
import Axios from "axios";

import {Link} from "react-router-dom";

//Context Hooks
import { useAuthContext } from '../../Hooks/Auth/useAuthContext';

function Progress() {
  const { user } = useAuthContext()
  
  // handle error
  const [ error, setError ] = useState('')

  // Show all Created progress
    //Progress
    const [ progressList, setProgressList ] = useState('');
    const getAllProgress = async() => {
        const Auth = {
            headers:{
            'Authorization': `Bearer ${user.token}`
            }
        }

        //saving the data
        await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/adviser/progress`, Auth)
        .then((response) => {
            // clear and call
            setError('')
            setProgressList(response.data)
            
        
        // catch error
        }).catch((error) =>{
            if (error.response) {
                setError(error.response.data.error)
            } 
        })
    }

    const [ myGroup, setMyGroup ] = useState('');
    const getMyGroup = async() => {
      const Auth = {
        headers:{
        'Authorization': `Bearer ${user.token}`
        }
    }

    //saving the data
    await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/adviser/my-group`, Auth)
    .then((response) => {
        // clear and call
        setError('')
        setMyGroup(response.data)
        console.log(response.data)
    
    // catch error
    }).catch((error) =>{
        if (error.response) {
            setError(error.response.data.error)
        } 
    })
    }

    useEffect(() => {
        getAllProgress()
        getMyGroup()
    }, [])

  return (
    <div className='progress'>
       {progressList && progressList.filter(progress => progress.group_id === user.group_id)
            .sort((a, b) => a.progress.localeCompare(b.progress))
            .map((progValue, index) => {
                const { _id, progress, percent } = progValue;
                return(
                  <div className='chapters' key={index}>
                    <h2>{progress}</h2>
                    <p>Progress: {percent}%</p>

                    {/*STUDENT:  Data to pass for "pages/Chapter1.js" */}
                    <Link to={'/chapter1'} 
                      state={{ 
                        group_id: user.group_id, 
                        progress_id: _id, 
                        progressName: progress}}>

                      <button className="view-progress">
                        View Progress
                      </button>
                    </Link>
                  </div>
                )
            })}

      {/* only shows when the group average is 100% and the user dont have a manuscript*/}
      {/* { myGroup.totalAveragePercent >= 100 && !myGroup.findManu && ( */}
        <div className='chapters'>
          <h2>Final Output</h2>
          <p><strong>Required:</strong> Average of 100% from Chapter 1-4</p>
          <Link to={'/finals'}>
            <button className="view-progress">
              View Progress
            </button>
          </Link> 
        </div>
        {/* )  } */}


    </div>
  )
}

export default Progress;