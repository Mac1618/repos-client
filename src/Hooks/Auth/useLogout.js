import { useAuthContext } from "./useAuthContext"

export const useLogout = () => {
    const { dispatch } = useAuthContext()

    const logout = () => {
        // remove user to local storage
        localStorage.removeItem('User')

        // dispatch logout funtion
        dispatch({type: 'LOGOUT'}) 
    }

    return { logout }
}