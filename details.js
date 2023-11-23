document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const beerId = params.get('id');

    fetch(`https://api.punkapi.com/v2/beers/${beerId}`)
        .then(response => response.json())
        .then(data => {
            const beerDetails = data[0];

            
            document.getElementById('beerImage').src = beerDetails.image_url;
            document.getElementById('beerName').textContent = beerDetails.name;
            document.getElementById('beerDescription').textContent = beerDetails.description;
            
            document.getElementById('beerABV').textContent = `Alcohol by Volume: ${beerDetails.abv}%`;
            document.getElementById('beerVolume').textContent = `Volume: ${beerDetails.volume.value} ${beerDetails.volume.unit}`;
            document.getElementById('beerIngredients').textContent = `Ingredients: ${beerDetails.ingredients.malt.map(malt => malt.name).join(', ')}`;
            document.getElementById('beerHops').textContent = `Hops: ${beerDetails.ingredients.hops.map(hop => hop.name).join(', ')}`;
            document.getElementById('beerFoodPairing').textContent = `Food Pairing: ${beerDetails.food_pairing.join(', ')}`;
            document.getElementById('brewersTips').textContent = `Brewers Tips: ${beerDetails.brewers_tips}`;
        })
        .catch(error => console.error('Error:', error));
});
