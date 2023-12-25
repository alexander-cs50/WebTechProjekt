import axios from 'axios';
import TemperatureModel from "../models/Temperature";

const fetchDataAndStore = async () => {
  try {
    const response = await axios.get('http://192.168.178.36/iolinkmaster/port[1]/iolinkdevice/pdin/getdata');
    const data = response.data;
    const cid = "TemperaturSensor1"
    
    const datavalue = data.data.value
    const datavaluecleaned = convertHexToCelsius(datavalue)

    const code = data.code
    const newTemperatureData = await TemperatureModel.create({
      cid: cid,
  data: datavaluecleaned,
  code: code,
    });
    console.log(newTemperatureData)
    console.log('Data fetched and stored successfully');
  } catch (error) {
    console.error('Error fetching or storing data:', error);
  }
};

function convertHexToCelsius(hexNr: string): number {
  const binNr: string = (parseInt(hexNr, 16)).toString(2);
  const shortBinNr: string = binNr.slice(0, -2); // Removing last 2 digits
  const decNr: number = parseInt(shortBinNr, 2);
  const fahrenheit: number = (decNr / 10 - 32) * (5 / 9);
  const celsius: number = Math.round(fahrenheit * 10) / 10;
  return celsius;
}

export default fetchDataAndStore;