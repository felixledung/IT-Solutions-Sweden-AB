document.addEventListener('DOMContentLoaded', () => {
    const choosePrinter = document.getElementById('choosePrinter');
    const dropdown = document.getElementById('dropdown');
    const caret = choosePrinter.querySelector('.fa-caret-down');

    choosePrinter.addEventListener('click', () => {
        dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
        caret.classList.toggle('rotate');
    });

    window.addEventListener('click', (event) => {
        if (!event.target.matches('#choosePrinter') && !event.target.closest('#dropdown')) {
            if (dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
                caret.classList.remove('rotate');
            }
        }
    });
});