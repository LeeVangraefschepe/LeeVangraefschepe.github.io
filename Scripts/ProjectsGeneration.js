// JSON object with multiple keys, each containing title, description, and icon
fetch('/Data/projects.json')
    .then((response) => response.json())
    .then((json) =>
    {
        extractJson(json);
    })
    .catch((error) => console.error('Error fetching JSON:', error));

// Function to display the result on the webpage
function displayResult(key, value)
{
    const content = document.getElementById('Content');

    if (value === 'Key not found in JSON')
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
    const categorizedProjects = {};

    for (const key in json)
    {
        const project = json[key];

        if (!categorizedProjects[project.category])
        {
            categorizedProjects[project.category] = [];
        }
        categorizedProjects[project.category].push(project);
    }

    const content = document.getElementById('Content');

    // Iterate over each category and create divs for them
    for (const category in categorizedProjects)
    {
        // Create a div for the category
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `<h1 class="project-h1">${category}</h1>`;

        categorizedProjects[category].sort((a, b) => b.priority - a.priority);

        // Add projects to the category div
        var i = 0;
        categorizedProjects[category].forEach(project =>
        {
            const projectDiv = document.createElement('div');
            projectDiv.className = `project${i % 3 == 0 ? '-first' : ''}`;
            projectDiv.innerHTML = `
                <a href="BaseProject.html?key=${project.key}" class="project-item">
                    <div class='project-container'>
                        <img src='/Images/${project.icon}' class='project-image'>
                        <div class='project-text-left'>${project.languages}</div>
                        <div class='project-title'>${project.display ? project.display : ''}</div>
                        <div class='project-overlay'>
		                    <img src='/Images/ProjectBackground.png' class='project-image-overlay'>
		                    <div class='project-text'>${project.short_description}</div>
	                    </div>
                    </div>
                </a>
            `;
            categoryDiv.appendChild(projectDiv);
            i += 1;
        });

        // Append the category div to the container
        content.appendChild(categoryDiv);
    }
}