import React, {useState, useEffect} from 'react'
import "./ReportDetails.css";
import Axios from "axios";

// useContext provider hook
import { useAuthContext } from '../../../Hooks/Auth/useAuthContext';

//Notification
import { ToastContainer } from 'react-toastify';
import Toast from '../../Toast/Toast';

// Confirmation box
import { useConfirm } from "material-ui-confirm";



function ReportDetails(props) {
  // useContext provider hook
  const { user } = useAuthContext();
  const confirm = useConfirm();

  // error
  const [ error, setError ] = useState('')
  const [ reports, setReports ] = useState()

  // group id
  const group_id = props.group_id

  // get all report of adviser
  const getReports = async() => {
    // Auth headers
    const Auth = {
      headers:{
        'Authorization': `Bearer ${user.token}`
      }
    }

    await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/report/${group_id}`, Auth).then((response) => {
        if(response.data){
            // dispatch({ type: 'SET_REPORTS', payload: response.data })
            setReports(response.data)
            setError('')
        }

    // catch error
    }).catch((error) => {
        if (error.response) {
            setError(error.response.data.error)
        } 
    })
  }

  //reading query to database
  useEffect( () => {
      getReports();
  }, []);

  //delete query to database
  const deleteReport = async(id) => {

    confirm({ title: `Do you want to delete this report?`,
              description: `Please note that this report will be permanently removed!`,
              confirmationText: "Delete"
    }).then(async() => {
        // auth
        const Auth = {
          headers:{
            'Authorization': `Bearer ${user.token}`
          }
        }

        await Axios.delete(`${process.env.REACT_APP_DEV_BASE_URL}/report/${id}`, Auth).then((response) => {
          if(response.data){
              // notification
              Toast(`The report is DELETED`, 'success');

              getReports()
              // dispatch({type: 'DELETE_REPORT', payload: response.data})
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
        Toast(`You cancelled the report deletion`, 'info');
    });
  } 

  return (
    <>
      <div className="report-details">

      <table >
        <thead>
            <tr>
              <th>#</th>
              <th>Details</th>
              <th>Member name</th>
              <th>Additional reports</th>
              <th>Handler</th>
            </tr>
          </thead>
          <tbody>
          {reports && reports.map( (reports, index) => {
          const { _id, input, reportedMembersArr, optionArr} = reports;
          return(
            <tr key={index}>  
              <td>{index + 1}</td>
              <td>
                <ul>
                    <li>{input && input}</li>
                  </ul>
                </td>

              <td>
                <ul>
                    {reportedMembersArr && reportedMembersArr.map((members) => {
                      const {name} = members;
                      return(
                          <li>{name}</li>
                      )})}
                  </ul>
                </td>
                        
              <td>
                <ul>
                  {optionArr && optionArr.map((option) => {
                      const {name} = option;
                      return(         
                          <li>{name}</li>
                      )})}
                </ul>
              </td>
                
              <td>
                <button
                  onClick={() => {
                    deleteReport(_id)
                  }}
                   className='warning'
                >Delete</button>
              </td>
            </tr> 

              )
            })
          }
          
          </tbody>
        </table>

        {/* {reports && reports.map( (reports) => {
          const { _id, input, reportedMembersArr, optionArr} = reports;
          return(
              <div className='card' key={_id}>
                <h4>{input}</h4>
                <ul>
                  <h4>MEMBERS</h4>
                  {reportedMembersArr && reportedMembersArr.map((members) => {
                    const {name} = members;
                    return(
                        <li>{name}</li>
                    )})}
              </ul>

              <ul>
                <h4>OPTIONS</h4>
                {optionArr && optionArr.map((option) => {
                    const {name} = option;
                    return(         
                        <li>{name}</li>
                    )})}
              </ul>
                
                <button
                  onClick={() => {
                    deleteReport(_id)
                  }}
                >Delete</button>
              </div>
              )
            })
          } */}
              {/* <div className='card'>
                <h4>Report 1</h4>
                <button>Delete</button>
              </div> */}
      </div>
      {error ? <p className={error ? 'error' : ''}>{error}</p> : null}
      <ToastContainer/>
    </>
  )
}

export default ReportDetails