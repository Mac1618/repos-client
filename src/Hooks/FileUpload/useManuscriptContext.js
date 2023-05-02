import { ManuscriptContext } from "../../Context/ManuscriptContext";
import { useContext } from "react";


export const useManuscriptContext  = () => {
    const context = useContext( ManuscriptContext )

    // if we dont have a value
    if(!context){
        throw Error('useManuscriptContext must be used inside an ManuscriptContextProvider')
    }

    return context;
}