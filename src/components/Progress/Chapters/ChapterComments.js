import React, { useState, useEffect } from 'react'
import Axios from "axios";

//react-icons
import * as FaIcons from "react-icons/fa";
import { format } from 'date-fns'

//Notification
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toast from '../../Toast/Toast';

// Confirmation box
import { useConfirm } from "material-ui-confirm";

// useContext provider hook
import { useCommentsContext } from '../../../Hooks/useCommentsContext';
import { useAuthContext } from '../../../Hooks/Auth/useAuthContext';


function ChapterComments(props) {
    const confirm = useConfirm();

    // Dependency to fix date in a readable format
    const handleDate = (date) => {
        return format(new Date(date), '	PPpp')
    }

    const [ createComment, setCreateComment ] = useState('');
    const [ error, setError ] = useState('')

    // useCommentsContext hook descructuring
    const { comments, dispatch } = useCommentsContext()
    const { user } = useAuthContext()


    //props for both the student and adviser
        //ADVISER: location is "components/Groups/GroupProgress.jsx"
        //STUDENT: location is "pages/Progress/Progress.jsx"
    const { group_id, progress_id, progressName } = props;


    // submit comment
    const handleSubmit = async() => {
        // Student comment
        if(user.authorization === 'student') {
            // post request comment data
            const commentData = {
               comment: createComment,
               chapter: progressName,
               progress_id: progress_id
           }

           const Auth = {
               headers:{
                 'Authorization': `Bearer ${user.token}`
               }
             }
   
           //posting query to database
           return await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/progress/comments/${group_id}`, commentData, Auth).then((response) => {
                // notification
                Toast(`Your comment is SAVED`, 'success');       

                dispatch({type: 'CREATE_COMMENT', payload: response.data})
                setError('')
                setCreateComment('')
   
           // catch error
           }).catch((error) =>{
               if (error.response) {
                   setError(error.response.data.error)
               } 
           })
       }

        //Adviser comment
        if(user.authorization === 'admin') {
            // post request comment data
            const commentData = {
                comment: createComment,
                chapter: progressName,
                progress_id: progress_id
            }

            const Auth = {
                headers:{
                  'Authorization': `Bearer ${user.token}`
                }
              }
    
            //posting query to database
            return await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/progress/comments/${group_id}`, commentData, Auth)
            .then((response) => {
                // notification
                Toast(`${createComment} is SAVED `, 'success'); 

                dispatch({type: 'CREATE_COMMENT', payload: response.data})
                setError('')
                setCreateComment('')
    
            // catch error
            }).catch((error) =>{
                if (error.response) {
                    setError(error.response.data.error)
                } 
            })
        }

    }

    //reading query to database
    useEffect( () => {
        const Auth = {
            headers:{
              'Authorization': `Bearer ${user.token}`
            }
          }

        const response = async() => {
            await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/progress/comments/${group_id}`, Auth).then((response) => {
                if(response.data){
                    dispatch({ type: 'SET_COMMENTS', payload: response.data })
                    setError('')
                }
            // catch error
            }).catch((error) => {
                if (error.response) {
                    setError(error.response.data.error)
                } 
            })
        }
        
        response();
    }, [ dispatch, user, group_id ]);

    //delete query to database
    const deleteComment = async(id) => {

        confirm({ title: `Do you want to this comment?`,
                description: `Please note that this comment will be permanently removed!`,
                confirmationText: "Delete"
        }).then(async() => {
                // auth
                const Auth = {
                    headers:{
                    'Authorization': `Bearer ${user.token}`
                    }
                }

                await Axios.delete(`${process.env.REACT_APP_DEV_BASE_URL}/progress/comments/${id}`, Auth).then((response) => {
                    if(response.data){
                        // notification
                        Toast(`Your comment is DELETED`, 'success');

                        dispatch({type: 'DELETE_COMMENT', payload: response.data})
                        setError('')
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
            Toast(`You cancelled this "comment" deletion`, 'info');
        });
    }

  return (
        <div className='comment'>
            <div className="comment-header">
                <h3>Comments</h3>
            </div>
            <div className="comments">
                {comments && comments.filter(post => {
                        if ( post.progress_id === progress_id && post.chapter.toString().toLowerCase() === progressName.toLowerCase()) {
                            return post;
                        } else{
                            return null;
                        }
                    }).map( (items, index) => {
                        const { _id, comment, username, userStatus, createdAt } = items 
                        // used to conditionally render the delete button.
                        const canDelete = (userStatus === 'student') ||
                            (userStatus === 'admin' && username === user.name );

                            return( 
                                <div className={userStatus === 'admin' ? 'adviser-comment chat-box' :'student-comment chat-box'} key={index}>
                                    <div className='header'>    
                                        <h4 className='user'>{username}</h4>    
                                        <p className='date'>{handleDate(createdAt)}</p> 

                                        {/* Delete button for adviser and student */}
                                        {canDelete && (
                                            <button
                                                onClick={() => {
                                                deleteComment(_id);
                                                }}
                                            >
                                                <FaIcons.FaTrashAlt className='delete-btn' color='red' />
                                            </button>
                                        )}
                                    </div>
                                    <p className='details'>{comment}</p>
                                </div>
                            )

                    })
                }

            </div>

            <div className='send'>
                    <textarea
                         onChange={ (e) => {
                            setCreateComment(e.target.value)
                        }}
                        type="text"
                        placeholder='Write a comment...' 
                        value={createComment}   
                        >
                        
                    </textarea>

                    <button 
                        onClick={() => {
                            handleSubmit()
                        }}
                        type="submit">Submit</button>
            </div>
            {error ? <p className={error ? 'error' : ''}>{error}</p> : null}
            <ToastContainer/>
    </div>
  )
}

export default ChapterComments