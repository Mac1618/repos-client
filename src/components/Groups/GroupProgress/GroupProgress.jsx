import React, { useState, useEffect }  from 'react'
import "./GroupProgress.css";
import Axios from "axios";

//react-router-dom
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from '../../../Hooks/Auth/useAuthContext';

// notification component
import { ToastContainer } from 'react-toastify';
import Toast from '../../Toast/Toast';

// Confirmation box
import { useConfirm } from "material-ui-confirm";

function GroupProgress() {
    const { user } = useAuthContext()
    const confirm = useConfirm();

    // error
    const [ error, setError ] = useState('')

    //react-router state
    const location = useLocation();
    const { group_id } = location.state

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
        await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/adviser/progress`, Auth).then((response) => {
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

    useEffect(() => {
        getAllProgress()
    }, [])


    // delete a progress
    const handleDeleteProgress = async(_id, progress) => {

        if(!progress){
            return setError("No progress to delete found. Please try again!")
        }

        confirm({ title: `Do you want to delete ${progress}?`,
                description: `Please note that this progress: ${progress} will be permanently removed. The deletion will affect the following: the Comments, Task, Files uploaded both the adviser and students.!`,
                confirmationText: "Delete"
        }).then(async() => {
                // data
                const config = {
                    data: {
                        group_id: group_id
                    },
        
                    // auth
                    headers: {
                    'Authorization': `Bearer ${user.token}`
                    }
                };
        
        
                // delete query
                await Axios.delete(`${process.env.REACT_APP_DEV_BASE_URL}/adviser/progress/${_id}`, config)
                .then((response) => {
                    // dispatch({type: 'DELETE_COMMENT', payload: response.data})
                    Toast(`${progress} is DELETED`, 'success');
                    getAllProgress()
                    setError('')
                // catch error
                }).catch((error) => {
                    if (error.response) {
                        setError(error.response.data.error)
                    } 
                })
        
        // cancel confirmation       
        }).catch(() => {
          //Notification
            Toast(`You cancelled the "${progress}" deletion`, 'info');
        });  
    }

  return (
    <div className="group-progress">

        {error && <div className='error'>{error}</div>}
        {progressList && progressList.filter(progress => progress.group_id === group_id)
            .sort((a, b) => a.progress.localeCompare(b.progress))
            .map((progValue, index) => {
                const { _id, progress } = progValue;
                return(
                    <div className='card' key={index}>
                        <h4>{progress}</h4>
                        
                        {/*ADVISER:  Data to pass for "pages/Chapter1.js" */}
                        <div>
                            <Link to={'/chapter1'} state={{ 
                                group_id: group_id, 
                                progress_id: _id, 
                                progressName: progress }} className='link'>
                                    <button className='view'>View</button>
                            </Link>

                            <button 
                                onClick={() => {
                                    handleDeleteProgress(_id, progress)
                                }}
                                className='warning'
                            >delete</button>
                        </div>
                        
                    </div>
                )
            })}
        <ToastContainer/>
    </div>
  )
}

export default GroupProgress