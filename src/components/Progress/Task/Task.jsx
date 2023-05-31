import React, { useState, useEffect } from 'react'
import './Task.css';

//dependencies
import Axios from "axios";
import download from 'downloadjs';
import { formatDistance } from 'date-fns'

//useContext hook
import { useAuthContext } from '../../../Hooks/Auth/useAuthContext';

//Notification
import { ToastContainer } from 'react-toastify';
import Toast from '../../Toast/Toast';

// Confirmation box
import { useConfirm } from "material-ui-confirm";

//react-router-dom
import { useLocation } from 'react-router-dom';

function Task() {
    const { user } = useAuthContext()
    const confirm = useConfirm();

    //react-router state
    const location = useLocation();

    // Location of the data: "components/Progress/Chapters/ChapterCards.jsx"
    const { task_id, group_id, progress_id } = location.state

    // Multer file upload
    const [ fileUpload, setFileUpload ] = useState(null)
    const [ error, setError ] = useState('')

    // Multer file upload
    const [ studentFileUpload, setStudentFileUpload ] = useState(null)
    const [ studentFiles, setStudentFiles ] = useState(null)
    const [ files, setFiles ] = useState(null)

    const onChangeFile = (e) => {
        setFileUpload(e.target.files[0])
    }
    
    const getStudentFiles = async() => {
        const Auth = {
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
        }
        await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/upload/student/${task_id}`, Auth).then((response) => {
            if(response.data){
                setStudentFiles(response.data.files)
                setError('')
            }
        // catch error
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data);
                setError(error.response.data)
            } 
        })
    }

    //reading query to database
    useEffect( () => {
        if(!studentFiles && location)
        getStudentFiles();
    }, [ user, location]);

    
    const getAdviserFiles = async() => {
        const Auth = {
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
        }
        await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/upload/${task_id}`, Auth).then((response) => {
            if(response.data){
                setFiles(response.data)
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
        if(!files && location){
            getAdviserFiles()
        }   
    }, [ user, location]);


    // Dependency to fix date in a readable format
    const handleDate = (date) => {
        return formatDistance(new Date(date), new Date())
    }

    // Adviser File Upload
    const handleFileUpload = async(e) => {
        e.preventDefault()

        if(fileUpload){
            const formData = {
                adviserTask: fileUpload,
                task_id: task_id,
                group_id: group_id,
                progress_id: progress_id
            }

        //posting query to database
        await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${user.token}`
            }
          })
            .then((response) => {
                // notification
                Toast(`Your file is UPLOADED`, 'success');

                getAdviserFiles()
                setError('')

            // catch error
            }).catch((error) =>{
                if (error.response) {
                    setError(error.response.data.error)
                } 
            })
        }else{
            setError('No file Found!')
        }
        // reset state
        setFileUpload(null)
    }
    // Adviser File Download
    const handleDownload = async(_id, path, mimetype, fileName) => {

        confirm({ title: `Do you want to download this revision: "${fileName}"?`,
                description: `Please note that by downloading this revision: "${fileName}". It will leave a time stamp and the file will be permanently deleted!`,
                confirmationText: "Download"
        }).then(async() => {

            // auth
            const Auth = {
                responseType: 'blob',
                headers:{
                'Authorization': `Bearer ${user.token}`
                }
            } 

            // get request
            await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/upload/single/${_id}`, Auth).then((response) => {
                if(response.data){
                    const split = path.split('\\');
                    const filename = split[split.length - 1];
                    setError('')
                    getAdviserFiles()

                    // notification
                    Toast(`Your file is DOWNLOADED and REMOVED from the server`, 'success');
                    
                    //downloadjs dependency
                    return download(response.data, filename, mimetype);
                } // catch error
            }).catch((error) => {
                if (error.response) {
                    setError(error.response.data.error)
                } 
            })

        // cancel confirmation       
        }).catch(() => {
            //Notification
            Toast(`You cancelled to download the revision: "${fileName}"`, 'info');
        });
    }

    //Adviser delete query to database
    const deleteFile = async(id, fileName) => {

        confirm({ title: `Do you want to delete this revision: "${fileName}"?`,
                description: `Please note that this revision: "${fileName}" will be permanently removed!`,
                confirmationText: "Delete"
        }).then(async() => {

            // auth
            const Auth = {
                headers:{
                'Authorization': `Bearer ${user.token}`
                }
            }

            // delete request   
            await Axios.delete(`${process.env.REACT_APP_DEV_BASE_URL}/upload/download/${id}`, Auth)
            .then((response) => {
                // remove the deleted file from the files state
                setFiles(files.filter(file => file._id !== id));
                setError('')

                // notification
                Toast(`Your file is DELETED`, 'success');

            // catch error
            }).catch((error) => {
                if (error.response) {
                    setError(error.response.data.error)
                } 
            })
        
        // cancel confirmation       
        }).catch(() => {
            //Notification
            Toast(`You cancelled to delete the revision: "${fileName}"`, 'info');
        });
    }

    // For student
    const onChangeStudentFile = (e) => {
        setStudentFileUpload(e.target.files[0])
    }

    //For student File Upload
    const handleStundentFileUpload = async(e) => {
        e.preventDefault()

        if(studentFileUpload){
            const formData = {
                studentTask: studentFileUpload,
                task_id: task_id,
                group_id: group_id,
                progress_id: progress_id
            }

        //posting query to database
        await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/upload/student/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${user.token}`
            }
          })
            .then((response) => {
                // notification
                Toast(`Your file is UPLOADED`, 'success');

                // reset state
                getStudentFiles()
                setError('')

            // catch error
            }).catch((error) =>{
                if (error.response) {
                    setError(error.response.data.error)
                } 
            })
        }else{
            setError('No file Found!')
        }
    }

    //For student File Download
    const handleStundentDownload = async(_id, path, mimetype, fileName) => {

        confirm({ title: `Do you want to download this revision: "${fileName}"?`,
                description: `Please note that by downloading this revision: "${fileName}". It will leave a time stamp and the file will be permanently deleted!`,
                confirmationText: "Download"
        }).then(async() => {

            // auth
            const Auth = {
                responseType: 'blob',
                headers:{
                'Authorization': `Bearer ${user.token}`
                }
            } 

            // get request
            await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/upload/student/download/${_id}`, Auth).then((response) => {
                if(response.data){
                    const split = path.split('\\');
                    const filename = split[split.length - 1];
                    getAdviserFiles()
                    setError('')

                    // notification
                    Toast(`Your file is DOWNLOADED and REMOVED from the server`, 'success');
                    
                    //downloadjs dependency
                    return download(response.data, filename, mimetype);
                } // catch error
            }).catch((error) => {
                if (error.response) {
                    setError(error.response.data.error)
                } 
            })

        // cancel confirmation       
        }).catch(() => {
            //Notification
            Toast(`You cancelled to download the file: "${fileName}"`, 'info');
        });
    }

    //delete query to database
    const deleteStundentFile = async(id, fileName) => {

        confirm({ title: `Do you want to delete this file: "${fileName}"?`,
                description: `Please note that this file: "${fileName}" will be permanently removed!`,
                confirmationText: "Delete"
        }).then(async() => {
            
            // auth
            const Auth = {
                headers:{
                'Authorization': `Bearer ${user.token}`
                }
            }

            // delete request
            await Axios.delete(`${process.env.REACT_APP_DEV_BASE_URL}/upload/student/${id}`, Auth).then((response) => {
                if(response.data){
                    // remove the deleted file from the files state
                    setStudentFiles(files.filter(file => file._id !== id));
                    setError('')

                    // notification
                    Toast(`Your file is DELETED`, 'success');
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
            Toast(`You cancelled the file deletion: "${fileName}"`, 'info');
        });
    }

 
  return (
    <div className='task-page'>
        <div className="description card">
            {location && <>
            <div className='header'>
                <h2>Chapter 1</h2>
                <h4>{location.state.taskName}</h4>
                <p className='date'>{handleDate(location.state.createdAt)}</p>
            </div>
            
            <div className="content">
                <h4>Task details</h4>
                <p>{location.state.description}</p>
            </div>
            </> }
        </div>
        
        {/* Target for firebase */}
        <div className="files">
            <div className="manuscript card">
                <h4>Manuscripts</h4>
                 {/* Shows the delete btn if the account is ADMIN */}
                
                <form className="form"
                    onSubmit={handleStundentFileUpload} 
                    >
                    
                {user.authorization === 'student' && <>
                        <input
                            onChange={onChangeStudentFile}
                            // filename="studentTask"
                            type="file" 
                            />
                        <button type='submit'> Submit</button>
                    </>}
                    
                </form>
                <div className='uploads'>
                <h4>Uploaded files</h4>
                    { studentFiles ? studentFiles.map((prevValue, index) => {
                        const { _id ,fileName, path, mimetype, deleted, createdAt} = prevValue;
                        return (
                            <div className='file-download' key={index}>
                                <p className='filename'>{fileName}</p>

                                <div className='download-file'>

                                {  user.authorization === 'admin' ?
                                    (deleted ? <p>{handleDate(createdAt)}</p> :
                                    <div
                                        className='download' 
                                        onClick={() => {
                                        handleStundentDownload(_id, path, mimetype, fileName)
                                    }}
                                    >download</div>) : null
                                }
                                </div>

                                <div className='delete-file'>
                                    <div
                                        onClick={() => {
                                            deleteStundentFile(_id, fileName);
                                        }} 
                                        className='warning'>
                                        delete
                                    </div>
                                </div>
                            </div>
                        )
                    }) : null
                    }
                </div>
     
            </div>
            
            {/* Multer save to localDisk */}
            <div className="revision card">
                <h4>Correction</h4>

                <form className="form"
                    onSubmit={handleFileUpload} 
                    encType="multipart/form-data">
                    
                {user.authorization === 'admin' && <>
                        <input
                            onChange={onChangeFile}
                            // filename="fileUpload"
                            type="file" 
                            />
                        <button type='submit'> Submit</button>
                    </>}
                    
                </form>
                <div className='uploads'>
                    <h4>Uploaded files</h4>

                    { files ? files.map((prevValue, index) => {
                        const { _id ,fileName, path , mimetype, deleted, createdAt} = prevValue;
                        return (
                            <div className='file-download' key={index}>
                                 <p className='filename'>{fileName}</p>
                                
                                <div className='download-file'>

                            {   user.authorization === 'student' ?
                                deleted ? <p>{handleDate(createdAt)}</p> : 
                                <div
                                    className='download' 
                                    onClick={() => {
                                    handleDownload(_id, path, mimetype, fileName)
                                }}
                                >download</div> : null
                            }

                                </div>
                                <div className='delete-file'>
                                {/* Shows the delete btn if the account is ADMIN */}
                                {user.authorization === 'admin' &&
                                    <div
                                        onClick={() => {
                                            deleteFile(_id, fileName);
                                        }} 
                                        className='warning'>
                                        delete
                                    </div>
                                }
                                </div>
                            </div>
                        )
                    }) : null }
                   
                </div>
                
            </div>
        </div>
        {error ? <p className='error'>{error}</p> : null}
        <ToastContainer/>
    </div>
  )
}

export default Task;