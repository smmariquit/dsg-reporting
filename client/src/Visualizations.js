import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export function WordCloudViz({ words, fontFamily = 'Poppins, sans-serif', className = '', cloudStyle = {} }) {
  // words: array of strings
  const data = Object.entries(
    words.reduce((acc, w) => {
      acc[w] = (acc[w] || 0) + 1;
      return acc;
    }, {})
  ).map(([text, value]) => ({ text, value }));

  // Colors for the word cloud
  const colors = ['#4b3fa7', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d946ef'];

  return (
    <div className={className} style={{ 
      width: '100%', 
      height: 180, 
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...cloudStyle 
    }}>
      {data.length === 0 ? <p>No words yet.</p> :
        <div style={{ 
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px'
        }}>
          {data.map((d, index) => {
            // Limit font size between 12px and 32px based on frequency
            const size = Math.min(32, 12 + d.value * 4);
            const color = colors[index % colors.length];
            // Add some randomness to positioning for a more organic look
            const rotation = (Math.random() - 0.5) * 30; // Random rotation between -15 and 15 degrees
            const opacity = Math.max(0.7, 1 - index * 0.1);
            
            return (
              <span 
                key={d.text} 
                style={{ 
                  fontSize: size, 
                  fontWeight: 600 + (d.value * 100), 
                  color: color,
                  textShadow: '0 2px 8px rgba(80,80,160,0.15)',
                  lineHeight: 1.2,
                  fontFamily: fontFamily,
                  transform: `rotate(${rotation}deg)`,
                  opacity: opacity,
                  transition: 'transform 0.3s ease, opacity 0.3s ease',
                  cursor: 'default',
                  userSelect: 'none',
                  display: 'inline-block',
                  margin: '2px 4px',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = `rotate(${rotation}deg) scale(1.1)`;
                  e.target.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = `rotate(${rotation}deg) scale(1)`;
                  e.target.style.opacity = opacity;
                }}
              >
                {d.text}
              </span>
            );
          })}
        </div>
      }
    </div>
  );
}

export function Histogram({ data, label }) {
  // data: array of numbers
  const counts = {};
  data.forEach(n => { counts[n] = (counts[n] || 0) + 1; });
  const chartData = Object.entries(counts).map(([k, v]) => ({ name: k, count: v }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <XAxis dataKey="name" label={{ value: label, position: 'insideBottom', offset: -5 }} stroke="#fff" tick={{ fill: '#fff' }} />
          <YAxis allowDecimals={false} stroke="#fff" tick={{ fill: '#fff' }} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
