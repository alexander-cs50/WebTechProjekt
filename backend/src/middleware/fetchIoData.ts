import axios from "axios";
import TemperatureModel from "../models/Temperature";
import HumidityModel from "../models/Humidity";

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
    const datavaluecleanedHum = (datavalue);
    const code = data.code;
    const datavaluecelsiuscleaned = convertHexToVibrationSensorTemp(datavalue);
    const datavaluevRmscleaned = convertHexToVibrationSensorvRms(datavalue);
    const datavalueaPeakcleaned = convertHexToVibrationSensoraPeak(datavalue);
    const datavalueaRMscleaned = convertHexToVibrationSensoraRms(datavalue);
    const datavalueacrestcleaned = convertHexToVibrationSensorCrest(datavalue);
    const newTemperatureData = await TemperatureModel.create({
      cid: cid,
      celsius: datavaluecelsiuscleaned,
      vRms:datavaluevRmscleaned,
      aPeak:datavalueaPeakcleaned,
      aRMs:datavalueaRMscleaned,
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
  const binNr: string = parseInt(hexNr, 16).toString(2).padStart(64, '0'); // pad with leading zeros
  const celsiusBinNr: string = binNr.slice(0, -2); // remove the last 2 bits
  const decNr: number = parseInt(celsiusBinNr, 2);
  const fahrenheit: number = decNr / 10;
  const celsius: number = (fahrenheit - 32) * (5 / 9);
  return Math.round(celsius * 10) / 10;
}

function convertHexToHumiditySensorHumdity(hexNr: string): number {
  const binNr: string = parseInt(hexNr, 16).toString(2).padStart(64, '0'); // pad with leading zeros
  const humdityBinNr: string = binNr.slice(0, 16); // get the first 16 bits
  const decNr: number = parseInt(humdityBinNr, 2);
  return Math.round(decNr*0.1);
}

function convertHexToHumiditySensorDegrees(hexNr: string): number {
  const binNr: string = parseInt(hexNr, 16).toString(2).padStart(64, '0'); // pad with leading zeros
  const humdityBinNr: string = binNr.slice(32, 48); // get the bits from position 32 to 48
  const decNr: number = parseInt(humdityBinNr, 2);
  return Math.round(decNr*0.1);
}

function convertHexToVibrationSensorvRms(hexNr: string): number {
  const binNr: string = parseInt(hexNr, 16).toString(2).padStart(64, '0'); // pad with leading zeros
  const humdityBinNr: string = binNr.slice(0, 16); // get the bits from position 32 to 48
  const decNr: number = parseInt(humdityBinNr, 2);
  return Math.round(decNr*0.0001);
}

function convertHexToVibrationSensoraPeak(hexNr: string): number {
  const binNr: string = parseInt(hexNr, 16).toString(2).padStart(64, '0'); // pad with leading zeros
  const humdityBinNr: string = binNr.slice(32, 48); // get the bits from position 32 to 48
  const decNr: number = parseInt(humdityBinNr, 2);
  return Math.round(decNr*0.1);
}

function convertHexToVibrationSensoraRms(hexNr: string): number {
  const binNr: string = parseInt(hexNr, 16).toString(2).padStart(64, '0'); // pad with leading zeros
  const humdityBinNr: string = binNr.slice(64, 80); // get the bits from position 32 to 48
  const decNr: number = parseInt(humdityBinNr, 2);
  return Math.round(decNr*0.1);
}

function convertHexToVibrationSensorTemp(hexNr: string): number {
  const binNr: string = parseInt(hexNr, 16).toString(2).padStart(64, '0'); // pad with leading zeros
  const humdityBinNr: string = binNr.slice(96, 112); // get the bits from position 32 to 48
  const decNr: number = parseInt(humdityBinNr, 2);
  return Math.round(decNr*0.1);
}

function convertHexToVibrationSensorCrest(hexNr: string): number {
  const binNr: string = parseInt(hexNr, 16).toString(2).padStart(64, '0'); // pad with leading zeros
  const humdityBinNr: string = binNr.slice(128, 144); // get the bits from position 32 to 48
  const decNr: number = parseInt(humdityBinNr, 2);
  return Math.round(decNr*0.1);
}

export default fetchDataAndStore;
