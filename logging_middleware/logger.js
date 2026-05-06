const axios = require("axios");
const Log=async(stack,level,packageName,message)=>{
    try{

        const response=await axios.post(
            "http://20.207.122.201/evaluation-service/logs",

            {
                stack,
                level,
                package: packageName,
                message
            },
            {
                headers:{
                    Authorization:`Bearer ${process.env.ACCESS_TOKEN}`
                }
            }
        );
        console.log("SUCCESS");
        console.log(response.data);
    }catch (error){
        console.log("FULL ERROR:");
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
        }else{
            console.log(error.message);
        }
    }
};

module.exports = Log;