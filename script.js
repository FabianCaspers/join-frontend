async function init() {
    extractTokenFromURL();
    await includeHTML();
    setURL("https://fabiancaspersdjango.pythonanywhere.com/");
}


// Log Out Dialog:
function showLogOutDialog() {
    document.getElementById('dialog').classList.toggle('d-none');
}

let token = "";

function extractTokenFromURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    token = urlParams.get('token');
    console.log(token)
    localStorage.setItem('token', token);
}


function handleLogout() {
    // const token = localStorage.getItem('token');
    localStorage.removeItem('token');
    window.location.href = "../index.html";
}

