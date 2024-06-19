/*
The form page Slider scrpit start here
*/
// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function() {
    // Initialize a variable to keep track of the current image index
    let currentImageIndex = 0;
    // Select all image elements within elements with class 'image-slider' and store them in the 'images' variable
    const images = document.querySelectorAll('.image-slider img');

    // Define a function to show the next image in the slideshow
    function showNextImage() {
        // Remove the 'active' class from the current image
        images[currentImageIndex].classList.remove('active');
        // Update the current image index to the next one (loop back to 0 if at the end)
        currentImageIndex = (currentImageIndex + 1) % images.length;
        // Add the 'active' class to the newly selected image
        images[currentImageIndex].classList.add("active");
    }

    // Set an interval to call the showNextImage function every 5000 milliseconds (5 seconds)
    setInterval(showNextImage, 5000);
});
   /* Google Map location*/
    // Replace YOUR_API_KEY with your actual API key
    const apiKey = 'AIzaSyAejLCIJkUU1-DZM5Qc0DgOSm2LtGKwUkk';

    // Replace the address with the actual address of your event
    const eventAddress = '<%= event.where %>'; // Use the event's location

    // Create the embedded map URL
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(eventAddress)}`;

    const mapContainer = document.getElementById('map-container');
    const iframe = document.createElement('iframe');
    iframe.src = mapUrl;
    iframe.width = '100%';
    iframe.height = '300';
    iframe.frameborder = '0';
    iframe.style.border = '0';
    iframe.allowfullscreen = '';
    mapContainer.appendChild(iframe);

  
    
    