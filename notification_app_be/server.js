require("dotenv").config();
const express=require("express");
const Log=require("../logging_middleware/logger");
const app=express();
app.get("/",async(req,res) =>{
    console.log(process.env.ACCESS_TOKEN);
    await Log(
        "backend",
        "info",
        "route",
        "Home route accessed"
    );
    res.send("Backend Running");
});
app.listen(3000,()=>{
    console.log("Server Started");
});