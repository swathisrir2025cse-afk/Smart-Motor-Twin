
import { useEffect, useState } from "react";

export default function useMotorSimulation(
  isRunning,
  speed,
  load,
  cooling,
  resetKey = 0
) {
  const [temperature, setTemperature] = useState(28);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    setTemperature(28);
    setElapsedSeconds(0);
  }, [resetKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature((previous) => {
        const ambientTemperature = 28;

        if (!isRunning) {
          return Math.max(ambientTemperature, previous - 0.7);
        }

        const speedFactor = Math.max(0, Math.min(speed / 3000, 1));
        const loadFactor = Math.max(0, Math.min(load / 100, 1));
        const coolingFactor = Math.max(0, Math.min(cooling / 100, 1));

        const heatGenerated =
          0.12 + speedFactor * 0.25 + loadFactor * 0.65;

        const heatRemoved =
          0.025 + coolingFactor * 0.28;

        const nextTemperature =
          previous + heatGenerated - heatRemoved;

        return Math.max(
          ambientTemperature,
          Math.min(nextTemperature, 120)
        );
      });

      if (isRunning) {
        setElapsedSeconds((previous) => previous + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, speed, load, cooling]);

  // Simulated sensor calculations
  const speedFactor = Math.max(0, Math.min(speed / 3000, 1));
  const loadFactor = Math.max(0, Math.min(load / 100, 1));

  const rpm = isRunning
    ? Math.round(speed * (1 - loadFactor * 0.025))
    : 0;

  const current = isRunning
    ? Number((1.2 + speedFactor * 2.8 + loadFactor * 5.5).toFixed(2))
    : 0;

  const power = isRunning
    ? Number(((current * 230 * 0.85) / 1000).toFixed(2))
    : 0;

  const vibration = isRunning
    ? Number(
        (
          0.35 +
          speedFactor * 1.1 +
          loadFactor * 1.4 +
          Math.max(0, temperature - 55) * 0.025
        ).toFixed(2)
      )
    : 0;

  const efficiency = isRunning
    ? Math.max(
        40,
        Math.min(
          96,
          94 - Math.abs(loadFactor - 0.75) * 18 - speedFactor * 2
        )
      )
    : 0;

  const status =
    temperature >= 80 || vibration >= 3.5
      ? "Critical"
      : temperature >= 65 || vibration >= 2.5
        ? "Warning"
        : isRunning
          ? "Normal"
          : "Stopped";

  return {
    temperature: Number(temperature.toFixed(1)),
    elapsedSeconds,
    status,
    rpm,
    vibration,
    current,
    power,
    efficiency: Number(efficiency.toFixed(1)),
  };
}
