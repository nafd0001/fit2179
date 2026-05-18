// Chart 1 -- Rainfall Map
vegaEmbed('#chart1', 'js/chart1_map.json', { actions: false })
  .catch(err => console.error('Chart 1 error:', err));

// Chart 2 -- Temperature Map
vegaEmbed('#chart2', 'js/chart2_map.json', { actions: false })
  .catch(err => console.error('Chart 2 error:', err));

// Chart 3 -- Temperature Over Time
vegaEmbed('#chart3', 'js/chart3_line.json', { actions: false })
  .catch(err => console.error('Chart 3 error:', err));

// Chart 4 -- Rainfall Over Time
vegaEmbed('#chart4', 'js/chart4_line.json', { actions: false })
  .catch(err => console.error('Chart 4 error:', err));