import React, { useState, useEffect } from 'react'
import './FinalOutput.css'
import Axios from "axios";

//useContext Hooks
import { useAuthContext } from '../../../Hooks/Auth/useAuthContext';

//Notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toast from '../../../components/Toast/Toast';

// Confirmation box
import { useConfirm } from "material-ui-confirm";

// react icons
import * as MdIcons from "react-icons/md";


function FinalOutput() {
  const { user } = useAuthContext();
  const confirm = useConfirm();
 
  // Multer file upload
  const [ manuscriptUpload, setManuscriptUpload ] = useState(null)
  const [ abstractUpload, setAbstractUpload ] = useState(null)
  const [ title, setTitle ] = useState('')

  //Addtionals - Error
  const [ error, setError ] = useState('')

  //onChange to store file
  const onChangeManuscript = (e) => {
    setManuscriptUpload(e.target.files[0])
  }

  //onChange to store file
  const onChangeAbstract = (e) => {
    setAbstractUpload(e.target.files[0])
  }

  //Upload route to the database
  const handleManuscriptUpload = async() => {

    if(manuscriptUpload){
      // confirm dialog
      confirm({ title: `Do you want to upload this manuscript: ${title}?`,
              description: `Please note that if you uploaded this: ${title} you cant access the final output anymore. Inshort your done with the capstone!`,
              confirmationText: "Upload"
        }).then(async() => {
            const formData = new FormData()
            formData.append("manuscriptFile", manuscriptUpload);
            formData.append("manuscript", title);
            formData.append("manuscriptFile", abstractUpload);

            //posting query to database
            await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/upload/manuscript`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${user.token}`
              }
            })
              .then((response) => {
                  setError('')

                //Notification
                Toast(`Your manuscript and abstract are uploaded`, 'success');

                  //reset state
                  setManuscriptUpload(null)
                  setAbstractUpload(null)
                  setTitle('')

              // catch error
              }).catch((error) =>{
                  if (error.response) {
                    //Notification
                    Toast(`Your manuscript is not saved. Please try again`, 'error');
                    setError(error.response)
                  } 
              })

        // cancel confirmation       
        }).catch(() => {
          //Notification
            Toast(`You cancelled the "${title}" deletion`, 'info');
        });  
              
    }else{
      setError('No file Found!')
    }
  }

  
  return (
    <>
      
      <div className='finals'>
          <h2>Final Output</h2>

          <div className='form'>
              <div className='name'> 
                  <label>Capstone Title: </label>  
                  <input 
                    onChange={(e) => {setTitle(e.target.value)}}
                    type="text"
                    value={title} 
                    placeholder='File name...'/>

                    {error && <div className='error'>{error}</div>}

                  <button
                    onClick={handleManuscriptUpload} 
                    className='success'>Submit</button>
              </div>

              <div className='file'>
                  <label> Manuscript File</label>
                  <input type="file" onChange={onChangeManuscript}/>
                  <MdIcons.MdOutlineUploadFile className='file-logo-top' size={60} color={'maroon'}/>
              
                  <label> Abstract File</label>
                  <input type="file" onChange={onChangeAbstract}/>
                  <MdIcons.MdOutlineUploadFile className='file-logo-bottom' size={60} color={'maroon'}/>
              </div>
          </div>
          
          <ToastContainer />
      </div>
    </>
  )
}

export default FinalOutput;