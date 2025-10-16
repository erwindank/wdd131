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

        // Resolve a robust name and alt text (supports multiple property names)
        const displayName = t.name || t.templeName || t.temple || 'Unnamed Temple';

        // Create image (ensure an absolute URL)
        const img = document.createElement('img');
        const imagePath = t.imageUrl || t.image || '';
        img.src = new URL(imagePath, location.href).href; // makes relative paths absolute
        img.alt = displayName;
        img.setAttribute('loading', 'lazy');
        // provide dimensions to avoid layout shift (use provided or fallbacks)
        img.width = t.width || 400;
        img.height = t.height || t.heightPx || 650;
        img.className = 'temple-image';

        // Name
        const name = document.createElement('h3');
        name.textContent = displayName;

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

// temple data (kept local and attached to window for compatibility)
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
        area: 0,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/san-salvador-el-salvador-temple/san-salvador-el-salvador-temple-7314.jpg",
        description: "A modern temple serving Central America."
    },
    {
        id: "temple-11",
        name: "Colonia Juárez Chihuahua Mexico Temple",
        location: "Colonia Juárez, Chihuahua, Mexico",
        dedicated: "October 23, 1999",
        area: 0,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/colonia-juarez-chihuahua-mexico-temple/colonia-juarez-chihuahua-mexico-temple-1570.jpg",
        description: "Historic landmark temple in northern Mexico."
    },
    {
        id: "temple-12",
        name: "Cochabamba Bolivia Temple",
        location: "Cochabamba, Bolivia",
        dedicated: "January 4, 2000",
        area: 0,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/cochabamba-bolivia-temple/cochabamba-bolivia-temple-13662.jpg",
        description: "Serves members across Bolivia and nearby regions."
    }
];

// expose data globally so other scripts can access if needed
window.temples = temples;

// Utility: extract a 4-digit year from a dedication string
function getDedicationYear(t) {
    const s = (t.dedicated || t.dedication || '').toString();
    const m = s.match(/(\d{4})/);
    return m ? Number(m[1]) : null;
}

// Utility: numeric area value (fallback to 0)
function getAreaValue(t) {
    return Number(t.area ?? t.areaSqFt ?? t.totalArea ?? 0) || 0;
}

// Create and render temple cards into .temples-grid
function renderGrid(list) {
    const grid = document.querySelector('.temples-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!list.length) {
        const empty = document.createElement('p');
        empty.textContent = 'No temples match this filter.';
        grid.appendChild(empty);
        return;
    }

    list.forEach(t => {
        const displayName = t.name || t.templeName || t.temple || 'Unnamed Temple';
        const imgSrc = new URL(t.imageUrl || t.image || '', location.href).href;

        const fig = document.createElement('figure');
        fig.className = 'temple-card';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = displayName;
        img.loading = 'lazy';
        img.className = 'temple-image';

        const cap = document.createElement('figcaption');

        const h = document.createElement('h3');
        h.textContent = displayName;

        const loc = document.createElement('p');
        loc.className = 'temple-location';
        loc.textContent = `Location: ${t.location || 'Unknown'}`;

        const year = getDedicationYear(t);
        const ded = document.createElement('p');
        ded.className = 'temple-dedicated';
        ded.textContent = `Dedicated: ${t.dedicated || t.dedication || 'Unknown'}`;

        const areaVal = getAreaValue(t);
        const area = document.createElement('p');
        area.className = 'temple-area';
        area.textContent = areaVal ? `Area: ${areaVal.toLocaleString()} sq ft` : 'Area: Unknown';

        cap.append(h, loc, ded, area);
        fig.append(img, cap);
        grid.appendChild(fig);
    });
}

// Filter helpers
function filterAll() {
    return temples.slice();
}
function filterOld() {
    return temples.filter(t => {
        const y = getDedicationYear(t);
        return y !== null && y < 1900;
    });
}
function filterNew() {
    return temples.filter(t => {
        const y = getDedicationYear(t);
        return y !== null && y > 2000; // strictly after 2000
    });
}
function filterLarge() {
    return temples.filter(t => getAreaValue(t) > 90000);
}
function filterSmall() {
    return temples.filter(t => getAreaValue(t) < 10000 && getAreaValue(t) > 0);
}

// Hook navigation and menu behavior after DOM ready
document.addEventListener("DOMContentLoaded", () => {
    // Footer
    const yEl = document.getElementById("currentyear");
    if (yEl) yEl.textContent = new Date().getFullYear();
    const lmEl = document.getElementById("lastModified");
    if (lmEl) lmEl.textContent = "Last Modified: " + document.lastModified;

    // Menu toggle
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("show");
            menuToggle.textContent = menuToggle.textContent === "☰" ? "✖" : "☰";
        });
    }

    // Navigation links
    const links = document.querySelectorAll('#nav-menu a');
    function clearActive() {
        links.forEach(a => a.classList.remove('active'));
    }

    function applyFilter(key) {
        clearActive();
        const lower = key.trim().toLowerCase();
        // set active link by matching text
        const matched = Array.from(links).find(a => a.textContent.trim().toLowerCase() === lower);
        if (matched) matched.classList.add('active');

        let result = [];
        switch (lower) {
            case 'old':
                result = filterOld();
                break;
            case 'new':
                result = filterNew();
                break;
            case 'large':
                result = filterLarge();
                break;
            case 'small':
                result = filterSmall();
                break;
            default:
                result = filterAll();
        }

        renderGrid(result);

        // if mobile, hide menu after selection
        if (navMenu && navMenu.classList.contains('show')) navMenu.classList.remove('show');
    }

    // attach click handlers
    links.forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            applyFilter(a.textContent || a.innerText);
        });
    });

    // initial render - Home (all)
    renderGrid(filterAll());
});

