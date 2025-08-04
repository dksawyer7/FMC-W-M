document.addEventListener('DOMContentLoaded', () => {
  const pages = [
    'about.html',
    'howwework.html',
    'leadership.html',
    'schedule.html',
    'join.html',
    'speaker.html',
    'instagram.html'
  ];
  const container = document.getElementById('content');
  Promise.all(
    pages.map(page =>
      fetch(page)
        .then(resp => resp.text())
        .then(html => ({ page, html }))
        .catch(err => {
          console.error('Failed to load', page, err);
          return null;
        })
    )
  ).then(results => {
    results.filter(Boolean).forEach(({ page, html }) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const main = doc.querySelector('main');
      if (main) {
        const fragment = document.createRange().createContextualFragment(
          main.innerHTML.trim()
        );
        const firstElement = fragment.firstElementChild;
        if (firstElement) {
          firstElement.id = page.replace('.html', '');
        }
        container.appendChild(fragment);
      }
    });
    if (window.initFMC) {
      window.initFMC();
    }
  });
});
