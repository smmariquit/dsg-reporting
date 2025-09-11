import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, WordCloud } from 'recharts';

export function WordCloudViz({ words, fontFamily = 'Poppins, sans-serif', className = '', cloudStyle = {} }) {
  // words: array of strings
  const data = Object.entries(
    words.reduce((acc, w) => {
      acc[w] = (acc[w] || 0) + 1;
      return acc;
    }, {})
  ).map(([text, value]) => ({ text, value }));

  return (
    <div className={className} style={{ width: '100%', height: 180, ...cloudStyle }}>
      {/* recharts WordCloud is experimental; fallback to list if not available */}
      {data.length === 0 ? <p>No words yet.</p> :
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 8, listStyle: 'none', padding: 0, fontFamily, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
          {data.map(d => {
            // Limit font size between 14px and 36px
            const size = Math.min(36, 14 + d.value * 5);
            return <li key={d.text} style={{ fontSize: size, fontWeight: 500, color: '#4b3fa7', textShadow: '0 2px 8px rgba(80,80,160,0.08)', lineHeight: 1.1 }}>{d.text}</li>;
          })}
        </ul>
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
