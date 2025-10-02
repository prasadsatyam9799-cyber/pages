
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchButton.addEventListener('click', function () {
        const query = searchInput.value.toLowerCase();
        searchResults.innerHTML = '';

        if (query.length === 0) {
            return;
        }

        searchResults.innerHTML = '<p>Loading...</p>';

        fetch('sitemap.xml')
            .then(response => response.text())
            .then(text => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(text, 'text/xml');
                const urls = Array.from(xmlDoc.getElementsByTagName('loc')).map(loc => loc.textContent);
                let found = false;

                const promises = urls.map(url => {
                    return fetch(url)
                        .then(response => response.text())
                        .then(text => {
                            const docParser = new DOMParser();
                            const doc = docParser.parseFromString(text, 'text/html');
                            const content = doc.body.textContent.toLowerCase();
                            
                            if (content.includes(query)) {
                                found = true;
                                const result = document.createElement('a');
                                result.href = url;
                                result.textContent = doc.title;
                                searchResults.appendChild(result);
                                searchResults.appendChild(document.createElement('br'));
                            }
                        });
                });

                Promise.all(promises).then(() => {
                    if (!found) {
                        searchResults.innerHTML = '<p>No results found.</p>';
                    } else {
                        // Remove the loading message
                        const loadingMessage = searchResults.querySelector('p');
                        if (loadingMessage && loadingMessage.textContent === 'Loading...') {
                            searchResults.removeChild(loadingMessage);
                        }
                    }
                });
            });
    });
});
