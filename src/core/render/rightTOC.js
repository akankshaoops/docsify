(function () {
  function createRightTOC() {
    // Check if Right TOC should be loaded based on user settings
    if (window.$docsify && window.$docsify.loadRightTOC === false) {
      return;
    }

    const min_hlevel = window.$docsify && window.$docsify.right_toc_min_hlevel || 2;
    const max_hlevel = window.$docsify && window.$docsify.right_toc_max_hlevel || 6;

    var tocContainer = document.createElement('div');
    tocContainer.className = 'right-toc';

    var tocHeading = document.createElement('div');
    tocHeading.className = 'toc-heading';
    tocHeading.textContent = 'On This Page';

    tocContainer.appendChild(tocHeading);

    var dropdown = document.createElement('select');
    dropdown.className = 'toc-dropdown';
    tocContainer.appendChild(dropdown);

    function insertTOC() {
      var contentElement = document.querySelector('.content');
      if (contentElement) {
        contentElement.insertBefore(tocContainer, contentElement.firstChild);
      } else {
        return;
      }
    }

    function observeContent() {
      const observer = new MutationObserver((mutations, obs) => {
        const contentElement = document.querySelector('.content');
        if (contentElement) {
          insertTOC();
          obs.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    window.$docsify.plugins = [].concat(function (hook, vm) {

      hook.doneEach(function () {

        // Clear existing TOC and dropdown options on doneEach
        tocContainer.querySelectorAll('.toc-link').forEach(el => el.remove()); // Remove only links
        dropdown.innerHTML = ''; // Clear dropdown options

        // Select headers based on min and max heading levels from user settings
        const headerSelector = Array.from({ length: max_hlevel - min_hlevel + 1 }, (_, i) => `.markdown-section h${i + min_hlevel}`).join(', ');
        const headers = Array.from(document.querySelectorAll(headerSelector)).filter(header => {
          const level = parseInt(header.tagName.slice(1), 10);
          return level >= min_hlevel && level <= max_hlevel;
        });

        if (headers.length === 0) {
          tocContainer.style.display = 'none';
          return;
        } else {
          tocContainer.style.display = 'block';
        }


        headers.forEach(function (header) {
          var link = document.createElement('a');
          link.href = '#' + header.id;
          link.textContent = header.textContent;
          link.className = 'toc-link level-' + header.tagName.slice(1); // Add level class based on heading level

          // Add indentation for dropdown options
          var level = parseInt(header.tagName.slice(1));
          var spaces = Array(level - min_hlevel + 1).join('\u00A0\u00A0\u00A0'); // Indentation with non-breaking spaces
          var option = document.createElement('option');
          option.value = '#' + header.id;
          option.textContent = spaces + header.textContent;

          tocContainer.appendChild(link);
          dropdown.appendChild(option);
        });



        dropdown.addEventListener('change', function () {
          var selectedId = this.value.slice(1);

          // Directly set the location.hash to jump to the element
          let currentRoute = location.hash.split('?')[0];
          location.hash = `${currentRoute}?id=${selectedId}`;

          // This will make the page jump directly to the target element
          var targetElement = document.getElementById(selectedId);
          if (targetElement) {
            targetElement.focus(); // focus to the target
          }
        });




        // Highlight active section
        document.addEventListener('scroll', function () {
          var current = headers[0];
          headers.forEach(function (header) {
            if (header.getBoundingClientRect().top < window.innerHeight / 2) {
              current = header;
            }
          });
          document.querySelectorAll('.toc-link').forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current.id) {
              link.classList.add('active');
            }
          });
        });

        // Fix for navigating to the correct section
        tocContainer.querySelectorAll('a.toc-link').forEach(function (link) {
          link.addEventListener('click', function (event) {
            event.preventDefault();
            var targetId = this.getAttribute('href').slice(1);
            let currentRoute = location.hash.split('?')[0];
            location.hash = `${currentRoute}?id=${targetId}`;
            var targetElement = document.getElementById(targetId);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }
          });
        });

        // Call the function to handle screen size
        handleScreenSize();
      });
    }, window.$docsify.plugins);

    function handleScreenSize() {
      var tocLinks = tocContainer.querySelectorAll('.toc-link');
      if (window.innerWidth <= 997) {
        dropdown.style.display = 'block';
        tocLinks.forEach(function (link) {
          link.style.display = 'none';
        });
      } else {
        dropdown.style.display = 'none';
        tocLinks.forEach(function (link) {
          link.style.display = 'block';
        });
      }
    }

    // Add resize event listener
    window.addEventListener('resize', handleScreenSize);

    observeContent();
  }

  if (document.readyState === 'complete' || document.readyState !== 'loading') {
    createRightTOC();
  } else {
    document.addEventListener('DOMContentLoaded', createRightTOC);
  }
})();


