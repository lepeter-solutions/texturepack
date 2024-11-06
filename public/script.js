

function createCardFromTemplate(templateId) {
    const template = document.getElementById(templateId);
    return document.importNode(template.content, true);
}

function renderSampleCards() {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';

    const folderCard = createCardFromTemplate('folder-template');
    const jsonCard = createCardFromTemplate('json-template');
    const pngCard = createCardFromTemplate('png-template');
    const otherCard = createCardFromTemplate('other-template');

    fileList.appendChild(folderCard);
    fileList.appendChild(jsonCard);
    fileList.appendChild(pngCard);
    fileList.appendChild(otherCard);
}

function checkForTemplate(fileName) {

    if (fileName.endsWith('.png')) {
        return 'png-template';
    } else if (fileName.endsWith('.json')) {
        return 'json-template';
    } else if (!fileName.includes('.')) {
        return 'folder-template';
    } else {
        return 'other-template';
    }
}


function getRoutePartOfUrl(url) {
    const urlObj = new URL(url);
    return urlObj.pathname.replace(/^\/api\/data\//, ''); // Remove the /api/data/ prefix if present
}

function renderEndImage(content) {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    const img = document.createElement('img');
    img.src = content;
    img.alt = 'End image';
    fileList.appendChild(img);

}

function renderFiles(files) {
    let templateId;
    let cardImage;
    console.log('Rendering files:', files);
    let fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    for (const file of files) {
        cardImage = null;
        templateId = checkForTemplate(file);
        const card = createCardFromTemplate(templateId);
        const filename = card.querySelector('.filename');
        filename.textContent = file;
        if (templateId === 'png-template') {
            const img = card.querySelector('img');
            // Construct the image source based on the current URL path
            const currentPath = getRoutePartOfUrl(window.location.href);
            console.log(currentPath)
            img.src = "/data" + currentPath +'/'+ file;
            img.alt = file;
        }
        // Add click event listener to the card
        card.querySelector('.card').addEventListener('click', () => {
            console.log(`Clicked on ${file}`);
            let currentPath = window.location.pathname;
            if (currentPath.endsWith('/')) {
                currentPath = currentPath.slice(0, -1);
            }
            const newUrl = `${window.location.origin}${currentPath}/${encodeURIComponent(file)}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
            console.log('New URL:', newUrl);
            fetchData(getRoutePartOfUrl(newUrl));
        });
        fileList.appendChild(card);
    }
}

async function fetchData(path = '') {
    const response = await fetch(`/api/data/${path}`);
    // check if the response convertible to json
    if (path.endsWith('.png')) {
        const blob = await response.blob();
        const img = URL.createObjectURL(blob);
        location.reload();

        renderEndImage(img);
        return;
    }
    // itt lekezelhető a többi file típus is

    const data = await response.json();
    console.log(data);
    // Check if the response contains a content key
    
    renderFiles(data.files);
}


function startFileStructure() {
    console.log('Starting file structure');
    //get current url
    const currentPath = getRoutePartOfUrl(window.location.href);
    fetchData(currentPath);
}


// Add popstate event listener to handle URL changes
window.addEventListener('popstate', (event) => {
    console.log('URL changed:', window.location.href);
    // Handle the URL change, e.g., re-render files based on the new URL
    const currentPath = getRoutePartOfUrl(window.location.href);
    fetchData(currentPath);
    // You can call a function here to update the UI based on the new URL
    // For example:
    // updateUIBasedOnUrl(currentPath);
});

// Event listener for page load
window.onload = () => {
    console.log(window.location.href);
    console.log('Page loaded');
    const currentPath = getRoutePartOfUrl(window.location.href);
    fetchData(currentPath);
};

// Event listener for page unload (refresh or close)
window.onbeforeunload = () => {
    console.log('Page is about to be unloaded');
};

document.addEventListener('DOMContentLoaded', () => {
    startFileStructure();
});