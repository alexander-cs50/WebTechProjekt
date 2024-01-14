import React, {useEffect, useState} from "react";
import Layout from './Layout'
import {Row, Col, Button, Card, Form} from "react-bootstrap";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {MdOutlineGraphicEq} from "react-icons/md";
import {HiSave} from "react-icons/hi";
import {
    vibProcessDataForCustomDate,
    vibProcessDataForToday,
    vibProcessDataForMonth,
    vibProcessDataForYear,
} from './processDataForChart';
import * as XLSX from 'xlsx';
import {getVibration} from "../network/dataset_api";


function Vibration() {
    const [latestVibration, setLatestVibration] = useState(null);
    const [selectedButton, setSelectedButton] = useState('today');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [vibration, setVibration] = useState([]);
    const [selectedTimeframe, setSelectedTimeframe] = useState('today');
    const [chartData, setChartData] = useState([]);
    const [isLoadingVib, setIsLoadingVib] = useState(true);

    const exportToExcel = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
            Zeit: item.name,
            Wert: item.vibration
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Vibrationswerte");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };


    useEffect(() => {
        async function loadVibrations() {
            try {
                const vib = await getVibration();
                setVibration(vib);
                if (vib.length > 0) {
                    const latestHum = vib[vib.length - 1]; // Annahme, dass das neueste Datum zuerst kommt
                    setLatestVibration(latestHum);
                }
                updateChartData(vib, 'today'); // Initialwerte für die Grafik
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingVib(false);
            }
        }

        async function loadData() {
            await loadVibrations();
        }

        //loading data when componenet gets mounted
        loadData();

        //updating data interval
        const interval = setInterval(() => {
            loadData();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    function handleExcelClick() {

        let fileName;
        let dataToExport = [];

        switch (selectedTimeframe) {
            case 'today':
                fileName = `Vibration_Today_${new Date().toISOString().slice(0, 10)}`;
                dataToExport = vibProcessDataForToday(vibration);
                break;
            case 'month':
                fileName = `Vibration_Month_${new Date().getFullYear()}_${new Date().getMonth() + 1}`;
                dataToExport = vibProcessDataForMonth(vibration);
                break;
            case 'year':
                fileName = `Vibration_Year_${new Date().getFullYear()}`;
                dataToExport = vibProcessDataForYear(vibration);
                break;
            case 'custom':
                fileName = `Vibration_${selectedDate}`;
                dataToExport = vibProcessDataForCustomDate(vibration, selectedDate);
                break;
            default:
                return;
        }

        exportToExcel(dataToExport, fileName);
    }

    const updateChartData = (vib, timeframe, date = null) => {
        let processedData;
        // Daten verarbeiten nach Auswahl der Button / Datepicker
        switch (timeframe) {
            case 'today':
                processedData = vibProcessDataForToday(vib);
                break;
            case 'month':
                processedData = vibProcessDataForMonth(vib);
                break;
            case 'year':
                processedData = vibProcessDataForYear(vib);
                break;
            case 'custom':
                processedData = vibProcessDataForCustomDate(vib, date);
                break;
            default:
                processedData = [];
        }
        setChartData(processedData);
    };
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        setSelectedTimeframe('custom');
        updateChartData(vibration, 'custom', event.target.value);
    };
    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
        setSelectedTimeframe(buttonName);
        updateChartData(vibration, buttonName);
    };

    const getButtonClassName = (buttonName) => {
        return selectedButton === buttonName ? 'chartButton' : 'chartButton grayedOut';
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
                                    <Card.Title className='card-content'>Vibration</Card.Title>
                                    <MdOutlineGraphicEq className='card-content1 temp-icon'/>
                                    <Card.Text className='card-content1'>
                                        {isLoadingVib ? (
                                            <p>Loading...</p>
                                        ) : latestVibration ? (
                                            `${latestVibration.aRms} m/s`
                                        ) : (
                                            "Data not available"
                                        )}
                                    </Card.Text>
                                    <Card.Text className='sensorText'>
                                        Vib-Sensor
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
                                <BarChart
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
                                    <YAxis label={{
                                        value: 'Vibration aRms in m/s',
                                        angle: -90,
                                        position: 'insideLeft'
                                    }}/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Bar type="monotone" dataKey="vibration" name='Vib-Sensor' fill="rgba(42,113,140,1)"
                                         activeDot={{r: 8}}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Col>
            </Row>
        </Layout>

    );
}

export default Vibration;