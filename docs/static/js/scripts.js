function initFMC() {
  const list = document.getElementById('events-list');
  if (list && !list.dataset.loaded) {
    fetch('data/events.json')
      .then(resp => resp.json())
      .then(events => {
        events.forEach(evt => {
          const li = document.createElement('li');
          li.className = 'flex justify-between items-center border-b py-2';
          li.innerHTML = `<span>${evt.date} - ${evt.title}</span><span class="text-gray-500">${evt.location}</span>`;
          list.appendChild(li);
        });
        list.dataset.loaded = 'true';
      })
      .catch(() => {
        const li = document.createElement('li');
        li.className = 'border-b py-2';
        li.textContent = 'Unable to load events.';
        list.appendChild(li);
        list.dataset.loaded = 'true';
      });
  }

  const intro = document.getElementById('intro-message');
  if (intro && !intro.dataset.animated) {
    const text = intro.dataset.message;
    intro.textContent = '';
    setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        intro.textContent = text.slice(0, i + 1);
        i++;
        if (i === text.length) {
          clearInterval(interval);
        }
      }, 50);
    }, 2000);
    intro.dataset.animated = 'true';
  }

  const PLACEHOLDER = 'https://unsplash.it/500/500';
  document.querySelectorAll('img').forEach(img => {
    if (!img.getAttribute('src')) {
      img.src = PLACEHOLDER;
    }
    img.addEventListener('error', function () {
      if (img.src !== PLACEHOLDER) {
        img.src = PLACEHOLDER;
      }
    });
  });
  const instaRows = document.querySelectorAll('.insta-row');
  instaRows.forEach(row => {
    if (!row.dataset.duplicated) {
      row.innerHTML += row.innerHTML;
      row.dataset.duplicated = 'true';
    }
  });

  setupTypeOnView();
}

document.addEventListener('DOMContentLoaded', initFMC);
window.initFMC = initFMC;

function setupTypeOnView() {
  const selectors = 'main h1, main h2, main h3, main h4, main h5, main h6, main p, main li, main small, main span';
  const elements = Array.from(document.querySelectorAll(selectors))
    .filter(el => el.children.length === 0 && el.id !== 'intro-message');

  elements.forEach(el => {
    el.dataset.fulltext = el.textContent;
    el.textContent = '';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.typing) {
          return;
        }
        el.dataset.typing = 'true';
        const text = el.dataset.fulltext;
        let i = 0;
        const interval = setInterval(() => {
          el.textContent = text.slice(0, i + 1);
          i++;
          if (i > text.length) {
            clearInterval(interval);
          }
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}
