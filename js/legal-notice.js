async function initLegalNotice() {
    await includeHTML();
    setURL("https://darkjoin.fabiancaspers.com/smallest_backend");
    activeLegalNoticeLink();
}


function activeLegalNoticeLink() {
    document.getElementById('legalnotice-link').classList.add('active-link')
}