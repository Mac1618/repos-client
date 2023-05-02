import React, {useState, useEffect} from 'react'
import "./StudentAdvisee.css"

// Dependencies
import Axios from "axios";

//react-icons
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";

// COntext Hooks
import { useAuthContext } from '../../../Hooks/Auth/useAuthContext';

function StudentAdvisee(props) {
   const { user } = useAuthContext()
   const [ students, setStudents ] = useState(null)
   const [ deanStudents, setDeanStudents ] = useState(null)
   // const [ groups, setGroups ] = useState(null)
   
   const [ search, setSearch ] = useState('')
   const [ error, setError ] = useState('')

   //ADVISER: get all of this adviser students
   const handleStudent = async() => {
         const Auth = {
            headers:{
               'Authorization': `Bearer ${user.token}`
            }
         }

         await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/manageuser/adviser/students`, Auth).then((response) => {
            if(response.data){
               setStudents(response.data)
               setError('')
            }
         // catch error
         }).catch((error) => {
            if (error.response) {
               setError(error.response.data)
            } 
         })
   }

   useEffect( () => {
      if(user.authorization === 'admin'){
         handleStudent();
      }   
  }, []);

   //DEAN: get all of this adviser students
   const HandleDeanStudents = async() => {
         const Auth = {
            headers:{
               'Authorization': `Bearer ${user.token}`
            }
         }

         await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/manageuser/dean/students/${props.admin_id}`, Auth).then((response) => {
            if(response.data){
               setDeanStudents(response.data)
               setError('')
            }
         // catch error
         }).catch((error) => {
            if (error.response) {
               setError(error.response.data)
            } 
         })
   }
   
   useEffect( () => {
      if(user.authorization === 'superadmin'){
         HandleDeanStudents();
      }   
  }, []);

  return (
    <div className='student-advisee' >
        <div className="search">
            <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder='Search a something...'/>
            <button>Search</button>
        </div>

        <table >
        <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Group</th>
              <th>Position</th>
              <th>Student ID</th>
              <th>Section</th>
              {/* <th>Handler</th> */}
            </tr>
          </thead>

          <tbody>
            {students && students.filter(post => {
               if (search === '') {
                  return post;
               } else if (post.name.toLowerCase().includes(search.toLowerCase()) || 
                           post.groupName.toLowerCase().includes(search.toLowerCase()) ||
                           post.position.toLowerCase().includes(search.toLowerCase()) || 
                           post.studentID.toLowerCase().includes(search.toLowerCase()) ||
                           post.section.toLowerCase().includes(search.toLowerCase()) 
               ) {
                  return post;
               }
            }).map((stud, index) => {
              return(
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{stud.name}</td>
                  <td>{stud.groupName}</td>
                  <td>{stud.position}</td>
                  <td>{stud.studentID}</td>
                  <td>{stud.section}</td>
                  {/* <td>
                     <div className='btn'>
                        <button><AiIcons.AiFillEdit size={20} color='green'/></button>
                        <button><FaIcons.FaTrashAlt size={20} color='red'/></button>
                     </div>
                  </td> */}
                </tr>
                ) })
              }

               {deanStudents && deanStudents.filter(post => {
                     if (search === '') {
                        return post;
                     } else if (post.name.toLowerCase().includes(search.toLowerCase()) || 
                                 post.groupName.toLowerCase().includes(search.toLowerCase()) ||
                                 post.position.toLowerCase().includes(search.toLowerCase()) || 
                                 post.studentID.toLowerCase().includes(search.toLowerCase()) ||
                                 post.section.toLowerCase().includes(search.toLowerCase()) 
                     ) {
                        return post;
                     }
                  }).map((stud, index) => {
                  return(
                     <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{stud.name}</td>
                        <td>{stud.groupName}</td>
                        <td>{stud.position}</td>
                        <td>{stud.studentID}</td>
                        <td>{stud.section}</td>
                        {/* <td>
                           <div className='btn'>
                              <button><AiIcons.AiFillEdit size={20} color='green'/></button>
                              <button><FaIcons.FaTrashAlt size={20} color='red'/></button>
                           </div>
                        </td> */}
                     </tr>
                     ) })
                  }
         </tbody>
      </table>
      
    </div>
  )
}

export default StudentAdvisee