import { DashboardChartContext } from "../Context/DashboardChartContext"; 
import { useContext } from "react";


export const useDashboardChartContext = () => {
    const context = useContext(DashboardChartContext)

    // if we dont have a value
    if(!context){
        throw Error('useDashboardChartContext must be used inside an DashboardChartContextProvider')
    }

    return context
}