// Get the menu icon and the navigation links
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');

// Add a click event listener to the menu icon
menuIcon.addEventListener('click', function() {
    // Toggle the 'show' class on the navigation links
    navLinks.classList.toggle('show');
});
