import { Temperature } from "../models/temperature";


export async function getTemperature(): Promise<Temperature[]> { //We make a new function and promise that it will return an array of Temperature
    const response = await fetch("api/temps", { method: "GET"}); //We make a new const and await the fetch of the data from the api
    if ( response.ok ) { //If the response is ok we return the response as json
        return response.json(); //We return the response as json
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error("Request failed with status: " + response.status + "message" + errorMessage);
      }
    }