const sidebar = document.querySelector('#sidebar');
const menuButton = document.querySelector('#menuButton');
const searchInput = document.querySelector('#searchInput');
const sections = [...document.querySelectorAll('.searchable')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const sectionIds = new Set(sections.map(section => section.id));

menuButton.addEventListener('click', () => sidebar.classList.toggle('open'));
navLinks.forEach(link => link.addEventListener('click', () => {
  sidebar.classList.remove('open');
  searchInput.value = '';
  window.setTimeout(showSelectedPage, 0);
}));

function showSelectedPage() {
  const requested = window.location.hash.slice(1);
  const selected = sectionIds.has(requested) ? requested : 'start';
  sections.forEach(section => {
    section.classList.remove('search-hit');
    section.querySelectorAll('[hidden]').forEach(block => block.hidden = false);
    section.classList.toggle('is-hidden', section.id !== selected);
  });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${selected}`));
  document.querySelector('#noResults').hidden = true;
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', showSelectedPage);
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  let matches = 0;

  sections.forEach(section => {
    const title = section.querySelector('h1, h2');
    const titleHit = Boolean(query && title?.textContent.toLowerCase().includes(query));
    const blocks = [...section.querySelectorAll(':scope > article, :scope > .script, :scope > .notice, :scope > .danger, :scope > .two-col, :scope > .code-grid, :scope > details')];
    let sectionMatches = 0;

    blocks.forEach(block => {
      const hit = !query || titleHit || block.textContent.toLowerCase().includes(query);
      block.hidden = !hit;
      if (query && hit) sectionMatches += 1;
    });

    const sectionHit = titleHit || sectionMatches > 0;
    section.classList.toggle('is-hidden', !sectionHit);
    section.classList.toggle('search-hit', Boolean(query && sectionHit));
    if (query) matches += sectionMatches + (titleHit ? 1 : 0);
  });

  document.querySelector('#noResults').hidden = !query || matches > 0;
  if (!query) showSelectedPage();
});

showSelectedPage();
