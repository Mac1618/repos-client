import React, {useState, useEffect} from 'react'
import './ChapterCards.css';

//Dependencies
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { formatDistance } from 'date-fns'

//Notification
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toast from '../../Toast/Toast';

// Confirmation box
import { useConfirm } from "material-ui-confirm";

// Auth Context
import { useAuthContext } from '../../../Hooks/Auth/useAuthContext';
import { useTaskContext } from '../../../Hooks/useTaskContext';


function ChapterCards(props) {
    const { user } = useAuthContext()
    const confirm = useConfirm();
    const { tasks, dispatch } = useTaskContext()
    const [ showUpdateBtn, setShowUpdateBtn ] = useState(false)

    // handle error
    const [ error, setError ] = useState('')

    //props for both the student and adviser
        //ADVISER: location is "components/Groups/GroupProgress.jsx"
        //STUDENT: location is "pages/Progress/Progress.jsx"
        const { group_id, progress_id, progressName } = props;

    const navigate = useNavigate()

    // Location of the data: "components/Progress/Task/Task.jsx"
    const openTaskCard = (id) => {
        const { _id, taskName, description, createdAt} = id;
        // link to navigate data
        navigate('/task', {
            state: {
                taskName: taskName,
                description: description,
                createdAt: createdAt,
                task_id: _id,
                group_id: group_id,
                progress_id: progress_id
            }
        })
    }

    // Dependency to fix date in a readable format
    const handleDate = (date) => {
        return formatDistance(new Date(date), new Date(), { addSuffix: true })
    }

    //reading query to database
    const [ count, setCount ] = useState('');
    const handleTaskGetRequest = async() => {
        const Auth = {
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
        }

        await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/progress/createtask/${group_id}`, Auth)
        .then((response) => {
            setError('')
            dispatch({ type: 'SET_TASK', payload: response.data })
            handlePercent(response.data);

        // catch error
        }).catch((error) => {
            if (error.response) {
                setError(error.response.data.error)
            }
        })
    }

    useEffect( () => {
        handleTaskGetRequest();
    }, []);


    // function that counts the percent
    const handlePercent = async(tasks) => {
        // count the task that is saved in what chapter
        const chapterTasks = await tasks.filter(task => task.progress_id === progress_id );
        const totalCount = chapterTasks.length;
        
        // check the value that of checkboxStatus === true
        const checkboxStatus = await chapterTasks.filter(task => task.checkboxStatus === true);
        const partialCount = checkboxStatus.length;

        // total percent for Chapter 1
        const total = (partialCount / totalCount ) * 100;
        setCount(Math.round(total));
    }

    const updatePercent = async() => {
         // update the progress percent to the database
         const Auth = {
            headers:{
              'Authorization': `Bearer ${user.token}`
            }
        }
        
        const countData = {
            percent: count
        }
    
        await Axios.patch(`${process.env.REACT_APP_DEV_BASE_URL}/adviser/update-progress/${progress_id}`, countData, Auth)
        .then((response) => { 
            // notification
            Toast(`The total percent of ${count} is UPDATED`, 'success');
            setError('')
        })
        .catch((error) => { 
            setError(error.response.data.error)
        })
    }

    // save the Done checkbox status
    const handleUndoneCheckboxStatus = async( _id, status, taskName) => {

        confirm({ title: `Do you want to uncheck this task: ${taskName}?`,
                description: `Please note that after uncheking the task: ${taskName}. You need to click the "update task" button that will pop up at the top left part!`,
                confirmationText: "Uncheck"
        }).then(async() => {

                //patch data
                const checkboxData = {
                    checkboxStatus: status,
                }

                // Auth token
                const Auth = {
                    headers:{
                    'Authorization': `Bearer ${user.token}`
                    }
                }

                // Update checkboxStatus to false
                await Axios.patch(`${process.env.REACT_APP_DEV_BASE_URL}/progress/createtask/${_id}`, checkboxData, Auth)
                .then((response) => { 
                    // notification
                    Toast(`${taskName} checkbox is UPDATED`, 'success');

                    handleTaskGetRequest()
                    setShowUpdateBtn(true)
                    setError()
                })
                .catch((error) => { 
                    setError(error.response.data.error)
                })

        // cancel confirmation       
        }).catch(() => {
        //Notification
            Toast(`You cancelled to uncheck task: "${taskName}"`, 'info');
        });
}

    // save the Done checkbox status
    const handleDoneCheckboxStatus = async( _id, status, taskName) => {

        confirm({ title: `Do you want to check this task: ${taskName}?`,
                description: `Please note that after cheking the task: ${taskName}. You need to click the "update task" button that will pop up at the top left part!`,
                confirmationText: "Check"
        }).then(async() => {
                //patch data
                const checkboxData = {
                    checkboxStatus: status,
                }

                // Auth token
                const Auth = {
                    headers:{
                    'Authorization': `Bearer ${user.token}`
                    }
                }

                // Update checkboxStatus to true
                await Axios.patch(`${process.env.REACT_APP_DEV_BASE_URL}/progress/createtask/${_id}`, checkboxData, Auth)
                .then((response) => { 
                    // notification
                    Toast(`${taskName} checkbox is UPDATED`, 'success');

                    handleTaskGetRequest() 
                    setShowUpdateBtn(true)
                    setError()
                })
                .catch((error) => {
                    setError(error.response.data.error)
                })

        // cancel confirmation       
        }).catch(() => {
        //Notification
            Toast(`You cancelled to check the task: "${taskName}"`, 'info');
        });
    
    }

    //delete query to database
    const deleteTask = async(id, taskName) => {

        confirm({ title: `Do you want to delete this task: ${taskName}?`,
                description: `Please note that this task: ${taskName} will be permanently removed. All the task files uploaded here will lost. We strongly suggest to download all the files before deleting!`,
                confirmationText: "Delete"
        }).then(async() => {
                // auth
                const Auth = {
                    headers:{
                    'Authorization': `Bearer ${user.token}`
                    }
                }   

                await Axios.delete(`${process.env.REACT_APP_DEV_BASE_URL}/progress/createtask/${id}`, Auth).then((response) => {
                    if(response.data){
                        // notification
                        Toast(`${taskName} is DELETED`, 'success');

                        setError('')
                        handleTaskGetRequest()
                        setShowUpdateBtn(true)
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
            Toast(`You cancelled the task: "${taskName}" deletion`, 'info');
        });
}
    

  return (
    <>
    <div className='task-popup'>
        <h4>Process: {count ? count : 0}%</h4> 
        {showUpdateBtn && 
            <button
                className='success'
                onClick={() => {
                    setShowUpdateBtn(false)
                    updatePercent()
                }}>
            Update Percent</button>}
    </div>
    <div className='task'>

        {tasks && tasks.filter(task => 
            task.progress_id === progress_id && task.chapter.toString().toLowerCase() === progressName.toLowerCase())
            .map((val, index) => {
                return(
                    <div className='card' key={index}>
                        <div className="header">
                            <h4>{val.checkboxStatus === true ? <span>Done:  </span> : null} {val.taskName}</h4> 
                            <p className='date'>{handleDate(val.createdAt)}</p>
                        </div>
                        <div className='hide-decsription'>
                            <p className='description'>{val.description}</p>
                        </div>
                            <div className="btn">
                                <button 
                                    onClick={() => {
                                        openTaskCard(val)
                                    }}>
                                View more</button>
                                {user.authorization === 'admin' &&
                                <>
                                    {val.checkboxStatus ? 
                                        <button 
                                            onClick={() => {
                                                const status = false
                                                handleUndoneCheckboxStatus(val._id, status, val.taskName)}}>
                                        Undone</button> 
                                    :
                                        <button 
                                            onClick={() => {
                                                const status = true
                                                handleDoneCheckboxStatus(val._id, status, val.taskName)}}>
                                        Done</button>
                                    }
                                        
                                    
                                        <button
                                        
                                        onClick={() => {
                                            deleteTask(val._id, val.taskName);
                                        }} 
                                        >Delete</button>

                                </>
                                }
                            </div>
                        </div>
                    )
                })}
            
        </div>
        {error ? <p className={error ? 'error' : ''}>{error}</p> : null}
        <ToastContainer/>
    </>
  )
}

export default ChapterCards