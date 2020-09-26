// Unsplash API
let noOfImagesToBeFetched = 5;
let initLoad = false;
const apiKey = 'VWp7hyL--HiYN5tQ5ksVywgLdRhciy2tnJS48fpT-c0';
const apiStaticUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=`;
let apiUrl = `${apiStaticUrl}${noOfImagesToBeFetched}`;
const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let fetchedImagesPainted = false; // flag to indicate when all images are painted in the DOM
let numberOfImagesLoaded = 0; // counter when matched with imagesArray length, changes the fetchedImagesPainted flag
let imagesArray = [];

/**
 * Get the Api Url
 * @param {*} imagesCount no of images to be fetched
 */
const getAPIUrl = (imagesCount) => {
  return `${apiStaticUrl}${imagesCount}`;
}

/**
 * Hide loading UI
 */
const hideLoading = () => {
  loader.hidden = true;
}

/**
 * Set attributes for a given element
 * @param {*} element HTML Element
 * @param {*} attributes Element attributes as key-value pairs in an object
 */
const setAttributes = (element, attributes) => {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

/**
 * Event listener for load of images
 */
const imageLoaded = () => {
  numberOfImagesLoaded += 1;
  if (numberOfImagesLoaded === imagesArray.length) {
    fetchedImagesPainted = true;
    hideLoading();
  }
}

/**
 * Get photos from Unsplash API
 */
async function fetchImages() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    imagesArray = data;
    numberOfImagesLoaded = 0;
    renderPhotosInUI();
    // Only load 5 images in the beginning, once loaded initially
    // Load 10 each time
    if (this.initLoad) {
      apiUrl = getAPIUrl(10);
      initLoad = false;
    }
  } catch (error) {
    // Catch error here
    hideLoading();
  }
}

/**
 * Render photos in the UI by creating elements in the DOM
 */
const renderPhotosInUI = () => {
  // Run function for each object in imagesArray
  imagesArray.forEach(photo => {
    // Create anchor
    const anchor = document.createElement("a");
    setAttributes(anchor, {
      href: photo.links.html,
      target: '_blank'
    });
    // Create image
    const image = document.createElement("img");
    setAttributes(image, {
      src: photo.urls.regular,
      alt: photo.alt_description || 'N/A',
      title: photo.description || 'N/A',
    });

    image.addEventListener('load', imageLoaded);
    // Insert image inside <a>
    anchor.appendChild(image);
    // Insert <a> inside image container
    imageContainer.appendChild(anchor);
  });
}

/**
 * Scroll Event listener
 * Fetch more images whenever scrollY is just reaching the 
 * end of the image container
 * 
 */
window.addEventListener('scroll', () => {
  if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 1000 && fetchedImagesPainted) {
    fetchedImagesPainted = false;
    fetchImages();
  }
})

// Start Fetching Images
fetchImages();