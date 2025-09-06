const fs = require('fs');
const path = require('path');

const layout = fs.readFileSync(path.join(__dirname, 'templates', 'layout.html'), 'utf8');
const pages = JSON.parse(fs.readFileSync(path.join(__dirname, 'content', 'pages.json'), 'utf8'));
const curatedL4 = JSON.parse(fs.readFileSync(path.join(__dirname, 'content', 'curatedL4.json'), 'utf8'));

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function render(values) {
  let html = layout;
  for (const [k, v] of Object.entries(values)) {
    html = html.replace(new RegExp(`{{${k}}}`, 'g'), v || '');
  }
  return html;
}

function videoHtml(videoId) {
  if (!videoId) return '';
  return `<aside class="w-full md:w-80 md:ml-4 mt-4 md:mt-0 shrink-0">
    <a href="https://youtu.be/${videoId}" target="_blank">
      <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="YouTube thumbnail" />
    </a>
  </aside>`;
}

function sectionHtml(sections = {}) {
  let html = '';
  if (sections.why) {
    html += `<h2 class="text-xl font-semibold mt-6">Why It Matters</h2>\n<p>${sections.why}</p>`;
  }
  if (sections.key && sections.key.length) {
    html += `<h2 class="text-xl font-semibold mt-6">Key Concepts</h2>\n<ul class="list-disc ml-6">` +
      sections.key.map(k => `<li>${k}</li>`).join('\n') + '</ul>';
  }
  if (sections.examples && sections.examples.length) {
    html += `<h2 class="text-xl font-semibold mt-6">Examples / Projects</h2>\n<ul class="list-disc ml-6">` +
      sections.examples.map(e => `<li>${e}</li>`).join('\n') + '</ul>';
  }
  if (sections.challenges && sections.challenges.length) {
    html += `<h2 class="text-xl font-semibold mt-6">Challenges & Risks</h2>\n<ul class="list-disc ml-6">` +
      sections.challenges.map(c => `<li>${c}</li>`).join('\n') + '</ul>';
  }
  if (sections.resources && sections.resources.length) {
    html += `<h2 class="text-xl font-semibold mt-6">Further Reading</h2>\n<ul class="list-disc ml-6">` +
      sections.resources.map(([t,u]) => `<li><a class="text-blue-600" href="${u}" target="_blank">${t}</a></li>`).join('\n') + '</ul>';
  }
  return html;
}

function pageTemplate(title, blurb, linksHtml, depth, backHref, sections = {}, breadcrumbs = '', videoId = '') {
  const homeHref = depth > 0 ? `${'../'.repeat(depth)}index.html` : 'index.html';
  const rootPrefix = depth > 0 ? '../'.repeat(depth) : '';
  const navLinks = [`<a href="${homeHref}" class="text-blue-200 hover:text-white">Home</a>`];
  if (backHref) navLinks.push(`<a href="${backHref}" class="text-blue-200 hover:text-white">Back</a>`);
  return render({
    title,
    blurb,
    links: linksHtml || '',
    sections: sectionHtml(sections),
    nav: navLinks.join('<span>|</span>'),
    rootPrefix,
    breadcrumbs,
    video: videoHtml(videoId)
  });
}

function defaultSections(title, blurb) {
  return {
    why: blurb,
    key: [
      `Definition and role of ${title}`,
      `How ${title} fits into Web3`,
      `Considerations when using ${title}`
    ],
    examples: [`Example projects using ${title}`],
    challenges: [`Challenges around ${title}`],
    resources: []
  };
}

function generate(node, dir, depth, backHref, ancestors = []) {
  fs.mkdirSync(dir, { recursive: true });
  let links = '';
  const breadcrumbsArr = [...ancestors, node.title];
  const breadcrumbs = breadcrumbsArr.join(' / ');
  if (node.children && node.children.length) {
    links += '<ul>\n';
    node.children.forEach(child => {
      const slug = slugify(child.title);
      links += `  <li><a href="${slug}/index.html">${child.title}</a></li>\n`;
    });
    links += '</ul>\n';
  }
  const l4 = curatedL4[node.title];
  if (l4) {
    links += '<ul>\n';
    if (Array.isArray(l4)) {
      l4.forEach(([title, blurb, videoId]) => {
        const slug = slugify(title);
        links += `  <li><a href="${slug}.html">${title}</a></li>\n`;
        const l4Breadcrumbs = breadcrumbsArr.concat(title).join(' / ');
        const l4Html = pageTemplate(title, blurb, '', depth, 'index.html', defaultSections(title, blurb), l4Breadcrumbs, videoId);
        fs.writeFileSync(path.join(dir, `${slug}.html`), l4Html);
      });
    } else {
      Object.entries(l4).forEach(([title, entry]) => {
        const slug = slugify(title);
        links += `  <li><a href="${slug}.html">${title}</a></li>\n`;
        const sections = entry.sections || defaultSections(title, entry.blurb);
        const l4Breadcrumbs = breadcrumbsArr.concat(title).join(' / ');
        const l4Html = pageTemplate(title, entry.blurb, '', depth, 'index.html', sections, l4Breadcrumbs, entry.videoId);
        fs.writeFileSync(path.join(dir, `${slug}.html`), l4Html);
      });
    }
    links += '</ul>\n';
  }
  const html = pageTemplate(node.title, node.blurb, links, depth, backHref, {}, breadcrumbs, node.videoId);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  if (node.children && node.children.length) {
    node.children.forEach(child => {
      const slug = slugify(child.title);
      generate(child, path.join(dir, slug), depth + 1, '../index.html', breadcrumbsArr);
    });
  }
}

function buildNav(node, basePath='') {
  const href = basePath ? `${basePath}/index.html` : 'index.html';
  const children = (node.children || []).map(child => {
    const slug = slugify(child.title);
    const childPath = basePath ? `${basePath}/${slug}` : slug;
    return buildNav(child, childPath);
  });
  const l4 = curatedL4[node.title];
  if (l4) {
    const leaves = Array.isArray(l4) ? l4.map(([title]) => title) : Object.keys(l4);
    leaves.forEach(title => {
      const slug = slugify(title);
      children.push({ title, href: `${basePath}/${slug}.html`, children: [] });
    });
  }
  return { title: node.title, href, children };
}

fs.writeFileSync('nav.json', JSON.stringify(buildNav(pages), null, 2));

generate(pages, '.', 0, null);
