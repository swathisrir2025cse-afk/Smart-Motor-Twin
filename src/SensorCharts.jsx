
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

const CHARTS = [
  {
    key: "temperature",
    title: "Motor Temperature",
    unit: "°C",
    color: "#fb923c",
    warning: 65,
    domain: [20, "auto"],
  },
  {
    key: "vibration",
    title: "Mechanical Vibration",
    unit: "mm/s",
    color: "#c084fc",
    warning: 2.5,
    domain: [0, "auto"],
  },
  {
    key: "speed",
    title: "Shaft Speed",
    unit: "RPM",
    color: "#38bdf8",
    warning: null,
    domain: [0, "auto"],
  },
  {
    key: "power",
    title: "Electrical Power",
    unit: "kW",
    color: "#34d399",
    warning: null,
    domain: [0, "auto"],
  },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload;

  return (
    <div className="telemetry-tooltip">
      <div className="tooltip-time">{label || "Latest sample"}</div>

      {payload.map((entry) => (
        <div className="tooltip-reading" key={entry.dataKey}>
          <span
            className="tooltip-dot"
            style={{ background: entry.color }}
          />
          <span>{entry.name}</span>
          <strong>
            {Number(entry.value).toFixed(
              entry.dataKey === "speed" ? 0 : 2
            )}
          </strong>
        </div>
      ))}

      {point?.current !== undefined && (
        <div className="tooltip-extra">
          Current: {Number(point.current).toFixed(2)} A
        </div>
      )}

      {point?.efficiency !== undefined && (
        <div className="tooltip-extra">
          Efficiency: {Number(point.efficiency).toFixed(1)}%
        </div>
      )}
    </div>
  );
}

function TelemetryChart({ config, data }) {
  const latest = data[data.length - 1];
  const latestValue = latest?.[config.key];

  return (
    <article className="chart-box telemetry-chart">
      <div className="chart-box-heading">
        <div>
          <span
            className="chart-status-dot"
            style={{ background: config.color }}
          />
          <h3>{config.title}</h3>
        </div>

        <div className="chart-current-value">
          <strong>
            {Number.isFinite(Number(latestValue))
              ? Number(latestValue).toFixed(
                  config.key === "speed" ? 0 : 1
                )
              : "—"}
          </strong>
          <span>{config.unit}</span>
        </div>
      </div>

      <div className="chart-inner">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={data}
            margin={{ top: 12, right: 12, left: -14, bottom: 2 }}
          >
            <CartesianGrid
              stroke="#25364a"
              strokeDasharray="3 5"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              stroke="#8293a8"
              tick={{ fill: "#8293a8", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#35465a" }}
              minTickGap={35}
            />

            <YAxis
              stroke="#8293a8"
              tick={{ fill: "#8293a8", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={config.domain}
              width={48}
            />

            <Tooltip
              content={<ChartTooltip />}
              cursor={{
                stroke: "#64748b",
                strokeDasharray: "4 4",
              }}
            />

            {config.warning !== null && (
              <ReferenceLine
                y={config.warning}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                ifOverflow="extendDomain"
              />
            )}

            <Line
              type="monotone"
              dataKey={config.key}
              name={config.title}
              stroke={config.color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 4,
                fill: config.color,
                stroke: "#0b1421",
                strokeWidth: 2,
              }}
              isAnimationActive={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-box-footer">
        <span>LIVE TELEMETRY</span>
        <span>{data.length} / 60 samples</span>
      </div>
    </article>
  );
}

export default function SensorCharts({ data = [] }) {
  return (
    <div className="charts-grid telemetry-grid">
      {CHARTS.map((config) => (
        <TelemetryChart
          key={config.key}
          config={config}
          data={data}
        />
      ))}
    </div>
  );
}
