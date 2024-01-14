import React, {useEffect, useState} from "react";
import {Card, Col, Row} from "react-bootstrap";
import {FaDroplet, FaTemperatureHalf} from "react-icons/fa6";
import {MdOutlineGraphicEq} from "react-icons/md";
import Layout from "./Layout";
import {Link} from 'react-router-dom';
import {getHumidity, getVibration, getTemperature} from "../network/dataset_api";

function Startpage() {

    const [latestHumidity, setLatestHumidity] = useState(null);
    const [latestVibration, setLatestVibration] = useState(null);
    const [latestTemperatureSensor1, setLatestTemperatureSensor1] = useState(null);
    const [latestTemperatureSensor2, setLatestTemperatureSensor2] = useState(null);
    const [currentTemperatureDisplay, setCurrentTemperatureDisplay] = useState(1);
    const switchInterval = 2500;
    const [isLoadingTemp, setIsLoadingTemp] = useState(true);
    const [isLoadingHum, setIsLoadingHum] = useState(true);
    const [isLoadingVib, setIsLoadingVib] = useState(true);

// Initialising und updating live data for cards
    useEffect(() => {
        async function loadVibrations() {
            try {
                const vib = await getVibration();
                if (vib.length > 0) {
                    const latestVib = vib[vib.length - 1];
                    setLatestVibration(latestVib);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingVib(false);
            }

        }

        async function loadHumidity() {
            try {
                const hum = await getHumidity();
                if (hum.length > 0) {
                    const latestHum = hum[hum.length - 1];
                    setLatestHumidity(latestHum);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingHum(false);
            }
        }

        async function loadTemperatures() {
            try {
                const temps = await getTemperature();
                if (temps.length > 0) {
                    const latestTempSensor1 = temps.filter(t => t.cid === "TemperaturSensor1").pop();
                    const latestTempSensor2 = temps.filter(t => t.cid === "TemperaturSensor2").pop();
                    setLatestTemperatureSensor1(latestTempSensor1);
                    setLatestTemperatureSensor2(latestTempSensor2);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingTemp(false);
            }
        }
        async function loadData() {
            await loadVibrations();
            await loadHumidity();
            await loadTemperatures();
        }

        //loading data when componenet gets mounted
         loadData();

        //updating data interval
        const interval = setInterval(() => {
            loadData();
        }, 5000);

        return () => clearInterval(interval);

    }, []);

    useEffect(() => {
        setCurrentTemperatureDisplay(1);

        const interval = setInterval(() => {
            setCurrentTemperatureDisplay(currentDisplay => currentDisplay === 1 ? 2 : 1);
        }, switchInterval);

        return () => clearInterval(interval);
    }, [latestTemperatureSensor1, latestTemperatureSensor2]);

    return (
        <Layout>
            <Row style={{display: 'flex', flexGrow: '1', alignItems: 'center', marginLeft: '300px'}}>
                <Col>
                    <Link to="/Temperature" style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                        {/* One Card for each sensor type */}
                        <Card className="card-shadow" style={{width: '18rem', height: '20em',}}>
                            <Card.Body className="text-center">
                                <Card.Title className='card-content'>Temperature</Card.Title>
                                <FaTemperatureHalf className='card-content temp-icon'/>
                                <Card.Text className='card-content'>
                                    {isLoadingTemp ? (
                                    <p>Loading...</p>
                                ) : currentTemperatureDisplay === 1 ? (
                                    latestTemperatureSensor1 ? (
                                        `${latestTemperatureSensor1.celsius}°C`
                                    ) : (
                                        "Keine Daten für Sensor 1 verfügbar."
                                    )
                                ) : (
                                    latestTemperatureSensor2 ? (
                                        `${latestTemperatureSensor2.celsius}°C`
                                    ) : (
                                        "Keine Daten für Sensor 2 verfügbar."
                                    )


                                )}
                                </Card.Text>
                                <Card.Text className='sensorText'>
                                    {currentTemperatureDisplay === 1 ?
                                        <p>Temp-Sensor1</p>
                                        :
                                        <p>Temp-Sensor2</p>
                                    }
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col>
                    <Link to="/Humidity" style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                        <Card className="card-shadow" style={{width: '18rem', height: '20rem'}}>
                            <Card.Body className="text-center">
                                <Card.Title className='card-content'>Humidity</Card.Title>
                                <FaDroplet className='card-content temp-icon'/>
                                <Card.Text className='card-content'>
                                    {isLoadingHum ? (
                                        <p>Loading...</p>
                                    ) : latestHumidity ? (
                                            <p>{latestHumidity.humidity} %</p>
                                        ) : (
                                            <p>Keine Daten verfügbar.</p>
                                        )
                                    }

                                </Card.Text>
                                <Card.Text className='sensorText'>
                                    Hum-Sensor
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col>
                    <Link to="/Vibration" style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                        <Card className="card-shadow" style={{width: '18rem', height: '20rem',}}>
                            <Card.Body className="text-center">
                                <Card.Title className='card-content'>Vibration</Card.Title>
                                <MdOutlineGraphicEq className='card-content temp-icon'/>
                                <Card.Text className='card-content'>
                                    {isLoadingVib ? (
                                        <p>Loading...</p>
                                    ) : latestVibration ? (
                                        <p>{latestVibration.aRms} m/s</p>
                                    ) : (
                                        <p>Keine Daten verfügbar.</p>
                                    )}
                                </Card.Text>
                                <Card.Text className='sensorText'>
                                    Vib-Sensor
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            </Row>
        </Layout>

    );
}

export default Startpage;