/* Django Backend */

async function initHome() {
    await includeHTML();
    setURL("https://fabiancaspersdjango.pythonanywhere.com/");

    const usernameFromLocalStorage = localStorage.getItem('username');
    if (usernameFromLocalStorage) {
        greetingUsers(usernameFromLocalStorage);
    } else {

    }

    activeHomeNavLink();
    setCurrentDate();
    setCurrentTime();
}

function activeHomeNavLink() {
    document.getElementById('home-link').classList.add('active-link')
    document.getElementById('home-link-mobile').classList.add('active-link')
}

function setCurrentTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();

    m = checkTime(m);
    s = checkTime(s);

    document.getElementById('clock').innerHTML = h + ":" + m + ":" + s;
    setTimeout(setCurrentTime, 1000);
}


function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}


/* async function getCurrentUser() {
    try {
        const response = await fetch("http://127.0.0.1:8000/");

        if (!response.ok) {
            throw new Error("Failed to fetch current user.");
        }

        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
} */





function greetingUsers() {
    let myDate = new Date();
    let hours = myDate.getHours();
    let greetingMessage;

    if (hours < 12) {
        greetingMessage = 'Good morning,';
    } else if (hours >= 12 && hours <= 17) {
        greetingMessage = 'Good afternoon,';
    } else if (hours >= 17 && hours <= 24) {
        greetingMessage = 'Good evening,';
    }

    const usernameFromLocalStorage = localStorage.getItem('username');

    if (usernameFromLocalStorage) {
        document.getElementById('welcome-name').innerHTML = usernameFromLocalStorage;
    } else {
        document.getElementById('welcome-name').innerHTML = 'Guest';
    }

    document.getElementById('welcome-text').innerHTML = greetingMessage;

    setCurrentTime();
    setCurrentDate();
}

function setCurrentDate() {
    let currentDate = new Date().toLocaleString("default", {
        "year": "numeric",
        "month": "long",
        "day": "numeric",
    });

    document.getElementById('date').innerHTML = currentDate;
}


