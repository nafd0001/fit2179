'use strict';

const EMBED_OPTS = {
  renderer: 'svg',
  actions: {
    export: true,
    source: false,
    compiled: false,
    editor: false
  },
  tooltip: { theme: 'custom' },
  config: {
    font: 'DM Sans',
    background: 'transparent',
    view: { stroke: null },
    axis: {
      labelFont: 'DM Sans',
      titleFont: 'DM Sans',
      labelColor: '#475569',
      titleColor: '#1e293b',
      gridColor: '#e2e8f0',
      domainColor: '#cbd5e1',
      tickColor: '#cbd5e1',
      labelFontSize: 11,
      titleFontSize: 12,
      titleFontWeight: 600
    },
    legend: {
      labelFont: 'DM Sans',
      titleFont: 'DM Sans',
      labelColor: '#475569',
      titleColor: '#1e293b',
      labelFontSize: 11,
      titleFontSize: 11
    },
    title: {
      font: 'Playfair Display',
      fontWeight: 700,
      color: '#0f2744',
      fontSize: 16
    }
  }
};

async function embedChart(containerId, spec) {
  if (!spec) {
    var el = document.getElementById(containerId);
    if (el) {
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = '#94a3b8';
      el.style.fontSize = '13px';
      el.textContent = 'Chart coming soon';
    }
    return;
  }

  var container = document.getElementById(containerId);
  if (!container) return;

  try {
    await vegaEmbed('#' + containerId, spec, EMBED_OPTS);
  } catch (err) {
    console.error('Chart ' + containerId + ' failed to render:', err);
    container.textContent = 'Spec error - check console';
  }
}

document.addEventListener('DOMContentLoaded', async function () {

  /* ------------------------------------------------------------------ */
  /* CHART 1 - Rainfall by Location Map                                  */
  /* Uses fill encoding with scale:null so the pre-computed hex color    */
  /* from JS is passed directly - no color scale, no ghost circles.      */
  /* ------------------------------------------------------------------ */

  function getRainfallColor(r) {
    if (r < 400)  return '#c6dbef';
    if (r < 700)  return '#9ecae1';
    if (r < 1000) return '#6baed6';
    if (r < 1500) return '#3182bd';
    if (r < 2000) return '#08519c';
    return '#08306b';
  }

  var cities12 = [
    { city: 'Darwin',        lat: -12.4634, lon: 130.8456, rainfall: 1859 },
    { city: 'Cairns',        lat: -16.9186, lon: 145.7781, rainfall: 2096 },
    { city: 'Townsville',    lat: -19.2564, lon: 146.8183, rainfall: 1272 },
    { city: 'Brisbane',      lat: -27.4698, lon: 153.0251, rainfall: 1148 },
    { city: 'Sydney',        lat: -33.8688, lon: 151.2093, rainfall: 1213 },
    { city: 'Canberra',      lat: -35.2809, lon: 149.1300, rainfall: 636  },
    { city: 'Melbourne',     lat: -37.8136, lon: 144.9631, rainfall: 683  },
    { city: 'Hobart',        lat: -42.8821, lon: 147.3272, rainfall: 585  },
    { city: 'Adelaide',      lat: -34.9285, lon: 138.6007, rainfall: 572  },
    { city: 'Perth',         lat: -31.9505, lon: 115.8605, rainfall: 696  },
    { city: 'Alice Springs', lat: -23.6980, lon: 133.8807, rainfall: 322  },
    { city: 'Woomera',       lat: -31.1500, lon: 136.8167, rainfall: 179  }
  ];

  cities12.forEach(function (d) {
    d.fillColor = getRainfallColor(d.rainfall);
  });

  var spec1 = {
    '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
    'width': 'container',
    'height': 400,
    'projection': { 'type': 'mercator' },
    'layer': [
      {
        'data': {
          'url': 'australian-states.json',
          'format': { 'type': 'json', 'property': 'features' }
        },
        'mark': {
          'type': 'geoshape',
          'fill': '#dce8f0',
          'stroke': '#aac4d6',
          'strokeWidth': 0.8,
          'tooltip': false
        }
      },
      {
        'data': { 'values': cities12 },
        'mark': {
          'type': 'point',
          'shape': 'circle',
          'filled': true,
          'stroke': 'white',
          'strokeWidth': 1.2,
          'opacity': 0.88
        },
        'encoding': {
          'longitude': { 'field': 'lon', 'type': 'quantitative' },
          'latitude':  { 'field': 'lat', 'type': 'quantitative' },
          'fill': {
            'field': 'fillColor',
            'type': 'nominal',
            'scale': null,
            'legend': null
          },
          'size': {
            'field': 'rainfall',
            'type': 'quantitative',
            'scale': { 'domain': [179, 2096], 'range': [80, 800] },
            'legend': null
          },
          'tooltip': [
            { 'field': 'city',    'type': 'nominal',      'title': 'City' },
            { 'field': 'rainfall','type': 'quantitative', 'title': 'Estimated Annual Rainfall (mm)', 'format': ',.0f' }
          ]
        }
      },
      {
        'data': { 'values': cities12 },
        'mark': {
          'type': 'text',
          'dy': -11,
          'fontSize': 9,
          'fontWeight': 600,
          'fill': '#1e293b',
          'align': 'center',
          'tooltip': false
        },
        'encoding': {
          'longitude': { 'field': 'lon',  'type': 'quantitative' },
          'latitude':  { 'field': 'lat',  'type': 'quantitative' },
          'text':      { 'field': 'city', 'type': 'nominal' }
        }
      }
    ],
    'config': {
      'view': { 'stroke': null },
      'legend': { 'disable': true }
    }
  };

  await embedChart('vis1', spec1);

  /* ------------------------------------------------------------------ */
  /* CHARTS 2-12: add your specs here as you go                          */
  /* ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ */
  /* CHART 2 - Temperature by Location (choropleth map)                 */
  /* ------------------------------------------------------------------ */

  var spec2 = {
    '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
    'width': 'container',
    'height': 400,
    'projection': { 'type': 'mercator' },
    'layer': [
      {
        'data': {
          'url': 'australian-states.json',
          'format': { 'type': 'json', 'property': 'features' }
        },
        'mark': {
          'type': 'geoshape',
          'fill': '#dce8f0',
          'stroke': '#aac4d6',
          'strokeWidth': 0.8,
          'tooltip': false
        }
      },
      {
        'data': { 'url': 'temp_by_location.csv' },
        'mark': {
          'type': 'point',
          'shape': 'circle',
          'filled': true,
          'stroke': 'white',
          'strokeWidth': 1.2,
          'opacity': 0.88
        },
        'encoding': {
          'longitude': { 'field': 'longitude', 'type': 'quantitative' },
          'latitude':  { 'field': 'latitude',  'type': 'quantitative' },
          'fill': {
            'field': 'fillColor',
            'type': 'nominal',
            'scale': null,
            'legend': null
          },
          'size': {
            'field': 'avg_temp',
            'type': 'quantitative',
            'scale': { 'domain': [13, 28], 'range': [80, 700] },
            'legend': null
          },
          'tooltip': [
            { 'field': 'City',     'type': 'nominal',      'title': 'City' },
            { 'field': 'avg_temp', 'type': 'quantitative', 'title': 'Average Temperature (°C)', 'format': '.1f' }
          ]
        }
      },
      {
        'data': { 'url': 'temp_by_location.csv' },
        'mark': {
          'type': 'text',
          'dy': -12,
          'fontSize': 9,
          'fontWeight': 600,
          'fill': '#1e293b',
          'align': 'center',
          'tooltip': false
        },
        'encoding': {
          'longitude': { 'field': 'longitude', 'type': 'quantitative' },
          'latitude':  { 'field': 'latitude',  'type': 'quantitative' },
          'text':      { 'field': 'City',       'type': 'nominal' }
        }
      }
    ],
    'config': {
      'view': { 'stroke': null },
      'legend': { 'disable': true }
    }
  };
  await embedChart('vis2', spec2);

  /* ------------------------------------------------------------------ */
  /* CHART 3 and 4 shared config                                         */
  /* ------------------------------------------------------------------ */

  var cityColors = {
    'Sydney':        '#4c78a8',
    'Melbourne':     '#9966cc',
    'Brisbane':      '#f58518',
    'Perth':         '#e45756',
    'Adelaide':      '#54a24b',
    'Hobart':        '#72b7b2',
    'Darwin':        '#E1DABD',
    'Cairns':        '#ff9da6',
    'Canberra':      '#9d755d',
    'Townsville':    '#17becf',
    'Alice Springs': '#edc948',
    'Woomera':       '#d67195'
  };

  var cityList = Object.keys(cityColors);

  function buildPills(containerId, activeCities, onClickFn) {
    var wrap = document.getElementById(containerId);
    if (!wrap) return;
    wrap.innerHTML = '';
    cityList.forEach(function (city) {
      var btn = document.createElement('button');
      var isActive = activeCities.indexOf(city) !== -1;
      btn.className = 'pill-btn' + (isActive ? ' active' : '');
      btn.textContent = city;
      if (isActive) {
        btn.style.background = cityColors[city];
        btn.style.borderColor = cityColors[city];
      }
      btn.addEventListener('click', function () { onClickFn(city); });
      wrap.appendChild(btn);
    });
  }

  function buildBottomLegend(containerId, activeCities) {
    var wrap = document.getElementById(containerId);
    if (!wrap) return;
    wrap.innerHTML = '';
    activeCities.forEach(function (city) {
      var item = document.createElement('div');
      item.className = 'bottom-legend-item';
      var line = document.createElement('span');
      line.className = 'bottom-legend-line';
      line.style.background = cityColors[city];
      var label = document.createElement('span');
      label.textContent = city;
      item.appendChild(line);
      item.appendChild(label);
      wrap.appendChild(item);
    });
  }

  /* ------------------------------------------------------------------ */
  /* CHART 3 - Temperature Over Time                                     */
  /* ------------------------------------------------------------------ */

  var activeCities3 = ['Sydney'];

  function makeSpec3(cities) {
    var filterExpr = cities.map(function(c) {
      return 'datum.Location === "' + c + '"';
    }).join(' || ');

    var domain = cities;
    var range  = cities.map(function(c) { return cityColors[c]; });

    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
      'width': 'container',
      'height': 340,
      'data': { 'url': 'monthly_climate.csv' },
      'transform': [{ 'filter': filterExpr }],
      'mark': {
        'type': 'line',
        'interpolate': 'monotone',
        'strokeWidth': 2.5,
        'point': { 'filled': true, 'size': 20 }
      },
      'encoding': {
        'x': {
          'field': 'YearMonth',
          'type': 'temporal',
          'title': null,
          'axis': { 'labelAngle': -45, 'format': '%b %Y', 'tickCount': 16 }
        },
        'y': {
          'field': 'AvgTemp',
          'type': 'quantitative',
          'title': 'Average Temperature (°C)',
          'axis': { 'labelExpr': "datum.value + '°C'" }
        },
        'color': {
          'field': 'Location',
          'type': 'nominal',
          'legend': null,
          'scale': { 'domain': domain, 'range': range }
        },
        'tooltip': [
          { 'field': 'Location',  'type': 'nominal',      'title': 'City' },
          { 'field': 'YearMonth', 'type': 'temporal',     'title': 'Month', 'format': '%b %Y' },
          { 'field': 'AvgTemp',   'type': 'quantitative', 'title': 'Average Temperature (°C)', 'format': '.1f' }
        ]
      },
      'config': { 'view': { 'stroke': null } }
    };
  }

  function renderChart3(toggleCity) {
    var idx = activeCities3.indexOf(toggleCity);
    if (idx === -1) {
      activeCities3.push(toggleCity);
    } else if (activeCities3.length > 1) {
      activeCities3.splice(idx, 1);
    }
    buildPills('pills-3', activeCities3, renderChart3);
    buildBottomLegend('bottom-legend-3', activeCities3);
    embedChart('vis3', makeSpec3(activeCities3));
  }

  renderChart3('Sydney');

  /* ------------------------------------------------------------------ */
  /* CHART 4 - Rainfall Over Time                                        */
  /* ------------------------------------------------------------------ */

  var activeCities4 = ['Sydney'];

  function makeSpec4(cities) {
    var filterExpr = cities.map(function(c) {
      return 'datum.Location === "' + c + '"';
    }).join(' || ');

    var domain = cities;
    var range  = cities.map(function(c) { return cityColors[c]; });

    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
      'width': 'container',
      'height': 340,
      'data': { 'url': 'monthly_climate.csv' },
      'transform': [{ 'filter': filterExpr }],
      'mark': {
        'type': 'area',
        'interpolate': 'monotone',
        'strokeWidth': 2,
        'fillOpacity': 0.25,
        'line': true
      },
      'encoding': {
        'x': {
          'field': 'YearMonth',
          'type': 'temporal',
          'title': null,
          'axis': { 'labelAngle': -45, 'format': '%b %Y', 'tickCount': 16 }
        },
        'y': {
          'field': 'Rainfall',
          'type': 'quantitative',
          'title': 'Monthly Rainfall (mm)',
          'axis': { 'labelExpr': "datum.value + ' mm'" }
        },
        'color': {
          'field': 'Location',
          'type': 'nominal',
          'legend': null,
          'scale': { 'domain': domain, 'range': range }
        },
        'tooltip': [
          { 'field': 'Location',  'type': 'nominal',      'title': 'City' },
          { 'field': 'YearMonth', 'type': 'temporal',     'title': 'Month', 'format': '%b %Y' },
          { 'field': 'Rainfall',  'type': 'quantitative', 'title': 'Rainfall (mm)', 'format': '.1f' }
        ]
      },
      'config': { 'view': { 'stroke': null } }
    };
  }

  function renderChart4(toggleCity) {
    var idx = activeCities4.indexOf(toggleCity);
    if (idx === -1) {
      activeCities4.push(toggleCity);
    } else if (activeCities4.length > 1) {
      activeCities4.splice(idx, 1);
    }
    buildPills('pills-4', activeCities4, renderChart4);
    buildBottomLegend('bottom-legend-4', activeCities4);
    embedChart('vis4', makeSpec4(activeCities4));
  }

  renderChart4('Sydney');

  /* ------------------------------------------------------------------ */
  /* CHART 5 - Month vs Temperature (Seasonality)                        */
  /* ------------------------------------------------------------------ */

  var activeCities5 = ['Sydney'];

  function makeSpec5(cities) {
    var filterExpr = cities.map(function(c) {
      return 'datum.Location === "' + c + '"';
    }).join(' || ');
    var domain = cities;
    var range  = cities.map(function(c) { return cityColors[c]; });

    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
      'width': 'container',
      'height': 320,
      'data': { 'url': 'monthly_seasonality.csv' },
      'transform': [{ 'filter': filterExpr }],
      'layer': [
        {
          'mark': {
            'type': 'line',
            'interpolate': 'monotone',
            'strokeWidth': 2.5
          },
          'encoding': {
            'x': {
              'field': 'Month',
              'type': 'ordinal',
              'title': 'Month (averaged across 2008-2017)',
              'sort': [1,2,3,4,5,6,7,8,9,10,11,12],
              'axis': {
                'labelExpr': "['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][datum.value - 1]",
                'labelAngle': 0
              }
            },
            'y': {
              'field': 'AvgTemp',
              'type': 'quantitative',
              'title': 'Average Temperature (°C)',
              'axis': { 'labelExpr': "datum.value + '°C'" }
            },
            'color': {
              'field': 'Location',
              'type': 'nominal',
              'legend': null,
              'scale': { 'domain': domain, 'range': range }
            }
          }
        },
        {
          'mark': {
            'type': 'point',
            'filled': true,
            'size': 50
          },
          'encoding': {
            'x': {
              'field': 'Month',
              'type': 'ordinal',
              'sort': [1,2,3,4,5,6,7,8,9,10,11,12]
            },
            'y': {
              'field': 'AvgTemp',
              'type': 'quantitative'
            },
            'color': {
              'field': 'Location',
              'type': 'nominal',
              'legend': null,
              'scale': { 'domain': domain, 'range': range }
            }
          }
        },
        {
          'params': [
            {
              'name': 'hover_month',
              'select': { 'type': 'point', 'fields': ['Month'], 'on': 'mouseover', 'nearest': true }
            }
          ],
          'mark': { 'type': 'rule', 'color': '#94a3b8', 'strokeWidth': 1, 'strokeDash': [4, 2] },
          'encoding': {
            'x': {
              'field': 'Month',
              'type': 'ordinal',
              'sort': [1,2,3,4,5,6,7,8,9,10,11,12]
            },
            'opacity': {
              'condition': { 'param': 'hover_month', 'empty': false, 'value': 1 },
              'value': 0
            },
            'tooltip': cities.map(function(c, i) {
              return { 'field': 'AvgTemp', 'type': 'quantitative', 'title': c + ' Temperature (°C)', 'format': '.1f' };
            }).concat([
              { 'field': 'MonthName', 'type': 'nominal', 'title': 'Month' }
            ])
          },
          'transform': [
            { 'filter': 'datum.Location === "' + cities[0] + '"' }
          ]
        }
      ],
      'config': { 'view': { 'stroke': null } }
    };
  }

  function renderChart5(toggleCity) {
    var idx = activeCities5.indexOf(toggleCity);
    if (idx === -1) {
      activeCities5.push(toggleCity);
    } else if (activeCities5.length > 1) {
      activeCities5.splice(idx, 1);
    }
    buildPills('pills-5', activeCities5, renderChart5);
    buildBottomLegend('bottom-legend-5', activeCities5);
    embedChart('vis5', makeSpec5(activeCities5));
  }

  renderChart5('Sydney');

  /* ------------------------------------------------------------------ */
  /* CHART 6 - Month vs Rainfall (grouped bar)                           */
  /* ------------------------------------------------------------------ */

  var activeCities6 = ['Sydney'];

  function makeSpec6(cities, highlightCity) {
    var filterExpr = cities.map(function(c) {
      return 'datum.Location === "' + c + '"';
    }).join(' || ');
    var domain = cities;
    var range  = cities.map(function(c) { return cityColors[c]; });

    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
      'width': 'container',
      'height': 320,
      'data': { 'url': 'monthly_seasonality.csv' },
      'transform': [
        { 'filter': filterExpr },
        {
          'calculate': highlightCity
            ? 'datum.Location === "' + highlightCity + '" ? 1 : 0.15'
            : '1',
          'as': 'barOpacity'
        }
      ],
      'mark': { 'type': 'bar' },
      'encoding': {
        'x': {
          'field': 'Month',
          'type': 'ordinal',
          'title': 'Month (averaged across 2008-2017)',
          'sort': [1,2,3,4,5,6,7,8,9,10,11,12],
          'axis': {
            'labelExpr': "['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][datum.value - 1]",
            'labelAngle': 0
          }
        },
        'xOffset': { 'field': 'Location', 'type': 'nominal' },
        'y': {
          'field': 'Rainfall',
          'type': 'quantitative',
          'title': 'Average Monthly Rainfall (mm)',
          'axis': { 'labelExpr': "datum.value + ' mm'" }
        },
        'color': {
          'field': 'Location',
          'type': 'nominal',
          'legend': null,
          'scale': { 'domain': domain, 'range': range }
        },
        'opacity': {
          'field': 'barOpacity',
          'type': 'quantitative',
          'legend': null,
          'scale': null
        },
        'tooltip': [
          { 'field': 'Location',  'type': 'nominal',      'title': 'City' },
          { 'field': 'MonthName', 'type': 'nominal',      'title': 'Month' },
          { 'field': 'Rainfall',  'type': 'quantitative', 'title': 'Average Rainfall (mm)', 'format': '.1f' }
        ]
      },
      'config': { 'view': { 'stroke': null } }
    };
  }

  function buildBottomLegend6(containerId, activeCities) {
    var wrap = document.getElementById(containerId);
    if (!wrap) return;
    wrap.innerHTML = '';
    activeCities.forEach(function (city) {
      var item = document.createElement('div');
      item.className = 'bottom-legend-item';
      item.style.cursor = 'pointer';
      var line = document.createElement('span');
      line.className = 'bottom-legend-line';
      line.style.background = cityColors[city];
      var label = document.createElement('span');
      label.textContent = city;
      item.appendChild(line);
      item.appendChild(label);

      item.addEventListener('mouseenter', function () {
        embedChart('vis6', makeSpec6(activeCities6, city));
      });
      item.addEventListener('mouseleave', function () {
        embedChart('vis6', makeSpec6(activeCities6, null));
      });

      wrap.appendChild(item);
    });
  }

  function renderChart6(toggleCity) {
    var idx = activeCities6.indexOf(toggleCity);
    if (idx === -1) {
      activeCities6.push(toggleCity);
    } else if (activeCities6.length > 1) {
      activeCities6.splice(idx, 1);
    }
    buildPills('pills-6', activeCities6, renderChart6);
    buildBottomLegend6('bottom-legend-6', activeCities6);
    embedChart('vis6', makeSpec6(activeCities6, null));
  }

  renderChart6('Sydney');

  /* ------------------------------------------------------------------ */
  /* CHART 7 - Average Rainfall by City (horizontal bar + state filter)  */
  /* ------------------------------------------------------------------ */

  var activeState7 = 'All';

  function makeSpec7(state) {
    var transform = state === 'All'
      ? []
      : [{ 'filter': 'datum.State === "' + state + '"' }];

    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
      'width': 'container',
      'height': { 'step': 22 },
      'data': { 'url': 'city_stats.csv' },
      'transform': transform.concat([
        { 'sort': [{ 'field': 'annual_rainfall', 'order': 'descending' }], 'window': [{ 'op': 'rank', 'as': 'rank' }] }
      ]),
      'mark': { 'type': 'bar', 'cornerRadiusEnd': 4 },
      'encoding': {
        'y': {
          'field': 'City',
          'type': 'nominal',
          'sort': { 'field': 'annual_rainfall', 'order': 'descending' },
          'title': null,
          'axis': { 'labelFontSize': 11 }
        },
        'x': {
          'field': 'annual_rainfall',
          'type': 'quantitative',
          'title': 'Estimated Annual Rainfall (mm)',
          'axis': { 'labelExpr': "datum.value + ' mm'" }
        },
        'color': {
          'field': 'City',
          'type': 'nominal',
          'legend': null,
          'scale': {
            'scheme': 'tableau20'
          }
        },
        'tooltip': [
          { 'field': 'City',            'type': 'nominal',      'title': 'City' },
          { 'field': 'State',           'type': 'nominal',      'title': 'State' },
          { 'field': 'annual_rainfall', 'type': 'quantitative', 'title': 'Estimated Annual Rainfall (mm)', 'format': ',.0f' }
        ]
      },
      'config': { 'view': { 'stroke': null } }
    };
  }

  function renderChart7(state) {
    activeState7 = state;
    var select = document.getElementById('dropdown-7');
    if (select) select.value = state;
    embedChart('vis7', makeSpec7(state));
  }

  (function buildDropdown7() {
    var container = document.getElementById('dropdown-container-7');
    if (!container) return;
    var states = [
  { value: 'All', label: 'All States' },
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA',  label: 'Western Australia' },
  { value: 'SA',  label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'NT',  label: 'Northern Territory' }
];
var label = document.createElement('label');
label.className = 'dropdown-label';
label.textContent = 'State';
var select = document.createElement('select');
select.id = 'dropdown-7';
select.className = 'chart-dropdown';
states.forEach(function (s) {
  var opt = document.createElement('option');
  opt.value = s.value;
  opt.textContent = s.label;
  select.appendChild(opt);
});
    select.addEventListener('change', function () { renderChart7(this.value); });
    container.appendChild(label);
    container.appendChild(select);
    renderChart7('All');
  })();

  /* ------------------------------------------------------------------ */
  /* CHART 8 - Hottest Cities (progress bar + metric toggle)             */
  /* ------------------------------------------------------------------ */

  var activeMetric8 = 'avg_temp';

  function makeSpec8(metric) {
    var titleMap = {
      'avg_temp': 'Average Temperature (°C)',
      'max_temp': 'Mean Maximum Temperature (°C)',
      'min_temp': 'Mean Minimum Temperature (°C)'
    };

    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
      'width': 'container',
      'height': { 'step': 28 },
      'data': { 'url': 'city_stats.csv' },
      'transform': [
        { 'filter': 'datum.City !== "Mount Ginini"' },
        { 'window': [{ 'op': 'rank', 'as': 'rank' }], 'sort': [{ 'field': metric, 'order': 'descending' }] },
        { 'filter': 'datum.rank <= 14' }
      ],
      'layer': [
        {
          'mark': {
            'type': 'bar',
            'cornerRadiusEnd': 4,
            'height': 10
          },
          'encoding': {
            'y': {
              'field': 'City',
              'type': 'nominal',
              'sort': { 'field': metric, 'order': 'descending' },
              'title': null,
              'axis': { 'labelFontSize': 11 }
            },
            'x': {
              'field': metric,
              'type': 'quantitative',
              'title': titleMap[metric],
              'scale': { 'zero': true },
              'axis': { 'labelExpr': "datum.value + '°C'" }
            },
            'color': {
              'field': metric,
              'type': 'quantitative',
              'scale': { 'scheme': 'orangered' },
              'legend': { 'title': 'Cool to Hot', 'orient': 'bottom', 'gradientLength': 400, 'gradientThickness': 16, 'labelOffset': 6, 'titlePadding': 8, 'padding': 10 }
            },
            'tooltip': [
              { 'field': 'City',   'type': 'nominal',      'title': 'City' },
              { 'field': 'State',  'type': 'nominal',      'title': 'State' },
              { 'field': metric,   'type': 'quantitative', 'title': titleMap[metric], 'format': '.1f' }
            ]
          }
        },
        {
          'mark': {
            'type': 'text',
            'align': 'left',
            'dx': 5,
            'fontSize': 10,
            'fontWeight': 600
          },
          'encoding': {
            'y': {
              'field': 'City',
              'type': 'nominal',
              'sort': { 'field': metric, 'order': 'descending' }
            },
            'x': {
              'field': metric,
              'type': 'quantitative'
            },
            'text': {
              'field': metric,
              'type': 'quantitative',
              'format': '.1f'
            },
            'color': { 'value': '#1e293b' }
          }
        }
      ],
      'config': { 'view': { 'stroke': null } }
    };
  }

  function renderChart8(metric) {
    activeMetric8 = metric;
    var select = document.getElementById('dropdown-8');
    if (select) select.value = metric;
    embedChart('vis8', makeSpec8(metric));
  }

  (function buildDropdown8() {
    var container = document.getElementById('dropdown-container-8');
    if (!container) return;
    var metrics = [
      { value: 'avg_temp', label: 'Average Temperature' },
      { value: 'max_temp', label: 'Maximum Temperature' },
      { value: 'min_temp', label: 'Minimum Temperature' }
    ];
    var label = document.createElement('label');
    label.className = 'dropdown-label';
    label.textContent = 'Metric';
    var select = document.createElement('select');
    select.id = 'dropdown-8';
    select.className = 'chart-dropdown';
    metrics.forEach(function (m) {
      var opt = document.createElement('option');
      opt.value = m.value;
      opt.textContent = m.label;
      select.appendChild(opt);
    });
    select.addEventListener('change', function () { renderChart8(this.value); });
    container.appendChild(label);
    container.appendChild(select);
    renderChart8('avg_temp');
  })();

  /* ------------------------------------------------------------------ */
  /* CHART 9 - Temperature vs Humidity                                   */
  /* ------------------------------------------------------------------ */

  var activeMode9 = 'overview';

  function makeSpec9overview() {
    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
      'width': 'container',
      'height': 340,
      'data': { 'url': 'city_scatter.csv' },
      'layer': [
        {
          'mark': { 'type': 'point', 'filled': true, 'size': 120, 'opacity': 0.85 },
          'encoding': {
            'x': {
              'field': 'avg_temp', 'type': 'quantitative',
              'title': 'Average Temperature (°C)',
              'scale': { 'padding': 30 },
              'axis': { 'labelExpr': "datum.value + '°C'" }
            },
            'y': {
              'field': 'avg_humidity', 'type': 'quantitative',
              'title': 'Average Humidity (%)',
              'scale': { 'padding': 30 },
              'axis': { 'labelExpr': "datum.value + '%'" }
            },
            'size': {
              'field': 'annual_rainfall', 'type': 'quantitative',
              'title': 'Estimated Annual Rainfall (mm)',
              'scale': { 'range': [60, 600] },
              'legend': { 'orient': 'bottom', 'title': 'Estimated Annual Rainfall (mm)' }
            },
            'color': {
              'field': 'City', 'type': 'nominal',
              'scale': {
                'domain': cityList,
                'range': cityList.map(function(c) { return cityColors[c]; })
              },
              'legend': null
            },
            'tooltip': [
              { 'field': 'City',            'type': 'nominal',      'title': 'City' },
              { 'field': 'avg_temp',        'type': 'quantitative', 'title': 'Average Temperature (°C)', 'format': '.1f' },
              { 'field': 'avg_humidity',    'type': 'quantitative', 'title': 'Average Humidity (%)',     'format': '.1f' },
              { 'field': 'annual_rainfall', 'type': 'quantitative', 'title': 'Estimated Annual Rainfall (mm)', 'format': ',.0f' }
            ]
          }
        },
        {
          'mark': { 'type': 'text', 'dy': -14, 'fontSize': 9, 'fontWeight': 600 },,
          'encoding': {
            'x': { 'field': 'avg_temp',     'type': 'quantitative' },
            'y': { 'field': 'avg_humidity', 'type': 'quantitative' },
            'text': { 'field': 'City',      'type': 'nominal' },
            'color': { 'value': '#1e293b' }
          }
        },
        {
          'mark': { 'type': 'line', 'color': '#94a3b8', 'strokeDash': [4,3], 'strokeWidth': 1.5 },
          'transform': [{ 'regression': 'avg_humidity', 'on': 'avg_temp' }],
          'encoding': {
            'x': { 'field': 'avg_temp',     'type': 'quantitative' },
            'y': { 'field': 'avg_humidity', 'type': 'quantitative' }
          }
        }
      ],
      'config': { 'view': { 'stroke': null } }
    };
  }

  function makeSpec9facet(city) {
    var cities = city === 'All' ? cityList : [city];
    var filterExpr = cities.map(function(c) { return 'datum.City === "' + c + '"'; }).join(' || ');
    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
      'data': { 'url': 'monthly_scatter.csv' },
      'transform': [{ 'filter': filterExpr }],
      'facet': {
        'field': 'City', 'type': 'nominal',
        'header': { 'title': null, 'labelFontSize': 11, 'labelFontWeight': 600 }
      },
      'columns': 3,
      'spec': {
        'width': 140, 'height': 120,
        'layer': [
          {
            'mark': { 'type': 'point', 'filled': true, 'size': 20, 'opacity': 0.5 },
            'encoding': {
              'x': {
                'field': 'avg_temp', 'type': 'quantitative',
                'title': 'Temperature (°C)',
                'axis': { 'labelFontSize': 9, 'titleFontSize': 9, 'labelExpr': "datum.value + '°C'" }
              },
              'y': {
                'field': 'avg_humidity', 'type': 'quantitative',
                'title': 'Humidity (%)',
                'axis': { 'labelFontSize': 9, 'titleFontSize': 9, 'labelExpr': "datum.value + '%'" }
              },
              'color': {
                'field': 'City', 'type': 'nominal',
                'scale': {
                  'domain': cityList,
                  'range': cityList.map(function(c) { return cityColors[c]; })
                },
                'legend': null
              },
              'tooltip': [
                { 'field': 'City',         'type': 'nominal',      'title': 'City' },
                { 'field': 'YearMonth',    'type': 'nominal',      'title': 'Month' },
                { 'field': 'avg_temp',     'type': 'quantitative', 'title': 'Temperature (°C)',  'format': '.1f' },
                { 'field': 'avg_humidity', 'type': 'quantitative', 'title': 'Humidity (%)',      'format': '.1f' }
              ]
            }
          },
          {
            'mark': { 'type': 'line', 'color': '#ef4444', 'strokeWidth': 1.5 },
            'transform': [{ 'regression': 'avg_humidity', 'on': 'avg_temp', 'groupby': ['City'] }],
            'encoding': {
              'x': { 'field': 'avg_temp',     'type': 'quantitative' },
              'y': { 'field': 'avg_humidity', 'type': 'quantitative' }
            }
          }
        ]
      },
      'config': { 'view': { 'stroke': '#e2e8f0' } }
    };
  }

  function renderChart9(mode) {
    activeMode9 = mode;
    var select = document.getElementById('dropdown-9');
    if (select) select.value = mode;
    if (mode === 'overview') {
      embedChart('vis9', makeSpec9overview());
    } else {
      embedChart('vis9', makeSpec9facet(mode));
    }
  }

  (function buildDropdown9() {
    var container = document.getElementById('dropdown-container-9');
    if (!container) return;
    var label = document.createElement('label');
    label.className = 'dropdown-label';
    label.textContent = 'View';
    var select = document.createElement('select');
    select.id = 'dropdown-9';
    select.className = 'chart-dropdown';
    var options = [{ value: 'overview', label: 'Overview (all cities)' }]
      .concat(cityList.map(function(c) { return { value: c, label: c }; }));
    options.forEach(function(o) {
      var opt = document.createElement('option');
      opt.value = o.value; opt.textContent = o.label;
      select.appendChild(opt);
    });
    select.addEventListener('change', function() { renderChart9(this.value); });
    container.appendChild(label);
    container.appendChild(select);
    renderChart9('overview');
  })();

  /* ------------------------------------------------------------------ */
  /* CHART 10 - Wind Speed vs Rainfall                                   */
  /* ------------------------------------------------------------------ */

  var activeMode10 = 'overview';

  function makeSpec10overview() {
    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
      'width': 'container',
      'height': 340,
      'data': { 'url': 'city_scatter.csv' },
      'layer': [
        {
          'mark': { 'type': 'point', 'filled': true, 'size': 120, 'opacity': 0.85 },
          'encoding': {
            'x': {
              'field': 'avg_wind', 'type': 'quantitative',
              'title': 'Average Wind Speed (km/h)',
              'axis': { 'labelExpr': "datum.value + ' km/h'" }
            },
            'y': {
              'field': 'annual_rainfall', 'type': 'quantitative',
              'title': 'Estimated Annual Rainfall (mm)',
              'axis': { 'labelExpr': "datum.value + ' mm'" }
            },
            'color': {
              'field': 'City', 'type': 'nominal',
              'scale': {
                'domain': cityList,
                'range': cityList.map(function(c) { return cityColors[c]; })
              },
              'legend': {
  'orient': 'bottom',
  'title': 'City',
  'columns': 6
}
            },
            'tooltip': [
              { 'field': 'City',            'type': 'nominal',      'title': 'City' },
              { 'field': 'avg_wind',        'type': 'quantitative', 'title': 'Average Wind Speed (km/h)', 'format': '.1f' },
              { 'field': 'annual_rainfall', 'type': 'quantitative', 'title': 'Estimated Annual Rainfall (mm)', 'format': ',.0f' }
            ]
          }
        },
        {
          'mark': { 'type': 'text', 'dy': -10, 'fontSize': 9, 'fontWeight': 600 },
          'encoding': {
            'x': { 'field': 'avg_wind',        'type': 'quantitative' },
            'y': { 'field': 'annual_rainfall', 'type': 'quantitative' },
            'text': { 'field': 'City',         'type': 'nominal' },
            'color': { 'value': '#1e293b' }
          }
        },
        {
          'mark': { 'type': 'line', 'color': '#94a3b8', 'strokeDash': [4,3], 'strokeWidth': 1.5 },
          'transform': [{ 'regression': 'annual_rainfall', 'on': 'avg_wind' }],
          'encoding': {
            'x': { 'field': 'avg_wind',        'type': 'quantitative' },
            'y': { 'field': 'annual_rainfall', 'type': 'quantitative' }
          }
        }
      ],
      'config': { 'view': { 'stroke': null } }
    };
  }

  function makeSpec10facet(city) {
    var cities = city === 'All' ? cityList : [city];
    var filterExpr = cities.map(function(c) { return 'datum.City === "' + c + '"'; }).join(' || ');
    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
      'data': { 'url': 'monthly_scatter.csv' },
      'transform': [{ 'filter': filterExpr }],
      'facet': {
        'field': 'City', 'type': 'nominal',
        'header': { 'title': null, 'labelFontSize': 11, 'labelFontWeight': 600 }
      },
      'columns': 3,
      'spec': {
        'width': 140, 'height': 120,
        'layer': [
          {
            'mark': { 'type': 'point', 'filled': true, 'size': 20, 'opacity': 0.5 },
            'encoding': {
              'x': {
                'field': 'avg_wind', 'type': 'quantitative',
                'title': 'Wind Speed (km/h)',
                'axis': { 'labelFontSize': 9, 'titleFontSize': 9, 'labelExpr': "datum.value + ' km/h'" }
              },
              'y': {
                'field': 'monthly_rainfall', 'type': 'quantitative',
                'title': 'Rainfall (mm)',
                'axis': { 'labelFontSize': 9, 'titleFontSize': 9, 'labelExpr': "datum.value + ' mm'" }
              },
              'color': {
                'field': 'City', 'type': 'nominal',
                'scale': {
                  'domain': cityList,
                  'range': cityList.map(function(c) { return cityColors[c]; })
                },
                'legend': null
              },
              'tooltip': [
                { 'field': 'City',             'type': 'nominal',      'title': 'City' },
                { 'field': 'YearMonth',        'type': 'nominal',      'title': 'Month' },
                { 'field': 'avg_wind',         'type': 'quantitative', 'title': 'Wind Speed (km/h)',  'format': '.1f' },
                { 'field': 'monthly_rainfall', 'type': 'quantitative', 'title': 'Rainfall (mm)',      'format': '.1f' }
              ]
            }
          },
          {
            'mark': { 'type': 'line', 'color': '#ef4444', 'strokeWidth': 1.5 },
            'transform': [{ 'regression': 'monthly_rainfall', 'on': 'avg_wind', 'groupby': ['City'] }],
            'encoding': {
              'x': { 'field': 'avg_wind',         'type': 'quantitative' },
              'y': { 'field': 'monthly_rainfall', 'type': 'quantitative' }
            }
          }
        ]
      },
      'config': { 'view': { 'stroke': '#e2e8f0' } }
    };
  }

  function renderChart10(mode) {
    activeMode10 = mode;
    var select = document.getElementById('dropdown-10');
    if (select) select.value = mode;
    if (mode === 'overview') {
      embedChart('vis10', makeSpec10overview());
    } else {
      embedChart('vis10', makeSpec10facet(mode));
    }
  }

  (function buildDropdown10() {
    var container = document.getElementById('dropdown-container-10');
    if (!container) return;
    var label = document.createElement('label');
    label.className = 'dropdown-label';
    label.textContent = 'View';
    var select = document.createElement('select');
    select.id = 'dropdown-10';
    select.className = 'chart-dropdown';
    var options = [{ value: 'overview', label: 'Overview (all cities)' }]
      .concat(cityList.map(function(c) { return { value: c, label: c }; }));
    options.forEach(function(o) {
      var opt = document.createElement('option');
      opt.value = o.value; opt.textContent = o.label;
      select.appendChild(opt);
    });
    select.addEventListener('change', function() { renderChart10(this.value); });
    container.appendChild(label);
    container.appendChild(select);
    renderChart10('overview');
  })();

  var spec11 = null;
  await embedChart('vis11', spec11);

  var spec12 = null;
  await embedChart('vis12', spec12);

});
