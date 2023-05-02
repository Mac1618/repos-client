import { createContext, useReducer } from "react";
export const CommentsContext = createContext()

export const commentsReducer = (state, action) => {
    switch (action.type) {
        // store all comments
        case 'SET_COMMENTS':
            return {
                comments: action.payload
            }
        
        // create a new comment
        case 'CREATE_COMMENT':
            return{
                    // spread the new comments inside comments
                          //NEW VALUE       // PREV VALUE
                comments: [action.payload, ...state.comments]
            }
        
        // delete a comment
        case 'DELETE_COMMENT':
            return{
                         // filter the comments     // Prev _id      // Delete _id 
                comments: state.comments.filter((c) => c._id !== action.payload._id)
            }

        default:
            return state
    }
}

export const CommentsContextProvider = ({ children }) => {
const [ state, dispatch ] = useReducer(commentsReducer, {
    comments: null
})

    return(
        <CommentsContext.Provider value={{ ...state, dispatch }}>
            { children }
        </CommentsContext.Provider>
    )
} 