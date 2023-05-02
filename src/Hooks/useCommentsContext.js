import { CommentsContext } from "../Context/Progress/CommentsContext";
import { useContext } from "react";


export const useCommentsContext = () => {
    const context = useContext(CommentsContext)

    // if we dont have a value
    if(!context){
        throw Error('useCommentsContext must be used inside an CommentsContextProvider')
    }

    return context
}