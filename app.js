const sidebar = document.querySelector('#sidebar');
const menuButton = document.querySelector('#menuButton');
const searchInput = document.querySelector('#searchInput');
const sections = [...document.querySelectorAll('.searchable')];
const navLinks = [...document.querySelectorAll('.nav-link')];

menuButton.addEventListener('click', () => sidebar.classList.toggle('open'));
navLinks.forEach(link => link.addEventListener('click', () => sidebar.classList.remove('open')));
document.querySelector('#printButton').addEventListener('click', () => window.print());
document.querySelector('#today').textContent = new Date().toLocaleDateString(undefined, {year:'numeric', month:'long', day:'numeric'});

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

    const sectionHit = !query || titleHit || sectionMatches > 0;
    section.classList.toggle('is-hidden', !sectionHit);
    section.classList.toggle('search-hit', Boolean(query && sectionHit));
    if (query) matches += sectionMatches + (titleHit ? 1 : 0);
  });

  document.querySelector('#noResults').hidden = !query || matches > 0;
});

const observer = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
}, {rootMargin:'-20% 0px -65% 0px', threshold:[0,.2,.5]});
sections.forEach(section => observer.observe(section));
