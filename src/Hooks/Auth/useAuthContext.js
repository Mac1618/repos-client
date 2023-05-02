import { AuthContext } from "../../Context/AuthContext";
import { useContext } from "react";


export const useAuthContext = () => {
    const context = useContext(AuthContext)

    // if we dont have a value
    if(!context){
        throw Error('useAuthContext must be used inside an AuthContextProvider')
    }

    return context
}