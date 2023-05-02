import { useState, useEffect } from "react";
import { useGroupNamesContext } from "./useGroupNamesContext";
import Axios from "axios";

import { useAuthContext } from "../Auth/useAuthContext";

export const useGroupNames = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const [ signupGroupName, setSignupGroupName ] = useState(null);

    // Context Hooks
    const { groupNames, dispatch } = useGroupNamesContext()
    const { user } =  useAuthContext()

        
    //Group Names      
    const getGroupNames = async() => {
        setIsLoading(true)
        setError(null)

        const Auth = {
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
            }

        //logs all the group names
        await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/group`, Auth)
        .then((response) => {
            if(response.data){
                dispatch({ type: 'SET_GROUPNAMES', payload: response.data })
                setIsLoading(false)
            }

        // catch error
        }).catch((error) => {
            if (error.response) {
                setError(error.response.data.error)
                setIsLoading(false)
            } 
        })
    }

    useEffect(() => {
        if(user) {
            getGroupNames()
        }
    }, [])

    useEffect(() => {
            //Group Names
            const signupGroupNames = async() => {
                setIsLoading(true)
                setError(null)

                //logs all the group names
                await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/group/groupselection`)
                .then((response) => {
                    if(response.data){
                        setSignupGroupName(response.data )
                        setIsLoading(false)
                    }

                // catch error
                }).catch((error) => {
                    if (error.response) {
                        setError(error.response.data.error)
                        setIsLoading(false)
                    } 
                })
            }
        if(!user){
            signupGroupNames()
        }

    }, [])

    // this hooks returns:
    return { groupNames, signupGroupName }
}