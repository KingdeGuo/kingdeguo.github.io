(function() {
  function displaySearchResults(results, store) {
    const searchResults = document.getElementById('search-results');
    if (results.length) {
      let resultList = '';
      results.forEach(result => {
        const item = store[result.ref];
        resultList += `<li><a href="${item.url}">${item.title}</a><p>${item.date}</p></li>`;
      });
      searchResults.innerHTML = resultList;
    } else {
      searchResults.innerHTML = '<li>No results found.</li>';
    }
  }

  const searchInput = document.getElementById('search-input');
  if (!searchInput) {
    return;
  }

  let idx = null;
  let store = {};

  // Fetch the search data
  fetch('/search.json')
    .then(response => response.json())
    .then(data => {
      store = data.reduce((acc, item, i) => {
        acc[i] = item;
        return acc;
      }, {});

      idx = lunr(function () {
        this.ref('id');
        this.field('title', { boost: 10 });
        this.field('content');

        data.forEach((doc, i) => {
          this.add({ ...doc, id: i });
        });
      });
    });

  searchInput.addEventListener('keyup', function (e) {
    if (!idx) return;
    const query = e.target.value;
    if (query.length < 2) {
        document.getElementById('search-results').innerHTML = '';
        return;
    }
    const results = idx.search(query);
    const storeForDisplay = Object.keys(store).reduce((acc, key) => {
        acc[key] = store[key];
        return acc;
    }, {});
    displaySearchResults(results, storeForDisplay);
  });
})();
