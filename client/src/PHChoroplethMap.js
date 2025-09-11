import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const phTopo = "/ph.json";

// data: array of province names (strings)
// highlight: string (province to highlight)
function getCounts(data) {
  const counts = {};
  data.forEach(p => {
    if (p) counts[p] = (counts[p] || 0) + 1;
  });
  return counts;
}

const provinceColors = [
  '#e0e7ff', '#b4c6fc', '#7fa6f8', '#4b7bec', '#274690', '#1b2a49'
];

function getColor(count, max) {
  if (!count) return '#f3f4f6';
  const idx = Math.floor((count / max) * (provinceColors.length - 1));
  return provinceColors[idx];
}

export default function PHChoroplethMap({ data, highlight }) {
  const counts = getCounts(data);
  const max = Math.max(1, ...Object.values(counts));
  return (
    <div style={{ width: '100%', maxWidth: 360, minWidth: 280, margin: '0 auto', padding: 0, overflow: 'visible' }}>
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 2200, center: [122, 12.5] }} width={340} height={180} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <Geographies geography={phTopo}>
          {({ geographies }) =>
            geographies.map(geo => {
              const prov = geo.properties.PROVINCE || geo.properties.name;
              const count = counts[prov] || 0;
              const isHighlight = highlight === prov;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isHighlight ? '#fbbf24' : getColor(count, max)}
                  stroke="#fff"
                  strokeWidth={isHighlight ? 2 : 0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', filter: 'brightness(1.1)' },
                    pressed: { outline: 'none' }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
