
import { useEffect, useState } from "react";
import "./App.css";
import Motor3D from "./Motor3D";
import useMotorSimulation from "./useMotorSimulation";
import SensorCharts from "./SensorCharts";

function App() {
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1450);
  const [load, setLoad] = useState(55);
  const [cooling, setCooling] = useState(70);
  const [resetKey, setResetKey] = useState(0);
  const [sensorHistory, setSensorHistory] = useState([]);
  const [alertMessage, setAlertMessage] = useState(
    "All systems operating within normal parameters."
  );
  const [clock, setClock] = useState(new Date());

  // All sensor readings now come from the same simulation engine.
  const {
    temperature,
    elapsedSeconds,
    status: motorHealth,
    rpm,
    vibration,
    current,
    power,
    efficiency,
  } = useMotorSimulation(isRunning, speed, load, cooling, resetKey);

  const performanceScore = isRunning
    ? Math.max(
        0,
        Math.min(
          100,
          Math.round(
            100 -
              Math.max(0, temperature - 45) * 0.8 -
              vibration * 5 -
              Math.abs(load - 70) * 0.12
          )
        )
      )
    : 100;

  const performanceLabel =
    performanceScore >= 85
      ? "EXCELLENT"
      : performanceScore >= 65
        ? "STABLE"
        : performanceScore >= 40
          ? "CAUTION"
          : "CRITICAL";

  const isCritical = motorHealth === "Critical";
  const isWarning = motorHealth === "Warning";

  const healthClass = isCritical
    ? "critical"
    : isWarning
      ? "warning"
      : "normal";

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keep the latest 60 sensor samples for live charts.
  useEffect(() => {
    const point = {
      time: new Date().toLocaleTimeString([], {
        minute: "2-digit",
        second: "2-digit",
      }),
      temperature: Number(temperature) || 0,
      speed: Number(rpm) || 0,
      vibration: Number(vibration) || 0,
      current: Number(current) || 0,
      power: Number(power) || 0,
      efficiency: Number(efficiency) || 0,
    };

    setSensorHistory((previous) => [...previous, point].slice(-60));
  }, [
    temperature,
    rpm,
    vibration,
    current,
    power,
    efficiency,
  ]);

  useEffect(() => {
    if (isCritical) {
      setAlertMessage(
        "Critical operating conditions detected. Reduce load or increase cooling."
      );
    } else if (isWarning) {
      setAlertMessage(
        "Operating conditions elevated. Monitor temperature and vibration."
      );
    } else if (!isRunning) {
      setAlertMessage(
        "Motor stopped. Sensor monitoring remains active."
      );
    } else {
      setAlertMessage(
        "All systems operating within normal parameters."
      );
    }
  }, [isCritical, isWarning, isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setSpeed(1450);
    setLoad(55);
    setCooling(70);
    setSensorHistory([]);
    setResetKey((previous) => previous + 1);
    setAlertMessage(
      "Simulation reset. Ready for a new operating cycle."
    );
  };

  const formatRuntime = (seconds) => {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const secs = Math.floor(safeSeconds % 60);

    return [hours, minutes, secs]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };

  return (
    <main className="twin-app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <path
                d="M20 4L34 12V28L20 36L6 28V12L20 4Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M22 8L13 22H20L18 32L28 17H21L22 8Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <h1>SMART MOTOR <span>TWIN</span></h1>
            <p>INDUSTRIAL INTELLIGENCE PLATFORM</p>
          </div>
        </div>

        <div className="topbar-right">
          <div className="system-indicator">
            <span className={`live-dot ${isRunning ? "pulse" : ""}`} />
            <div>
              <strong>
                {isRunning ? "LIVE SIMULATION" : "STANDBY MODE"}
              </strong>
              <small>DIGITAL TWIN / MOTOR-01</small>
            </div>
          </div>

          <div className="clock-block">
            <strong>
              {clock.toLocaleTimeString([], { hour12: false })}
            </strong>
            <small>
              {clock.toLocaleDateString([], {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </small>
          </div>
        </div>
      </header>

      <section className="welcome-row">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            ASSET MONITORING / OVERVIEW
          </div>
          <h2>Motor Control Center</h2>
          <p className="welcome-subtitle">
            Real-time visualization of motor performance, thermal behavior
            and operating conditions.
          </p>
        </div>

        <div className={`overall-status ${healthClass}`}>
          <span className="status-ring"><span /></span>
          <div>
            <small>OVERALL CONDITION</small>
            <strong>
              {isCritical
                ? "CRITICAL"
                : isWarning
                  ? "WARNING"
                  : isRunning
                    ? "OPTIMAL"
                    : "STANDBY"}
            </strong>
          </div>
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard
          label="MOTOR TEMPERATURE"
          value={Number(temperature || 0).toFixed(1)}
          unit="°C"
          icon="thermometer"
          tone={temperature >= 65 ? "amber" : "cyan"}
          note={temperature >= 65 ? "Elevated thermal level" : "Thermal condition"}
          progress={Math.min(100, (Number(temperature) / 120) * 100)}
        />

        <MetricCard
          label="VIBRATION LEVEL"
          value={Number(vibration).toFixed(2)}
          unit="mm/s"
          icon="activity"
          tone={vibration >= 2.5 ? "amber" : "blue"}
          note={vibration >= 2.5 ? "Inspect vibration" : "Mechanical stability"}
          progress={Math.min(100, (vibration / 5) * 100)}
        />

        <MetricCard
          label="MOTOR CURRENT"
          value={Number(current).toFixed(2)}
          unit="A"
          icon="zap"
          tone="purple"
          note={`Estimated power draw: ${Number(power).toFixed(2)} kW`}
          progress={Math.min(100, (current / 10) * 100)}
        />

        <MetricCard
          label="ENERGY EFFICIENCY"
          value={Number(efficiency).toFixed(1)}
          unit="%"
          icon="gauge"
          tone="green"
          note="Estimated operating efficiency"
          progress={efficiency}
        />
      </section>

      <section className="main-grid">
        <article className="panel motor-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-kicker">ASSET VISUALIZATION</div>
              <h3>3D Motor Twin</h3>
            </div>
            <span className="asset-tag">
              <span className="mini-dot" /> MTR-001
            </span>
          </div>

          <div className="motor-viewport">
            <div className="viewport-topline">
              <span><span className="live-dot" /> LIVE MODEL</span>
              <span>INDUCTION MOTOR / 3-PHASE</span>
            </div>

            <div className="viewport-grid" />
            <div className="viewport-glow" />

            <div className="motor-object">
              <Motor3D isRunning={isRunning} />
            </div>

            <div className="sensor-callout callout-temp">
              <span className="callout-line" />
              <span className="callout-point" />
              <div>
                <small>THERMAL SENSOR</small>
                <strong>{Number(temperature).toFixed(1)}°C</strong>
              </div>
            </div>

            <div className="sensor-callout callout-speed">
              <span className="callout-line" />
              <span className="callout-point" />
              <div>
                <small>SHAFT SPEED</small>
                <strong>{rpm.toLocaleString()} RPM</strong>
              </div>
            </div>

            <div className="viewport-bottomline">
              <span className={`state-chip ${isRunning ? "running" : ""}`}>
                <span /> {isRunning ? "MOTOR RUNNING" : "MOTOR STOPPED"}
              </span>
              <span className="runtime">
                RUNTIME <strong>{formatRuntime(elapsedSeconds)}</strong>
              </span>
            </div>
          </div>

          <div className="motor-specs">
            <Spec label="ASSET ID" value="MTR-001" />
            <Spec label="SHAFT SPEED" value={`${rpm.toLocaleString()} RPM`} />
            <Spec label="POWER DRAW" value={`${Number(power).toFixed(2)} kW`} />
            <Spec label="SIMULATION" value="VIRTUAL" />
          </div>
        </article>

        <article className="panel control-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-kicker">OPERATIONAL PARAMETERS</div>
              <h3>Motor Controls</h3>
            </div>
            <span className="control-icon">⌘</span>
          </div>

          <div className="control-state">
            <span className={`state-led ${isRunning ? "on" : ""}`} />
            <div>
              <strong>{isRunning ? "System active" : "System idle"}</strong>
              <small>Manual control mode</small>
            </div>
            <span className="manual-badge">MANUAL</span>
          </div>

          <div className="slider-control">
            <div className="slider-label">
              <label htmlFor="speed-control">Motor speed</label>
              <strong>{speed.toLocaleString()} <small>RPM</small></strong>
            </div>
            <input
              id="speed-control"
              type="range"
              min="0"
              max="3000"
              step="50"
              value={speed}
              style={{ "--slider-progress": `${(speed / 3000) * 100}%` }}
              onChange={(event) => setSpeed(Number(event.target.value))}
            />
            <div className="range-labels">
              <span>0 RPM</span><span>3000 RPM</span>
            </div>
          </div>

          <div className="slider-control">
            <div className="slider-label">
              <label htmlFor="load-control">Mechanical load</label>
              <strong>{load}<small>%</small></strong>
            </div>
            <input
              id="load-control"
              type="range"
              min="0"
              max="100"
              step="5"
              value={load}
              style={{ "--slider-progress": `${load}%` }}
              onChange={(event) => setLoad(Number(event.target.value))}
            />
            <div className="range-labels">
              <span>0% load</span><span>100% load</span>
            </div>
          </div>

          <div className="slider-control">
            <div className="slider-label">
              <label htmlFor="cooling-control">Cooling intensity</label>
              <strong>{cooling}<small>%</small></strong>
            </div>
            <input
              id="cooling-control"
              type="range"
              min="0"
              max="100"
              step="5"
              value={cooling}
              style={{ "--slider-progress": `${cooling}%` }}
              onChange={(event) => setCooling(Number(event.target.value))}
            />
            <div className="range-labels">
              <span>Low airflow</span><span>Maximum airflow</span>
            </div>
          </div>

          <div className="control-divider" />

          <div className="control-buttons">
            <button
              className={`primary-button ${isRunning ? "stop-button" : ""}`}
              onClick={() => setIsRunning((previous) => !previous)}
            >
              <span>{isRunning ? "Ⅱ" : "▶"}</span>
              {isRunning ? "Stop motor" : "Start motor"}
            </button>
            <button className="reset-button" onClick={handleReset}>
              <span>↻</span> Reset
            </button>
          </div>

          <div className="control-footnote">
            <span className="info-symbol">i</span>
            Changes affect the simulated operating conditions.
          </div>
        </article>
      </section>

      <section className="analytics-grid">
        <article className="panel analytics-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-kicker">LIVE TELEMETRY</div>
              <h3>Performance Analytics</h3>
            </div>
            <span className="chart-period"><span /> LIVE / 60 SAMPLES</span>
          </div>

          <div className="chart-legend">
            <span><i className="legend-dot temperature-dot" /> Temperature (°C)</span>
            <span><i className="legend-dot speed-dot" /> Speed (RPM)</span>
          </div>

          <div className="chart-container">
            <SensorCharts data={sensorHistory} />
          </div>
          <p className="chart-footnote">
            Sensor history updates as the simulation runs.
          </p>
        </article>

        <article className="panel health-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-kicker">CONDITION ASSESSMENT</div>
              <h3>Performance Score</h3>
            </div>
            <span className="score-symbol">◎</span>
          </div>

          <div className="score-area">
            <div
              className={`score-ring ${healthClass}`}
              style={{ "--score": `${performanceScore * 3.6}deg` }}
            >
              <div className="score-inner">
                <strong>{performanceScore}</strong>
                <span>/ 100</span>
              </div>
            </div>
            <div className="score-description">
              <span className={`score-label ${healthClass}`}>
                {performanceLabel}
              </span>
              <p>
                {isCritical
                  ? "Operating conditions need immediate attention."
                  : isWarning
                    ? "Some readings are elevated. Monitor the motor."
                    : "The simulated motor is operating within its preferred range."}
              </p>
            </div>
          </div>

          <div className="score-breakdown">
            <div>
              <span>Thermal condition</span>
              <strong>{temperature >= 65 ? "Attention" : "Normal"}</strong>
            </div>
            <div>
              <span>Mechanical condition</span>
              <strong>{vibration >= 2.5 ? "Attention" : "Normal"}</strong>
            </div>
            <div>
              <span>Cooling system</span>
              <strong>{cooling >= 40 ? "Active" : "Low"}</strong>
            </div>
          </div>
        </article>
      </section>

      <section
        className={`alert-panel ${
          isCritical ? "alert-critical" : isWarning ? "alert-warning" : ""
        }`}
      >
        <div className="alert-icon">
          {isCritical ? "!" : isWarning ? "⚠" : "✓"}
        </div>
        <div className="alert-copy">
          <strong>
            {isCritical
              ? "CRITICAL ALERT"
              : isWarning
                ? "ATTENTION REQUIRED"
                : "SYSTEM NOTIFICATIONS"}
          </strong>
          <p>{alertMessage}</p>
        </div>
        <span
          className={`alert-status ${
            isCritical ? "danger" : isWarning ? "caution" : ""
          }`}
        >
          {isCritical ? "CRITICAL" : isWarning ? "WARNING" : "ALL CLEAR"}
        </span>
      </section>

      <footer className="app-footer">
        <div>
          <span className="footer-mark">ST</span> SMART MOTOR TWIN
          <span className="footer-divider"> / </span> DIGITAL ENGINEERING
        </div>
        <div>
          DEMONSTRATION ENVIRONMENT
          <span className="footer-divider"> · </span>
          NOT CONNECTED TO PHYSICAL HARDWARE
        </div>
      </footer>
    </main>
  );
}

function MetricCard({ label, value, unit, icon, tone, note, progress }) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        <span className="metric-icon">
          {icon === "thermometer" && "♨"}
          {icon === "activity" && "⌁"}
          {icon === "zap" && "ϟ"}
          {icon === "gauge" && "◉"}
        </span>
      </div>
      <div className="metric-value">
        <strong>{value}</strong><span>{unit}</span>
      </div>
      <div className="metric-progress">
        <span style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
      </div>
      <p className="metric-note"><span />{note}</p>
    </article>
  );
}

function Spec({ label, value }) {
  return (
    <div className="motor-spec">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;
