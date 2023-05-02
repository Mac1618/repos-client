import { createContext, useReducer } from "react";

export const TaskContext = createContext()

export const taskReducer = (state, action) => {
    switch (action.type) {
        // store all tasks
        case 'SET_TASK':
            return {
                tasks: action.payload
            }
        
        // create a new task
        case 'CREATE_TASK':
            return{
                    // spread the new task inside task
                          //NEW VALUE       // PREV VALUE
                tasks: [action.payload, ...state.tasks]
            }

        default:
            return state
    }
}

export const TaskContextProvider = ({ children }) => {
const [ state, dispatch ] = useReducer(taskReducer, {
    tasks: null
})

    return(
        <TaskContext.Provider value={{ ...state, dispatch }}>
            { children }
        </TaskContext.Provider>
    )
} 