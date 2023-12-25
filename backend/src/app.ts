import "dotenv/config"; //for .env folder
import express, { NextFunction, Request, Response } from "express"; //import express
import temperatureRoutes from "./routes/temperatureroute";
import createHttpError, { isHttpError } from "http-errors";


const app = express();

app.use(express.json()); //This makes it so we send json files from our server to the DB

app.use("/api/temps", temperatureRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));  //Error handling via the http-errors package
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  //global error handling middleware                             //moves error handling from a try catch stateent into a the error handler of express

  let errorMessage = "An Unknown error occurred"; //create variable errorMessage with a default String, this can be cahnged by the error itself
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  } //We have to verify if the error is actually an error, because the catch function catches everythign unknown
  res.status(statusCode).json({ error: errorMessage }); //give out a error response and includes the error Message as Json
  console.error(statusCode +": " +  errorMessage); //prints the error into the console
});

export default app; //expor the app const so we can import it in the server.ts
