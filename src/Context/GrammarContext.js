import { createContext, useReducer } from "react";

export const GrammarContext = createContext()

export const grammarReducer = (state, action) => {
    switch (action.type) {
        // store all Grammar
        case 'SET_GRAMMAR':
            return {
                grammars: action.payload
            }
        
        // create a new grammar
        case 'CREATE_GRAMMAR':
            return{
                    // spread the new grammars inside grammars
                          //NEW VALUE       // PREV VALUE
                grammars: [action.payload, ...state.grammars]
            }
        
        // delete a grammar
        case 'DELETE_GRAMMAR':
            return{
                         // filter the grammars     // Prev _id      // Delete _id 
                grammars: state.grammars.filter((c) => c._id !== action.payload._id)
            }

        default:
            return state
    }
}

export const GrammarsContextProvider = ({ children }) => {
const [ state, dispatch ] = useReducer(grammarReducer, {
    grammars: null
})

    return(
        <GrammarContext.Provider value={{ ...state, dispatch }}>
            { children }
        </GrammarContext.Provider>
    )
} 