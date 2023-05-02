import { GrammarContext } from "../Context/GrammarContext";
import { useContext } from "react";


export const useGrammarContext = () => {
    const context = useContext(GrammarContext)

    // if we dont have a value
    if(!context){
        throw Error('useGrammarContext must be used inside an GrammarContextProvider')
    }

    return context
}