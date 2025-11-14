// Get the temperature and wind speed shown on the page. If they aren't there yet, use sensible default values.
const temperature = Number(document.getElementById('temperature')?.textContent) || 20; // °C
const windSpeed = Number(document.getElementById('wind-speed')?.textContent) || 5; // km/h

// Function to calculate wind chill (Celsius)
// Formula in Celsius: Wind Chill = 13.12 + 0.6215T - 11.37(V^0.16) + 0.3965T(V^0.16)
// T = temperature in °C, V = wind speed in km/h
function calculateWindChill(temp, wind) {
    return 13.12 + 0.6215 * temp - 11.37 * Math.pow(wind, 0.16) + 0.3965 * temp * Math.pow(wind, 0.16);
}

// Function to check if wind chill calculation is viable
function isWindChillViable(temp, wind) {
    // Metric conditions: Temperature <= 10°C and Wind speed > 4.8 km/h
    return temp <= 10 && wind > 4.8;
}

// Function to update weather information
function updateWeather() {
    // prefer input fields if present, otherwise fall back to spans
    const tempInput = document.getElementById('temperature-input');
    const windInput = document.getElementById('wind-speed-input');

    const temp = tempInput ? Number(tempInput.value) : Number(document.getElementById('temperature')?.textContent) || 20;
    const wind = windInput ? Number(windInput.value) : Number(document.getElementById('wind-speed')?.textContent) || 5;

    const wcEl = document.getElementById('windchill');
    if (wcEl) {
        wcEl.textContent = isWindChillViable(temp, wind)
            ? `${calculateWindChill(temp, wind).toFixed(1)}°C`
            : 'N/A';
    }

    const y = document.getElementById('currentyear');
    if (y) y.textContent = new Date().getFullYear();

    const lm = document.getElementById('lastModified');
    if (lm) lm.textContent = 'Last Modified: ' + document.lastModified;
}

// expose for Console if needed
window.updateWeather = updateWeather;
window.calculateWindChill = calculateWindChill;

document.addEventListener('DOMContentLoaded', () => {
    // initial render
    updateWeather();

    // wire the Recalculate button (no inline onclick)
    const btn = document.getElementById('recalc-weather');
    if (btn) btn.addEventListener('click', updateWeather);

    // optional: live update if you add inputs
    const ti = document.getElementById('temperature-input');
    const wi = document.getElementById('wind-speed-input');
    if (ti) ti.addEventListener('input', updateWeather);
    if (wi) wi.addEventListener('input', updateWeather);
});