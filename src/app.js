import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
const app=express();


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.json({}));
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser())

//import routes
import userRoutes from "./routes/user.routes.js"

//routes declaration
app.use("/api/v4/users",userRoutes);



export {app};