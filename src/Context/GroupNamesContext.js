import { createContext, useReducer } from "react";

export const GroupNamesContext = createContext()

export const groupNamesReducer = (state, action) => {
    switch (action.type) {
        // store all groupNames
        case 'SET_GROUPNAMES':
            return {
                groupNames: action.payload
            }
        
        // create a new comment
        case 'CREATE_GROUPNAME':
            return{
                    // spread the new groupNames inside groupNames
                          //NEW VALUE       // PREV VALUE
                groupNames: [action.payload, ...state.groupNames]
            }
        
        // delete a comment
        case 'DELETE_GROUPNAME':
            return{
                         // filter the groupNames     // Prev _id      // Delete _id 
                groupNames: state.groupNames.filter((c) => c._id !== action.payload._id)
            }

        default:
            return state
    }
}

export const GroupNamesContextProvider = ({ children }) => {
const [ state, dispatch ] = useReducer(groupNamesReducer, {
    groupNames: null
})

    return(
        < GroupNamesContext.Provider value={{ ...state, dispatch }}>
            { children }
        </ GroupNamesContext.Provider>
    )
} 