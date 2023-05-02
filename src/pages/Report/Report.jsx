import React, { useState, useEffect} from 'react'
import './Report.css';
import Axios from "axios";

// useContext provider hook
import { useAuthContext } from '../../Hooks/Auth/useAuthContext';

//Notification
import { ToastContainer } from 'react-toastify';
import Toast from '../../components/Toast/Toast';

function Reports() {
  // error
  const [ error, setError ] = useState('')
  const [ error2, setError2 ] = useState('')

  // useContext provider hook
  const { user } = useAuthContext()

  //variable for report form
  const [reportBoxes, setReportBoxes] = useState([
    { id: 0, name: "Not helping with the deliverables", status: false },
    { id: 1, name: "Always not available", status: false },
    { id: 2, name: "Unable to reach out", status: false },
    { id: 3, name: "No calls, no show", status: false }
  ]);
  const [reportInput, setReportInput] = useState('');
  const [reportArray, setReportArray] = useState([]);

  const [ members, setMembers ] = useState(null);
  //reading query to database
  useEffect( () => {
    const Auth = {
        headers:{
          'Authorization': `Bearer ${user.token}`
        }
      }

    const response = async() => {
        await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/group/members/${user.group_id}`, Auth).then((response) => {
            if(response.data){
                setMembers(response.data)
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
  }, []);
  
  // Initialize an empty array for checked members
  const [checkedMembers, setCheckedMembers] = useState([]);

  // Function that stores the member ID and NAME
  const handleCheckboxChange = (memberId, memberName) => {
    // Check if the current member ID is already in the checkedMembers array
    const isChecked = checkedMembers.some((member) => member.id === memberId);

    if (isChecked) {
      // Remove the ID and NAME from the checkedMembers array if the checkbox is unchecked
      setCheckedMembers(
        checkedMembers.filter((member) => member.id !== memberId)
      );
    } else {
      // Add the member object to the checkedMembers array if the checkbox is checked
      setCheckedMembers([...checkedMembers, { id: memberId, name: memberName }]);
    }
  };
  
  // function when Report button is clicked
  const handleClick = () => {
      // 'reportBoxes' = count all status that is 'true'
      reportBoxes.forEach(function(obj) {
          const { status, name }= obj;
          if(status === true){
            reportArray.push({name});
          }
      })

    //posting query to database
    const createReport = async(input, options, members) => {
      // post request comment data
      const reportPostData = {
        input: input,
        optionArr: options,
        reportedMembersArr: members,
        group_id: user.group_id
      }

      // Auth headers
      const Auth = {
        headers:{
          'Authorization': `Bearer ${user.token}`
        }
      }

      // save the data to database
      await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/report`, reportPostData, Auth)
      .then((response) => {
          // notification
          Toast(`Your REPORT is saved`, 'success');

          // reset states
          setError('')

        // catch error
        }).catch((error) =>{
            if (error.response) {
                setError(error.response.data.error)
            } 
        })
    }


    const repArr = reportArray.length;
    const repMemArr = checkedMembers.length;
    // save to database when there is a value
    if( repMemArr > 0 && reportInput || repMemArr > 0 && repArr > 0  ){
      //calls the post functuin
      createReport(reportInput, reportArray, checkedMembers)

      console.log("Here is the report info: ", reportInput, reportArray, checkedMembers, user.group_id)
      setError2('')
    } else {
      setError2('Please fill in all the field!')
    }

      //reseting all the useState variables
      setReportBoxes([
        { id: 0, name: "Not helping with the deliverables", status: false },
        { id: 1, name: "Always not available", status: false },
        { id: 2, name: "Unable to reach out", status: false },
        { id: 3, name: "No calls, no show", status: false }
      ])
      setReportArray([]);
      setReportInput('');
      setCheckedMembers([])
  }

  return (
    <div className='reports'>
      <div className="message">
        <div className="options">

          <div className="check-list">
            <h2>Report a member</h2>

            {reportBoxes.map((eachProc) => {
              const { id, name, status } = eachProc;
                return (
                  <label key={id}>
                    <input
                      checked={status}
                      onChange={() => {
                        setReportBoxes((old) =>
                            old.map((item) => {
                                return (
                                    item.id === id ? { ...item, status: !status } : item)
                                })
                            );
                        }}
                      type="checkbox" 
                    />
                    {name}
                  </label>
                );
              })}

            <button
              onClick={() => {
                  handleClick()
                }
              }
              >Report 
            </button>
          </div>

          <div className="text-area">
            <label htmlFor="">
              Other reason:
            </label>

            <textarea 
              cols="30" rows="10" 
              placeholder='Enter your reasons here..'
              value={reportInput}
              onChange={(e) => {
                const value = e.target.value
                setReportInput(value);
              }}>
            </textarea>
          </div>
        </div>
         
      </div>
      
      <div className="members">
        <h3>Select the member</h3>

        { members ? members.map((member, index) => {
              const { _id, name } = member
              return(
                <>
                  <label key={index}>
                  <input 
                    type="checkbox" 
                    onChange={() => handleCheckboxChange(_id, name)}
                    checked={checkedMembers.some((member) => member.id === _id)}
                  />
                  {name}
                </label>
                </>
              )
            }) : null}

        {error ? <p className={error ? 'error' : ''}>{error}</p> : null}  
        {error2 ? <p className={error2 ? 'error' : ''}>{error2}</p> : null}   
      </div>
      <ToastContainer/>
    </div>
  )
}

export default Reports