async function initContacts() {
    await includeHTML();
    setURL("https://darkjoin.fabiancaspers.com/smallest_backend");
    await loadAllContacts();
    activeContactsNavLink();
    showAllContacts();
}


let allInitials = [];
let allNames = [];
let allContacts = [];


async function addNewContact(e) {
    e.preventDefault();

    let contactName = document.getElementById('contact-name');
    let contactEmail = document.getElementById('contact-email');
    let contactPhone = document.getElementById('contact-phone');
    let contactCompany = document.getElementById('contact-company');

    contact = {
        'name': contactName.value,
        'email': contactEmail.value,
        'phone': contactPhone.value,
        'company': contactCompany.value,
        'color': getRandomColor()
    }

    allContacts.push(contact);

    await saveAllContacts();
    showAllContacts();
    closeNewContactDialog();

    contactName.value = '';
    contactEmail.value = '';
    contactPhone.value = '';
    contactCompany.value = '';

    return false;
}


function showAllContacts() {
    getInitials();
    renderInitialBoxes();
}


function getInitials() {
    // Alle Namen herausfinden:
    getAllNames();

    // Anfangsbuchstaben herausfinden:
    getAllInitials();

    // Anfangsbuchstaben Alphabetisch sortieren:
    allInitials.sort();

    // Duplikate entfernen:
    allInitials = [...new Set(allInitials)];
}



function getAllNames() {
    for (let i = 0; i < allContacts.length; i++) {
        let names = allContacts[i]['name'];
        allNames.push(names);
    }
}


function getAllInitials() {
    for (let i = 0; i < allNames.length; i++) {
        let letter = allNames[i].charAt(0);
        allInitials.push(letter);
    }
}


function renderInitialBoxes() {
    let contactsNavContainer = document.getElementById('contacts-nav-container');
    contactsNavContainer.innerHTML = '';

    for (let i = 0; i < allInitials.length; i++) {

        contactsNavContainer.innerHTML += /*html*/ `
            <div id="contact-box${i}" class="contact-box">
                <div class="initial-section">
                    <p>${allInitials[i]}</p>
                </div>
                <hr>
                <div id="contact-section${i}" class="contact-section"></div>
            </div>
        `;

        filterNames(i);
    }
}


function filterNames(i) {
    for (let j = 0; j < allContacts.length; j++) {

        if (allContacts[j]['name'].charAt(0) === allInitials[i]) {
            document.getElementById(`contact-section${i}`).innerHTML += renderContactToInitials(j);
        }
    }
}


function renderContactToInitials(j) {
    return /*html*/ `
        <div onclick="renderContactDetails(${j}); renderContactDetailsMobile(${j})" class="single-contact">
            <div class="contact-circle" style="background-color: ${allContacts[j]['color']}">
                <p>${allContacts[j]['name'].split(" ").map(word => word[0]).join("")}</p>
            </div>
            <div class="contact-information">
                <p>${allContacts[j]['name']}</p>
                <p class="email">${allContacts[j]['email']}</p>
            </div>
        </div>
    `;
}


function renderContactDetails(j) {
    let contactDetailsContainer = document.getElementById('contact-detail');
    contactDetailsContainer.innerHTML = '';

    contactDetailsContainer.innerHTML = /*html*/ `
        <div class="contact-details-header">
            <div class="contact-circle-container" style="background-color: ${allContacts[j]['color']}">
                <p class="initials">${allContacts[j]['name'].split(" ").map(word => word[0]).join("")}</p>
            </div>
            <div class="contact-name-container">
                <p class="contact-name">${allContacts[j]['name']}</p>
            </div>
        </div>
        <div class="contact-information-container">
            <p>Contact Information:</p>
        </div>
        <div class="contact-email-container">
            <p class="headline">Email</p>
            <p class="mail-address">${allContacts[j]['email']}</p>
        </div>
        <div class="contact-email-container">
            <p class="headline">Phone</p>
            <p class="phone-number">${allContacts[j]['phone']}</p>
        </div>
        <div class="contact-company-container">
            <p class="headline">Company</p>
            <p class="company-name">${allContacts[j]['company']}</p>
        </div>
    `;
    showDeleteContactButton(j);
}


function renderContactDetailsMobile(j) {
    let mediaQuery = window.matchMedia('(max-width: 941px)')

    if (mediaQuery.matches) {
        let contactDetailsContainerMobile = document.getElementById('contact-details-mobile');
        contactDetailsContainerMobile.innerHTML = '';

        contactDetailsContainerMobile.innerHTML = /*html*/ `
            <div class="contact-details-container-mobile">
                <div class="contact-details-header">
                    <div class="contact-circle-container" style="background-color: ${allContacts[j]['color']}">
                        <p class="initials">${allContacts[j]['name'].split(" ").map(word => word[0]).join("")}</p>
                    </div>
                    <div class="contact-name-container">
                        <p class="contact-name">${allContacts[j]['name']}</p>
                    </div>
                    <div onclick="closeContactDetailsMobile()" class="backwards-icon-cnt">
                        <img src="../assets/icons/backwards.png" title="go back to all Contacts" alt="">
                    </div>
                </div>
                <div class="contact-information-container">
                    <p>Contact Information:</p>
                </div>
                <div class="contact-email-container">
                    <p class="headline">Email</p>
                    <p class="mail-address">${allContacts[j]['email']}</p>
                </div>
                <div class="contact-email-container">
                    <p class="headline">Phone</p>
                    <p class="phone-number">${allContacts[j]['phone']}</p>
                </div>
                <div class="contact-company-container">
                    <p class="headline">Company</p>
                    <p class="company-name">${allContacts[j]['company']}</p>
                </div>
                <div class="contact-button-container">
                    <input onclick="deleteContact(${j})" type="button" id="delete-button" class="d-none delete-contact-button-mobile" type="button" value="Delete Contact"></a>
                </div>
            </div>
        `;

        contactDetailsContainerMobile.classList.remove('d-none');
        showDeleteContactButton(j);
    }
}


function closeContactDetailsMobile() {
    let contactDetailsContainerMobile = document.getElementById('contact-details-mobile');
    contactDetailsContainerMobile.classList.add('d-none');
}


function showDeleteContactButton(j) {
    let buttonContainer = document.getElementById('delete-button-container');
    buttonContainer.innerHTML = '';
    buttonContainer.innerHTML += /*html*/ `
        <input onclick="deleteContact(${j})" type="button" id="delete-button" class="d-none delete-contact-button" type="button" value="Delete Contact"></a>
    `;

    let deleteButton = document.getElementById('delete-button');
    deleteButton.classList.remove('d-none');
}


async function deleteContact(j) {
    allContacts.splice(j, 1);
    await saveAllContacts();
    document.getElementById('contact-detail').innerHTML = '';
    showAllContacts();
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function activeContactsNavLink() {
    document.getElementById('contacts-link').classList.add('active-link');
    document.getElementById('contacts-link-mobile').classList.add('active-link');
}



function openNewContactDialog() {
    let contactDialog = document.getElementById('contact-dialog');
    contactDialog.classList.remove('d-none');
}


function closeNewContactDialog() {
    let contactDialog = document.getElementById('contact-dialog')
    contactDialog.classList.add('d-none');
}


async function saveAllContacts() {
    await backend.setItem('allContacts', JSON.stringify(allContacts));
}


async function loadAllContacts() {
    await downloadFromServer();
    allContacts = JSON.parse(backend.getItem('allContacts')) || [];
}