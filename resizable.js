(function() {
  function initResizable(sidebar, resizer, direction) {
    if (!sidebar || !resizer) return;
    let startX, startWidth;
    const minWidth = 150;
    resizer.addEventListener('mousedown', function(e) {
      e.preventDefault();
      startX = e.clientX;
      startWidth = parseInt(getComputedStyle(sidebar).width, 10);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', stopResize);
    });
    function onMouseMove(e) {
      let newWidth = direction === 'right'
        ? startWidth + (e.clientX - startX)
        : startWidth + (startX - e.clientX);
      if (newWidth < minWidth) newWidth = minWidth;
      sidebar.style.width = newWidth + 'px';
    }
    function stopResize() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopResize);
    }
  }
  document.addEventListener('DOMContentLoaded', function() {
    initResizable(document.getElementById('sidebar'), document.getElementById('sidebar-resizer'), 'right');
    initResizable(document.getElementById('ollama-info'), document.getElementById('ollama-resizer'), 'left');
  });
})();
