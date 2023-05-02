import { createContext, useReducer } from "react";

export const ManuscriptContext = createContext()

export const manuscriptReducer = (state, action) => {
    switch (action.type) {
        // store all manuscripts
        case 'SET_MANUSCRIPT':
            return {
                manuscript: action.payload
            }
        
        // create a new manuscript
        case 'CREATE_MANUSCRIPT':
            return{
                    // spread the new manuscript inside manuscript
                          //NEW VALUE       // PREV VALUE
                manuscript: [action.payload, ...state.manuscript]
            }
        
        // delete a manuscript
        case 'DELETE_MANUSCRIPT':
            return{
                         // filter the manuscript     // Prev _id      // Delete _id 
                manuscript: state.manuscript.filter((c) => c._id !== action.payload._id)
            }

        default:
            return state
    }
}

export const ManuscriptContextProvider = ({ children }) => {
const [ state, dispatch ] = useReducer(manuscriptReducer, {
    manuscript: null
})

    return(
        <ManuscriptContext.Provider value={{ ...state, dispatch }}>
            { children }
        </ManuscriptContext.Provider>
    )
} 