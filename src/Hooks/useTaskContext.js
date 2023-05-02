import { useContext } from "react";
import { TaskContext } from "../Context/TaskContext";


export const useTaskContext  = () => {
    const context = useContext( TaskContext )

    // if we dont have a value
    if(!context){
        throw Error('useTaskContext must be used inside an TaskContextProvider')
    }

    return context;
}