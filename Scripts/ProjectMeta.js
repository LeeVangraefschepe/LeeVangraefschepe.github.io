document.addEventListener("DOMContentLoaded", function () {
    fetch('/Data/projects.json')
        .then((response) => response.json())
        .then((json) => {
            extractJson(json);
        })
        .catch((error) => console.error('Error fetching JSON:', error));

    function getQueryParameter(key) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(key);
    }

    function setMetaTag(attributeName, attributeValue, content) {
        let metaTag = document.querySelector(`meta[${attributeName}='${attributeValue}']`);
        if (metaTag) {
            metaTag.setAttribute('content', content);
        }
        else {
            metaTag = document.createElement('meta');
            metaTag.setAttribute(attributeName, attributeValue);
            metaTag.setAttribute('content', content);
            document.head.appendChild(metaTag);
        }
    }

    function extractJson(json) {
        const key = getQueryParameter('key');

        const project = json[key];
        setMetaTag('property', 'og:title', `${project.title}`);
        setMetaTag('property', 'og:description', `${project.short_description}`);
        setMetaTag('property', 'og:image', `/Images/${project.icon}`);
        setMetaTag('property', 'og:url', window.location.href);

        setMetaTag('name', 'twitter:card', 'summary_large_image');
        setMetaTag('name', 'twitter:title', `${project.title}`);
        setMetaTag('name', 'twitter:description', `${project.short_description}`);
        setMetaTag('name', 'twitter:image', `/Images/${project.icon}`);

    }
});