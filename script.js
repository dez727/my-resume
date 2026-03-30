// ===================================================================
// EMAIL OBFUSCATION
//
// Prevents spam bots from scraping email from raw HTML source.
// Email is split into parts and assembled at runtime by JavaScript.
// ===================================================================

(function () {
    var u = 'addez2';
    var d = 'outlook.com';
    var addr = u + '@' + d;
    var el = document.getElementById('email-link');
    var txt = document.getElementById('email-text');
    if (el && txt) {
        el.href = 'mailto:' + addr;
        txt.textContent = addr;
    }
})();

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
    const isOpen = navLinks.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
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
// Toggles visibility of job description details. Bound via
// addEventListener (no inline onclick — required for strict CSP).
// ===================================================================

function toggleDetails(btn) {
    const details = btn.previousElementSibling;
    const isExpanded = details.classList.toggle('expanded');
    btn.classList.toggle('expanded');
    btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    // Walk child nodes to find the text node — firstChild may be a comment or whitespace node
    for (var node of btn.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            node.textContent = isExpanded ? 'Hide details ' : 'Show details ';
            break;
        }
    }
}

document.querySelectorAll('.expand-btn').forEach(function (btn) {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () { toggleDetails(this); });
});

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
         * - window.window.scrollY: How far we've already scrolled from page top
         * - headerOffset: Space to leave for fixed header
         *
         * Example calculation:
         * If element is 500px from viewport top, we've scrolled 1000px,
         * and header is 80px: final position = 500 + 1000 - 80 = 1420px from page top
         */
        const offsetPosition = elementPosition + window.window.scrollY - headerOffset;

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
window.addEventListener('scroll', function scrollHandler() {
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
         * window.scrollY: How far page has scrolled from top (global variable)
         * Equivalent to window.scrollY
         *
         * Logic: If we've scrolled past section top (minus 150px buffer),
         * consider that section as "current"
         * The 150px buffer ensures section activates before it's fully at top
         */
        if (window.scrollY >= sectionTop - 150) {
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
        item.removeAttribute('aria-current');

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
            item.setAttribute('aria-current', 'page');
        }
    });
});

// ===================================================================
// AI CHAT WIDGET
//
// Floating chatbot panel that streams responses from the Cloudflare
// Worker backend. Uses textContent (never innerHTML) to prevent XSS.
// ===================================================================

(function () {
    // ---- Configuration ----
    // Replace with your deployed Cloudflare Worker URL
    const CHAT_API_URL = 'https://resume-chatbot.dezad727.workers.dev/api/chat';
    const MAX_USER_HISTORY_SENT = 3;
    const MAX_MESSAGE_LENGTH = 500;
    const WELCOME_MESSAGE =
        "Hi! I'm an AI assistant that can answer questions about Desmond's " +
        "experience, skills, and projects. For the most accurate picture, " +
        "also review the resume sections above. What would you like to know?";

    const SUGGESTED_QUESTIONS = [
        "What's Desmond's experience with AI?",
        "Tell me about his leadership roles",
        "What projects has he built?",
        "How can I contact Desmond?",
    ];

    // ---- DOM References ----
    const widget = document.getElementById('chat-widget');
    const toggle = document.getElementById('chat-toggle');
    const panel = document.getElementById('chat-panel');
    const closeBtn = document.getElementById('chat-close');
    const messagesEl = document.getElementById('chat-messages');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const iconOpen = toggle.querySelector('.chat-icon-open');
    const iconClose = toggle.querySelector('.chat-icon-close');

    // ---- State ----
    let isOpen = false;
    let isStreaming = false;
    // Store only successful prior user turns.
    // Assistant replies are rendered in the UI but not resent to the API.
    let userHistory = []; // {role: 'user', content: string}[]
    let welcomeShown = false;

    // ---- Open / Close ----
    // Start with panel inert so hidden inputs aren't tabbable (a11y fix)
    panel.inert = true;

    function openChat() {
        isOpen = true;
        panel.inert = false;
        panel.classList.add('chat-visible');
        panel.setAttribute('aria-hidden', 'false');
        toggle.classList.add('chat-open');
        toggle.setAttribute('aria-expanded', 'true');
        iconOpen.style.display = 'none';
        iconClose.style.display = 'block';
        input.focus();
        if (!welcomeShown) {
            addMessage('bot', WELCOME_MESSAGE);
            showSuggestions();
            welcomeShown = true;
        }
    }

    function closeChat() {
        isOpen = false;
        panel.inert = true;
        panel.classList.remove('chat-visible');
        panel.setAttribute('aria-hidden', 'true');
        toggle.classList.remove('chat-open');
        toggle.setAttribute('aria-expanded', 'false');
        iconOpen.style.display = 'block';
        iconClose.style.display = 'none';
        toggle.focus();
    }

    toggle.addEventListener('click', function () {
        isOpen ? closeChat() : openChat();
    });
    closeBtn.addEventListener('click', closeChat);

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen) closeChat();
    });

    // Hero CTA button opens chat
    var ctaBtn = document.getElementById('chat-cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function () { toggle.click(); });
    }

    // ---- Suggested Questions ----

    function showSuggestions() {
        var container = document.createElement('div');
        container.className = 'chat-suggestions';
        SUGGESTED_QUESTIONS.forEach(function (q) {
            var btn = document.createElement('button');
            btn.className = 'chat-suggestion';
            btn.textContent = q;
            btn.addEventListener('click', function () {
                removeSuggestions();
                addMessage('user', q);
                sendToAPI(q);
            });
            container.appendChild(btn);
        });
        messagesEl.appendChild(container);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeSuggestions() {
        var el = messagesEl.querySelector('.chat-suggestions');
        if (el) el.remove();
    }

    // ---- Safe Markdown Renderer (XSS-safe: DOM-only, no innerHTML) ----
    // Allowlist: **bold**, *italic*, `code`, bullet lists (- item),
    // and section deep links [text](#id)

    var SECTION_IDS = ['hero', 'experience', 'education', 'skills', 'projects'];

    function renderMarkdown(container, text) {
        container.textContent = '';
        var lines = text.split('\n');
        var i = 0;

        while (i < lines.length) {
            var line = lines[i];

            // Bullet list: group consecutive "- " lines into a <ul>
            if (/^\s*[-*]\s/.test(line)) {
                var ul = document.createElement('ul');
                ul.className = 'chat-md-list';
                while (i < lines.length && /^\s*[-*]\s/.test(lines[i])) {
                    var li = document.createElement('li');
                    renderInline(li, lines[i].replace(/^\s*[-*]\s+/, ''));
                    ul.appendChild(li);
                    i++;
                }
                container.appendChild(ul);
                continue;
            }

            // Blank line — skip
            if (line.trim() === '') { i++; continue; }

            // Regular paragraph
            var p = document.createElement('p');
            p.className = 'chat-md-p';
            renderInline(p, line);
            container.appendChild(p);
            i++;
        }
    }

    function renderInline(parent, text) {
        // Regex matches: **bold**, *italic*, `code`, [text](#anchor)
        var pattern = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\(#([\w-]+)\))/g;
        var last = 0;
        var match;

        while ((match = pattern.exec(text)) !== null) {
            // Plain text before this match
            if (match.index > last) {
                parent.appendChild(document.createTextNode(text.slice(last, match.index)));
            }

            if (match[2]) {
                // **bold**
                var strong = document.createElement('strong');
                strong.textContent = match[2];
                parent.appendChild(strong);
            } else if (match[3]) {
                // *italic*
                var em = document.createElement('em');
                em.textContent = match[3];
                parent.appendChild(em);
            } else if (match[4]) {
                // `code`
                var code = document.createElement('code');
                code.className = 'chat-md-code';
                code.textContent = match[4];
                parent.appendChild(code);
            } else if (match[5] && match[6]) {
                // [text](#section-id) — deep link
                var sectionId = match[6];
                if (SECTION_IDS.indexOf(sectionId) !== -1) {
                    var a = document.createElement('a');
                    a.textContent = match[5];
                    a.href = '#' + sectionId;
                    a.className = 'chat-md-link';
                    a.addEventListener('click', (function (id) {
                        return function (ev) {
                            ev.preventDefault();
                            var target = document.getElementById(id);
                            if (target) {
                                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        };
                    })(sectionId));
                    parent.appendChild(a);
                } else {
                    // Not a valid section — render as plain text
                    parent.appendChild(document.createTextNode(match[5]));
                }
            }

            last = match.index + match[0].length;
        }

        // Remaining plain text
        if (last < text.length) {
            parent.appendChild(document.createTextNode(text.slice(last)));
        }
    }

    // ---- Message Rendering ----

    /**
     * Create a message bubble and append it to the messages area.
     * Returns the content element for streaming updates.
     */
    function addMessage(role, text) {
        var div = document.createElement('div');
        div.className = 'chat-msg ' + (role === 'user' ? 'chat-msg-user' : role === 'error' ? 'chat-msg-error' : 'chat-msg-bot');

        if (role === 'bot' && text) {
            renderMarkdown(div, text);
        } else {
            div.textContent = text;
        }

        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return div;
    }

    function showTyping() {
        var div = document.createElement('div');
        div.className = 'chat-typing';
        div.id = 'chat-typing-indicator';
        // Build dots with DOM methods — no innerHTML (LLM02)
        for (var i = 0; i < 3; i++) {
            div.appendChild(document.createElement('span'));
        }
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function hideTyping() {
        var el = document.getElementById('chat-typing-indicator');
        if (el) el.remove();
    }

    async function postChat(messages) {
        return fetch(CHAT_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: messages }),
            signal: AbortSignal.timeout(30000), // 30s timeout
        });
    }

    // ---- Streaming Fetch ----

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (isStreaming) return;

        var text = input.value.trim();
        if (!text) return;
        if (text.length > MAX_MESSAGE_LENGTH) {
            addMessage('error', 'Please keep your message under 500 characters.');
            return;
        }

        // Add user message to UI
        removeSuggestions();
        addMessage('user', text);
        input.value = '';
        input.focus();

        sendToAPI(text);
    });

    async function sendToAPI(userText) {
        isStreaming = true;
        sendBtn.disabled = true;
        showTyping();

        // Only send the last N successful user turns plus the current one.
        var messagesToSend = userHistory
            .concat({ role: 'user', content: userText })
            .slice(-MAX_USER_HISTORY_SENT);
        var usedFallback = false;

        try {
            var response = await postChat(messagesToSend);

            if (!response.ok && messagesToSend.length > 1 && response.status !== 429) {
                response = await postChat([{ role: 'user', content: userText }]);
                usedFallback = response.ok;
            }

            hideTyping();

            if (response.status === 429) {
                addMessage('error', 'Too many messages. Please wait a few minutes and try again.');
                isStreaming = false;
                sendBtn.disabled = false;
                return;
            }

            if (response.status === 413) {
                addMessage('error', 'That conversation context was too large. Please try asking again.');
                isStreaming = false;
                sendBtn.disabled = false;
                return;
            }

            if (!response.ok) {
                addMessage('error', 'Something went wrong. Please try again.');
                isStreaming = false;
                sendBtn.disabled = false;
                return;
            }

            // Create bot message bubble and stream into it
            var botDiv = addMessage('bot', '');
            botDiv.classList.add('chat-streaming');
            var fullText = '';

            var reader = response.body.getReader();
            var decoder = new TextDecoder();
            var buffer = '';

            // Helper: parse SSE lines and extract content deltas
            function processSSELines(lines) {
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (!line.startsWith('data: ')) continue;

                    var data = line.slice(6);
                    if (data === '[DONE]') continue;

                    try {
                        var parsed = JSON.parse(data);
                        var delta = parsed.choices && parsed.choices[0] && parsed.choices[0].delta;
                        if (delta && delta.content) {
                            fullText += delta.content;
                            botDiv.textContent = fullText;
                            messagesEl.scrollTop = messagesEl.scrollHeight;
                        }
                    } catch (_) {
                        // skip malformed SSE chunks
                    }
                }
            }

            while (true) {
                var result = await reader.read();
                if (result.done) break;

                buffer += decoder.decode(result.value, { stream: true });

                var lines = buffer.split('\n');
                buffer = lines.pop(); // keep incomplete line in buffer
                processSSELines(lines);
            }

            // Flush any remaining data in the buffer after stream ends
            if (buffer.trim()) {
                processSSELines([buffer]);
            }

            // Remove streaming cursor
            botDiv.classList.remove('chat-streaming');

            // Handle empty stream — don't leave a blank bot bubble
            if (!fullText) {
                botDiv.textContent = 'No response received. Please try again.';
                botDiv.className = 'chat-msg chat-msg-error';
            } else {
                // Render final markdown (during stream it was plain text)
                renderMarkdown(botDiv, fullText);
                messagesEl.scrollTop = messagesEl.scrollHeight;
                userHistory = usedFallback
                    ? [{ role: 'user', content: userText }]
                    : messagesToSend;
            }

        } catch (err) {
            hideTyping();
            if (err.name === 'TimeoutError') {
                addMessage('error', 'Response timed out. Please try again.');
            } else {
                addMessage('error', 'Could not connect. Please check your connection and try again.');
            }
        }

        isStreaming = false;
        sendBtn.disabled = false;
        if (isOpen) input.focus(); // only focus if panel is still open
    }
})();
