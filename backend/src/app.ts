import "dotenv/config"; //for .env folder
import express from "express"; //import express
import temperatureRoutes from "./routes/temperatureroute";


const app = express(); 

app.use(express.json()); //This makes it so we send json files from our server to the DB

app.use("/api/temps", temperatureRoutes)

export default app; //expor the app const so we can import it in the server.ts
