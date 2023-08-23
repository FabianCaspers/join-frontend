async function init() {
    await includeHTML();
    setURL("http://127.0.0.1:8000/");
}


// Log Out Dialog:
function showLogOutDialog() {
    document.getElementById('dialog').classList.toggle('d-none');
}