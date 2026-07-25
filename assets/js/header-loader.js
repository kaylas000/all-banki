// Header loader - loads header from components/header.html
(function() {
  function getBasePath() {
    var path = window.location.pathname;
    if (path.includes('/pages/')) {
      return '../';
    }
    return '';
  }

  function initHeader() {
    var basePath = getBasePath();
    var headerEl = document.getElementById('site-header');
    var mobileNavEl = document.getElementById('site-mobile-nav');

    if (headerEl) {
      fetch(basePath + 'assets/components/header.html')
        .then(function(r) { return r.text(); })
        .then(function(html) {
          headerEl.innerHTML = html;
          // Set active link
          var currentPage = window.location.pathname.split('/').pop() || 'index.html';
          var links = headerEl.querySelectorAll('a[data-page]');
          links.forEach(function(link) {
            link.classList.remove('active');
            var href = link.getAttribute('href').split('/').pop();
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
              link.classList.add('active');
            }
          });
        });
    }

    if (mobileNavEl) {
      fetch(basePath + 'assets/components/mobile-nav.html')
        .then(function(r) { return r.text(); })
        .then(function(html) {
          mobileNavEl.innerHTML = html;
        });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }
})();
