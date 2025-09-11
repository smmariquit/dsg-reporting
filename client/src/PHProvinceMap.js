import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// TopoJSON for PH provinces (public domain, simplified)
const PH_TOPOJSON = "/ph.json";

export default function PHProvinceMap({ selected, onSelect }) {
  return (
    <div style={{ width: '100%', maxWidth: 500, margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 2200, center: [122.5, 12.5] }}
        width={480}
        height={520}
        style={{ background: 'transparent', width: '100%', height: 'auto' }}
      >
        <Geographies geography={PH_TOPOJSON}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => onSelect(geo.properties.PROVINCE)}
                style={{
                  default: {
                    fill: selected === geo.properties.PROVINCE ? '#61dafb' : '#e0e7ef',
                    stroke: '#3fa7ff',
                    strokeWidth: 0.7,
                    outline: 'none',
                    cursor: 'pointer',
                    filter: selected === geo.properties.name ? 'drop-shadow(0 0 8px #61dafb)' : 'none',
                  },
                  hover: {
                    fill: '#a259ff',
                    outline: 'none',
                  },
                  pressed: {
                    fill: '#3fa7ff',
                    outline: 'none',
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
