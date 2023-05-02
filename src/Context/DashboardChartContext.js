import { createContext, useReducer } from "react";

export const DashboardChartContext = createContext()

export const dashboardChartReducer = (state, action) => {
    switch (action.type) {
        //USER DASHBOARD
        // store all userDashboard
        case 'SET_USERDASHBOARD':
            return {
                userDashboards: action.payload
            }
        
        // create a new userDashboard
        case 'CREATE_USERDASHBOARD':
            return{
                    // spread the new userDashboards inside userDashboards
                          //NEW VALUE       // PREV VALUE
                userDashboards: [action.payload, ...state.userDashboards]
            }
        
        // delete a userDashboard
        case 'DELETE_USERDASHBOARD':
            return{
                         // filter the userDashboards     // Prev _id      // Delete _id 
                userDashboards: state.userDashboards.filter((c) => c._id !== action.payload._id)
            }
        
        //ADMIN DASHBOARD
        // store all adminDashboard
        case 'SET_ADMINDASHBOARD':
            return {
                adminDashboards: action.payload
            }
        
        // create a new adminDashboard
        case 'CREATE_ADMINDASHBOARD':
            return{
                    // spread the new adminDashboards inside adminDashboards
                          //NEW VALUE       // PREV VALUE
                adminDashboards: [action.payload, ...state.adminDashboards]
            }
        
        // delete a adminDashboard
        case 'DELETE_ADMINDASHBOARD':
            return{
                         // filter the adminDashboards     // Prev _id      // Delete _id 
                adminDashboards: state.adminDashboards.filter((c) => c._id !== action.payload._id)
            }
        
        //SUPER ADMIN DASHBOARD
        // store all superAdminDashboard
        case 'SET_SUPERADMINDASHBOARD':
            return {
                superAdminDashboards: action.payload
            }
        
        // create a new superAdminDashboard
        case 'CREATE_SUPERADMINDASHBOARD':
            return{
                    // spread the new superAdminDashboards inside superAdminDashboards
                          //NEW VALUE       // PREV VALUE
                superAdminDashboards: [action.payload, ...state.superAdminDashboards]
            }
        
        // delete a superAdminDashboard
        case 'DELETE_SUPERADMINDASHBOARD':
            return{
                         // filter the superAdminDashboards     // Prev _id      // Delete _id 
                superAdminDashboards: state.superAdminDashboards.filter((c) => c._id !== action.payload._id)
            }


        default:
            return state;
    }
}

export const DashboardChartContextProvider = ({ children }) => {
const [ state, dispatch ] = useReducer(dashboardChartReducer, {
    userDashboards: null,
    adminDashboards: null,
    superAdminDashboards: null
})

    return(
        <DashboardChartContext.Provider value={{ ...state, dispatch }}>
            { children }
        </DashboardChartContext.Provider>
    )
} 