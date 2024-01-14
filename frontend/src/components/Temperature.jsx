import React from "react";
import {useEffect, useState} from "react";
import {getTemperature} from "../network/dataset_api";
import Layout from './Layout'
import {Row, Col, Card, Button, Form} from "react-bootstrap";
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {FaTemperatureHalf} from "react-icons/fa6";
import {HiSave} from "react-icons/hi";
import {
    tempProcessDataForCustomDate,
    tempProcessDataForToday,
    tempProcessDataForMonth,
    tempProcessDataForYear
} from './processDataForChart';
import * as XLSX from 'xlsx';


function Temperature() {

    const [selectedButton, setSelectedButton] = useState('today');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [temperatures, setTemperatures] = useState([]);
    const [selectedTimeframe, setSelectedTimeframe] = useState('today');
    const [chartData, setChartData] = useState([]);
    const [latestTemperatureSensor1, setLatestTemperatureSensor1] = useState(null);
    const [latestTemperatureSensor2, setLatestTemperatureSensor2] = useState(null);
    const [isLoadingTemp, setIsLoadingTemp] = useState(true);

    function handleExcelClick() {
        let fileName;
        let dataToExportSensor1 = [];
        let dataToExportSensor2 = [];

        // Get Data for Excel-file from processDataForChart.js methods
        switch (selectedTimeframe) {
            case 'today':
                fileName = `Temperature_Today_${new Date().toISOString().slice(0, 10)}`;
                const dataToday = tempProcessDataForToday(temperatures);
                dataToExportSensor1 = dataToday.sensor1;
                dataToExportSensor2 = dataToday.sensor2;
                break;
            case 'month':
                fileName = `Temperature_Month_${new Date().getFullYear()}_${new Date().getMonth() + 1}`;
                const dataMonth = tempProcessDataForMonth(temperatures);
                dataToExportSensor1 = dataMonth.sensor1;
                dataToExportSensor2 = dataMonth.sensor2;
                break;
            case 'year':
                fileName = `Temperature_Year_${new Date().getFullYear()}`;
                const dataYear = tempProcessDataForYear(temperatures);
                dataToExportSensor1 = dataYear.sensor1;
                dataToExportSensor2 = dataYear.sensor2;
                break;
            case 'custom':
                fileName = `Temperature_${selectedDate}`;
                const dataCustom = tempProcessDataForCustomDate(temperatures, selectedDate);
                dataToExportSensor1 = dataCustom.sensor1;
                dataToExportSensor2 = dataCustom.sensor2;
                break;
            default:
                return;
        }
        exportToExcel(dataToExportSensor1, dataToExportSensor2, fileName);

    }

    const exportToExcel = (sensor1Data, sensor2Data, fileName) => {
        // Merge Arrays for Excel
        const combinedData = sensor1Data.map((item, index) => ({
            Sensorname: 'TemperaturSensor1',
            Zeit: item.name,
            Wert: item.temperature
        })).concat(sensor2Data.map((item) => ({
            Sensorname: 'TemperaturSensor2',
            Zeit: item.name,
            Wert: item.temperature
        })));

        // Create sheet
        const worksheet = XLSX.utils.json_to_sheet(combinedData);

        // Create Excel-Book and add sheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Temperaturen");

        // write workbook into file
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    // Initialising and updating data for page --- Live values for 2 sensors !!!
    useEffect(() => {
        async function loadTemperatures() {
            try {
                const temps = await getTemperature();
                setTemperatures(temps);
                if (temps.length > 0) {
                    const popTemps = temps;
                    const latestTempSensor1 = popTemps.filter(t => t.cid === "TemperaturSensor1").pop();
                    const latestTempSensor2 = popTemps.filter(t => t.cid === "TemperaturSensor2").pop();
                    setLatestTemperatureSensor1(latestTempSensor1);
                    setLatestTemperatureSensor2(latestTempSensor2);
                }
                updateChartData(temps, 'today');
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingTemp(false);
            }
        }

        async function loadData() {
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


    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        setSelectedTimeframe('custom');
        updateChartData(temperatures, 'custom', event.target.value);
    };

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
        setSelectedTimeframe(buttonName);
        updateChartData(temperatures, buttonName);
    };

    const getButtonClassName = (buttonName) => {
        return selectedButton === buttonName ? 'chartButton' : 'chartButton grayedOut';
    };

    const updateChartData = (temps, timeframe, date = null) => {
        let processedData;
        // Process Data after selecting a button or a date
        switch (timeframe) {
            case 'today':
                processedData = tempProcessDataForToday(temps);
                break;
            case 'month':
                processedData = tempProcessDataForMonth(temps);
                break;
            case 'year':
                processedData = tempProcessDataForYear(temps);
                break;
            case 'custom':
                processedData = tempProcessDataForCustomDate(temps, date);
                break;
            default:
                processedData = {sensor1: [], sensor2: []};
        }
        //Merge Arrays for Chart data attribute
        const mergedData = processedData.sensor1.map((data, index) => {
            return {
                name: data.name,
                sensor1Temp: data.temperature,
                sensor2Temp: processedData.sensor2[index] ? processedData.sensor2[index].temperature : null,
            };
        });

        setChartData(mergedData);
    };

    return (
        <Layout>
            <Row style={{display: 'flex', flexGrow: '1', alignItems: 'center', margin: '40px'}}>
                <Col>
                    <div style={{
                        opacity: '1',
                        borderRadius: '25px',
                        background: 'white',
                        height: '80vH',
                        width: '99%',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: '0%',
                            width: '20%',
                            height: '100%'
                        }}>
                            {/* Content for the left side */}
                            <Card className="card-shadow2">
                                <Card.Body className="text-center">
                                    <Card.Title className='card-content'>Temperature</Card.Title>
                                    <FaTemperatureHalf className='card-content1 temp-icon'/>

                                    <Card.Text className='card-content1'>
                                        {isLoadingTemp ? (
                                            <p>Loading...</p>
                                        ) : latestTemperatureSensor1 ? (
                                                `${latestTemperatureSensor1.celsius}°C`
                                            ) : (
                                                "No Data for sensor 1 available"
                                        )}
                                    </Card.Text>
                                    <Card.Text className='sensorText'>
                                        Temp-Sensor1
                                    </Card.Text>

                                    <Card.Text className='card-content1'>
                                        {isLoadingTemp ? (
                                            <p>Loading...</p>
                                        ) : latestTemperatureSensor2 ? (
                                            `${latestTemperatureSensor2.celsius}°C`
                                        ) : (
                                            "No Data for sensor 2 available"
                                        )}
                                    </Card.Text>
                                    <Card.Text className='sensorText'>
                                        Temp-Sensor2
                                    </Card.Text>

                                    <Button className="align-icon-text" onClick={() => handleExcelClick()}>
                                        <HiSave/>
                                        <span className="button-text">Download Sensor data history</span>
                                    </Button>

                                </Card.Body>
                            </Card>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            marginLeft: '4%'
                        }}>
                            {/* vertical line for separation */}
                            <div className='vl'></div>
                        </div>
                        {/* Area for chart */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: '0%',
                            marginRight: '0%',
                            width: '70%',
                            height: '100%'
                        }}>
                            <ResponsiveContainer width="100%" height="80%">
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                    marginLeft: '11%',
                                    marginRight: '0%',
                                    width: '100%'
                                }}>
                                    <Button className={getButtonClassName('today')}
                                            onClick={() => handleButtonClick('today')}>Today</Button>
                                    <Button className={getButtonClassName('month')}
                                            onClick={() => handleButtonClick('month')}>This month</Button>
                                    <Button className={getButtonClassName('year')}
                                            onClick={() => handleButtonClick('year')}>This year</Button>
                                    <Form.Control
                                        className='chartDateForm'
                                        type="date"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                    />

                                </div>
                                <AreaChart
                                    width={500}
                                    height={300}
                                    data={chartData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"
                                           label={{value: 'Time', position: 'insideBottomRight', offset: -17}}/>
                                    <YAxis label={{value: 'Temperature in °C', angle: -90, position: 'insideLeft'}}/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Area type="monotone" dataKey="sensor1Temp" name='Temp-Sensor1'
                                          stroke="rgba(33,81,95,1)" fill="rgba(33,81,95,1) " activeDot={{r: 8}}/>
                                    <Area type="monotone" dataKey="sensor2Temp" name='Temp-Sensor2'
                                          stroke="rgba(42,113,140,1)"
                                          fill="rgba(42,113,140,1)" activeDot={{r: 8}}/>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Col>
            </Row>
        </Layout>

    );
}

export default Temperature;