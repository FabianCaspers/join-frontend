async function init() {
    await includeHTML();
    setURL("https://darkjoin.fabiancaspers.com/smallest_backend");
}


// Log Out Dialog:
function showLogOutDialog() {
    document.getElementById('dialog').classList.toggle('d-none');
}