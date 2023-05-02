import React, { useState, useEffect } from 'react'
import "./GroupAdvisee.css"
// Dependencies
import Axios from "axios";

//react-icons
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";

// COntext Hooks
import { useAuthContext } from '../../../Hooks/Auth/useAuthContext';

function GroupAdvisee(props) {
   const { user } = useAuthContext()
   const [ groups, setGroups ] = useState(null)
   const [ deanGroups, setDeanGroups ] = useState(null)

   const [ error, setError ] = useState('')
   const [ search, setSearch ] = useState('')
 
   //from managestudent parent file
   const {admin_id} = props

   //ADVISER: reading query to database
    const handleGroups = async() => {
        const Auth = {
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
        }

        await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/manageuser/adviser/groups`, Auth).then((response) => {
            if(response.data){
                // dispatch({ type: 'SET_FILES', payload: response.data })
                setGroups(response.data)
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
            handleGroups();
        }   
    }, []);

    //DEAN: reading query to database
    const handleDeanGroups = async() => {
        const Auth = {
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
        }

        await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/manageuser/dean/groups/${admin_id}`, Auth).then((response) => {
            if(response.data){
                // dispatch({ type: 'SET_FILES', payload: response.data })
                setDeanGroups(response.data)
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
            handleDeanGroups();
        }   
    }, []);

  return (
    <div className='group-advisee' >
        <div className="search">
            <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder='Search a something...'/>
            <button>Search</button>
        </div>

        
        <table >
            <thead>
                <tr>
                <th>#</th>
                <th>Name</th>
                <th>Average</th>
                <th>Academic Year</th>
                {/* <th>Handler</th> */}
                </tr>
            </thead>

            <tbody>
                {groups && groups.filter(post => {
                    if (search === '') {
                        return post;
                    } else if (post.groups.toLowerCase().includes(search.toLowerCase()) ||
                                post.academicYear.toLowerCase().includes(search.toLowerCase()) ||
                                post.totalAveragePercent.toLowerCase().includes(search.toLowerCase())
                    ) {
                        return post;
                    }
                }).map((group, index) => {
                    return(
                        <tr>
                            <td key={index}>{index + 1}</td>
                            <td>{group.groups}</td>
                            <td>{group.totalAveragePercent}%</td>
                            <td>{group.academicYear}</td>
                            {/* <td>
                                <div className='btn'>
                                    <button><AiIcons.AiFillEdit size={20} color='green'/></button>
                                    <button><FaIcons.FaTrashAlt size={20} color='red'/></button>
                                </div>
                            </td> */}
                        </tr>
                        ) })
                }
                
                
                { deanGroups &&  deanGroups.filter(post => {
                    if (search === '') {
                        return post;
                    } else if (post.groups.toLowerCase().includes(search.toLowerCase()) ||
                                post.academicYear.toLowerCase().includes(search.toLowerCase()) ||
                                post.totalAveragePercent.toLowerCase().includes(search.toLowerCase())
                    ) {
                        return post;
                    }
                    }).map((group, index) => {
                    return(
                        <tr>
                                <td key={index}>{index + 1}</td>
                                <td>{group.groups}</td>
                                <td>{group.totalAveragePercent}%</td>
                                <td>{group.academicYear}</td>
                                {/* <td>
                                    <div className='btn'>
                                        <button><AiIcons.AiFillEdit size={20} color='green'/></button>
                                        <button><FaIcons.FaTrashAlt size={20} color='red'/></button>
                                    </div>
                                </td> */}
                            </tr>
                    )
                    }) }
            </tbody>
        </table>
    </div>
  )
}

export default GroupAdvisee