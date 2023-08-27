async function initLogin() {
    setURL("https://fabiancaspersdjango.pythonanywhere.com/");
}


let allUsers = [];
let currentUser;


function openSignUpDialog() {
    let logInDialog = document.getElementById('log-in-box');
    let signUpDialog = document.getElementById('sign-up-box');
    let PWdialog = document.getElementById('reset-dialog')

    logInDialog.classList.add('d-none');
    signUpDialog.classList.remove('d-none');
    PWdialog.classList.add('d-none');
}


function closeSignUpDialog() {
    let signUpDialog = document.getElementById('sign-up-box');
    let logInDialog = document.getElementById('log-in-box');

    signUpDialog.classList.add('d-none');
    logInDialog.classList.remove('d-none');
}


async function saveAllUsers() {
    await backend.setItem('allUsers', JSON.stringify(allUsers));
}


async function saveCurrentUser() {
    await backend.setItem('currentUser', JSON.stringify(currentUser));
}


async function loadAllUsers() {
    await downloadFromServer();
    allUsers = JSON.parse(backend.getItem('allUsers')) || [];
}


async function loadCurrentUser() {
    await downloadFromServer();
    currentUser = JSON.parse(backend.getItem('currentUser')) || [];
}


async function deleteAllUsers() {
    await backend.deleteItem('allUsers');
}


function signUpNotification() {
    document.getElementById('notification-signup').classList.remove('d-none');

    setTimeout(function () {
        document.getElementById('notification-signup').classList.add('d-none')
    }, 3000)
}


function checkHref() {
    if (window.location.href.indexOf("caspers") > -1) {
        // The URL contains the string 'fabian-caspers'(DA-Server)
        // window.location.href = '../Join-Javascript/html/home.html';
        window.location.href = '../html/home.html';
    } else {
        // The URL do not contain the string 'fabian-caspers' (Lokal)
        // window.location.href = '../html/home.html';
    }
}


function openPwResetDialog() {
    document.getElementById('reset-dialog').classList.remove('d-none');
    document.getElementById('log-in-box').classList.add('d-none');
}


function closeResetDialog() {
    document.getElementById('reset-dialog').classList.add('d-none');
    document.getElementById('log-in-box').classList.remove('d-none');
}



// Reset password:
async function onSubmit(event) {
    event.preventDefault();
    let formData = new FormData(event.target); // Create a FormData based on our Form Element in HTML
    let response = await action(formData);

    if (response.ok) {
        sentEmailNotification();
    } else {
        sentEmailProblemNotification();
    }

    document.getElementById('email').value = '';
    closeResetDialog();
}


function action(formData) {
    const input = "https://fabiancaspersdjango.pythonanywhere.com/send_reset_email/";
    const requestInit = {
        method: 'post',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    };

    return fetch(
        input,
        requestInit
    );
}



function sentEmailNotification() {
    document.getElementById('notification-send-email').classList.remove('d-none');

    setTimeout(function () {
        document.getElementById('notification-send-email').classList.add('d-none')
    }, 3000)
}


function sentEmailProblemNotification() {
    document.getElementById('notification-send-email-problem').classList.remove('d-none');

    setTimeout(function () {
        document.getElementById('notification-send-email-problem').classList.add('d-none')
    }, 3000)
}


/* Beginn Django Backend */


async function signUp(e) {
    e.preventDefault();

    let name = document.getElementById('signup-name');
    let email = document.getElementById('signup-mail');
    let password = document.getElementById('signup-password');

    let user = {
        'username': name.value,
        'email': email.value,
        'password': password.value
    };

    try {
        const response = await fetch('https://fabiancaspersdjango.pythonanywhere.com/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });


        if (response.ok) {
            name.value = '';
            email.value = '';
            password.value = '';
            signUpNotification();
            closeSignUpDialog();
        } else {
            // Fehlerbehandlung, falls die Registrierung fehlschlägt
        }
    } catch (error) {
        console.error('Fehler bei der Anfrage:', error);
    }

    return false;
}


async function logIn() {
    let email = document.getElementById('login-mail');
    let password = document.getElementById('login-password');

    try {
        const response = await fetch('https://fabiancaspersdjango.pythonanywhere.com/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'email': email.value, 'password': password.value }),
        });

        let json = await response.json();
        // localStorage.setItem('token', json.token);

        if (response.ok) {
            // localStorage.setItem('token', json.token);
            localStorage.setItem('username', json.username);
            email.classList.remove('wrong-email');
            password.classList.remove('wrong-password');
            email.classList.add('correct-email');
            password.classList.add('correct-password');
            window.location.href = '/html/home.html?token=' + json.token;  // geändert
        } else {
            // Fehlerbehandlung, falls der Login fehlschlägt
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}


// Funktion zum Abrufen des CSRF-Tokens
function getCSRFToken() {
    const csrfCookie = document.cookie.split(';').find((c) => c.trim().startsWith('csrftoken='));
    if (!csrfCookie) return null;
    return csrfCookie.split('=')[1];
}

async function guestLogin() {
    let email = "guest@join.com";
    let password = "Guest1234";

    try {
        const response = await fetch('https://fabiancaspersdjango.pythonanywhere.com/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'email': email, 'password': password }),
        });

        let json = await response.json();
        // localStorage.setItem('token', json.token);

        if (response.ok) {
            // currentUser = 'Guest';
            // localStorage.setItem('token', json.token);
            localStorage.setItem('username', json.username);
            window.location.href = '/html/home.html?token=' + json.token;  // geändert
        } else {
            console.error('Gast-Login fehlgeschlagen:', json.detail);
        }
    } catch (error) {
        console.error('Fehler beim Gast-Login:', error);
    }
}

