// Header & Footer loader - loads from components/
(function() {
  function getBasePath() {
    var path = window.location.pathname;
    if (path.includes('/pages/')) {
      return '../';
    }
    return '';
  }

  function initComponents() {
    var basePath = getBasePath();
    var headerEl = document.getElementById('site-header');
    var mobileNavEl = document.getElementById('site-mobile-nav');
    var footerEl = document.getElementById('site-footer');

    if (headerEl) {
      fetch(basePath + 'assets/components/header.html')
        .then(function(r) { return r.text(); })
        .then(function(html) {
          headerEl.innerHTML = html;
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

    if (footerEl) {
      fetch(basePath + 'assets/components/footer.html')
        .then(function(r) { return r.text(); })
        .then(function(html) {
          footerEl.innerHTML = html;
        });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    initComponents();
  }
})();
