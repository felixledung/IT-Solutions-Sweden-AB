document.addEventListener("DOMContentLoaded", () => {
    // Tooltip functionality for social media links
    document.querySelectorAll(".socials li a").forEach((link, i, links) => {
        const tooltipText = link.getAttribute("title") || link.querySelector('i').className.split(' ').pop().replace('fa-', '').replace('-', '');
        const position = (i === 0) ? 'left' : (i === links.length - 1) ? 'right' : 'bottom';

        const tooltipSpan = document.createElement('span');
        tooltipSpan.className = `tooltiptext ${position}`;
        tooltipSpan.textContent = tooltipText.charAt(0).toUpperCase() + tooltipText.slice(1);

        link.parentElement.classList.add('tooltip');
        link.parentElement.appendChild(tooltipSpan);
    });

    // Fetching words for typing effect
    fetch('json/typing_words.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const words = data.words;
            const dynamicText = document.querySelector("p span");
            let wordIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            const typeEffect = () => {
                const currentWord = words[wordIndex];
                dynamicText.textContent = currentWord.substring(0, charIndex);
                dynamicText.classList.add("stop-blinking");

                if (!isDeleting) {
                    charIndex++;
                    if (charIndex > currentWord.length) {
                        isDeleting = true;
                    }
                } else {
                    charIndex--;
                    if (charIndex <= 0) {
                        isDeleting = false;
                        wordIndex = (wordIndex + 1) % words.length;
                    }
                }

                setTimeout(typeEffect, isDeleting ? 100 : 200);
                if (charIndex === 0 && !isDeleting) {
                    setTimeout(() => dynamicText.classList.remove("stop-blinking"), 1200);
                }
            };

            typeEffect();
        })
        .catch(error => console.error('Error fetching words:', error));

    // Set the current year in the copyright
    document.getElementById("year").textContent = new Date().getFullYear();
});