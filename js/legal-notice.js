async function initLegalNotice() {
    await includeHTML();
    setURL("https://fabiancaspersdjango.pythonanywhere.com/");
    activeLegalNoticeLink();
}


function activeLegalNoticeLink() {
    document.getElementById('legalnotice-link').classList.add('active-link')
}