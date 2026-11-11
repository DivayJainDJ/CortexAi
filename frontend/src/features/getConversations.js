import api from "../../utils/axios"
import { auth } from "../../utils/firebase"

export const getConversations=async () => {
    if(!auth.currentUser) return []
    try {
        const {data}=await api.get("/api/chat/get-conversations")
        return data
    } catch (error) {
        console.log(error)
        return []
    }
}