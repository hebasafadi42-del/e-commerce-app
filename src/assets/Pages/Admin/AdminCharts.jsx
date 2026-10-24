import { useId, useState } from "react";


const W = 640;
const H = 260;
const PAD = { t: 16, r: 16, b: 32, l: 48 };

const niceMax = (v) => {
  if (v <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nice * exp;
};

const compact = (n) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);

export const XYChart = ({
  data,
  type = "area",
  color = "#F0345D",
  format = (v) => v,
  name = "Value",
}) => {
  const [hover, setHover] = useState(null);
  const gid = "g" + useId().replace(/:/g, "");

  const n = data.length;
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);
  const step = innerW / Math.max(n, 1);

  const x = (i) => PAD.l + step * i + step / 2;
  const y = (v) => PAD.t + innerH - (v / max) * innerH;
  const base = PAD.t + innerH;

  let line = "";
  data.forEach((d, i) => {
    if (i === 0) line = `M ${x(i)} ${y(d.value)}`;
    else {
      const mx = (x(i - 1) + x(i)) / 2;
      line += ` C ${mx} ${y(data[i - 1].value)}, ${mx} ${y(d.value)}, ${x(i)} ${y(d.value)}`;
    }
  });
  const areaPath = n ? `${line} L ${x(n - 1)} ${base} L ${x(0)} ${base} Z` : "";

  const labelEvery = Math.ceil(n / 7);
  const barW = Math.min(step * 0.6, 40);
  const tipLeft = hover != null ? Math.min(88, Math.max(12, (x(hover) / W) * 100)) : 0;

  return (
    <div className="adm-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={name}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line className="adm-grid-line" x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} />
            <text className="adm-axis-text" x={PAD.l - 8} y={y(t) + 4} textAnchor="end">
              {compact(t)}
            </text>
          </g>
        ))}

        {type === "area" ? (
          <>
            {n > 0 && <path d={areaPath} fill={`url(#${gid})`} />}
            {n > 0 && <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />}
            {hover != null && (
              <>
                <line className="adm-hover-line" x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={base} />
                <circle cx={x(hover)} cy={y(data[hover].value)} r="5" fill="#fff" stroke={color} strokeWidth="3" />
              </>
            )}
          </>
        ) : (
          data.map((d, i) => (
            <rect
              key={i}
              x={x(i) - barW / 2}
              y={y(d.value)}
              width={barW}
              height={Math.max(0, base - y(d.value))}
              rx="5"
              fill={color}
              opacity={hover == null || hover === i ? 1 : 0.45}
            />
          ))
        )}

        {data.map((d, i) =>
          i % labelEvery === 0 ? (
            <text key={i} className="adm-axis-text" x={x(i)} y={H - 8} textAnchor="middle">
              {d.label}
            </text>
          ) : null
        )}

        {data.map((_, i) => (
          <rect
            key={i}
            x={PAD.l + step * i}
            y={PAD.t}
            width={step}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>

      {hover != null && (
        <div className="adm-tip" style={{ left: `${tipLeft}%` }}>
          <strong>{data[hover].label}</strong>
          <span>
            {name}: {format(data[hover].value)}
          </span>
        </div>
      )}
    </div>
  );
};

export const DonutChart = ({ data, centerLabel = "Total" }) => {
  const [active, setActive] = useState(null);
  const R = 70;
  const C = 2 * Math.PI * R;
  const total = data.reduce((s, d) => s + d.value, 0);

  let acc = 0;
  const segs = data
    .filter((d) => d.value > 0)
    .map((d) => {
      const len = (d.value / total) * C;
      const seg = { ...d, dash: `${len} ${C - len}`, offset: -acc };
      acc += len;
      return seg;
    });

  const shown = active != null ? data.find((d) => d.label === active) : null;

  return (
    <div className="adm-donut">
      <svg viewBox="0 0 200 200" role="img" aria-label="Distribution">
        <circle className="adm-donut__track" cx="100" cy="100" r={R} fill="none" strokeWidth="26" />
        <g transform="rotate(-90 100 100)">
          {segs.map((s) => (
            <circle
              key={s.label}
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={active === s.label ? 30 : 26}
              strokeDasharray={s.dash}
              strokeDashoffset={s.offset}
              opacity={active == null || active === s.label ? 1 : 0.35}
              style={{ transition: "all .2s ease" }}
              onMouseEnter={() => setActive(s.label)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </g>
        <text x="100" y="98" textAnchor="middle" className="adm-donut__value">
          {shown ? shown.value : total}
        </text>
        <text x="100" y="118" textAnchor="middle" className="adm-axis-text">
          {shown ? shown.label : centerLabel}
        </text>
      </svg>

      <ul className="adm-legend">
        {data.map((d) => (
          <li
            key={d.label}
            onMouseEnter={() => setActive(d.label)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="adm-legend__dot" style={{ background: d.color }} />
            <span className="text-capitalize flex-grow-1">{d.label}</span>
            <strong>{d.value}</strong>
            <span className="text-muted small ms-2">
              {total ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const HBarList = ({ data, color = "#6C5CE7" }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="adm-hbars">
      {data.map((d) => (
        <div key={d.label}>
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-truncate me-2">{d.label}</span>
            <strong>{d.value}</strong>
          </div>
          <div className="adm-bar__track">
            <div className="adm-bar__fill" style={{ width: `${(d.value / max) * 100}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
  );
};