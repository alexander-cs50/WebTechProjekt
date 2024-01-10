import "dotenv/config"; //for .env folder
import express, { NextFunction, Request, Response } from "express"; //import express
import Routes from "./routes/routes";
import createHttpError, { isHttpError } from "http-errors";

const app = express(); //create an express app

app.use(express.json()); //This makes it so we send json files from our server to the DB

app.use("/api/sensor", Routes); //This is the route for the api, we use the Routes const from routes.ts

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));  //Error handling via the http-errors package
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => { 
//This is the global error handling middleware, it will be called if there is an error in the code

  let errorMessage = "An Unknown error occurred"; //default error message
  let statusCode = 500; //default status code
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  } //if the error is a http error, we will use the status code and message from the error
  res.status(statusCode).json({ error: errorMessage }); //send the error message and status code to the client
  console.error(statusCode +": " +  errorMessage); //log the error in the console
});

export default app; //export the app so we can use it in server.ts


