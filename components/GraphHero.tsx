export default function GraphHero() {
  // A stylized rendering of what the product actually is: a person node,
  // connected to skills, connected to a job. Not decorative filler —
  // this is the literal data model.
  const nodes = [
    { id: "you", x: 40, y: 150, r: 14, label: "You", color: "var(--accent)" },
    { id: "s1", x: 140, y: 70, r: 9, label: "Python" },
    { id: "s2", x: 150, y: 150, r: 9, label: "SQL" },
    { id: "s3", x: 130, y: 225, r: 9, label: "ML" },
    { id: "job", x: 260, y: 150, r: 15, label: "ML Engineer", color: "var(--teal)" },
    { id: "peer", x: 240, y: 40, r: 8, label: "Peer" },
  ];
  const edges = [
    ["you", "s1"],
    ["you", "s2"],
    ["you", "s3"],
    ["s1", "job"],
    ["s2", "job"],
    ["s3", "job"],
    ["job", "peer"],
  ];
  const pos = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <svg viewBox="0 0 300 260" width="100%" height="auto" role="img" aria-label="Graph connecting a user's skills to a matching job">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={pos[a].x}
          y1={pos[a].y}
          x2={pos[b].x}
          y2={pos[b].y}
          stroke="var(--line)"
          strokeWidth={1.5}
        />
      ))}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.color ?? "var(--bg-raised)"} stroke="var(--line)" strokeWidth={1.5} />
          <text
            x={n.x}
            y={n.y + n.r + 14}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="9"
            fill="var(--ink-dim)"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
