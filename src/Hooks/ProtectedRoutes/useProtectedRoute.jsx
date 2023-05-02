import { useAuthContext } from "../Auth/useAuthContext"

import { Outlet, Navigate } from "react-router-dom"

function ProtectedRoutes () {
    const { user } = useAuthContext()

        if(!user){
            return <Navigate to='/login' />
        }

        if(user) {
            if(user.authorization === 'pending'){
                return <Navigate to='/pending' />
            }

            return <Outlet />
        }
        
}

export default ProtectedRoutes;