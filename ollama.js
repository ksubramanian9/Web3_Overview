window.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('ollama-info');
  const heading = document.querySelector('main h1');
  if (!container || !heading) return;

  let lastMd = '';

  async function renderMarkdownToAnswer(md) {
    lastMd = md;
    try {
      const [
        { marked },
        { default: DOMPurify }
      ] = await Promise.all([
        import('https://cdn.jsdelivr.net/npm/marked@11.2.0/lib/marked.esm.js'),
        import('https://cdn.jsdelivr.net/npm/dompurify@3.0.9/dist/purify.es.mjs')
      ]);
      const rawHtml = marked.parse(md, { gfm: true, breaks: true, headerIds: false, mangle: false });
      const safeHtml = DOMPurify.sanitize(rawHtml);
      container.innerHTML = `<h2 id="ollama-title" class="text-xl font-bold text-center mb-4">Generative AI Output</h2>${safeHtml}`;

      container.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
        if (el.id === 'ollama-title') return;
        if (el.tagName === 'H1') el.classList.add('text-xl', 'font-bold', 'mt-4', 'mb-2');
        if (el.tagName === 'H2') el.classList.add('text-lg', 'font-semibold', 'mt-4', 'mb-2');
        if (el.tagName === 'H3') el.classList.add('font-semibold', 'mt-3', 'mb-1');
      });


      if (window.hljs) {
        container.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
      }
      if (window.renderMathInElement) {
        renderMathInElement(container, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
          ],
          throwOnError: false
        });
      }
      attachCopyButtons(container);
    } catch (e) {
      container.innerHTML = `<span class="warn">Markdown render error:</span> ${e.message}`;
    }
  }

  function attachCopyButtons(scopeEl) {
    scopeEl.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code');
        const text = code ? code.innerText : pre.innerText;
        try {
          await navigator.clipboard.writeText(text);
          const old = btn.textContent; btn.textContent = 'Copied!';
          setTimeout(() => (btn.textContent = old), 1200);
        } catch {
          btn.textContent = 'Failed';
          setTimeout(() => (btn.textContent = 'Copy'), 1200);
        }
      });
      pre.appendChild(btn);
    });
  }

  async function askOllama() {
    container.textContent = 'Querying Ollama…';
    const breadcrumbs = document.querySelector('header .text-sm.text-gray-300')?.textContent.trim() || '';
    const pageText = document.querySelector('main')?.innerText.replace(/\s+/g, ' ').trim() || '';

    const prompt = `You are a Web 3.0 expert.\n\nContext:\nBreadcrumbs: ${breadcrumbs}\nPage Content: ${pageText}\n\nUse this context to produce a concise teaching note in the following Markdown template:\n\n## Overview\n<2-3 sentences>\n\n## Key Points\n- <bullet>\n- <bullet>\n\n## Next Steps\n- <bullet>\n\nKeep the response under 150 words.`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, temperature: 0.2, max_tokens: 300 }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      await renderMarkdownToAnswer(data.response || '(empty)');
    } catch (e) {
      container.innerHTML = `<span class="warn">Couldn’t reach Ollama:</span> ${e.message}`;
    }
  }


  askOllama();
});
