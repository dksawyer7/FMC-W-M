document.addEventListener('DOMContentLoaded', function () {
  const list = document.getElementById('events-list');
  if (list) {
    fetch('data/events.json')
      .then(resp => resp.json())
      .then(events => {
        events.forEach(evt => {
          const li = document.createElement('li');
          li.className = 'list-group-item d-flex justify-content-between align-items-center';
          li.innerHTML = `<span>${evt.date} - ${evt.title}</span><span class="text-muted">${evt.location}</span>`;
          list.appendChild(li);
        });
      })
      .catch(() => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = 'Unable to load events.';
        list.appendChild(li);
      });
  }

  const PLACEHOLDER = 'https://via.placeholder.com/500';
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
});
