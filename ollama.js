window.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('ollama-info');
  const heading = document.querySelector('main h1');
  if (!container || !heading) return;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Provide a brief markdown outline on ${heading.textContent}.`,
        temperature: 0.7,
        max_tokens: 100
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return;
    const data = await res.json();
    const text = data.response || '';

    try {
      const { marked } = await import('https://cdn.jsdelivr.net/npm/marked@11.2.0/marked.esm.js');
      container.innerHTML = marked.parse(text.trim());
    } catch {
      container.textContent = text.trim();
    }
  } catch (err) {
    // If the request fails or server is unavailable, leave container empty.
  }
});
