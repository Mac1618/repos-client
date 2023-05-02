import React, { useState} from "react";
import { useAuthContext } from "./useAuthContext"
import Axios from "axios";


export const useLogin= () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()
    

    // Login user
    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)
        

        // post request to signup users
        const loginUserData = {
            email: email,
            password: password,
        }
        
        // signing up user
        await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/user/login`, loginUserData)
        .then((response) => {
            if(response.data) {
                 // save the user to local storage
                localStorage.setItem('User', JSON.stringify(response.data))

                //update AuthContext
                dispatch({type: 'LOGIN', payload: response.data})
                setIsLoading(false)
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
    return { login, error, isLoading }
}