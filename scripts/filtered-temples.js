document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("currentyear").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = "Last Modified: " + document.lastModified;

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("show");

        // Toggle button symbol ☰ ↔ X
        if (menuToggle.textContent === "☰") {
            menuToggle.textContent = "✖";
        } else {
            menuToggle.textContent = "☰";
        }
    });

    // Support both possible variable names (adjust if your array name differs)
    const data = window.temples || window.templeList || window.templesData || [];
    const grid = document.querySelector('.temples-grid');
    if (!grid || !data.length) return;

    // Clear any existing content and build cards
    grid.innerHTML = '';

    data.forEach(t => {
        // Create card container
        const card = document.createElement('article');
        card.className = 'temple-card';

        // Create image (ensure an absolute URL)
        const img = document.createElement('img');
        const imagePath = t.imageUrl || t.image || '';
        img.src = new URL(imagePath, location.href).href; // makes relative paths absolute
        img.alt = t.name || 'Temple image';
        img.setAttribute('loading', 'lazy');
        // provide dimensions to avoid layout shift (use provided or fallbacks)
        img.width = t.width || 400;
        img.height = t.height || t.heightPx || 650;
        img.className = 'temple-image';

        // Name
        const name = document.createElement('h3');
        name.textContent = t.name || 'Unnamed Temple';

        // Location
        const locationP = document.createElement('p');
        locationP.className = 'temple-location';
        locationP.textContent = `Location: ${t.location || 'Unknown'}`;

        // Dedicated date
        const dedicatedP = document.createElement('p');
        dedicatedP.className = 'temple-dedicated';
        dedicatedP.textContent = `Dedicated: ${t.dedicated || t.dedication || 'Unknown'}`;

        // Area in square feet (try several common property names)
        const areaVal = t.area || t.areaSqFt || t.totalArea || t.area_in_sq_ft || 'Unknown';
        const areaP = document.createElement('p');
        areaP.className = 'temple-area';
        areaP.textContent = `Area: ${areaVal} sq ft`;

        // Assemble and append
        card.append(img, name, locationP, dedicatedP, areaP);
        grid.appendChild(card);
    });
});

const temples = [
    {
        templeName: "Aba Nigeria",
        location: "Aba, Nigeria",
        dedicated: "2005, August, 7",
        area: 11500,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
    },
    {
        templeName: "Manti Utah",
        location: "Manti, Utah, United States",
        dedicated: "1888, May, 21",
        area: 74792,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
    },
    {
        templeName: "Payson Utah",
        location: "Payson, Utah, United States",
        dedicated: "2015, June, 7",
        area: 96630,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
    },
    {
        templeName: "Yigo Guam",
        location: "Yigo, Guam",
        dedicated: "2020, May, 2",
        area: 6861,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
    },
    {
        templeName: "Washington D.C.",
        location: "Kensington, Maryland, United States",
        dedicated: "1974, November, 19",
        area: 156558,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
    },
    {
        templeName: "Lima Perú",
        location: "Lima, Perú",
        dedicated: "1986, January, 10",
        area: 9600,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
    },
    {
        templeName: "Mexico City Mexico",
        location: "Mexico City, Mexico",
        dedicated: "1983, December, 2",
        area: 116642,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
    },
    {
        id: "temple-10",
        name: "San Salvador El Salvador Temple",
        location: "San Salvador, El Salvador",
        dedicated: "November 20, 2015",
        imageUrl: "images/san-salvador-temple.jpg",
        description: "A modern temple serving Central America."
    },
    {
        id: "temple-11",
        name: "Colonia Juárez Chihuahua Mexico Temple",
        location: "Colonia Juárez, Chihuahua, Mexico",
        dedicated: "October 23, 1999",
        imageUrl: "images/colonia-juarez-temple.jpg",
        description: "Historic landmark temple in northern Mexico."
    },
    {
        id: "temple-12",
        name: "Cochabamba Bolivia Temple",
        location: "Cochabamba, Bolivia",
        dedicated: "January 4, 2000",
        imageUrl: "images/cochabamba-temple.jpg",
        description: "Serves members across Bolivia and nearby regions."
    }
];

