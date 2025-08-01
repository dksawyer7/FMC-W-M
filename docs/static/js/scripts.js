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

  const candidates = document.querySelectorAll('[data-typing], main h1, main h2, main h3, main h4, main h5, main h6, main p, main li');
  const typeTargets = Array.from(candidates).filter(el => !el.dataset.animated);
  typeTargets.forEach(el => {
    if (!el.dataset.typing) {
      const text = el.textContent.trim();
      if (text) {
        el.dataset.typing = text;
        el.textContent = '';
      }
    }
  });
  const toObserve = typeTargets.filter(el => el.dataset.typing);
  if (toObserve.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          const el = entry.target;
          const text = el.dataset.typing;
          el.textContent = '';
          let i = 0;
          const interval = setInterval(() => {
            el.textContent = text.slice(0, i + 1);
            i++;
            if (i === text.length) {
              clearInterval(interval);
            }
          }, 50);
          el.dataset.animated = 'true';
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    toObserve.forEach(el => observer.observe(el));
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

  if (!document.body.dataset.scrollBound) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          const start = window.scrollY;
          const end = target.getBoundingClientRect().top + start;
          const duration = 600;
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
              window.location.hash = targetId;
            }
          }

          requestAnimationFrame(step);
        }
      });
    });
    document.body.dataset.scrollBound = 'true';
  }
  initScrollTyping();
}

function initScrollTyping() {
  const targets = document.querySelectorAll('h1, h2, h3');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.typingAnimated) return;
        obs.unobserve(el);
        const text = el.textContent.trim();
        el.textContent = '';
        el.classList.add('typing');
        let i = 0;
        const interval = setInterval(() => {
          el.textContent += text[i];
          i++;
          if (i >= text.length) {
            clearInterval(interval);
            el.classList.remove('typing');
            el.dataset.typingAnimated = 'true';
          }
        }, 50);
      }
    });
  }, { threshold: 0.6 });
  targets.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initFMC);
window.initFMC = initFMC;
