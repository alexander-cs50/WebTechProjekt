import axios from "axios";
import TemperatureModel from "../models/Temperature";
import HumidityModel from "../models/Humidity";
import VibrationModel from "../models/Vibration";

const fetchDataAndStore = async (link: string, cidname: string) => {
  try {
    const response = await axios.get(link); // fetch data from the link
    const data = response.data; // save the data from the link in the variable data
    const cid = cidname; // save the cid in the variable cid
    const datavalue = data.data.value; // save the value in the variable datavalue
    if (cidname === "TemperaturSensor1" || cidname === "TemperaturSensor2") { // if the cidname is TemperaturSensor1 or TemperaturSensor2
      const datavaluecleaned = convertHexToCelsiusSensor(datavalue); // convert the hex value to celsius
      const code = data.code;
      const newTemperatureData = await TemperatureModel.create({ // create a new TemperatureModel
        cid: cid,
        celsius: datavaluecleaned,
        code: code,
      }); // save the data in the database
      console.log(newTemperatureData); // log the data in the console
      console.log("Data fetched and stored successfully"); // log that the data was fetched and stored successfully
    }
    
    else if (cidname === "SchwingungsSensor1") { // if the cidname is SchwingungsSensor1
    const code = data.code; // save the code in the variable code
    const datavaluevRmscleaned = convertHexToVibrationSensor(datavalue, 0, 4, 0.0001); // convert the hex values
    const datavalueaPeakcleaned = convertHexToVibrationSensor(datavalue, 8, 12, 0.1);
    const datavalueaRMscleaned = convertHexToVibrationSensor(datavalue, 16, 20, 0.1);
    const datavaluecelsiuscleaned = convertHexToVibrationSensor(datavalue, 24, 28, 0.1);
    const datavalueacrestcleaned = convertHexToVibrationSensor(datavalue, 32, 36, 0.1);
    const newTemperatureData = await VibrationModel.create({ // create a new VibrationModel
      cid: cid,
      celsius: datavaluecelsiuscleaned,
      vRms:datavaluevRmscleaned,
      aPeak:datavalueaPeakcleaned,
      aRms:datavalueaRMscleaned,
      crest:datavalueacrestcleaned,
      code: code,
    }); // save the data in the database
    console.log(newTemperatureData); // log the data in the console
    console.log("Data fetched and stored successfully"); // log that the data was fetched and stored successfully
  } 
  else if (cidname === "LuftfeuchtigkeitsSensor1") { // if the cidname is LuftfeuchtigkeitsSensor1
    const datavaluehumcleaned = convertHexToHumiditySensorHumdity(datavalue); // convert the hex values
    const datavaluedegreescleaned = convertHexToHumiditySensorDegrees(datavalue);
    const code = data.code; // save the code in the variable code
    const newHumidityData = await HumidityModel.create({ // create a new HumidityModel
      cid: cid,
      humidity: datavaluehumcleaned,
      celsius: datavaluedegreescleaned,
      code: code,
    }); // save the data in the database
    console.log(newHumidityData); // log the data in the console
    console.log("Data fetched and stored successfully"); // log that the data was fetched and stored successfully
  }
} 
   catch (error) {
    console.error("Error fetching or storing data:", error);
  } // catch errors
};

function convertHexToCelsiusSensor(hexNr: string): number {
  const binNr: string = parseInt(hexNr, 16).toString(2) // convert to binary
  const celsiusBinNr: string = binNr.slice(0, -2); // remove the last 2 bits
  const decNr: number = parseInt(celsiusBinNr, 2); // convert to decimal
  const fahrenheit: number = decNr / 10; //divide by 10 (Steigung 0.1)
  const celsius: number = (fahrenheit - 32) * (5 / 9); // convert to celsius
  return Math.round(celsius * 10) / 10; // round to 1 decimal
}

function convertHexToHumiditySensorHumdity(hexNr: string): number {
  const shorthex: string = hexNr.slice(0, 4); // get the specified bits
  const binNr: string = parseInt(shorthex, 16).toString(2); // convert to binary
  const decNr: number = parseInt(binNr, 2); // convert to decimal
  return Math.round(decNr*0.1); // divide by 10 (Steigung 0.1)
}

function convertHexToHumiditySensorDegrees(hexNr: string): number {
  const shorthex: string = hexNr.slice(8, 12); // get the specified bits
  const binNr: string = parseInt(shorthex, 16).toString(2); // convert to binary
  const decNr: number = parseInt(binNr, 2); // convert to decimal
  return Math.round(decNr*0.1); // divide by 10 (Steigung 0.1)
}

function convertHexToVibrationSensor(hexNr: string, start: number, end: number, factor: number): number {
  const shorthex: string = hexNr.slice(start, end); // get the specified bits
  const binNr: string = parseInt(shorthex, 16).toString(2); // convert to binary
  const decNr: number = parseInt(binNr, 2); // convert to decimal
  return Math.round(decNr * factor); // divide by the factor (Steigung gleich factor)
}

export default fetchDataAndStore;
