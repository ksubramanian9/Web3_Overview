// Dynamically builds the sidebar navigation from nav.json
window.addEventListener('DOMContentLoaded', async () => {
  const segments = location.pathname.split('/').filter(Boolean);
  const depth = segments.length - 1; // exclude current file
  const rootPrefix = '../'.repeat(depth);
  const sidebar = document.getElementById('sidebar');
  const toggleButton = document.getElementById('sidebarToggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      if (sidebar) sidebar.classList.toggle('hidden');
    });
  }
  if (!sidebar) return;
  sidebar.classList.add('pl-0');
  try {
    const res = await fetch(rootPrefix + 'nav.json');
    const tree = await res.json();

    function build(node, isRoot = false) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = node.title;
      link.href = rootPrefix + node.href;
      li.appendChild(link);
      let isCurrent = new URL(link.href, location.href).pathname === location.pathname;
      if (isCurrent) {
        link.classList.add('font-bold');
        li.dataset.current = 'true';
      }
      if (node.children && node.children.length) {
        const ul = document.createElement('ul');
        ul.classList.add('ml-4', 'list-none', 'pl-0');
        if (!isRoot) ul.classList.add('hidden');
        node.children.forEach(child => ul.appendChild(build(child)));
        li.appendChild(ul);
        const btn = document.createElement('button');
        btn.textContent = isRoot ? '-' : '+';
        btn.classList.add('mr-1');
        btn.addEventListener('click', e => {
          e.preventDefault();
          ul.classList.toggle('hidden');
          btn.textContent = ul.classList.contains('hidden') ? '+' : '-';
        });
        li.insertBefore(btn, link);
      }
      return li;
    }

    const nav = document.createElement('nav');
    const ul = document.createElement('ul');
    ul.classList.add('list-none', 'pl-0');
    ul.appendChild(build(tree, true));
    nav.appendChild(ul);
    sidebar.appendChild(nav);

    const current = sidebar.querySelector('li[data-current="true"]');
    let parent = current ? current.parentElement : null;
    while (parent && parent !== sidebar) {
      if (parent.tagName === 'UL' && parent.classList.contains('hidden')) {
        parent.classList.remove('hidden');
        const btn = parent.parentElement.querySelector('button');
        if (btn) btn.textContent = '-';
      }
      parent = parent.parentElement;
    }
  } catch (err) {
    console.error('Failed to load navigation', err);
  }
});
