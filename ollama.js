window.addEventListener('DOMContentLoaded', async () => {
  if (!window.RUNNING_IN_DOCKER) return;
  const container = document.getElementById('ollama-info');
  const heading = document.querySelector('main h1');
  if (!container || !heading) return;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('http://host.docker.internal:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama2',
        prompt: `Provide a brief markdown outline on ${heading.textContent}.`,
        stream: false
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return;
    const data = await res.json();
    const text = data.response || '';
    container.classList.add('whitespace-pre-line');
    container.textContent = text.trim();
  } catch (err) {
    // If the request fails or server is unavailable, leave container empty.
  }
});
