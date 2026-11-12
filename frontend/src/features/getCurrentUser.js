
import api from "../../utils/axios"
import { auth } from "../../utils/firebase"

const getCurrentUser=async () => {
    // Firebase restores a persisted user asynchronously; wait for that before deciding.
    if(auth.authStateReady) await auth.authStateReady()
    if(!auth.currentUser) return null
    
    try {
        const {data}=await api.get("/api/me")
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

export default getCurrentUser