import { useState, useEffect } from 'react'
import Axios from "axios";
import "./InputForm.css";

// Register hook
import { useAuthContext } from '../../Hooks/Auth/useAuthContext';

//react icons
import * as FaIcons from "react-icons/fa";
import * as MdICons from "react-icons/md";
import { IconContext } from 'react-icons';


function InputForm() {
  // useContext Hook
  const { dispatch } = useAuthContext()
  
  // useState
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState(null);
 
  //Form Data for Registration of student
  const [ formData, setFormData ] = useState({
    name: "",
    email: "",
    studentID: "",
    password: "",
    section: "",
    group_id: "",
    position:""
  })

  // onChange of every input
  const handleForm = (event) =>{    
    event.preventDefault()
    const { name, value } = event.target;

    setFormData(prevValue => {
      return {
        ...prevValue,
        [name]: value
      }
    });
  }

   //Group Names
   const [ signupGroupName, setSignupGroupName ] = useState(null);  
   const signupGroupNames = async() => {
       setError(null)
 
       //logs all the group names
       await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/group/groupselection`)
       .then((response) => {
           if(response.data){
               setSignupGroupName(response.data )
           }
 
       // catch error
       }).catch((error) => {
           if (error.response) {
               setError(error.response.data.error)
 
           } 
       })
   }

   useEffect(() => {
     async function fetchGroupNames() {
       await signupGroupNames();
     }
     fetchGroupNames();
   }, []);



  // onChange of Group select
  const [ selectedGroup, setSelectedGroup] = useState()
  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  }


  // onSubmit signup 
  const [ group_id, setGroup_Id ] = useState(null);
   const handleSubmit = async() => {
    setIsLoading(true);

    if(selectedGroup){
      signupGroupName.filter(prev => prev.groups === selectedGroup)
      .map((post) => {
        return setGroup_Id(post._id)
      })
    }
  
      // post request to signup users
      const registerUserData = {
          name: formData.name,
          email: formData.email,
          studentID: formData.studentID,
          password: formData.password,
          yearAndSection_id: formData.section,
          position:formData.position, 
          group_id: formData.group_id
      }
      
      // signing up user
      await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/user/signup`, registerUserData)
      .then((response) => {
          if(response.data) {
               // save the user to local storage
              localStorage.setItem('User', JSON.stringify(response.data))

              //update AuthContext
              dispatch({type: 'LOGIN', payload: response.data})
              setIsLoading(false)

              //reset useStates
              setFormData({
                name: "",
                email: "",
                studentID: "",
                password: "",
                section: "",
                groups: "",
                position:""
              })
              setSelectedSectionId('')
          }

      // catch error
      }).catch((error) =>{
          if (error.response) {
              setError(error.response.data.error)
              setIsLoading(false)
          } 
      })


  }


  
  // Logging all the Created sections
  const [ YearAndSection, setYearAndSectionList ] = useState(null)
  const showAllSections =  async() => {
    //saving the data
    await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/dean/year-and-sections`)
    .then((response) => {
        setYearAndSectionList(response.data)
        // clear and call
        setError('')
        
    // catch error
    }).catch((error) =>{
        if (error.response) {
            setError(error.response.data.error)
        } 
    })
  }
  useEffect(() => {
      showAllSections()
  },[])



  return (
    <>
    <IconContext.Provider value={{color: 'maroon'}}>
      <div className='inputformdata'>

          <div className='form-logo'>
            <FaIcons.FaUser size='20' className='logo'/>
            <input 
              name="name"
              value={formData.name}
              onChange={(event) => {
                handleForm(event)
              }}
              type='text' placeholder='Enter your name...'/>
          </div>

          <div className='form-logo'>
            <MdICons.MdEmail size='20' className='logo'/>
            <input 
              name='email'
              value={formData.email} 
              onChange={(event) => {
                handleForm(event)
              }}
              type='email' placeholder='Type your email...'/>
          </div>

          <div className='form-logo'>
            <FaIcons.FaAddressCard size='20' className='logo'/>
            <input 
              name="studentID"
              value={formData.studentID} 
              onChange={(event) => {
                handleForm(event)
              }}
              type='text' placeholder='Enter your student-ID...'/>
          </div>

          <div className='form-logo'>
            <FaIcons.FaLock size='20' className='logo'/>
            <input 
              name="password"
              value={formData.password} 
              onChange={(event) => {
                handleForm(event)
              }}
              type='password' placeholder='Enter your password...'/>
          </div> 
          
          <p><strong>Note:</strong> <em>Select your section first to filter the groups!</em></p>
          
          { YearAndSection && (
            <div className='data'>
                <label>Year and Section:</label>
                <select 
                  onChange={(event) => {
                    handleForm(event)
                    setSelectedSectionId(event.target.value)
                  }} 
                  name='section'>
                    <option value=''>Select options here</option>
                    { YearAndSection
                    .sort((a, b) => a.adviser.localeCompare(b.adviser))
                    .sort((a, b) => b.academicYear.localeCompare(a.academicYear)) 
                    .map((sections, index) => {
                      return(
                        <option 
                          value={sections._id}
                          key={index}  
                          style={{ whiteSpace: 'pre-wrap' }}> 
                            {`${sections.academicYear}\n
                              ${sections.section}
                            \n${sections.adviser}`}
                        </option>
                      )
                    })}
                </select>
            </div>
          )}

          {selectedSectionId &&
            <div>
              <label>Select your Team:</label>
              <select 
                onChange={(event) => {
                  handleForm(event)
                  handleGroupChange(event)
                }} 
                name="group_id">
                  <option value=''>Select options here</option>
                {signupGroupName
                  .filter(group => group.yearAndSection_id === selectedSectionId)
                  .map((prevValue, index) => {
                    const { groups, _id } = prevValue
                    return(
                          <option 
                            key={index}
                            value={_id}
                          >{groups}</option>
                    )
                })}
              </select>
          </div>}
            
            <div>
                <label >Select your position:</label>
                <select 
                  name="position" 
                  onChange={(event) => {
                    handleForm(event)
                  }}
                >
                  <option value=''>Select options here</option>
                  <option value="Programmer">Programmer</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Technical Writer">Technical Writer</option>
                  <option value="Database Designer">Database Designer</option>
                  <option value="UI Designer">UI Designer</option>
                </select>         
            </div>

              {error && <p className='error'>{error}</p>}

        </div>
        <button 
          disabled={isLoading}
          onClick={() => handleSubmit()}
        >Register Account</button>
      </IconContext.Provider>
    </>  
  )
}

export default InputForm