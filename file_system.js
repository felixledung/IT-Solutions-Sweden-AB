document.addEventListener("DOMContentLoaded", function () {
    const fileList = document.getElementById("fileList");
    const documentTitle = document.getElementById("documentTitle");
    const documentContent = document.getElementById("documentContent");
    const yearElement = document.getElementById("year");

    // Uppdatera år i footern
    yearElement.textContent = new Date().getFullYear();

    // Lista över dokument
    const documents = [
        {
            title: "Användarvillkor",
            file: "json/terms_of_use.json",
            id: "terms"
        },
        {
            title: "Sekretesspolicy",
            file: "json/privacy_policy.json",
            id: "privacy"
        },
        {
            title: "Köpvillkor",
            file: "json/purchase_conditions.json",
            id: "purchase_conditions"
        },
        {
            title: "Nedladdning Av Programvara", // Rättat stavfel här
            file: "json/software_download.json", // Rättat filnamnet här
            id: "download_software"
        },
        {
            title: "Hantering av AI",
            file: "json/ai_management.json",
            id: "ai_management"
        }
    ];

    // Dynamiskt generera dokumentlistan
    documents.forEach(doc => {
        const docElement = document.createElement("p");
        docElement.innerText = doc.title;
        docElement.classList.add("document-link");
        docElement.addEventListener("click", () => {
            loadDocument(doc.file, doc.id, docElement);
        });
        fileList.appendChild(docElement);
    });

    // Funktion för att hämta och visa dokument och uppdatera URL
    function loadDocument(file, docId, element) {
        fetch(file)
            .then(response => response.json())
            .then(data => {
                documentTitle.innerText = data.title;

                // Uppdatera URL med dokumentets ID
                const newUrl = `${window.location.origin}${window.location.pathname}?doc=${docId}`;
                window.history.pushState({ path: newUrl }, '', newUrl);

                // Ta bort "active"-klassen från alla dokumentlänkar
                document.querySelectorAll(".documents p").forEach(p => p.classList.remove("active"));

                // Lägg till "active"-klassen på det valda elementet
                if (element) {
                    element.classList.add("active");
                }

                // Bygg dokumentinnehållet (samma innehållshantering som tidigare)
                let content = `
                    <strong>Effektiv datum:</strong> ${data.effective_date || ''}<br>
                    <strong>Företag:</strong> ${data.company || ''}<br>
                    ${data.website ? `<strong>Webbplats:</strong> <a href="${data.website}" target="_blank">${data.website}</a><br>` : ''}
                    ${data.introduction ? `<h2>Introduktion</h2><p>${data.introduction.description}</p>` : ''}
                    ${data.information_collected ? `
                        <h2>Insamlad information</h2>
                        <p>${data.information_collected.description}</p>
                        <ul>${data.information_collected.types.map(type => `<li>${type}</li>`).join('')}</ul>
                    ` : ''}
                    ${data.how_we_use_information ? `
                        <h2>Hur vi använder information</h2>
                        <p>${data.how_we_use_information.description}</p>
                        <ul>${data.how_we_use_information.purposes.map(purpose => `<li>${purpose}</li>`).join('')}</ul>
                    ` : ''}
                    ${data.data_protection ? `
                        <h2>Dataskydd</h2>
                        <p>${data.data_protection.description}</p>
                        <ul>${data.data_protection.measures.map(measure => `<li>${measure}</li>`).join('')}</ul>
                    ` : ''}
                    ${data.sharing_information ? `
                        <h2>Delning av information</h2>
                        <p>${data.sharing_information.description}</p>
                        <ul>${data.sharing_information.situations.map(situation => `<li>${situation}</li>`).join('')}</ul>
                    ` : ''}
                    ${data.your_rights ? `
                        <h2>Dina rättigheter</h2>
                        <p>${data.your_rights.description}</p>
                        <ul>${data.your_rights.rights.map(right => `<li>${right}</li>`).join('')}</ul>
                    ` : ''}
                    ${data.changes_to_privacy_policy ? `<h2>Ändringar i Sekretesspolicy</h2><p>${data.changes_to_privacy_policy.description}</p>` : ''}
                    ${data.contact_information ? `
                        <h2>Kontaktinformation</h2>
                        <p>${data.contact_information.description}</p>
                        <strong>Email:</strong> ${data.contact_information.email || ''}<br>
                        <strong>Adress:</strong> ${data.contact_information.address || ''}<br>
                    ` : ''}
                    ${data.services ? `
                        <h2>Tjänster</h2>
                        <p>${data.services.description}</p>
                        <p><strong>Tillgänglighet:</strong> ${data.services.availability}</p>
                    ` : ''}
                    ${data.website_usage ? `
                        <h2>Användning av Webbplatsen</h2>
                        <p>${data.website_usage.description}</p>
                        <ul>${data.website_usage.prohibitions.map(prohibition => `<li>${prohibition}</li>`).join('')}</ul>
                    ` : ''}
                    ${data.user_generated_content ? `
                        <h2>Användargenererat Innehåll</h2>
                        <p>${data.user_generated_content.description}</p>
                        <p>${data.user_generated_content.responsibility}</p>
                    ` : ''}
                    ${data.disclaimer ? `
                        <h2>Ansvarsfriskrivning</h2>
                        <p>${data.disclaimer.description}</p>
                        <p>${data.disclaimer.efforts}</p>
                    ` : ''}
                    ${data.third_party_links ? `
                        <h2>Tredjepartslänkar</h2>
                        <p>${data.third_party_links.description}</p>
                        <p>${data.third_party_links.advice}</p>
                    ` : ''}
                    ${data.privacy_policy ? `<h2>Integritetspolicy</h2><p>${data.privacy_policy.description}</p>` : ''}
                    ${data.changes_to_terms ? `<h2>Ändringar i Villkor</h2><p>${data.changes_to_terms.description}</p>` : ''}
                    ${data.governing_law ? `<h2>Gällande Lag</h2><p>${data.governing_law.description}</p>` : ''}
                    ${data.limitation_of_liability ? `<h2>Begränsning av Ansvar</h2><p>${data.limitation_of_liability.description}</p>` : ''}
                    ${data.contact_us ? `
                        <h2>Kontakta oss</h2>
                        <p>${data.contact_us.description}</p>
                        <strong>Email:</strong> ${data.contact_us.email || ''}<br>
                        <strong>Telefon:</strong> ${data.contact_us.phone || ''}<br>
                        <strong>Adress:</strong> ${data.contact_us.address || ''}<br>
                        <strong>Svarstid:</strong> ${data.contact_us.response_time || ''}<br>
                    ` : ''}
                `;

                documentContent.innerHTML = content;
            })
            .catch(error => console.error('Error fetching JSON:', error));
    }

    // Ladda dokument baserat på URL-parametern om det finns
    const params = new URLSearchParams(window.location.search);
    const docId = params.get('doc');
    if (docId) {
        const selectedDoc = documents.find(doc => doc.id === docId);
        if (selectedDoc) {
            const selectedElement = Array.from(document.querySelectorAll(".documents p")).find(p => p.innerText === selectedDoc.title);
            loadDocument(selectedDoc.file, selectedDoc.id, selectedElement);
        }
    }
});