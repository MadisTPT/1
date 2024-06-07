document.addEventListener("DOMContentLoaded", fetchData);

function fetchData() {
    const container = document.getElementById("dataContainer");
    container.innerHTML = '<p>Loading...</p>';

    const episodeIds = Array.from({length: 19}, (_, i) => i + 1).join(',');
    fetch(`https://rickandmortyapi.com/api/episode/${episodeIds}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        displayData(data);
    })
    .catch(error => {
        displayError(error.message);
    });
}

function displayData(data) {
    const container = document.getElementById("dataContainer");
    container.innerHTML = '';

    const episodes = Array.isArray(data) ? data : [data];

    episodes.forEach(episode => {
        const episodeDiv = document.createElement('div');
        episodeDiv.classList.add('episode');
        episodeDiv.innerHTML = `
            <h2 class="episode-header">Episode ${episode.episode}: ${episode.name}</h2>
            <div class="character-list" style="display: none;">
                <p>Air Date: ${episode.air_date}</p>
                <p>Characters:</p>
                <ul id="characters-${episode.id}"></ul>
            </div>
        `;
        container.appendChild(episodeDiv);

        const charactersList = document.getElementById(`characters-${episode.id}`);
        episode.characters.forEach(characterUrl => {
            fetch(characterUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(characterData => {
                const characterName = characterData.name;
                const characterImage = characterData.image;

                const listItem = document.createElement('li');
                listItem.classList.add('character-item');
                const characterImg = document.createElement('img');
                characterImg.src = characterImage;
                characterImg.alt = characterName;

                const characterNameSpan = document.createElement('span');
                characterNameSpan.textContent = characterName;
                characterNameSpan.classList.add('character-name');

                listItem.appendChild(characterImg);
                listItem.appendChild(characterNameSpan);
                charactersList.appendChild(listItem);
            })
            .catch(error => {
                console.error('Error fetching character data:', error);
            });
        });

        const episodeHeader = episodeDiv.querySelector('.episode-header');
        episodeHeader.addEventListener('click', () => {
            const characterList = episodeDiv.querySelector('.character-list');
            if (characterList.style.display === 'none') {
                characterList.style.display = 'block';
            } else {
                characterList.style.display = 'none';
            }
        });
    });
}

function displayError(error) {
    const container = document.getElementById('dataContainer');
    container.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
}
