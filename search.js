// Simple client-side search functionality
window.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('search');
  if (!searchInput) return;

  const segments = location.pathname.split('/').filter(Boolean);
  const depth = segments.length - 1; // exclude current file
  const rootPrefix = '../'.repeat(depth);

  let pages = [];
  try {
    const res = await fetch(rootPrefix + 'nav.json');
    const tree = await res.json();
    function flatten(node) {
      pages.push({ title: node.title, href: rootPrefix + node.href });
      if (node.children && node.children.length) node.children.forEach(flatten);
    }
    flatten(tree);
  } catch (err) {
    console.error('Failed to load search index', err);
    return;
  }

  const results = document.createElement('div');
  results.id = 'search-results';
  results.classList.add('bg-white', 'text-black', 'mt-2', 'p-2', 'rounded', 'shadow', 'max-h-60', 'overflow-auto');
  results.classList.add('hidden');
  searchInput.insertAdjacentElement('afterend', results);

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    results.innerHTML = '';
    if (!q) {
      results.classList.add('hidden');
      return;
    }
    const matches = pages.filter(p => p.title.toLowerCase().includes(q));
    matches.forEach(p => {
      const a = document.createElement('a');
      a.href = p.href;
      a.textContent = p.title;
      a.classList.add('block', 'px-2', 'py-1', 'hover:bg-gray-100');
      results.appendChild(a);
    });
    results.classList.toggle('hidden', matches.length === 0);
  });
});
