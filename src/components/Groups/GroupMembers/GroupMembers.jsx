import React, { useState, useEffect } from 'react'
import './GroupMembers.css';

import Axios from "axios";
import { useAuthContext } from '../../../Hooks/Auth/useAuthContext';

function GroupMembers(props) {
  const [ error, setError ] = useState('');
  const [ members, setMembers ] = useState(null);

  const { group_id } = props
  const { user } = useAuthContext()
  

    //reading query to database
    useEffect( () => {
      const Auth = {
          headers:{
            'Authorization': `Bearer ${user.token}`
          }
        }

      const response = async() => {
          await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/group/members/${group_id}`, Auth).then((response) => {
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

  return (
    <div className="group-members">

            { members ? members.map((member, index) => {
              const { name } = member
              return(
                <div className='card' key={index}>
                  <h4>{name}</h4>
                </div>
              )
            }) : null}
        </div>
  )
}

export default GroupMembers