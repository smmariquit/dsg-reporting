import React, { useState } from 'react';
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
  '#e0e7ef', '#c1d1e0', '#a2bbd1', '#83a5c2', '#648fb3', '#4579a4'
];

function getColor(count, max) {
  if (!count) return '#e0e7ef';
  const idx = Math.floor((count / max) * (provinceColors.length - 1));
  return provinceColors[idx];
}

export default function PHChoroplethMap({ data, highlight }) {
  const [tooltip, setTooltip] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  const counts = getCounts(data);
  const max = Math.max(1, ...Object.values(counts));
  
  const handleMouseEnter = (e, prov, count) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({ 
      x: e.clientX - rect.left + 10, 
      y: e.clientY - rect.top - 10 
    });
    setTooltip(`${prov}: ${count || 0} ${count === 1 ? 'person' : 'people'}`);
  };
  
  const handleMouseLeave = () => {
    setTooltip('');
  };

  return (
    <div style={{ width: '100%', maxWidth: 500, margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 2200, center: [122.5, 12.5] }} width={480} height={520} style={{ background: 'transparent', width: '100%', height: 'auto' }}>
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
                  fill={isHighlight ? '#61dafb' : getColor(count, max)}
                  stroke="#3fa7ff"
                  strokeWidth={isHighlight ? 2 : 0.7}
                  style={{
                    default: { 
                      outline: 'none',
                      filter: isHighlight ? 'drop-shadow(0 0 8px #61dafb)' : 'none'
                    },
                    hover: { outline: 'none', fill: '#a259ff' },
                    pressed: { outline: 'none', fill: '#3fa7ff' }
                  }}
                  onMouseEnter={(e) => handleMouseEnter(e, prov, count)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 1000,
            whiteSpace: 'nowrap'
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
