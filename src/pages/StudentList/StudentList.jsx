import React, { useState, useEffect } from 'react';
import './StudentList.css';
import Axios from "axios";

// Confirmation box
import { useConfirm } from "material-ui-confirm";

//react-icons
import * as FaIcons from "react-icons/fa";
import * as Io5Icons from "react-icons/io5";

//auth Context HOOK
import { useAuthContext } from '../../Hooks/Auth/useAuthContext'

//Notification
import { ToastContainer } from 'react-toastify';
import Toast from '../../components/Toast/Toast';


function StudentList() {
  const { user } = useAuthContext()
  const confirm = useConfirm();

  // useStates
  const [ accept, setAccept ] = useState(true);
  const [ pendings, setPendings ] = useState(null);
  const [ studentList, setStudentList ] = useState(null)
  const [ error, setError ] = useState('');

  // get all pending student
  const pendingUser = async() => {

    const Auth = {
      headers:{
        'Authorization': `Bearer ${user.token}`
      }
    }

    if(user){
      await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/user/pending`, Auth).then((response) => {
        if(response.data){
            setPendings(response.data)
            setError('')
        }

      // catch error
      }).catch((error) => {
          if (error.response) {
              setError(error.response.data.error)
          } 
      })
    }
  }

  useEffect(() => {
    pendingUser()
  }, [user])

  // get all registerd student
  const studentUser = async() => {
    const Auth = {
      headers:{
        'Authorization': `Bearer ${user.token}`
      }
    }

    await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/user/students`, Auth).then((response) => {
      if(response.data){
          setStudentList(response.data)
          setError('')
      }

    // catch error
    }).catch((error) => {
        if (error.response) {
            setError(error.response.data.error)
        } 
    })
  }

  useEffect(() => {
    studentUser();
  }, [user])

  // Accept a student
  const handleAcceptStudent = async(_id, name) => {

    confirm({ title: `Do you want to accept ${name}?`,
        description: `Please note that ${name} will be listed to your Officail list. This student will also joined his requested group!`,
        confirmationText: "Accept"
    }).then(async() => {
        
        // auth
        const data = {
          authorization: 'student'
        } 

        const Auth = {
          headers:{
            'Authorization': `Bearer ${user.token}`
          }
        }

        await Axios.patch(`${process.env.REACT_APP_DEV_BASE_URL}/user/pending/${_id}`, data, Auth)
        .then((response) => {
            // notification
            Toast(`You accepted ${name} as your student. The student via also be notified via email`, 'success');
            
            //reset state
            setError('')
            pendingUser()
            studentUser()

          // catch error
          }).catch((error) => {
              if (error.response) {
                  setError(error.response.data.error)
              } 
          })
    }).catch(() => {
        //Notification
        Toast(`You didn't accept ${name} account`, 'info');
    });
  }

  // Delete a pending student account
  const removePendingAccount = async(_id, name) => {

    confirm({ title: `Do you want to delete ${name} pending account?`,
        description: `Please note that if you delete ${name} account this wont show up anymore in the pending list and will permanently be removed!`,
        confirmationText: "Delete"
    }).then(async() => {
        // auth
        const Auth = {
          headers:{
            'Authorization': `Bearer ${user.token}`
          }
        }
      
        // delete request
        await Axios.delete(`${process.env.REACT_APP_DEV_BASE_URL}/user/pending/${_id}`, Auth )
        .then((response) => {
            setError('')
            pendingUser()

            // notification
            Toast(`You REMOVED ${name} from the pending accounts`, 'success');

        // catch error
        }).catch((error) => {
            if (error.response) {
                setError(error.response.data.error)
            }   
        })
    }).catch(() => {
        //Notification
        Toast(`${name} account is not archived`, 'info');
    });
  }

  // Delete a student account
  const removeStudentAccount = async(_id, name) => {

    confirm({ title: `Do you want to delete this student account: "${name}"?`,
            description: `Please note that ${name}'s account will permanently removed!`,
            confirmationText: "Delete"
    }).then(async() => {
        // auth
        const Auth = {
          headers:{
            'Authorization': `Bearer ${user.token}`
          }
        }
        
        // delete request
        await Axios.delete(`${process.env.REACT_APP_DEV_BASE_URL}/user/students/${_id}`, Auth )
        .then((response) => {
          // notification
          Toast(`You REMOVED ${name} from your official list of students`, 'success');
          studentUser()
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
        Toast(`${name} account deletion is cancelled`, 'info');
    });

  }

  return (
    <div className='student-list'>
      <div className='cont'>
        <span 
          className={accept ? 'active' : 'deactivate'} 
          onClick={() => {
          setAccept(true);
        }}>Official List</span>

        <span 
          className={accept ? 'deactivate' : 'active'} 
          onClick={() => {
          setAccept(false);
        }}>Pendings</span>

      {error && <div className='error'>{error}</div>}

      <table >
        <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Group Name</th>
              <th>Student ID</th>
              <th>Position</th>
              <th>Handler</th>
            </tr>
          </thead>

          <tbody>
          {accept ?  
            <>
              {studentList && studentList.map((students, index) => {
                const { _id, name, groupName, studentID, position, isArchived } = students
              if (!isArchived) {
              return(
                <tr>
                  <td key={index}>{index + 1}</td>
                  <td>{name}</td>
                  <td>{groupName}</td>
                  <td>{studentID}</td>  
                  <td>{position}</td>
                  <td>
                      <button 
                        onClick={() => removeStudentAccount(_id, name)} className='warning'>
                      <FaIcons.FaTrashAlt/></button>
                  </td>
                </tr>
                )}
               })
              }
            </> :  
            <>
              {pendings && pendings.map((prevUser, index) => {
                const { _id, name, groupName, studentID, position, isArchived } = prevUser
              return(
                <tr>
                  <td key={index}>{index + 1}</td>
                  <td>{name}</td>
                  <td>{groupName}</td>
                  <td>{studentID}</td>  
                  <td>{position}</td>
                  <td>
                    <button 
                      onClick={() => handleAcceptStudent(_id, name)} 
                      className='success'>
                      <Io5Icons.IoPersonAddSharp/>
                    </button> 

                    <button 
                      onClick={() => removePendingAccount(_id, name)} 
                      className='warning'>
                      <FaIcons.FaTrashAlt/>
                    </button>
                  </td>
                </tr>
                ) })
              }
            </>
          }
        </tbody>
      </table>

      </div>
      <ToastContainer />
    </div>
  )
}

export default StudentList