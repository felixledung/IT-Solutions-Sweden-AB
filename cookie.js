document.addEventListener('DOMContentLoaded', function () {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-btn');
    const declineBtn = document.getElementById('decline-btn');
    const cookieIcon = document.getElementById('cookieBtn');
    const closeCookie = document.getElementById('close-btn');
    const cookieContent = document.querySelector('.cookie-content');

    // Kontrollera om localStorage är tillgängligt
    if (typeof localStorage !== 'undefined') {
        const cookiePreference = localStorage.getItem('cookiePreference');
        const hasSeenBanner = localStorage.getItem('hasSeenBanner');

        // Visa bannern om inget val är gjort
        if (!cookiePreference) {
            cookieBanner.style.display = 'flex';

            // Om användaren inte har sett bannern tidigare, göm 'close-btn'
            if (!hasSeenBanner) {
                closeCookie.style.display = 'none';
            }
        }

        // Funktion för att spara användarens val
        function setCookiePreference(preference) {
            localStorage.setItem('cookiePreference', preference);
            localStorage.setItem('hasSeenBanner', 'true'); // Markera att användaren har sett bannern
            cookieBanner.style.display = 'none';
        }

        // Lyssnare för 'Accept' och 'Decline' knapparna
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => setCookiePreference('accepted'));
        }
        if (declineBtn) {
            declineBtn.addEventListener('click', () => setCookiePreference('rejected'));
        }

        // Visar cookie-bannern när cookie-ikonen klickas
        if (cookieIcon) {
            cookieIcon.addEventListener('click', () => {
                cookieBanner.style.display = 'flex';
                closeCookie.style.display = 'block'; // Visa 'close-btn' när användaren öppnar bannern igen
            });
        }

        // Stänger cookie-bannern när 'close' knappen klickas
        if (closeCookie) {
            closeCookie.addEventListener('click', () => {
                cookieBanner.style.display = 'none';
            });
        }

        // Stänger cookie-bannern om användaren klickar utanför innehållet
        window.addEventListener('click', (event) => {
            if (cookieBanner.style.display === 'flex' && !cookieContent.contains(event.target)) {
                cookieBanner.style.display = 'none';
            }
        });
    } else {
        console.warn('localStorage är inte tillgängligt i denna webbläsare.');
    }

    // Uppdatera det aktuella året
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    } else {
        console.warn('Elementet för nuvarande år saknas.');
    }
});