// Hämta data för öl från API:et
fetch('https://api.punkapi.com/v2/beers?per_page=80')
    .then(response => response.json())
    .then(data => {
        console.log('Beers data:', data);
        console.log('API response:', data);

        const maltSelect = document.getElementById('malt');
        const hopsSelect = document.getElementById('hops');

        // Använda endast de första 10 ölarna som exempel
        data.slice(0, 10).forEach(beer => {
            // Lägg till maltalternativ i select-elementet
            beer.ingredients.malt.forEach(malt => {
                const option = document.createElement('option');
                option.value = malt.name;
                option.textContent = malt.name;
                maltSelect.appendChild(option);
            });

            // Lägg till humlealternativ i select-elementet
            beer.ingredients.hops.forEach(hop => {
                const option = document.createElement('option');
                option.value = hop.name;
                option.textContent = hop.name;
                hopsSelect.appendChild(option);
            });
        });
    })
    .catch(error => {
        console.error('Error fetching search results:', error);
        if (error.message === 'Invalid query params') {
            // Logga detaljer om ogiltiga sökparametrar
            console.error('Invalid search parameters.', error.data);
        } else {
            // Övriga felhanteringsåtgärder
        }
    });

document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const beerName = formData.get('name');
    const abvGreaterThan = formData.get('abvGreaterThan');
    const abvLessThan = formData.get('abvLessThan');
    const brewedBefore = formData.get('brewedBefore');
    const brewedAfter = formData.get('brewedAfter');
    const searchParams = new URLSearchParams(formData);

    // Ta bort hops och malt från sökparametrarna om de är tomma
    if (searchParams.get('hops') === '') {
        searchParams.delete('hops');
    }
    if (searchParams.get('malt') === '') {
        searchParams.delete('malt');
    }
    if (beerName) {
        searchParams.delete('name'); // Ta bort 'name' från sökparametrarna
        searchParams.append('beer_name', `^${beerName}`); // Lägg till 'beer_name' med reguljärt uttryck för början av namnet
    }
    if (abvGreaterThan) {
        searchParams.append('abv_gt', abvGreaterThan);
    }

    if (abvLessThan) {
        searchParams.append('abv_lt', abvLessThan);
    }

    if (brewedBefore) {
        searchParams.append('brewed_before', brewedBefore);
    }

    if (brewedAfter) {
        searchParams.append('brewed_after', brewedAfter);
    }





    const searchUrl = `https://api.punkapi.com/v2/beers?per_page=80&${searchParams.toString()}`;
    console.log('Search URL:', searchUrl);

    // Kolla om sökresultatet redan finns i cachet
    const cachedResult = sessionStorage.getItem(searchUrl);
    if (cachedResult) {
        displayResults(JSON.parse(cachedResult));
    } else {
        // Hämta data från API:et
        fetch(searchUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Invalid query params');
                }
                return response.json();
            })
            .then(data => {
                // Kontrollera om API-svaret är ett felmeddelande
                if (data.statusCode && data.error && data.message) {
                    throw new Error(data.message);
                }

                // Spara sökresultatet i cachet
                sessionStorage.setItem(searchUrl, JSON.stringify(data));
                displayResults(data);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
                // Hantera felet, t.ex. visa ett felmeddelande för användaren
            });
    }
});

function displayResults(results) {
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = '';

    // Kontrollera om results är en array eller om det är ett objekt med en data-egenskap som är en array
    if (Array.isArray(results) || (results.data && Array.isArray(results.data))) {
        const beers = Array.isArray(results) ? results : results.data;
        beers.forEach(beer => {
            const beerDiv = document.createElement('div');
            beerDiv.textContent = beer.name;
            searchResultsDiv.appendChild(beerDiv);
        });
    } else {
        console.error('Invalid search results format:', results);
        // Hantera felaktigt format, t.ex. visa ett felmeddelande för användaren
    }
}
