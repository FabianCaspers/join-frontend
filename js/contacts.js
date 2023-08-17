async function initContacts() {
    await includeHTML();
    setURL("http://127.0.0.1:8000/contacts/");
    await loadAllContacts();
    activeContactsNavLink();
    showAllContacts();
}


let allInitials = [];
let allNames = [];
let allContacts = [];
let color = getRandomColor();
console.log("Color inside addNewContact:", color);


async function addNewContact(e) {
    e.preventDefault();

    let contactName = document.getElementById('contact-name');
    let contactEmail = document.getElementById('contact-email');
    let contactPhone = document.getElementById('contact-phone');
    let contactCompany = document.getElementById('contact-company');

    let contact = {
        'name': contactName.value,
        'email': contactEmail.value,
        'number': contactPhone.value,
        'company': contactCompany.value,
        'color': getRandomColor()
    }


    let savedContact = await saveAllContacts(contact);
    if (savedContact) {
        allContacts.push(savedContact);
        showAllContacts();
        closeNewContactDialog();
    }


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


function renderContactDetails(contactIndex) {

    let contact = allContacts[contactIndex];
    if (!contact) {
        console.error(`No contact found with ID ${contactIndex}`);
        return;
    }
    
    let contactDetailsContainer = document.getElementById('contact-detail');
    contactDetailsContainer.innerHTML = '';

    contactDetailsContainer.innerHTML = /*html*/ `
        <div class="contact-details-header">
            <div class="contact-circle-container" style="background-color: ${contact['color']}">
                <p class="initials">${contact['name'].split(" ").map(word => word[0]).join("")}</p>
            </div>
            <div class="contact-name-container">
                <p class="contact-name">${contact['name']}</p>
            </div>
        </div>
        <div class="contact-information-container">
            <p>Contact Information:</p>
        </div>
        <div class="contact-email-container">
            <p class="headline">Email</p>
            <p class="mail-address">${contact['email']}</p>
        </div>
        <div class="contact-email-container">
            <p class="headline">Phone</p>
            <p class="phone-number">${contact['number']}</p>
        </div>
        <div class="contact-company-container">
            <p class="headline">Company</p>
            <p class="company-name">${contact['company']}</p>
        </div>
    `;
    showDeleteContactButton(contactIndex);
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


function showDeleteContactButton(contactIndex) {
    let buttonContainer = document.getElementById('delete-button-container');
    buttonContainer.innerHTML = '';
    buttonContainer.innerHTML += /*html*/ `
        <input onclick="deleteContact(${contactIndex})" type="button" id="delete-button" class="d-none delete-contact-button" type="button" value="Delete Contact"></a>
    `;

    let deleteButton = document.getElementById('delete-button');
    deleteButton.classList.remove('d-none');
}


async function deleteContact(contactIndex) {
    let contactId = allContacts[contactIndex].id;

    try {
        let response = await fetch(`http://127.0.0.1:8000/contacts/${contactId}/`, {
            method: 'DELETE'
        });

        if (response.ok) {
            allContacts.splice(contactIndex, 1);
            showAllContacts();
            location.reload();
        } else {
            console.error('Failed to delete the contact:', await response.text());
        }
    } catch (error) {
        console.error('Error deleting the contact:', error);
    }
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    console.log("Generated color:", color);
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


async function saveAllContacts(contact) {
    const response = await fetch("http://127.0.0.1:8000/contacts/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
    });
    const data = await response.json();

    if (response.status !== 201) {
        console.error('Failed to save contact:', await response.text());
        return null;
    }
    return data;
}


async function loadAllContacts() {
    const response = await fetch("http://127.0.0.1:8000/contacts/");

    if (response.status !== 200) {
        console.error('Failed to fetch contacts:', await response.text());
        return [];
    }

    const data = await response.json();
    allContacts = Array.isArray(data) ? data : []; 
    return allContacts;
}