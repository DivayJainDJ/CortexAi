import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/chat.routes.js"

dotenv.config()

const port = Number(process.env.PORT) || 3002

const app=express()
app.use(express.json())
app.use("/",router)
app.get("/",(req,res)=>{
    res.json({message:"hello from chat"})
})

app.listen(port, "0.0.0.0", () => {
    console.log(`chat started at ${port}`)
    connectDb().catch(err => console.error("DB connection failed:", err))
})

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err)
})
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err)
})
