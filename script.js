async function init() {
    await includeHTML();
    setURL("https://fabiancaspersdjango.pythonanywhere.com/");
}


// Log Out Dialog:
function showLogOutDialog() {
    document.getElementById('dialog').classList.toggle('d-none');
}