/*!
 * hux-blog.js — Vanilla JS rewrite (no jQuery dependency)
 */

// Responsive tables
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.post-container table').forEach(function(table) {
        var wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
        table.classList.add('table');
    });
});

// Responsive embed videos
document.addEventListener('DOMContentLoaded', function() {
    var selectors = [
        'iframe[src*="youtube.com"]',
        'iframe[src*="vimeo.com"]'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(function(iframe) {
        var wrapper = document.createElement('div');
        wrapper.className = 'embed-responsive embed-responsive-16by9';
        iframe.parentNode.insertBefore(wrapper, iframe);
        wrapper.appendChild(iframe);
        iframe.classList.add('embed-responsive-item');
    });
});

// Navigation: show header on scroll-up, hide on scroll-down
document.addEventListener('DOMContentLoaded', function() {
    var MQL = 1170;
    if (window.innerWidth <= MQL) return;

    var navbar = document.querySelector('.navbar-custom');
    var catalog = document.querySelector('.side-catalog');
    if (!navbar) return;

    var headerHeight = navbar.offsetHeight;
    var banner = document.querySelector('.intro-header .container');
    var bannerHeight = banner ? banner.offsetHeight : 0;
    var previousTop = 0;

    window.addEventListener('scroll', function() {
        var currentTop = window.pageYOffset;

        if (currentTop < previousTop) {
            // scrolling up
            if (currentTop > 0 && navbar.classList.contains('is-fixed')) {
                navbar.classList.add('is-visible');
            } else {
                navbar.classList.remove('is-visible');
                navbar.classList.remove('is-fixed');
            }
        } else {
            // scrolling down
            navbar.classList.remove('is-visible');
            if (currentTop > headerHeight && !navbar.classList.contains('is-fixed')) {
                navbar.classList.add('is-fixed');
            }
        }
        previousTop = currentTop;

        // adjust side-catalog
        if (catalog) {
            catalog.style.display = '';
            if (currentTop > (bannerHeight + 41)) {
                catalog.classList.add('fixed');
            } else {
                catalog.classList.remove('fixed');
            }
        }
    });
});
