import React, { useState } from 'react'
import Axios from "axios";
import * as BsIcons from "react-icons/bs";

// Context
import { useAuthContext } from '../../../Hooks/Auth/useAuthContext';

// Confirmation box
import { useConfirm } from "material-ui-confirm";

//Notification
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toast from '../../Toast/Toast';

function ArchivedGroups(props) {
  const { user } = useAuthContext()
  const confirm = useConfirm();

  // store error
  const [ error, setError ] = useState('')

  // ADVISER: Location is "pages/Home/Home.jsx"
  const { showGroups, academicYear, searchBar } = props

  // Unrchive the group and all its students
const unarchiveGroup = async(id, groups) => {

  //stops the program if no user is found!
  if(!user) {
    return setError('You must be lgged in!')
  }

  confirm({ title: `Do you want to Unarchive ${groups}?`,
        description: `The memebers of this group: ${groups} can now access their accounts!`,
        confirmationText: "Unarchive"
  }).then(async() => {
      // post request comment data
      const archiveData = {
      }

      // auth
      const Auth = {
        headers:{
          'Authorization': `Bearer ${user.token}`
        }
      }

      //saving the data
      await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/adviser/unarchive-group/${id}`, archiveData, Auth)
      .then((response) => {
      props.handleGroups()

        // notification
        Toast(`${groups} is removed from group archive`, 'success');

        // clear and call
        setError('')

        // catch error
        }).catch((error) =>{
            if (error.response) {
                setError(error.response.data.error)
            } 
        })

  }).catch(() => {
      //Notification
      Toast(`You cancelled ${groups} from being unarchived`, 'info');
  });
}

  return (
    <> 
      {error && <div className='error'>{error}</div>}
      {showGroups && showGroups.group
        .filter(group => {
          return (
            group.academicYear === academicYear &&
            group.isArchived &&
            (searchBar === "" || group.groups.toLowerCase().includes(searchBar.toLowerCase()))
          )
        })
        .map(allGroup => {
          const { _id, groups, academicYear } = allGroup;
          return (
            <div className='card' key={_id}>
              <div className="card-header">
                <BsIcons.BsPeopleFill size='25' />
                <h2>{groups}</h2>
              </div>
              <h4>{academicYear}</h4>
              <div className='card-buttons'>
                <button 
                  onClick={() => {
                    unarchiveGroup(_id, groups);
                  }}
                >
                  Unarchive
                </button>
              </div>
            </div>
          )
        })}
    <ToastContainer />
    </>
  )
}

export default ArchivedGroups