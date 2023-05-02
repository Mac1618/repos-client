import { createContext, useReducer, useEffect } from "react";
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        // Login a user
        case 'LOGIN':
            return { user: action.payload }
        
        // Logout a user
        case 'LOGOUT':
            return{ user: null }

        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
const [ state, dispatch ] = useReducer( authReducer, {
    user: null
})

    //render only once when the AuthContextProvider run
    useEffect(() => {
        // store the user data from localstorage 
        const user = JSON.parse(localStorage.getItem('User'))

        // check if the user has a value
        if (user) {
            const decodedToken = jwtDecode(user.token)
            // if the token is expired then logout the user
            if (decodedToken.exp * 1000 < Date.now()) { // Check if token is expired
                dispatch({ type: 'LOGOUT' })
                localStorage.removeItem('token')
            }
            // if the token is NOT expired then log in the user
            else{
                dispatch({type: 'LOGIN', payload: user})
            }
        }
    }, [])


    console.log("AuthContext: ", state)
    return(
        < AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </ AuthContext.Provider>
    )
} 