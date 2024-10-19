document.addEventListener('DOMContentLoaded', function () {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-btn');
    const declineBtn = document.getElementById('decline-btn');
    const cookieIcon = document.getElementById('cookieBtn');
    const closeCookie = document.getElementById('close-btn');

    // Kontrollera om användaren redan har gjort ett val
    const cookiePreference = localStorage.getItem('cookiePreference');

    if (!cookiePreference) {
        cookieBanner.style.display = 'flex';
    }

    // Funktion för att spara användarens val
    function setCookiePreference(preference) {
        localStorage.setItem('cookiePreference', preference);
        cookieBanner.style.display = 'none';
    }

    // Lyssnare för 'Accept' och 'Decline' knapparna
    acceptBtn?.addEventListener('click', () => setCookiePreference('accepted'));
    declineBtn?.addEventListener('click', () => setCookiePreference('rejected'));

    // Visar cookie-bannern när cookie-ikonen klickas
    cookieIcon?.addEventListener('click', () => {
        cookieBanner.style.display = 'flex';
    });

    // Stänger cookie-bannern när 'close' knappen klickas
    closeCookie?.addEventListener('click', () => {
        cookieBanner.style.display = 'none';
    });

    // Stänger cookie-bannern om användaren klickar utanför den
    window.addEventListener('click', (event) => {
        if (event.target === cookieBanner) {
            cookieBanner.style.display = 'none';
        }
    });

    // Uppdatera det aktuella året
    document.getElementById('current-year').textContent = new Date().getFullYear();
});