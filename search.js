
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
        }
    };

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
});
