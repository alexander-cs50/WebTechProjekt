import app from "./app";
import env from "./util/validateEnv";    
import mongoose from "mongoose";                                        
import fetchDataAndStore from "./middleware/fetchIoData";

const port = env.PORT; //get the port from the env file                                             

mongoose.connect(env.MONGO_CONNNECTION_STRING) //connect to the database                      
    .then(() => {                                                       
        console.log("Mongoose connected"); //log if the connection was successful                        
        setInterval(() => fetchDataAndStore(env.SENSOR_LINK1,"TemperaturSensor1"), 10000);
        setInterval(() => fetchDataAndStore(env.SENSOR_LINK2,"TemperaturSensor2"), 10000);
        setInterval(() => fetchDataAndStore(env.SENSOR_LINK3,"SchwingungsSensor1"), 10000);
        setInterval(() => fetchDataAndStore(env.SENSOR_LINK8,"LuftfeuchtigkeitsSensor1"), 10000);
        app.listen(port, () => {                                        
            console.log("Server running on port: " + port);             
        }); //start the server on the port from the env file
    })
    .catch(console.error); //catch errors from the database connection and log them

