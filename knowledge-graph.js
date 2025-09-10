(async () => {
  const res = await fetch('content/pages.json');
  const data = await res.json();

  const nodes = [];
  const links = [];
  function traverse(node, parent) {
    nodes.push({ id: node.title });
    if (parent) {
      links.push({ source: parent, target: node.title });
    }
    if (Array.isArray(node.children)) {
      node.children.forEach(child => traverse(child, node.title));
    }
  }
  traverse(data);

  const width = 1200;
  const height = 600;
  const svg = d3.select('#graph').attr('viewBox', [0, 0, width, height]);

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(120))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const link = svg.append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', 1.5);

  const node = svg.append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('g')
    .data(nodes)
    .join('g')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  node.append('circle')
    .attr('r', 10)
    .attr('fill', '#3b82f6');

  node.append('text')
    .text(d => d.id)
    .attr('x', 12)
    .attr('y', '0.31em')
    .attr('fill', '#000');

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
})();
