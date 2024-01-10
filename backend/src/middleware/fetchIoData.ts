import axios from "axios";
import TemperatureModel from "../models/Temperature";
import HumidityModel from "../models/Humidity";
import VibrationModel from "../models/Vibration";

const fetchDataAndStore = async (link: string, cidname: string) => {
  try {
    const response = await axios.get(link);
    const data = response.data;
    const cid = cidname;
    const datavalue = data.data.value;
    if (cidname === "TemperaturSensor1" || cidname === "TemperaturSensor2") {
      const datavaluecleaned = convertHexToCelsiusSensor(datavalue);
      const code = data.code;
      const newTemperatureData = await TemperatureModel.create({
        cid: cid,
        celsius: datavaluecleaned,
        code: code,
      });
      console.log(newTemperatureData);
      console.log("Data fetched and stored successfully");
    }
    
    else if (cidname === "SchwingungsSensor1") {
    const code = data.code;
    const datavaluevRmscleaned = convertHexToVibrationSensor(datavalue, 0, 4, 0.0001);
    const datavalueaPeakcleaned = convertHexToVibrationSensor(datavalue, 8, 12, 0.1);
    const datavalueaRMscleaned = convertHexToVibrationSensor(datavalue, 16, 20, 0.1);
    const datavaluecelsiuscleaned = convertHexToVibrationSensor(datavalue, 24, 28, 0.1);
    const datavalueacrestcleaned = convertHexToVibrationSensor(datavalue, 32, 36, 0.1);
    const newTemperatureData = await VibrationModel.create({
      cid: cid,
      celsius: datavaluecelsiuscleaned,
      vRms:datavaluevRmscleaned,
      aPeak:datavalueaPeakcleaned,
      aRms:datavalueaRMscleaned,
      crest:datavalueacrestcleaned,
      code: code,
    });
    console.log(newTemperatureData);
    console.log("Data fetched and stored successfully");
  } 
  else if (cidname === "LuftfeuchtigkeitsSensor1") {
    const datavaluehumcleaned = convertHexToHumiditySensorHumdity(datavalue);
    const datavaluedegreescleaned = convertHexToHumiditySensorDegrees(datavalue);
    const code = data.code;
    const newHumidityData = await HumidityModel.create({
      cid: cid,
      humidity: datavaluehumcleaned,
      celsius: datavaluedegreescleaned,
      code: code,
    });
    console.log(newHumidityData);
    console.log("Data fetched and stored successfully");
  }
}
   catch (error) {
    console.error("Error fetching or storing data:", error);
  }
};

function convertHexToCelsiusSensor(hexNr: string): number {
  const binNr: string = parseInt(hexNr, 16).toString(2)
  const celsiusBinNr: string = binNr.slice(0, -2); // remove the last 2 bits
  const decNr: number = parseInt(celsiusBinNr, 2); // convert to decimal
  const fahrenheit: number = decNr / 10; //divide by 10 (Steigung 0.1)
  const celsius: number = (fahrenheit - 32) * (5 / 9); // convert to celsius
  return Math.round(celsius * 10) / 10; // round to 1 decimal
}

function convertHexToHumiditySensorHumdity(hexNr: string): number {
  const binNr: string = parseInt(hexNr, 16).toString(2)
  const humdityBinNr: string = binNr.slice(0, 16); // get the first 16 bits
  const decNr: number = parseInt(humdityBinNr, 2); // convert to decimal
  return Math.round(decNr*0.1); // divide by 10 (Steigung 0.1)
}

function convertHexToHumiditySensorDegrees(hexNr: string): number {
  const binNr: string = parseInt(hexNr, 16).toString(2)
  const humdityBinNr: string = binNr.slice(32, 48); // get the bits from position 32 to 48
  const decNr: number = parseInt(humdityBinNr, 2); // convert to decimal
  return Math.round(decNr*0.1); // divide by 10 (Steigung 0.1)
}

function convertHexToVibrationSensor(hexNr: string, start: number, end: number, factor: number): number {
  const shorthex: string = hexNr.slice(start, end); // get the specified bits
  const binNr: string = parseInt(shorthex, 16).toString(2); // convert to binary
  const decNr: number = parseInt(binNr, 2); // convert to decimal
  return Math.round(decNr * factor); // divide by the factor (Steigung gleich factor)
}

export default fetchDataAndStore;
