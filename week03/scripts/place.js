// Static values for temperature and wind speed (matching HTML content)
const temperature = 20; // °C
const windSpeed = 5; // km/h

// Function to calculate wind chill factor
// Formula for Metric (Celsius): Wind Chill = 13.12 + 0.6215T - 11.37(V^0.16) + 0.3965T(V^0.16)
// Where T = temperature in °C, V = wind speed in km/h
function calculateWindChill(temp, wind) {
    return 13.12 + 0.6215 * temp - 11.37 * Math.pow(wind, 0.16) + 0.3965 * temp * Math.pow(wind, 0.16);
}

// Function to check if wind chill calculation is viable
function isWindChillViable(temp, wind) {
    // Metric conditions: Temperature <= 10°C and Wind speed > 4.8 km/h
    return temp <= 10 && wind > 4.8;
}

// Calculate and display wind chill when page loads
document.addEventListener('DOMContentLoaded', () => {
    const windchillElement = document.getElementById('windchill');
    
    if (isWindChillViable(temperature, windSpeed)) {
        const windchill = calculateWindChill(temperature, windSpeed);
        windchillElement.textContent = `${windchill.toFixed(1)}°C`;
    } else {
        windchillElement.textContent = 'N/A';
    }
    
    // Update current year in footer
    document.getElementById('currentyear').textContent = new Date().getFullYear();
    
    // Update last modified date in footer
    document.getElementById('lastModified').textContent = 'Last Modified: ' + document.lastModified;
});
