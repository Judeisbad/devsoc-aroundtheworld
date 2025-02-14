const cursor = document.querySelector(".custom-cursor");
const cursorEarth = document.querySelector(".custom-cursor-earth");
const headerContainer = document.getElementById("header-container");
const contentContainer = document.getElementById("content");

function loadPage(page) {
    const loadingScreen = document.getElementById("loading-screen");

    Promise.all([
        fetch(`./html/${page}/${page}-header.html`).then(response => response.text()),
        fetch(`./html/${page}/${page}.html`).then(response => response.text())
    ]).then(([headerData, contentData]) => {
        headerContainer.innerHTML = headerData;
        contentContainer.innerHTML = contentData;
        // Set body class to current pagename
        document.body.className = `${page}-page`
        
        // Track last page used
        localStorage.setItem("lastPage", page);

        updateSelection(page);
    })
}

// Page changing scripts
document.addEventListener("DOMContentLoaded", () => {
    const lastPage = localStorage.getItem("lastPage") || "home";
    loadPage(lastPage);
});

// Custom mouse cursor
document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    cursorEarth.style.left = `${e.clientX + 4}px`;
    cursorEarth.style.top = `${e.clientY + 5}px`
});

document.addEventListener("mouseleave", () => {
    cursor.style.display = "none";
    cursorEarth.style.display = "none";
});

document.addEventListener("mouseenter", () => {
    cursor.style.display = "block";
    cursorEarth.style.display = "block";
});

document.querySelectorAll('a, button').forEach((element) => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('link-hover'); // Change color
    });

    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('link-hover'); // Remove color
    });
});

// Shows/Hides dropdown list 
function toggleDropdown() {
    const dropdownContent = document.getElementById("navDropdown")
    dropdownContent.classList.toggle("show");

    const selectedText = document.querySelector(".dropbutton .language").textContent;
    const dropdownItems = dropdownContent.querySelectorAll("a");

    dropdownItems.forEach((item) => {
        if (item.textContent === selectedText) {
            item.style.display = "none";
        } else {
            item.style.display = "block";
        }
    });
}

window.onclick = function (event) {
    if (!event.target.matches(".dropbutton, .dropbutton *")) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
        const translatedLanguageContainer = document.getElementById("translated-language-container");
    }
}
// Update dropdown when selected 
function updateSelection(selection) {
    const dropButton = document.getElementById("dropbutton-selection");
    dropButton.textContent = capitaliseFirstLetter(selection);
    document.getElementById("navDropdown").classList.remove("show");
}

function capitaliseFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}