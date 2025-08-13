function initFMC() {
  document.querySelectorAll('.copyright-year').forEach(span => {
    span.textContent = new Date().getFullYear();
  });
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

  const headingCandidates = document.querySelectorAll('[data-typing], main h1, main h2, main h3, main h4, main h5, main h6');
  const textCandidates = document.querySelectorAll('main p, main li');

  const headingTargets = Array.from(headingCandidates).filter(el => !el.dataset.animated);
  headingTargets.forEach(el => {
    if (!el.dataset.typing) {
      const text = el.textContent.trim();
      if (text) {
        el.dataset.typing = text;
        el.textContent = '';
      }
    }
  });
  const toObserve = headingTargets.filter(el => el.dataset.typing);
  if (toObserve.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          const el = entry.target;
          const text = el.dataset.typing;
          typeText(el, text, 102); // slowed typing by 50%
          el.dataset.animated = 'true';
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    toObserve.forEach(el => observer.observe(el));
  }

  const fadeTargets = Array.from(textCandidates).filter(el => !el.dataset.animated);
  if (fadeTargets.length) {
    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.classList.add('visible');
          entry.target.dataset.animated = 'true';
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    fadeTargets.forEach(el => {
      el.classList.add('fade-in-block');
      fadeObserver.observe(el);
    });
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
      const content = row.innerHTML;
      row.innerHTML = content + content + content + content;
      row.dataset.duplicated = 'true';
    }
  });

  if (!document.body.dataset.scrollBound) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          const start = window.scrollY;
          const nav = document.querySelector('.sticky-nav');
          const navHeight = nav ? nav.offsetHeight : 0;
          // Always scroll to the very top when the "Home" tab is pressed
          const end = targetId === 'home'
            ? 0
            : target.getBoundingClientRect().top + start - navHeight;
          const duration = 1800; // slowed scroll by 50%
          const startTime = performance.now();

          function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          }

          function step() {
            const now = performance.now();
            const time = Math.min(1, (now - startTime) / duration);
            const eased = easeInOutQuad(time);
            window.scrollTo(0, start + (end - start) * eased);
            if (time < 1) {
              requestAnimationFrame(step);
            } else {
              window.scrollTo(0, end);
              history.replaceState(null, '', '#' + targetId);
            }
          }

          requestAnimationFrame(step);
        }
      });
    });
    document.body.dataset.scrollBound = 'true';
  }
}

function typeText(el, text, speed) {
  el.textContent = '';
  let idx = 0;

  function typeNext() {
    if (idx < text.length) {
      el.textContent += text[idx++];
      setTimeout(typeNext, speed);
    }
  }

  typeNext();
}

document.addEventListener('DOMContentLoaded', initFMC);
window.initFMC = initFMC;
