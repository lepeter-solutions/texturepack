

let baseFileUrl;

function getRoutePartOfUrl(url) {
    const urlObj = new URL(url);
    return urlObj.pathname.replace(/^\/api\/data\//, ''); // Remove the /api/data/ prefix if present
}

function getRoutePartOfUrl(url) {
    const urlObj = new URL(url);
    return urlObj.pathname.replace(/^\/api\/data\//, ''); // Remove the /api/data/ prefix if present
}

function loadImage() {
    // Get the current URL
    const url = window.location.href;
    // Extract the route part of the URL
    const routePart = getRoutePartOfUrl(url);
    // Prepend /api/data/ to the route part
    const imageUrl = `/api/data/${routePart}`;
    // Set the image source to the constructed URL
    const img = document.getElementById('image');
    const filename = document.getElementById('file-name');
    baseFileUrl = routePart;
    if (img) {
        img.src = imageUrl;
        filename.textContent = routePart;
    }
}

document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('image').src = e.target.result;
            document.getElementById('file-name').textContent = file.name;
        };
        reader.readAsDataURL(file);
        


    }
});

document.addEventListener('DOMContentLoaded', function () {
    loadImage();
});


window.addEventListener('popstate', (event) => {
    location.reload();

});