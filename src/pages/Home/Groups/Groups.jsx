import React, { useState, useEffect } from 'react'
import './Groups.css'
import { useLocation } from 'react-router-dom';
import Axios from "axios";

//Notification
import { ToastContainer, toast } from 'react-toastify';
import Toast from '../../../components/Toast/Toast';

// Confirmation box
import { useConfirm } from "material-ui-confirm";

// components
import ReportDetails from '../../../components/Groups/ReportsDetails/ReportDetails';
import GroupMembers from '../../../components/Groups/GroupMembers/GroupMembers';
import GroupProgress from '../../../components/Groups/GroupProgress/GroupProgress';

// Context Hook
import { useAuthContext } from '../../../Hooks/Auth/useAuthContext';

function Groups() {
  const { user } = useAuthContext()
  const [ error, setError ] = useState('')
  const confirm = useConfirm();

  //react-router state
  // Location: pages/Home/Home.jsx
  const location = useLocation();
  const { group_id, groupName } = location.state
  
  const [members, setMembers] = useState(true);
  const [progress, setProgress] = useState(false);
  const [reports, setReports] = useState(false);

  //Progress
  const [ addProgress, setAddProgress ] = useState('');
  const [ progressList, setProgressList ] = useState('');

  // Group rename
  const [ renameGroup, setRenameGroup ] = useState('')
  const [ newGrouName, setNewGroupName ] = useState('')
  
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

  // function that handles adding new progress
  const handleAddProgress = async() => {

    // post request comment data
    const progressData = {
      progress: addProgress,
      group_id: group_id
    }

    const Auth = {
      headers:{
        'Authorization': `Bearer ${user.token}`
      }
    }

    //saving the data
    await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/adviser/progress`, progressData, Auth).then((response) => {
      // clear and call
      Toast(`${addProgress} added `, 'success');
      setAddProgress('')
      setError('')

    // catch error
    }).catch((error) =>{
        if (error.response) {
            setError(error.response.data.error)
        } 
    })

  }

  // rename a groupname
  const handleRenameGroup = async() => {

    confirm({ title: `Do you want to rename the group as ${renameGroup}?`,
              description: `This will rename the appointed group!`,
              confirmationText: "Rename"
    }).then(async() => {
      // post request comment data
      const progressData = {
        renameGroup: renameGroup,
        group_id: group_id
        }

        const Auth = {
          headers:{
            'Authorization': `Bearer ${user.token}`
          }
        }

        //saving the data
        await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/group/rename`, progressData, Auth).then((response) => {
          // clear and call
          Toast(`${renameGroup} is renamed `, 'success');
          setNewGroupName(renameGroup)
          setRenameGroup('')
          setError('')

        // catch error
        }).catch((error) =>{
            if (error.response) {
                setError(error.response.data.error)
            } 
        })

    //cancel confirmation
    }).catch(() => {
      //Notification
      Toast(`The group rename is cancelled`, 'info');
    });
  }


  const selector = () => {
    if (members === true) {
      return <GroupMembers group_id={group_id} />
    }

    if (progress === true) {
      return <GroupProgress group_id={group_id} />
    }

    if (reports === true) {
      return <ReportDetails group_id={group_id} />
    }
  }

  return (
    <div className="groups">
      
      <div className="content">
        <div className='content-nav'>
          <ul> 
            <li 
              className={members ? 'active-nav-link' : ''}
              onClick={() => {
                  setMembers(true);
                  setReports(false);
                  setProgress(false);
              } }>Members</li>

            <li
              className={progress ? 'active-nav-link' : ''}
              onClick={() => {
                  setProgress(true)
                  setMembers(false);
                  setReports(false);
              } }>Progress</li>

            <li 
              className={reports ? 'active-nav-link' : ''}
              onClick={() => {
                  setReports(true);
                  setMembers(false);
                  setProgress(false);
              } }
              >Reports</li>
          </ul>
        </div>
        {error && <div className='error'>{error}</div>}
        {selector()}

      </div>


      <div className="controll">
        <h2>{ newGrouName ? newGrouName : groupName }</h2>

        <div className='rename'>
          <label>Change Group name:</label>
          <div className="form">
            <input 
              onChange={(e) => setRenameGroup(e.target.value)}
              type="text" 
              placeholder={`Rename ${newGrouName ? newGrouName : groupName}...`} />
            <button
              onClick={() => handleRenameGroup()}
            >Rename</button>
          </div>
        </div>


        <h2>List of Progress</h2>

        <div className='rename'>
          <label>Create a progress</label>
          <div className="form">
            <input onChange={(e) => setAddProgress(e.target.value)} 
              value={addProgress}
              type="text" 
              placeholder='Enter progress name...' />
            <button onClick={handleAddProgress}>Add</button>
          </div>
        </div>

      </div>
      <ToastContainer />
    </div>
  )
}

export default Groups