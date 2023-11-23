document.getElementById('fetchRandomBeer').addEventListener('click', () => {
    fetch('https://api.punkapi.com/v2/beers/random')
        .then(response => response.json())
        .then(data => {
            // Extract information from the response
            const beerImage = data[0].image_url;
            const beerName = data[0].name;
            const beerTagline = data[0].tagline;
            const beerDescription = data[0].description;
            
            
            const beerCardInfo = document.getElementById('beerCard');
            const imageElement = document.createElement('img');
            const h2 = document.createElement('h2');
            const taglineParagraph = document.createElement('p');
            const descriptionParagraph = document.createElement('p');
            const seeMore = document.createElement('button');
           

            imageElement.src = beerImage;
            h2.textContent = beerName;
            taglineParagraph.textContent = `Tagline:${beerTagline}`;
            descriptionParagraph.textContent = `Description: ${beerDescription}`
            seeMore.textContent = "See More >"
           
            beerCardInfo.textContent = '';
            beerCardInfo.appendChild(imageElement);
            beerCardInfo.appendChild(h2);
            beerCardInfo.appendChild(seeMore);

            seeMore.addEventListener('click', () => {
                const url = `info.html?id=${encodeURIComponent(data[0].id)}&name=${encodeURIComponent(beerName)}&tagline=${encodeURIComponent(beerTagline)}&description=${encodeURIComponent(beerDescription)}`;
                window.location.href = url;
            })
        })
        .catch(error => console.error('Error:', error));
});