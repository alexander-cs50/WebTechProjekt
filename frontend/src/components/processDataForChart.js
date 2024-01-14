const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function roundToTwo(num) {
    return Number(num.toFixed(2));
}

const calculateAverage = (numbers) => numbers.reduce((a, b) => a + b, 0) / numbers.length;


//---------------------------------------  Humidity Sensor Section -------------------------------------

// Processing data for selected date

export const humProcessDataForCustomDate = (hum, date) => {
    const customDay = new Date(date).toISOString().slice(0, 10);
    const hourlyData = hum.filter(t => t.createdAt.startsWith(customDay))
        .reduce((acc, curr) => {
            const hour = new Date(curr.createdAt).getHours();
            acc[hour] = acc[hour] || [];
            acc[hour].push(parseFloat(curr.humidity));
            return acc;
        }, {});

    return Object.entries(hourlyData).map(([hour, values]) => ({
        name: `${hour}:00`,
        humidity: roundToTwo(calculateAverage(values))
    }));
};

// Processing data for today
export const humProcessDataForToday = (hum) => {
    const today = new Date().toISOString().slice(0, 10);
    const hourlyData = hum.filter(t => t.createdAt.startsWith(today))
        .reduce((acc, curr) => {
            const hour = new Date(curr.createdAt).getHours();
            acc[hour] = acc[hour] || [];
            acc[hour].push(parseFloat(curr.humidity));
            return acc;
        }, {});

    return Object.entries(hourlyData).map(([hour, values]) => ({
        name: `${hour}:00`,
        humidity: roundToTwo(calculateAverage(values))
    }));
};

// Processing data for current month
export const humProcessDataForMonth = (hum) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const dailyData = hum.filter(t => {
        const date = new Date(t.createdAt);
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    }).reduce((acc, curr) => {
        const day = new Date(curr.createdAt).getDate();
        acc[day] = acc[day] || [];
        acc[day].push(parseFloat(curr.humidity));
        return acc;
    }, {});

    return Object.entries(dailyData).map(([day, values]) => ({
        name: `${day}`,
        humidity: roundToTwo(calculateAverage(values))
    }));
};

// Processing data for current year
export const humProcessDataForYear = (hum) => {
    const currentYear = new Date().getFullYear();
    const monthlyData = hum.filter(t => new Date(t.createdAt).getFullYear() === currentYear)
        .reduce((acc, curr) => {
            const month = new Date(curr.createdAt).getMonth();
            acc[month] = acc[month] || [];
            acc[month].push(parseFloat(curr.humidity));
            return acc;
        }, {});

    return Object.entries(monthlyData).map(([month, values]) => ({
        name: months[month],
        humidity: roundToTwo(calculateAverage(values))
    }));
};

//------------------------------------- Temperature Sensors Section  -------------------------------------------

// The entire section on temperature sensors was crafted with the assistance and creative input from ChatGPT !!!
const processSensorData = (temps, filterFn, groupFn) => {
    const sensorData = {
        sensor1: {},
        sensor2: {}
    };

    temps.forEach(temp => {
        if (filterFn(temp)) {
            const groupKey = groupFn(temp);
            const tempValue = parseFloat(temp.celsius);

            if (temp.cid === "TemperaturSensor1") {
                if (!sensorData.sensor1[groupKey]) {
                    sensorData.sensor1[groupKey] = [];
                }
                sensorData.sensor1[groupKey].push(tempValue);
            } else if (temp.cid === "TemperaturSensor2") {
                if (!sensorData.sensor2[groupKey]) {
                    sensorData.sensor2[groupKey] = [];
                }
                sensorData.sensor2[groupKey].push(tempValue);
            }
        }
    });

    // Create Object for storing two arrays (temp-sensor1 & temp-sensor2)
    const averageData = {
        sensor1: [],
        sensor2: []
    };

    for (const [key, values] of Object.entries(sensorData.sensor1)) {
        averageData.sensor1.push({
            name: key,
            temperature: roundToTwo(calculateAverage(values))
        });
    }

    for (const [key, values] of Object.entries(sensorData.sensor2)) {
        averageData.sensor2.push({
            name: key,
            temperature: roundToTwo(calculateAverage(values))
        });
    }

    return averageData;
};

// Data process methods for different timeframes
export const tempProcessDataForCustomDate = (temps, date) => {
    const customDay = new Date(date).toISOString().slice(0, 10);
    return processSensorData(
        temps,
        temp => temp.createdAt.startsWith(customDay),
        temp => `${new Date(temp.createdAt).getHours()}:00`
    );
};

export const tempProcessDataForToday = (temps) => {
    const today = new Date().toISOString().slice(0, 10);
    return processSensorData(
        temps,
        temp => temp.createdAt.startsWith(today),
        temp => `${new Date(temp.createdAt).getHours()}:00`
    );
};

export const tempProcessDataForMonth = (temps) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    return processSensorData(
        temps,
        temp => new Date(temp.createdAt).getFullYear() === currentYear &&
            new Date(temp.createdAt).getMonth() === currentMonth,
        temp => `${new Date(temp.createdAt).getDate()}`
    );
};

export const tempProcessDataForYear = (temps) => {
    const currentYear = new Date().getFullYear();
    return processSensorData(
        temps,
        temp => new Date(temp.createdAt).getFullYear() === currentYear,
        temp => months[new Date(temp.createdAt).getMonth()]
    );
};

//---------------------------------------  Vibration Sensor Section --------------------------------------------------------------------------

// Processing data for selected date
export const vibProcessDataForCustomDate = (vib, date) => {
    const customDay = new Date(date).toISOString().slice(0, 10);
    const hourlyData = vib.filter(t => t.createdAt.startsWith(customDay))
        .reduce((acc, curr) => {
            const hour = new Date(curr.createdAt).getHours();
            acc[hour] = acc[hour] || [];
            acc[hour].push(parseFloat(curr.aRms));
            return acc;
        }, {});

    return Object.entries(hourlyData).map(([time, values]) => ({
        name: time,
        vibration: roundToTwo(calculateAverage(values))
    }));
};

// Processing data for today
export const vibProcessDataForToday = (vib) => {
    const today = new Date().toISOString().slice(0, 10);
    const hourlyData = vib.filter(t => t.createdAt.startsWith(today))
        .reduce((acc, curr) => {
            const hour = new Date(curr.createdAt).getHours();
            acc[hour] = acc[hour] || [];
            acc[hour].push(parseFloat(curr.aRms));
            return acc;
        }, {});

    return Object.entries(hourlyData).map(([hour, values]) => ({
        name: `${hour}:00`,
        vibration: roundToTwo(calculateAverage(values))
    }));
};

// Processing data for current month
export const vibProcessDataForMonth = (vib) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const dailyData = vib.filter(t => {
        const date = new Date(t.createdAt);
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    }).reduce((acc, curr) => {
        const day = new Date(curr.createdAt).getDate();
        acc[day] = acc[day] || [];
        acc[day].push(parseFloat(curr.aRms));
        return acc;
    }, {});

    return Object.entries(dailyData).map(([day, values]) => ({
        name: `${day}`,
        vibration: roundToTwo(calculateAverage(values))
    }));
};

// Processing data for current year
export const vibProcessDataForYear = (vib) => {
    const currentYear = new Date().getFullYear();
    const monthlyData = vib.filter(t => new Date(t.createdAt).getFullYear() === currentYear)
        .reduce((acc, curr) => {
            const month = new Date(curr.createdAt).getMonth();
            acc[month] = acc[month] || [];
            acc[month].push(parseFloat(curr.aRms));
            return acc;
        }, {});

    return Object.entries(monthlyData).map(([month, values]) => ({
        name: months[month],
        vibration: roundToTwo(calculateAverage(values))
    }));
};