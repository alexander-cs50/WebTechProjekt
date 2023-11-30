import { cleanEnv } from "envalid";                         // envalid can be used for cleaning and testing the environment variables i guess
import { port, str } from "envalid/dist/validators";        // there is a validation specifically for ports and for string, we import these here

export default cleanEnv(process.env, {                      //use the function to export our env variables
    MONGO_CONNNECTION_STRING: str(),
    PORT: port(),
    SESSION_SECRET: str(),
});