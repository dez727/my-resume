// ===================================================================
// MOBILE NAVIGATION TOGGLE
//
// Handles hamburger menu functionality on mobile devices. When user
// clicks the hamburger icon, the menu slides in/out.
// ===================================================================

/*
 * SELECT DOM ELEMENTS
 * document.querySelector() finds first element matching CSS selector
 * Returns a reference to the element we can manipulate
 */
const navToggle = document.querySelector('.nav-toggle');  // Hamburger button
const navLinks = document.querySelector('.nav-links');    // Navigation menu

/*
 * ADD CLICK EVENT LISTENER
 * addEventListener() registers a function to run when event occurs
 * Parameters:
 * 1. Event type: 'click' - fires when user clicks element
 * 2. Handler function: Arrow function (() => {}) that runs on click
 */
navToggle.addEventListener('click', () => {
    /*
     * TOGGLE 'ACTIVE' CLASS
     * classList.toggle() adds or removes a CSS class:
     * - If class exists: removes it (menu closes)
     * - If class doesn't exist: adds it (menu opens)
     * Returns: true if class was added, false if removed
     *
     * CSS handles the visual animation (.nav-links.active styles)
     */
    navLinks.classList.toggle('active');
});

/*
 * AUTO-CLOSE MENU WHEN LINK CLICKED
 * On mobile, menu should close after clicking a navigation link
 */
document.querySelectorAll('.nav-links a').forEach(link => {
    /*
     * querySelectorAll() returns NodeList of ALL matching elements
     * .forEach() loops through each element in the list
     * 'link' is the current element in each iteration
     */

    link.addEventListener('click', () => {
        /*
         * classList.remove() removes class (always)
         * Unlike toggle(), this only removes - doesn't add
         * Result: Menu always closes when any link is clicked
         */
        navLinks.classList.remove('active');
    });
});

// ===================================================================
// EXPAND/COLLAPSE EXPERIENCE DETAILS
//
// Toggles visibility of job description details. Called from HTML
// onclick attribute: <button onclick="toggleDetails(this)">
// ===================================================================

function toggleDetails(btn) {
    /*
     * FUNCTION PARAMETERS
     * 'btn' is the button element that was clicked
     * Passed automatically by 'this' in onclick="toggleDetails(this)"
     */

    /*
     * DOM TRAVERSAL - Finding Related Elements
     * previousElementSibling: Gets the element immediately before this one in HTML
     * In our HTML structure: <div class="experience-details"></div> comes before <button>
     * So btn.previousElementSibling gives us the details div
     */
    const details = btn.previousElementSibling;

    /*
     * TOGGLE AND CAPTURE RETURN VALUE
     * classList.toggle() returns a boolean:
     * - true if class was added (now expanded)
     * - false if class was removed (now collapsed)
     * We store this to update button text accordingly
     */
    const isExpanded = details.classList.toggle('expanded');

    /*
     * TOGGLE BUTTON STATE
     * Adds/removes 'expanded' class from button
     * CSS rotates the chevron icon 180° when button has this class
     */
    btn.classList.toggle('expanded');

    /*
     * UPDATE BUTTON TEXT
     * Ternary operator: condition ? valueIfTrue : valueIfFalse
     * firstChild.textContent: The text inside the button (not the SVG icon)
     * Extra space after text maintains spacing before icon
     */
    btn.firstChild.textContent = isExpanded ? 'Hide details ' : 'Show details ';
}

// ===================================================================
// SMOOTH SCROLL WITH HEADER OFFSET
//
// Implements smooth scrolling for anchor links with proper spacing
// for fixed navigation header. When clicking nav links, page scrolls
// smoothly to target section.
// ===================================================================

/*
 * SELECT ALL ANCHOR LINKS STARTING WITH #
 * querySelectorAll('a[href^="#"]') uses attribute selector:
 * - a: All anchor elements
 * - [href^="#"]: Where href attribute starts with # (internal links)
 * - ^= means "starts with"
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener('click', function (e) {
        /*
         * NOTE: Using regular function (not arrow) to preserve 'this' context
         * In arrow functions, 'this' refers to outer scope
         * In regular functions, 'this' refers to the clicked element
         */

        /*
         * PREVENT DEFAULT LINK BEHAVIOR
         * preventDefault() stops browser's default anchor link action
         * Normally clicking #section jumps immediately - we want smooth scroll instead
         */
        e.preventDefault();

        /*
         * FIND TARGET SECTION
         * this.getAttribute('href') gets href value (e.g., "#experience")
         * querySelector() finds element with that ID
         */
        const target = document.querySelector(this.getAttribute('href'));

        /*
         * CALCULATE SCROLL POSITION
         * We need to account for the fixed header so content isn't hidden behind it
         */

        const headerOffset = 80;  // Height of fixed navbar + extra spacing (in pixels)

        /*
         * getBoundingClientRect() returns element's position relative to viewport
         * .top property: Distance from top of viewport to top of element
         * Returns current position, which changes as page scrolls
         */
        const elementPosition = target.getBoundingClientRect().top;

        /*
         * Calculate final scroll position:
         * - elementPosition: Where element is now relative to viewport top
         * - window.pageYOffset: How far we've already scrolled from page top
         * - headerOffset: Space to leave for fixed header
         *
         * Example calculation:
         * If element is 500px from viewport top, we've scrolled 1000px,
         * and header is 80px: final position = 500 + 1000 - 80 = 1420px from page top
         */
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        /*
         * SCROLL TO CALCULATED POSITION
         * window.scrollTo() scrolls the page
         * Options object:
         * - top: Y position to scroll to
         * - behavior: 'smooth' creates animated scroll (vs 'auto' = instant jump)
         */
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// ===================================================================
// ACTIVE NAV LINK ON SCROLL
//
// Highlights the navigation link corresponding to the currently visible
// section as user scrolls. Provides visual feedback about page location.
// ===================================================================

/*
 * SELECT ALL SECTIONS AND NAV LINKS
 * We'll compare scroll position against sections to determine which is visible
 */
const sections = document.querySelectorAll('section');  // All page sections
const navItems = document.querySelectorAll('.nav-links a');  // All navigation links

/*
 * SCROLL EVENT LISTENER
 * Fires every time user scrolls the page
 * Note: Scroll events fire frequently - consider throttling for performance on complex sites
 */
window.addEventListener('scroll', () => {
    /*
     * Arrow function syntax - concise function definition
     * Equivalent to: function() { ... }
     */

    /*
     * TRACK CURRENT SECTION
     * Will store ID of section currently in viewport
     */
    let current = '';

    /*
     * CHECK EACH SECTION'S POSITION
     * Loop through all sections to find which one user is viewing
     */
    sections.forEach(section => {

        /*
         * offsetTop: Distance from page top to element top (doesn't change with scroll)
         * Unlike getBoundingClientRect(), this is absolute position on page
         */
        const sectionTop = section.offsetTop;

        /*
         * clientHeight: Element's height including padding but not border/margin
         * Tells us how tall the section is
         */
        const sectionHeight = section.clientHeight;

        /*
         * DETECT IF SECTION IS IN VIEW
         * pageYOffset: How far page has scrolled from top (global variable)
         * Equivalent to window.scrollY
         *
         * Logic: If we've scrolled past section top (minus 150px buffer),
         * consider that section as "current"
         * The 150px buffer ensures section activates before it's fully at top
         */
        if (pageYOffset >= sectionTop - 150) {
            /*
             * getAttribute('id'): Gets section's ID (e.g., "experience")
             * Store the ID - last section passing the check becomes current
             */
            current = section.getAttribute('id');
        }
    });

    /*
     * UPDATE NAV LINK HIGHLIGHTING
     * Loop through nav links and highlight the one matching current section
     */
    navItems.forEach(item => {

        /*
         * RESET ALL LINKS TO DEFAULT COLOR
         * Setting to empty string removes inline style, reverts to CSS default
         */
        item.style.color = '';

        /*
         * HIGHLIGHT MATCHING LINK
         * Compare link's href with current section ID
         * Template literal `#${current}` creates string like "#experience"
         */
        if (item.getAttribute('href') === `#${current}`) {
            /*
             * SET ACCENT COLOR DIRECTLY VIA JAVASCRIPT
             * var(--accent) uses CSS custom property (variable)
             * This works because CSS variables are accessible via JS style property
             */
            item.style.color = 'var(--accent)';
        }
    });
});
