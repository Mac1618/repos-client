import React, { useState} from "react";
import { useAuthContext } from "./useAuthContext"
import Axios from "axios";

// GroupNames hook
import { useGroupNames } from "../../Hooks/GroupNames/useGroupNames";

export const useRegister = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    // store the selected group
    const [ groupData, setGroupData ] = useState(null);
    const [ group_id, setGroup_Id ] = useState(null);
    const { signupGroupName } = useGroupNames();

    

    // Register user
    const Signup = async (formData) => {
        setIsLoading(true)
        setError(null)
        
        
        if(formData.groups){
            signupGroupName.filter(prev => prev.groups === formData.groups)
            .map((post) => {
              return setGroupData(post.groups)
            })
          }

          if(formData.groups){
            signupGroupName.filter(prev => prev.groups === formData.groups)
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
            section: formData.section,
            position:formData.position, 
            groupID: groupData,
            group_id: group_id
        }
        
        console.log(registerUserData)
        // signing up user
        await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/user/signup`, registerUserData)
        .then((response) => {
            if(response.data) {
                 // save the user to local storage
                localStorage.setItem('User', JSON.stringify(response.data))

                //update AuthContext
                dispatch({type: 'LOGIN', payload: response.data})
                setIsLoading(false)
                setGroupData(null)
            }

        // catch error
        }).catch((error) =>{
            if (error.response) {
                setError(error.response.data.error)
                setIsLoading(false)
            } 
        })
    }


    

    // this hooks returns:
    return { Signup, signupGroupName, error, isLoading }
}