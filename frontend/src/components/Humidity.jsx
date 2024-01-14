import React, {useEffect, useState} from "react";
import Layout from './Layout'
import {Row, Col, Card, Button, Form} from "react-bootstrap";
import {AreaChart, Area, XAxis, YAxis, Legend, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import {FaDroplet} from "react-icons/fa6";
import {HiSave} from "react-icons/hi";
import {
    humProcessDataForCustomDate,
    humProcessDataForToday,
    humProcessDataForMonth,
    humProcessDataForYear,
} from './processDataForChart';
import * as XLSX from 'xlsx';
import {getHumidity, getTemperature} from "../network/dataset_api";


function Humidity() {

    const [latestHumidity, setLatestHumidity] = useState(null);
    const [selectedButton, setSelectedButton] = useState('today');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [humidity, setHumidity] = useState([]);
    const [selectedTimeframe, setSelectedTimeframe] = useState('today');
    const [chartData, setChartData] = useState([]);
    const [isLoadingHum, setIsLoadingHum] = useState(true);

    const exportToExcel = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
            Zeit: item.name,
            Wert: item.humidity
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Feuchtigkeitswerte");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };


    useEffect(() => {
        async function loadHumidity() {
            try {
                const hum = await getHumidity();
                setHumidity(hum);
                if (hum.length > 0) {
                    const latestHum = hum[hum.length - 1];
                    setLatestHumidity(latestHum);
                }
                updateChartData(hum, 'today');
            } catch (error) {
                console.error(error);
            }finally {
                setIsLoadingHum(false);
            }
        }


        async function loadData() {
            await loadHumidity();
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
                fileName = `Feuchtigkeit_Today_${new Date().toISOString().slice(0, 10)}`;
                dataToExport = humProcessDataForToday(humidity);
                break;
            case 'month':
                fileName = `Feuchtigkeit_Month_${new Date().getFullYear()}_${new Date().getMonth() + 1}`;
                dataToExport = humProcessDataForMonth(humidity);
                break;
            case 'year':
                fileName = `Feuchtigkeit_Year_${new Date().getFullYear()}`;
                dataToExport = humProcessDataForYear(humidity);
                break;
            case 'custom':
                fileName = `Feuchtigkeit_${selectedDate}`;
                dataToExport = humProcessDataForCustomDate(humidity, selectedDate);
                break;
            default:
                return;
        }

        exportToExcel(dataToExport, fileName);
    }

    const updateChartData = (hum, timeframe, date = null) => {
        let processedData;
        switch (timeframe) {
            case 'today':
                processedData = humProcessDataForToday(hum);
                break;
            case 'month':
                processedData = humProcessDataForMonth(hum);
                break;
            case 'year':
                processedData = humProcessDataForYear(hum);
                break;
            case 'custom':
                processedData = humProcessDataForCustomDate(hum, date);
                break;
            default:
                processedData = [];
        }
        setChartData(processedData);
    };
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        setSelectedTimeframe('custom');
        updateChartData(humidity, 'custom', event.target.value);
    };
    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
        setSelectedTimeframe(buttonName);
        updateChartData(humidity, buttonName);
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
                                    <Card.Title className='card-content'>Humidity</Card.Title>
                                    <FaDroplet className='card-content1 temp-icon'/>
                                    <Card.Text className='card-content1'>
                                        {isLoadingHum ? (
                                            <p>Loading...</p>
                                        ) : latestHumidity ? (
                                            `${latestHumidity.humidity} %`
                                        ) : (
                                            "Data not available"
                                        )}
                                    </Card.Text>
                                    <Card.Text className='sensorText'>
                                        Hum-Sensor
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
                                    <YAxis label={{value: 'Humidity in %', angle: -90, position: 'insideLeft'}}/>
                                    <Tooltip/>
                                    <Legend></Legend>
                                    <Area type="monotone" dataKey="humidity" name='Hum-Sensor' stroke="rgba(33,81,95,1)"
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

export default Humidity;