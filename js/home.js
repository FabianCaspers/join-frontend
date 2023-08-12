/* async function initHome() {
    await includeHTML();
    setURL("http://127.0.0.1:8000/");
    await loadCurrentUser();
    greetingUsers();
    activeHomeNavLink();
} */


function activeHomeNavLink() {
    document.getElementById('home-link').classList.add('active-link')
    document.getElementById('home-link-mobile').classList.add('active-link')
}


/* function greetingUsers() {
    let myDate = new Date()
    let hours = myDate.getHours();
    let greetingMessage;

    if (hours < 12) {
        greetingMessage = 'Good morning,';
    } else if (hours >= 12 && hours <= 17) {
        greetingMessage = 'Good afternoon,';
    } else if (hours >= 17 && hours <= 24) {
        greetingMessage = 'Good evening,';
    }

    document.getElementById('welcome-text').innerHTML = greetingMessage;
    document.getElementById('welcome-name').innerHTML = currentUser.split(' ')[0];

    setCurrentTime();
    setCurrentDate();
} */


function setCurrentDate() {
    let currentDate = new Date().toLocaleString("default", {
        "year": "numeric",
        "month": "long",
        "day": "numeric",
    });

    document.getElementById('date').innerHTML = currentDate;
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




/* Django Backend */

async function initHome() {
    await includeHTML();
    setURL("http://127.0.0.1:8000/");
    await greetingUsers();

    const currentUserData = await getCurrentUser();
    if (currentUserData) {
        greetingUsers(currentUserData.username);
    } else {
        
    }
    
    activeHomeNavLink();
    setCurrentDate();
    setCurrentTime();
    greetingUsers();
}



async function getCurrentUser() {
    try {
        const response = await fetch("http://127.0.0.1:8000/current_user/");

        if (!response.ok) {
            throw new Error("Failed to fetch current user.");
        }

        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}





async function greetingUsers(username) {
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

    const user = await getCurrentUser();

    if (user && user.username) {
        document.getElementById('welcome-name').innerHTML = user.username;
    } else {
        
        document.getElementById('welcome-name').innerHTML = 'Guest';
    }

    document.getElementById('welcome-text').innerHTML = greetingMessage;
/*     document.getElementById('welcome-name').innerHTML = username; */

    setCurrentTime();
    setCurrentDate();
}

