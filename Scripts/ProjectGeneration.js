// JSON object with multiple keys, each containing title, description, and icon
fetch('/Data/projects.json')
    .then((response) => response.json())
    .then((json) =>
    {
        extractJson(json);
    })
    .catch((error) => console.error('Error fetching JSON:', error));

// Function to get the icon path based on the type
function getIconPath(type)
{
    const iconPaths =
    {
        youtube: '/Images/YoutubeIcon.png',
        linkedin: '/Images/LinkedIn.png',
        github: '/Images/GithubIcon.png',
        steam: '/Images/SteamIcon.png',
        playstore: '/Images/Playstore.png',
        itch: '/Images/ItchIcon.png'
    };
    return iconPaths[type] || '/Images/GithubIcon.png'; // Default icon if type not found
}

// Function to get query parameters from URL
function getQueryParameter(key)
{
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
}

// Function to get value from JSON based on query parameter key
function getValueFromJson(json, key)
{
    return json[key] !== undefined ? json[key] : 'Failed to find project';
}

// Function to display the result on the webpage
function displayResult(key, value)
{
    const content = document.getElementById('Content');

    if (value === 'Failed to find project')
    {
        content.innerHTML = `<h1>${value}</h1>`;
    }
    else
    {
        var followHtml = value.follow.map(fol => `
            <li class="link-button">
                <a href="${fol.URL}" target="_blank">
                    <img class="link-button" src="${getIconPath(fol.type)}" alt="${fol.type} icon">
                </a>
             </li>
        `).join('');

        if (value.follow.length > 0)
        {
            followHtml = `
                <h2>Follow the project</h2>
                <ul class="no-style-list">
                    ${followHtml}
                </ul>
            `;
        }

        const articlesHtml = value.articles.reduce((acc, article, index) => {
            // Determine if a new div should be opened
            if (index % 2 === 0) {
                // If it's the start of a new group of two articles, open a div
                acc += '<div class="articles-group">';
            }

            // Add the article HTML
            acc += `
        <article>
            ${article.title ? `<h2>${article.title}</h2>` : '<h2 style="visibility: hidden;">Untitled</h2>'}
            <p>${article.content}</p>
        </article>
    `;

            // Determine if a div should be closed
            if (index % 2 === 1 || index === value.articles.length - 1) {
                // If it's the end of a group of two articles or the last article, close the div
                acc += '</div>';
            }

            return acc;
        }, '');


        content.innerHTML = `
            <h1 style="margin-bottom: 100px!important;">${value.title}</h1>
            <div style="width:100%; float:left;">
                <div class="project-left-side">
                    <img class="project-page-image" src="/Images/${value.icon}" alt="${value.title} icon">
                    <p>${value.period}</p>
                </div>
                <div class="project-right-side">
                    <h2 style="margin-top: 0;">Short description</h2>
                    <p>${value.description}</p>
                </div>
            </div>
            <div class="articles-section">
                ${articlesHtml}
            </div>
            <div class="follow-section">
                ${followHtml}
            </div>
        `;
    }
}

function extractJson(json)
{
    // Get the query parameter key from URL
    const key = getQueryParameter('key');

    if (key) {
        // Get the value from JSON
        const value = getValueFromJson(json, key);

        // Display the result on the webpage
        displayResult(key, value);
    }
    else {
        console.log('No key provided in query parameter');
        document.body.innerHTML = '<h1>Failed to find project</h1>';
    }
}