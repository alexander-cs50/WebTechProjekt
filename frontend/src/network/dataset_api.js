export async function getTemperature() {
    const response = await fetch("api/sensor/temps", { method: "GET" });
    if (response.ok) {
        return response.json();
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
    }
}

export async function getHumidity() {
    const response = await fetch("api/sensor/humidity", { method: "GET" });
    if (response.ok) {
        return response.json();
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
    }
}

export async function getVibration() {
    const response = await fetch("api/sensor/vibration", { method: "GET" });
    if (response.ok) {
        return response.json();
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
    }
}