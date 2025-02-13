const cursor = document.querySelector(".custom-cursor");
const cursorEarth = document.querySelector(".custom-cursor-earth");

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
    }
}
// Update dropdown when selected 
function updateSelection(selection) {
    const dropButton = document.getElementById("dropbutton-selection");
    dropButton.textContent = selection;
    document.getElementById("navDropdown").classList.remove("show");
}