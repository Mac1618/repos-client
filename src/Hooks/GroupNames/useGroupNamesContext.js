import { GroupNamesContext } from "../../Context/GroupNamesContext";
import { useContext } from "react";


export const useGroupNamesContext = () => {
    const context = useContext(GroupNamesContext)

    // if we dont have a value
    if(!context){
        throw Error('useGroupNamesContext must be used inside an GroupNamesContextProvider')
    }

    return context
}