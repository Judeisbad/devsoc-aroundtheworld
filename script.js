const cursor = document.getElementById("custom-cursor");
const cursorEarth = document.getElementById("custom-cursor-earth");
const cursorContainer = document.getElementById("cursor-container");
const headerContainer = document.getElementById("header-container");
const contentContainer = document.getElementById("content");
let curTime = new Date();
let fontInterval;
let curPage;
let highestZIndex = 5;
const maxZIndex = 30;
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
        setupYoutubeMouseInteraction();
        setTime();
        setAnalogueTime();
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
    cursorContainer.classList.add("hidden");
});

document.addEventListener("mouseenter", () => {
    cursorContainer.classList.remove("hidden");
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
    const windows = document.querySelectorAll(".window");
    // Check doubleclicked icon (and singleclick)
    document.addEventListener("click", (event) => {
        if (!event.target.classList.contains("icon-element")) {
            // console.log("Cancelled");
            return;
        }
        // If it's an icon that's clicked
        let clickedIcon = null;
        // console.log("DEBUG" + event.target);
        icons.forEach(icon => {
            // Check active icon
            if (icon.contains(event.target)) {
                clickedIcon = icon;
            } else {
                icon.classList.remove("active");
            }
        });
        if (clickedIcon) {
            clickedIcon.classList.add("active");
        }
        // console.log(clickedIcon);
        if (event.detail === 2) { // If it's a doubleclick
            openWindow(clickedIcon); // Open window
        }
        windows.forEach(window => {
            dragElement(window);
        });
    });
    // Handle window overlap
    document.addEventListener("mousedown", (event) => {
        if (!event.target.closest(".window")) {
            return;
        }
        const clickedWindow = event.target.closest(".window");
        raiseZIndex(clickedWindow);
    });
}

function setupYoutubeMouseInteraction() {
    const youtubeEmbeds = document.querySelectorAll(".youtube-embed");
    youtubeEmbeds.forEach(youtubeEmbed => {
        youtubeEmbed.addEventListener("mouseenter", () => {
            cursorContainer.classList.add("hidden");
        });
        youtubeEmbed.addEventListener("mouseleave", () => {
            cursorContainer.classList.remove("hidden");
        });
    });
}

function raiseZIndex(clickedWindow) {
    if (clickedWindow) {
        clickedWindow.style.zIndex = ++highestZIndex;
    } if (highestZIndex > maxZIndex) {
        resetZIndex();
    }
}

function resetZIndex() {
    const windows = [...document.querySelectorAll(".window")];
    windows.sort((a, b) => {
        a.style.zIndex - b.style.zIndex;
    });
    highestZIndex = 5; // Baseline z index
    windows.forEach((window, index) => {
        window.style.zIndex = highestZIndex + index;
    })
    highestZIndex += windows.length - 1;
}

function openWindow(icon) {
    const iconID = icon.id;
    // console.log(iconID);
    const windowName = `${iconID.split("-")[0]}-window`;
    const window = document.getElementById(windowName);
    window.style.display = "flex";
    raiseZIndex(window);
}

function closeWindow(element) {
    const elementID = element.id;
    const windowName = `${elementID.split("-")[0]}-window`;
    const window = document.getElementById(windowName);
    window.style.display = "none";
}

function dragElement(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(element.id + "-header")) {
        // Move div from header
        document.getElementById(element.id + "-header").onmousedown = dragMouseDown;
    } else {
        // If nonexitant, move div from element
        document.getElementById(element.id).onmousedown = dragMouseDown;
    }


    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.mouseX;
        pos4 = e.mouseY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        // Calculate offset
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Turn window fullscreen
function fullScreen() {
    const fullscreenElement = document.getElementById("fullscreen");
    if (!document.fullscreenElement) {
        fullscreenElement.innerHTML = "Exit Fullscreen";
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        fullscreenElement.innerHTML = "Fullscreen";
        document.exitFullscreen();
    }
}

// Set time for element
function setTime() {
    const timeElement = document.getElementById("time");
    timeElement.innerHTML = `${curTime.getHours()}:${curTime.getMinutes()}`;
}

function setAnalogueTime() {
    const hourHand = document.getElementById("hour-hand");
    const minuteHand = document.getElementById("minute-hand");
    const hourHandRotateBy = curTime.getHours() % 12 * 30;
    hourHand.style.transform = `rotate(${hourHandRotateBy}deg)`;
    const minuteHandRotateBy = curTime.getMinutes() % 60 * (360 / 60);
    minuteHand.style.transform = `rotate(${minuteHandRotateBy}deg)`;
}