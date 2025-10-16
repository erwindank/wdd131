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
});

