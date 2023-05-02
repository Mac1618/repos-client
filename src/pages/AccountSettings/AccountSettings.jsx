import React, { useState, useEffect } from 'react'
import './AccountSettings.css';

// API
import Axios from "axios";

// User Context
import { useAuthContext } from '../../Hooks/Auth/useAuthContext';

// React Icons
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";

// Message
import { ToastContainer } from 'react-toastify';
import Toast from '../../components/Toast/Toast';

function AccountSettings() {
  const { user } = useAuthContext()
  const [ error, setError ] = useState('')

  // STUDENT
  const [ student, setStudent ] = useState(null);
  const handleStudentAccount = async() => {
    setStudent(null);

    const Auth = {
      headers:{
      'Authorization': `Bearer ${user.token}`
      }
    }

    //saving the data
    await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/account-settings/student`, Auth)
    .then((response) => {
        setStudent(response.data)

        // clear and call
        setError('')
        
    
    // catch error
    }).catch((error) =>{
        if (error.response) {
            setError(error.response.data.error)
        } 
    })
  }
  // ADVISER
  const [ adviser, setAdviser ] = useState(null);
  const handleAdviserAccount = async() => {
    setAdviser(null);

    const Auth = {
      headers:{
      'Authorization': `Bearer ${user.token}`
      }
    }

    //saving the data
    await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/account-settings/adviser`, Auth)
    .then((response) => {
        setAdviser(response.data)

        // clear and call
        setError('')
        
    
    // catch error
    }).catch((error) =>{
        if (error.response) {
            setError(error.response.data.error)
        } 
    })
  }
  // DEAN
  const [ dean, setDean ] = useState(null);
  const handleDeanAccount = async() => {
    setDean(null);

    const Auth = {
      headers:{
      'Authorization': `Bearer ${user.token}`
      }
    }

    //saving the data
    await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/account-settings/dean`, Auth)
    .then((response) => {
        setDean(response.data)

        // clear and call
        setError('')
        
    
    // catch error
    }).catch((error) =>{
        if (error.response) {
            setError(error.response.data.error)
        } 
    })
  }
  // YEAR AND SECTION
  const [ yearAndSection, setYearAndSection ] = useState(null)
  const handleYearAndSection = async() => {
    setYearAndSection(null); 

    const Auth = {
      headers:{
      'Authorization': `Bearer ${user.token}`
      }
    }

    //saving the data
    await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/account-settings/adviser/year-and-section`, Auth)
    .then((response) => {
        setYearAndSection(response.data)

        // clear and call
        setError('')
        
    // catch error
    }).catch((error) =>{
        if (error.response) {
            setError(error.response.data.error)
        } 
    })
  }

  // CALL THE FUNCTION
  useEffect(() => {
    // Student: Account 
    if(user.authorization === 'student' && !student){
      handleStudentAccount()
    } 

    //Adviser: Account 
    else if(user.authorization === 'admin' && !adviser){
      handleAdviserAccount()
    }

    //Dean: Account 
    else if(user.authorization === 'superadmin'){
      handleDeanAccount()
    }

    //Adviser: Year and Section 
    if(user.authorization === 'admin' && !yearAndSection){
      handleYearAndSection()
    }
  }, [])

  const [ activeYearAndSection, setActiveYearAndSection ] = useState();
  const handleActiveYearAndSection = async() => {

    //stops the program if no user is found!
    if(!user) {
      setError('You must be logged in!')
      return
    }

    // post request comment data
    const PostData = {
      yearAndSection_id: activeYearAndSection
    }

    const Auth = {
      headers:{
        'Authorization': `Bearer ${user.token}`
      }
    }

    //saving the data
    await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/account-settings/adviser/year-and-section/${activeYearAndSection}`, PostData, Auth)
      .then((response) => {
        // clear and call
          handleAdviserAccount()
          Toast(`Your Year and Section is activated `, 'success');
          setError('')

    // catch error
    }).catch((error) =>{
        if (error.response) {
            setError(error.response.data.error)
        } 
    })
  }
  return (
    <div className="profile-account">

        <h3>
          Your Profile
        </h3>
        <p>My Details</p>

        {student && student.map((account) => {
          const {name, position, email, adviser, section, status, group, student_id } = account;
          return(
            <>
              <div className="name">
                <span>
                  <FaIcons.FaUser size={50} />
                </span>
                <section>
                    <div>
                      <h4>{name}</h4>
                      <p>Name</p>
                    </div>
                </section>
              </div>

              <div className="info">
                <span>
                <MdIcons.MdDescription size={50}/>
                </span>
                <section>
                  <div className="details">
                    <div>
                      <h4>{section}</h4>
                      <p>Section</p>
                    </div>

                    <div>
                      <h4>{position}</h4>
                      <p>Position</p>
                    </div>

                    <div>
                      <h4>{group}</h4>
                      <p>Group</p>
                    </div>
                    
                    <div>
                      <h4>{email}</h4>
                      <p>Email</p>
                    </div>
                    
                    <div>
                      <h4>{adviser}</h4>
                      <p>Adviser</p>
                    </div>
                    
                    <div>
                      <h4>{student_id}</h4>
                      <p>Student Number</p>
                    </div>

                    <div>
                      <h4>{status}</h4>
                      <p>Access</p>
                    </div>
                  </div>
                </section>
              </div>
          </>
          ) 
        })}

        {adviser && adviser.map((account) => {
          const { name, email, status, activeSection, activeAcademicYear, totalPercent } = account;
          return (
            <>
              <div className="name">
                <span>
                  <FaIcons.FaUser size={50} />
                </span>
                <section>
                    <div>
                      <h4>{name}</h4>
                      <p>Name</p>
                    </div>
                </section>
              </div>

              <div className="info">
                <span>
                <MdIcons.MdDescription size={50}/>
                </span>
                <section>

                  <div className="details">

                    <div>
                      <h4>{activeSection}</h4>
                      <p>Current Active: Section</p>
                    </div>

                    <div>
                      <h4>{activeAcademicYear}</h4>
                      <p>Current Active: Academic Year</p>
                    </div>

                    <div>
                      <h4>{email}</h4>
                      <p>Email</p>
                    </div>

                    <div>
                      <h4>{status}</h4>
                      <p>Access</p>
                    </div>
                  </div>
                </section>
              </div>
          </>
          )
        })}
        
        {dean && dean.map((account) => {
          const { name, email, status } = account;
          return(
            <>
              <div className="name">
                <span>
                  <FaIcons.FaUser size={50} />
                </span>
                <section>
                    <div>
                      <h4>{name}</h4>
                      <p>Name</p>
                    </div>
                </section>
              </div>

              <div className="info">
                <span>
                <MdIcons.MdDescription size={50}/>
                </span>
                <section>

                  <div className="details">

                    <div>
                      <h4>{email}</h4>
                      <p>Email</p>
                    </div>

                    <div>
                      <h4>{status}</h4>
                      <p>Access</p>
                    </div>

                  </div>
                </section>
              </div>
          </>
          )
        })}

        {error && <div className='error'>{error}</div>}
        
        {yearAndSection && <>
          <div className="year-and-section">
            <h3>Select here your Year and section: </h3>

            <div className='options'>
              <label htmlFor="">Year and Section</label>
              <select
                onChange={(e) => setActiveYearAndSection(e.target.value)}
              >
                <option value=''>Select options here</option>
              {yearAndSection
                .sort((a, b) => a.academicYear.localeCompare(b.academicYear)) // Sort by academicYear
                .map((list) => {
                  const { section, academicYear, _id} = list
                  return(
                    <option value={_id}>{`${section}   ${academicYear}`}</option>
                  )
              })}

              </select>
              
              <span
                onClick={() => handleActiveYearAndSection()}
              >Activate</span>
            </div> 
          </div>
        </>}
        <ToastContainer />
    </div>    
  )
}

export default AccountSettings