document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".socials li a").forEach((link, i, links) => {
        const tooltipText = link.getAttribute("title") || link.querySelector('i').className.split(' ').pop().replace('fa-', '').replace('-', '');
        const position = i === 0 ? 'left' : (i === links.length - 1 ? 'right' : 'bottom');

        const tooltipSpan = document.createElement('span');
        tooltipSpan.className = `tooltiptext ${position}`;
        tooltipSpan.textContent = tooltipText.charAt(0).toUpperCase() + tooltipText.slice(1);

        link.parentElement.classList.add('tooltip');
        link.parentElement.appendChild(tooltipSpan);
    });

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
                const currentChar = currentWord.substring(0, charIndex);
                dynamicText.textContent = currentChar;
                dynamicText.classList.add("stop-blinking");

                if (!isDeleting && charIndex < currentWord.length) {
                    charIndex++;
                    setTimeout(typeEffect, 200);
                } else if (isDeleting && charIndex > 0) {
                    charIndex--;
                    setTimeout(typeEffect, 100);
                } else {
                    isDeleting = !isDeleting;
                    dynamicText.classList.remove("stop-blinking");
                    wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
                    setTimeout(typeEffect, 1200);
                }
            }

            typeEffect();
        })
        .catch(error => console.error('Error fetching words:', error));
});

document.getElementById("current-year").textContent = new Date().getFullYear();