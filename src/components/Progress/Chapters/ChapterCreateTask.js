import React, { useState, useEffect } from 'react'
import Axios from "axios";

import { useAuthContext } from '../../../Hooks/Auth/useAuthContext';
import { useTaskContext } from '../../../Hooks/useTaskContext';

//Notification
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toast from '../../Toast/Toast';


function ChapterCreateTask(props) {
    const { user } = useAuthContext()
    const { tasks, dispatch } = useTaskContext()

    // handle error
    const [ error, setError ] = useState('')

    const [ taskName, setTaskName ] = useState('');
    const [ description, setDescription ] = useState('');
    // const [ isLoading, setIsLoading ] = useState(false);

    //props for both the student and adviser
        //ADVISER: location is "components/Groups/GroupProgress.jsx"
        //STUDENT: location is "pages/Progress/Progress.jsx"
        const { group_id, progress_id, progressName } = props;
        

    const handleSubmit = async () => {

        // Creating task data
        const taskData = {
            taskName: taskName,
            description: description,
            chapter: progressName,
            group_id: group_id,
            progress_id
        }

        const Auth = {
            headers:{
              'Authorization': `Bearer ${user.token}`
            }
        }
        
        await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/progress/createtask`, taskData, Auth )
        .then((response) => {
                // notification
                Toast(`${taskName} is CREATED `, 'success');

                setError('')
                dispatch({type: 'CREATE_TASK', payload: response.data})
                setTaskName('')
                setDescription('')
    
        // catch error
        }).catch((error) =>{
            if (error.response) {
                setError(error.response.data.error)
            } 
        })  
    }

  return (
    <>
        <div className="create-task">
            {error ? <p className={error ? 'error' : ''}>{error}</p> : null}
            <h3>Create a task</h3>
            <label>Task name: </label>
            <input 
                type="text"
                value={taskName} 
                placeholder='Name of task...'
                onChange={(e) => {
                    setTaskName(e.target.value)
                }}
                />

            <label className='desc'>Description</label>
            <textarea 
                name="" id=""
                cols="30" rows="6"
                value={description} 
                placeholder='task description...'
                onChange={(e) => {
                    setDescription(e.target.value)
                }}>
            </textarea>

            <button 
                onClick={() => {
                    handleSubmit()

                }}
                type="submit">Submit</button>
        </div>
       <ToastContainer/>
    </>
  )
}


export default ChapterCreateTask