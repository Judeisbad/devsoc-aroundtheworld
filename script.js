const cursor = document.querySelector(".custom-cursor");
const cursorEarth = document.querySelector(".custom-cursor-earth");
const headerContainer = document.getElementById("header-container");
const contentContainer = document.getElementById("content");
let fontInterval;
let curPage;
// Change font
// const fonts = ["B612", "Lexend Deca", "Open Sans", "Outfit", "Doto", "Inter"];
const fonts = ["B612", "Doto", "DynaPuff", "Climate Crisis",
        "Shantell Sans", "Advent Pro", "Oswald", "Caveat"]
let index = 0;

// Track whether the page have been loaded at least once
let pageLoaded = {
    "home": false,
    "about": false,
    "interests": false
};

function changeFont() {
    // console.log("CHANGEFONT");
    const elements = document.querySelectorAll(".changing-font");
    index = (index + 1) % fonts.length;
    elements.forEach(el => {
        el.style.fontFamily = fonts[getRandomInt(0, fonts.length)];
        el.style.fontWeight = getRandomInt(100, 800);
        el.style.color = `rgb(${getRandomInt(70, 255)}, ${getRandomInt(70, 255)}, ${getRandomInt(70, 255)})`;
    });
}

function typewriter(input_text, delay=100) {
    const target = document.getElementById("typewriter-text");
    // console.log(target);
    target.innerHTML = "";
    let i = 0;
    let n = input_text.length;
    function type() {
        if (i < n) {
            target.textContent += input_text[i++];
            setTimeout(type, delay);
        }
    }
    type(delay=70);
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}




function loadPage(page) {
    curPage = page;
    // const loadingScreen = document.getElementById("loading-screen");
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
        updateStyles(page);
        pageLoaded[page] = true;
    });
}

// Update styles for a page
function updateStyles(page) {
    if (page === "home") {
        contentContainer.style.backgroundImage = "";
        contentContainer.style.backgroundColor = "rgb(39, 45, 57)";
        changeFont();
        fontInterval = setInterval(changeFont, 1500);
        typewriter("Use the dropdown menu above to navigate!");
    } else if (page === "interests") {
        clearInterval(fontInterval);
        contentContainer.style.backgroundColor = "rgb(0, 172, 196)";
        contentContainer.style.backgroundImage = "url(https://images.unsplash.com/photo-1548268770-66184a21657e?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)";
        contentContainer.style.backgroundBlendMode = "lighten";
        setupIconClickHandler();
    } else if (page === "about") {
        clearInterval(fontInterval);
        contentContainer.style.backgroundImage = "";
        contentContainer.style.backgroundColor = "rgb(39, 45, 57)";
    }
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

// Controls border on/off on icons
function setupIconClickHandler() {
    // console.log("SETUPICONCLICK");
    const icons = document.querySelectorAll(".icon-container");
    document.addEventListener("click", (event) => {
        if (!event.target.classList.contains("icon-element")) {
            // console.log("Cancelled");
            return;
        }
        let clickedIcon = null;
        // console.log("DEBUG" + event.target);
        icons.forEach(icon => {
            if (icon.contains(event.target)) {
                clickedIcon = icon;
            } else {
                icon.classList.remove("active");
            }
        })
        if (clickedIcon) {
            clickedIcon.classList.add("active");
        }
        if (event.detail === 2) { // If it's a doubleclick
            openWindow(clickedIcon); // Open window
        }
    })
}

function openWindow(icon) {
    const iconID = icon.id;
    // console.log(iconID);
    let windowName = `${iconID.split("-")[0]}-window`;
    const window = document.getElementById(windowName);
    window.style.display = "flex";
}

