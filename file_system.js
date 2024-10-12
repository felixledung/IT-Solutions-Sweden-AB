document.addEventListener("DOMContentLoaded", function () {
    const fileList = document.getElementById("fileList");
    const documentTitle = document.getElementById("documentTitle");
    const documentContent = document.getElementById("documentContent");

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
        }
    ];

    // Dynamiskt generera dokumentlistan
    documents.forEach(doc => {
        const docElement = document.createElement("p");
        docElement.innerText = doc.title;
        docElement.addEventListener("click", () => {
            loadDocument(doc.file, doc.id);
        });
        fileList.appendChild(docElement);
    });

    // Funktion för att hämta och visa dokument och uppdatera URL
    function loadDocument(file, docId) {
        fetch(file)
            .then(response => response.json())
            .then(data => {
                documentTitle.innerText = data.title;

                // Uppdatera URL med dokumentets ID
                const newUrl = `${window.location.origin}${window.location.pathname}?doc=${docId}`;
                window.history.pushState({ path: newUrl }, '', newUrl);

                // Bygg dokumentinnehållet
                let content = `<strong>Effektiv datum:</strong> ${data.effective_date || ''}<br>
                               <strong>Företag:</strong> ${data.company || ''}<br>
                               <h2>Introduktion</h2>
                               <p>${data.introduction ? data.introduction.description : ''}</p>
                               <h2>Information som samlas in</h2>
                               <p>${data.information_collected ? data.information_collected.description : ''}</p>
                               <ul>${data.information_collected ? data.information_collected.types.map(item => `<li>${item}</li>`).join('') : ''}</ul>
                               <h2>Hur vi använder information</h2>
                               <p>${data.how_we_use_information ? data.how_we_use_information.description : ''}</p>
                               <ul>${data.how_we_use_information ? data.how_we_use_information.purposes.map(item => `<li>${item}</li>`).join('') : ''}</ul>
                               <h2>Dataskydd</h2>
                               <p>${data.data_protection ? data.data_protection.description : ''}</p>
                               <ul>${data.data_protection ? data.data_protection.measures.map(item => `<li>${item}</li>`).join('') : ''}</ul>
                               <h2>Delning av information</h2>
                               <p>${data.sharing_information ? data.sharing_information.description : ''}</p>
                               <ul>${data.sharing_information ? data.sharing_information.situations.map(item => `<li>${item}</li>`).join('') : ''}</ul>
                               <h2>Dina rättigheter</h2>
                               <p>${data.your_rights ? data.your_rights.description : ''}</p>
                               <ul>${data.your_rights ? data.your_rights.rights.map(item => `<li>${item}</li>`).join('') : ''}</ul>
                               <h2>Ändringar av sekretesspolicy</h2>
                               <p>${data.changes_to_privacy_policy ? data.changes_to_privacy_policy.description : ''}</p>
                               <h2>Kontaktinformation</h2>
                               <p>${data.contact_information ? data.contact_information.description : ''}</p>
                               <strong>Email:</strong> ${data.contact_information ? data.contact_information.email : ''}<br>
                               <strong>Adress:</strong> ${data.contact_information ? data.contact_information.address : ''}`;

                documentContent.innerHTML = content;
            })
            .catch(error => console.error('Error fetching JSON:', error));
    }
});