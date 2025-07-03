// ============================================================================
// SankeyMChart.jsx  –  Applications ➜ Status Sankey (single root node)
// Requires: npm i recharts
// ============================================================================

import React, { useMemo } from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';

/* ── 1. Build one root node (“Applications”) ➜ status nodes ─────────────── */
const buildSankeyData = (apps = []) => {
  // Root node index = 0
  const nodes = [{ name: 'Applications' }];
  const idxMap = new Map([['Applications', 0]]);   // status → index
  const linkAgg = new Map();                       // status → count

  apps.forEach(({ status = 'Unknown' }) => {
    linkAgg.set(status, (linkAgg.get(status) || 0) + 1);
  });

  const links = [];
  linkAgg.forEach((value, status) => {
    // create node for each status if not exists
    if (!idxMap.has(status)) {
      idxMap.set(status, nodes.push({ name: status }) - 1);
    }
    links.push({
      source: 0,                   // Applications
      target: idxMap.get(status),  // Status node
      value,                       // # of apps
    });
  });

  return { nodes, links };
};

/* ── 2. Simple coloured node component ─────────────────────────── */
const Node = ({ x, y, width, height, index, payload }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={index === 0 ? '#60a5fa' : '#34d399'}
      stroke="#ffffff"
    />
    <text
      x={x + width / 2}
      y={y + height / 2}
      dy="0.35em"
      textAnchor="middle"
      fill="#ffffff"
      fontSize={12}
      pointerEvents="none"
    >
      {payload.name}
    </text>
  </g>
);

/* ── 3. Chart component ────────────────────────────────────────── */
const SankeyMChart = ({ applications }) => {
  const data = useMemo(
    () => buildSankeyData(applications),
    [applications]
  );

  if (!data.nodes.length) {
    return <p className="text-gray-500">No application data to display.</p>;
  }

  return (
    <div className="w-full h-[420px] mb-10">
      <ResponsiveContainer>
        <Sankey
          data={data}
          node={<Node />}
          nodePadding={40}
          margin={{ top: 20, right: 120, bottom: 20, left: 120 }}
          link={{ stroke: '#a3a3a3' }}
          iterations={32}
        >
          <Tooltip
            formatter={(v) =>
              `${v} application${v > 1 ? 's' : ''}`
            }
          />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
};

export default SankeyMChart;
