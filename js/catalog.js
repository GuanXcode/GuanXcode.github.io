/*!
 * catalog.js — Vanilla JS table of contents (replaces jquery.nav.js + inline jQuery)
 * Uses IntersectionObserver for scroll spy
 */

(function() {
    var postContainer = document.querySelector('.post-container');
    var catalogBody = document.querySelector('.catalog-body');
    if (!postContainer || !catalogBody) return;

    var headings = postContainer.querySelectorAll('h1,h2,h3,h4,h5,h6');
    if (headings.length === 0) return;

    // Build catalog HTML
    headings.forEach(function(heading) {
        if (!heading.id) return;
        var tag = heading.tagName.toLowerCase();
        var link = document.createElement('a');
        link.href = '#' + heading.id;
        link.setAttribute('rel', 'nofollow');
        link.textContent = heading.textContent;

        var li = document.createElement('li');
        li.className = tag + '_nav';
        li.appendChild(link);
        catalogBody.appendChild(li);
    });

    // Toggle catalog fold
    var toggleBtn = document.querySelector('.catalog-toggle');
    var sideCatalog = document.querySelector('.side-catalog');
    if (toggleBtn && sideCatalog) {
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sideCatalog.classList.toggle('fold');
        });
    }

    // Scroll spy using IntersectionObserver
    var catalogLinks = catalogBody.querySelectorAll('a');
    var padding = 80;
    var observerOptions = {
        root: null,
        rootMargin: '-' + padding + 'px 0px -50% 0px',
        threshold: 0
    };

    var currentActive = null;

    function setActive(id) {
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        catalogLinks.forEach(function(link) {
            if (link.getAttribute('href') === '#' + id) {
                link.parentElement.classList.add('active');
                currentActive = link.parentElement;
            }
        });
    }

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                setActive(entry.target.id);
            }
        });
    }, observerOptions);

    headings.forEach(function(heading) {
        if (heading.id) {
            observer.observe(heading);
        }
    });

    // Smooth scroll on catalog link click
    catalogLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = this.getAttribute('href').substring(1);
            var target = document.getElementById(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - padding,
                    behavior: 'smooth'
                });
            }
        });
    });
})();
