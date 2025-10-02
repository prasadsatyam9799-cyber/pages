
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    const pages = ['index.html', 'about.html', 'contact.html', 'privacy.html', 'terms.html'];

    searchButton.addEventListener('click', function () {
        const query = searchInput.value.toLowerCase();
        searchResults.innerHTML = '';

        if (query.length === 0) {
            return;
        }

        pages.forEach(page => {
            fetch(page)
                .then(response => response.text())
                .then(text => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');
                    const content = doc.body.textContent.toLowerCase();
                    
                    if (content.includes(query)) {
                        const result = document.createElement('a');
                        result.href = page;
                        result.textContent = doc.title;
                        searchResults.appendChild(result);
                        searchResults.appendChild(document.createElement('br'));
                    }
                });
        });
    });
});
