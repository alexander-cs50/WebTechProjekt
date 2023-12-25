import { Temperature as TemperatureModel } from "../models/temperature"
import { useEffect, useState } from "react";
import { getTemperature } from "../network/dataset_api";
import { Button, Col, Row, Spinner } from "react-bootstrap";


const DataView = () => {
    const [temperatures, setTemperatures] = useState<TemperatureModel[]>([]);


useEffect(() => {
    async function loadTemperatures() {
        try {
            const temperatures = await getTemperature();
            setTemperatures(temperatures);
        } catch (error) {
            console.error(error);
        }
    } loadTemperatures();
}, []);


return (
    <div>
      <h1>Your Data:</h1>
      <ul>
        {temperatures.map(item => (
          <li key={item._id}>
            {item.sensor}
            {item.createdAt}
            {item.recordedtemperature}
            </li>
        ))}
      </ul>
    </div>
  );
};

export default DataView;