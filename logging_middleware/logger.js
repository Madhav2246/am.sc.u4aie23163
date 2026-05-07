const axios = require("axios");
const Log = async (stack, level, packageName, message) =>{
    try{
        const res = await axios.post("http://20.207.122.201/evaluation-service/logs",{
            stack,
            level,
            package: packageName,
            message
        }, {
            headers: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        });
        console.log("SUCCESS");
        console.log(res.data);
    } catch (err) {
        console.log("FULL ERROR:");
        if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
        } else {
            console.log(err.message);
        }
    }
};
module.exports = Log;
