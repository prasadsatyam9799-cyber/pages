
document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.getElementById('search-results-container');
    const query = new URLSearchParams(window.location.search).get('query');

    if (query) {
        fetch('search-index.json')
            .then(response => response.json())
            .then(data => {
                const results = data.filter(item => 
                    item.title.toLowerCase().includes(query.toLowerCase()) || 
                    item.content.toLowerCase().includes(query.toLowerCase())
                );

                if (results.length > 0) {
                    results.forEach(result => {
                        const resultCard = document.createElement('div');
                        resultCard.className = 'result-card';

                        const title = document.createElement('h3');
                        title.textContent = result.title;

                        const snippet = document.createElement('p');
                        snippet.textContent = result.content.substring(0, 150) + '...';

                        const link = document.createElement('a');
                        link.href = result.url;
                        link.textContent = 'Read More';
                        link.innerHTML += '<span class="material-icons">arrow_forward</span>';

                        resultCard.appendChild(title);
                        resultCard.appendChild(snippet);
                        resultCard.appendChild(link);
                        resultsContainer.appendChild(resultCard);
                    });
                } else {
                    resultsContainer.innerHTML = '<p>No results found.</p>';
                }
            });
    }
});
