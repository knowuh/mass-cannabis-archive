import { useEffect, useRef } from 'preact/hooks';
import * as Plot from '@observablehq/plot';

interface StatsDashboardProps {
  licenses: any[];
  sales: any[];
}

export default function StatsDashboard({ licenses, sales }: StatsDashboardProps) {
  const velocityRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!licenses.length || !velocityRef.current) return;

    // 1. License Velocity (New licenses over time)
    // We need to parse dates. COMMENCE_OPERATIONS_DATE or CNB_DATE_OF_FINAL_LICENSURE
    const velocityData = licenses
      .filter(d => d.COMMENCE_OPERATIONS_DATE)
      .map(d => ({
        date: new Date(d.COMMENCE_OPERATIONS_DATE),
        type: d.LICENSE_TYPE
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const velocityPlot = Plot.plot({
      style: {
        backgroundColor: "transparent",
        color: "var(--text-base)",
        fontFamily: "var(--font-mono)",
        fontSize: "10px"
      },
      marks: [
        Plot.rectY(velocityData, Plot.binX({y: "count"}, {x: "date", thresholds: "month", fill: "var(--accent-color)", tip: true})),
        Plot.ruleY([0])
      ],
      x: { label: "Date →", grid: true },
      y: { label: "↑ New Licenses", grid: true },
      width: velocityRef.current.clientWidth,
      height: 300,
      marginRight: 40
    });

    velocityRef.current.appendChild(velocityPlot);

    // 2. Market Composition (By Type)
    const typePlot = Plot.plot({
      style: {
        backgroundColor: "transparent",
        color: "var(--text-base)",
        fontFamily: "var(--font-mono)",
        fontSize: "10px"
      },
      marks: [
        Plot.barX(licenses, Plot.groupY({x: "count"}, {y: "LICENSE_TYPE", fill: "var(--accent-color)", sort: {y: "x", reverse: true}, tip: true})),
        Plot.ruleX([0])
      ],
      x: { label: "Count →", grid: true },
      y: { label: null },
      width: typeRef.current.clientWidth,
      height: 400,
      marginLeft: 180
    });

    typeRef.current.appendChild(typePlot);

    return () => {
      velocityPlot.remove();
      typePlot.remove();
    };
  }, [licenses]);

  return (
    <div class="stats-grid">
      <section class="stat-card">
        <h3>License Velocity <span class="mono">(Commence Operations)</span></h3>
        <div ref={velocityRef} class="plot-container"></div>
      </section>

      <section class="stat-card">
        <h3>Market Composition <span class="mono">(By License Type)</span></h3>
        <div ref={typeRef} class="plot-container"></div>
      </section>

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-8);
          padding: var(--space-4) 0;
        }
        .stat-card {
          background: var(--surface-color);
          border: var(--border-width) solid var(--border-color);
          padding: var(--space-6);
        }
        .stat-card h3 {
          font-family: var(--font-mono);
          font-size: var(--font-size-sm);
          text-transform: uppercase;
          color: var(--accent-color);
          margin-bottom: var(--space-6);
          border-bottom: var(--border-width) solid var(--border-color);
          padding-bottom: var(--space-2);
        }
        .plot-container {
          width: 100%;
          min-height: 300px;
        }
        .mono {
          font-family: var(--font-mono);
          font-weight: normal;
          opacity: 0.7;
          text-transform: none;
        }
      `}</style>
    </div>
  );
}
