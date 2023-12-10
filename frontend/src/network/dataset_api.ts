import { Temperature } from "../models/temperature";


export async function getTemperature(): Promise<Temperature[]> {
    const response = await fetch("api/temps", { method: "GET"});
    if ( response.ok ) {
        return response.json();
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error("Request failed with status: " + response.status + "message" + errorMessage);
      }
    }