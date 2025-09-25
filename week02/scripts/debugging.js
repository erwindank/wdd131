const radiusOutput = document.getElementById('radius');
const areaOutput = document.getElementById('area');

const PI = 3.14159;

let radius = 10;
let area = PI * radius * radius;
radiusOutput.textContent = radius;
areaOutput.textContent = area;

radius = 20;
area = PI * radius * radius;
radiusOutput.textContent = radius;
areaOutput.textContent = area;