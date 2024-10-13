class DocumentManager {
    constructor({ fileListId, documentTitleId, documentContentId, yearElementId, documents, sectionsConfig, themeToggleId }) {
        this.fileList = document.getElementById(fileListId);
        this.documentTitle = document.getElementById(documentTitleId);
        this.documentContent = document.getElementById(documentContentId);
        this.yearElement = document.getElementById(yearElementId);
        this.documents = documents;
        this.sectionsConfig = sectionsConfig;
        this.themeToggle = document.getElementById(themeToggleId);
        this.savedScrollPosition = 0;
        this.init();
    }

    init() {
        this.updateYear();
        this.sortDocuments();
        this.renderDocumentList();
        this.addThemeToggleListener();
        this.loadDocumentFromLocalStorage();
        this.autoRestoreScroll();
    }

    // Sort documents alphabetically by title
    sortDocuments() {
        this.documents.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Update the current year in the footer
    updateYear() {
        this.yearElement.textContent = new Date().getFullYear();
    }

    // Render the list of documents in the sidebar
    renderDocumentList() {
        this.fileList.innerHTML = '';  // Clear existing list
        this.documents.forEach(doc => {
            const docElement = this.createElement('p', doc.title, ['document-link'], () => this.loadDocument(doc));
            this.fileList.appendChild(docElement);
        });
    }

    // Load the selected document and display its content
    async loadDocument(doc) {
        try {
            this.savedScrollPosition = window.scrollY;  // Save scroll position
            const data = await this.fetchDocument(doc.file);
            this.documentTitle.innerText = data.title;
            this.updateUrl(doc.id);
            this.setActiveDocument(doc.title);
            this.documentContent.innerHTML = this.buildContent(data);
            window.scrollTo(0, 0);  // Reset scroll to top
            localStorage.setItem('selectedDocumentId', doc.id);  // Store selected document in localStorage
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    // Fetch document data from a JSON file
    async fetchDocument(file) {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to fetch ${file}`);
        return response.json();
    }

    // Update the browser URL without reloading the page
    updateUrl(docId) {
        const newUrl = `${window.location.origin}${window.location.pathname}?doc=${docId}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }

    // Highlight the active document in the sidebar
    setActiveDocument(docTitle) {
        [...this.fileList.children].forEach(p => p.classList.toggle('active', p.innerText === docTitle));
    }

    // Build content dynamically from JSON data
    buildContent(data) {
        return this.sectionsConfig.map(({ key, label, link }) => {
            const sectionContent = this.createSection(data[key], label, link);
            return sectionContent ? sectionContent : this.buildDynamicSections(data); // For any additional fields
        }).join('');
    }

    // Create each section based on JSON structure
    createSection(data, label, link = false) {
        if (!data) return '';

        let content = `<h2>${label}</h2><p>${data.description || ''}</p>`;
        if (link && data.url) content += `<strong>Webbplats:</strong> <a href="${data.url}" target="_blank">${data.url}</a><br>`;

        ['types', 'purposes'].forEach(key => {
            if (data[key]) {
                content += `<ul>${data[key].map(item => `<li>${item}</li>`).join('')}</ul>`;
            }
        });
        return content;
    }

    // For any additional fields that aren't predefined in sectionsConfig
    buildDynamicSections(data) {
        const ignoredKeys = this.sectionsConfig.map(section => section.key);
        return Object.keys(data).map(key => {
            if (ignoredKeys.includes(key) || !data[key]) return ''; // Skip predefined keys
            const label = key.replace(/_/g, ' ').toUpperCase(); // Convert key to a label
            return this.createSection(data[key], label);
        }).join('');
    }

    // Load selected document from localStorage after page reload
    loadDocumentFromLocalStorage() {
        const selectedDocId = localStorage.getItem('selectedDocumentId');
        const docIdFromUrl = new URLSearchParams(window.location.search).get('doc');
        const docId = docIdFromUrl || selectedDocId;

        if (docId) {
            const doc = this.documents.find(d => d.id === docId);
            if (doc) {
                this.loadDocument(doc);
            }
        }
    }

    // Helper function to create a DOM element
    createElement(tag, text, classes = [], onClick = null) {
        const element = document.createElement(tag);
        element.innerText = text;
        if (classes.length) element.classList.add(...classes);
        if (onClick) element.addEventListener('click', onClick);
        return element;
    }

    // Dark Mode Toggle
    addThemeToggleListener() {
        this.themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });

        // Load saved theme
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }

    // Restore Scroll Position when Navigating Back to a Document
    autoRestoreScroll() {
        window.addEventListener('popstate', () => {
            window.scrollTo(0, this.savedScrollPosition || 0);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const config = {
        fileListId: "fileList",
        documentTitleId: "documentTitle",
        documentContentId: "documentContent",
        yearElementId: "currentYear",
        themeToggleId: "themeToggle",
        documents: [
            { title: "Användarvillkor", file: "json/terms_of_use.json", id: "terms" },
            { title: "Sekretesspolicy", file: "json/privacy_policy.json", id: "privacy" },
            { title: "Köpvillkor", file: "json/purchase_conditions.json", id: "purchase" },
            { title: "Nedladdning Av Programvara", file: "json/software_download.json", id: "download_software" },
            { title: "Hantering av AI", file: "json/ai_management.json", id: "ai_management" }
        ],
        sectionsConfig: [
            { key: 'effective_date', label: 'Effektiv datum' },
            { key: 'company', label: 'Företag' },
            { key: 'website', label: 'Webbplats', link: true },
            { key: 'introduction', label: 'Introduktion' },
            { key: 'information_collected', label: 'Insamlad information' },
            { key: 'how_we_use_information', label: 'Hur vi använder information' },
            { key: 'data_protection', label: 'Dataskydd' },
            { key: 'sharing_information', label: 'Delning av information' },
            { key: 'your_rights', label: 'Dina rättigheter' },
            { key: 'changes_to_privacy_policy', label: 'Ändringar i Sekretesspolicy' },
            { key: 'contact_information', label: 'Kontaktinformation' }
        ]
    };

    new DocumentManager(config);
});
