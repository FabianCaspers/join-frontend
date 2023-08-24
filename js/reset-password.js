async function initResetPassword() {
    setURL("https://fabiancaspersdjango.pythonanywhere.com/");
}


let uidb64 = "";
let token = "";

function extractTokenAndUIDFromURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    uidb64 = urlParams.get('uid');
    token = urlParams.get('token');
    console.log(token, uidb64)
}

async function onSubmitPW(e) {
    e.preventDefault();
    
    extractTokenAndUIDFromURL();
    
    const newPW = document.getElementById('password').value;
    
    const response = await fetch(`https://fabiancaspersdjango.pythonanywhere.com/reset_password/${uidb64}/${token}/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPW })
    });

    const data = await response.json();

    if (response.status === 200) {
        passwordNotification();
        backToLoginBtn();
    } else {
        alert(data.error || 'Ein Fehler ist aufgetreten.');
    }

    document.getElementById('password').value = "";
}

function passwordNotification() {
    document.getElementById('notification-password').classList.remove('d-none');

    setTimeout(function () {
        document.getElementById('notification-password').classList.add('d-none')
    }, 2500)
}

function backToLoginBtn() {
    document.getElementById('back-to-login').classList.remove('d-none');
    window.location.href = '/html/index.html';
}

