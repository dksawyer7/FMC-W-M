document.addEventListener('DOMContentLoaded', function () {
  const list = document.getElementById('events-list');
  if (list) {
    fetch('data/events.json')
      .then(resp => resp.json())
      .then(events => {
        events.forEach(evt => {
          const li = document.createElement('li');
          li.className = 'flex justify-between items-center border-b p-2';
          li.innerHTML = `<span>${evt.date} - ${evt.title}</span><span class="text-gray-500">${evt.location}</span>`;
          list.appendChild(li);
        });
      })
      .catch(() => {
        const li = document.createElement('li');
        li.className = 'border-b p-2';
        li.textContent = 'Unable to load events.';
        list.appendChild(li);
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

  const slider = document.getElementById('instaSlider');
  if (slider) {
    const track = slider.querySelector('.insta-track');
    const items = slider.querySelectorAll('.insta-item');
    const visible = 5;
    let index = 0;

    function update() {
      track.style.transform = `translateX(-${index * (100 / visible)}%)`;
    }

    slider.querySelector('.insta-next').addEventListener('click', () => {
      index = (index + 1) % items.length;
      update();
    });

    slider.querySelector('.insta-prev').addEventListener('click', () => {
      index = (index - 1 + items.length) % items.length;
      update();
    });

    update();
  }
});
