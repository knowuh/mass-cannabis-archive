import { useEffect, useRef } from 'preact/hooks';
import * as Plot from '@observablehq/plot';

interface AggregatedData {
  licenseVelocity: { date: string; count: number }[];
  marketComposition: { type: string; count: number }[];
  parentConcentration: { name: string; count: number }[];
  segmentSplit: { date: string; segment: string; total: number }[];
  salesTrends: { date: string; category: string; total: number }[];
  priceTrends: { date: string; price: number }[];
  raceData: { race: string; total: number }[];
  genderData: { gender: string; total: number }[];
}

interface StatsDashboardProps {
  data: AggregatedData;
}

export default function StatsDashboard({ data }: StatsDashboardProps) {
  const velocityRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLDivElement>(null);
  const salesRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const raceRef = useRef<HTMLDivElement>(null);
  const genderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const commonStyle = {
      backgroundColor: "transparent",
      color: "var(--text-base)",
      fontFamily: "var(--font-mono)",
      fontSize: "10px"
    };

    // 1. License Velocity
    const velocityPlot = Plot.plot({
      style: commonStyle,
      marks: [
        Plot.rectY(data.licenseVelocity, {
          x: d => new Date(d.date),
          y: "count",
          fill: "var(--accent-color)",
          tip: true
        }),
        Plot.ruleY([0])
      ],
      x: { 
        label: "Date →", 
        grid: true,
        ticks: "year", // Use yearly ticks or a sparse interval to avoid overlap
        tickFormat: d => {
          const date = new Date(d);
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const yy = String(date.getFullYear()).slice(-2);
          return `${mm}/${yy}`;
        }
      },
      y: { label: "↑ New Licenses", grid: true },
      width: velocityRef.current?.clientWidth || 800,
      height: 300
    });
    velocityRef.current?.appendChild(velocityPlot);

    // 2. Market Composition
    const typePlot = Plot.plot({
      style: commonStyle,
      marks: [
        Plot.barX(data.marketComposition, {
          x: "count",
          y: "type",
          fill: "var(--accent-color)",
          sort: { y: "x", reverse: true },
          tip: true
        }),
        Plot.ruleX([0])
      ],
      x: { label: "Count →", grid: true },
      y: { label: null },
      width: typeRef.current?.clientWidth || 400,
      height: 400,
      marginLeft: 180
    });
    typeRef.current?.appendChild(typePlot);

    // 3. Parent Concentration
    const sharePlot = Plot.plot({
      style: commonStyle,
      marks: [
        Plot.barX(data.parentConcentration, {
          x: "count",
          y: "name",
          fill: "var(--accent-color)",
          sort: { y: "-x" },
          tip: true
        }),
        Plot.ruleX([0])
      ],
      x: { label: "Licenses →", grid: true },
      y: { label: null },
      width: shareRef.current?.clientWidth || 400,
      height: 400,
      marginLeft: 200
    });
    shareRef.current?.appendChild(sharePlot);

    // 4. Market Segment Split
    const segmentPlot = Plot.plot({
      style: commonStyle,
      marks: [
        Plot.areaY(data.segmentSplit, {
          x: d => new Date(d.date),
          y: "total",
          fill: "segment",
          tip: true
        }),
        Plot.ruleY([0])
      ],
      x: { label: "Date →", grid: true },
      y: { label: "↑ Monthly Revenue ($)", grid: true, tickFormat: "$.0s" },
      color: { legend: true, scheme: "category10" },
      width: segmentRef.current?.clientWidth || 800,
      height: 400
    });
    segmentRef.current?.appendChild(segmentPlot);

    // 5. Sales Performance (Category)
    const salesPlot = Plot.plot({
      style: commonStyle,
      marks: [
        Plot.areaY(data.salesTrends, {
          x: d => new Date(d.date),
          y: "total",
          fill: "category",
          tip: true
        }),
        Plot.ruleY([0])
      ],
      x: { label: "Date →", grid: true },
      y: { label: "↑ Monthly Revenue ($)", grid: true, tickFormat: "$.0s" },
      color: { legend: true, scheme: "tableau10" },
      width: salesRef.current?.clientWidth || 800,
      height: 400
    });
    salesRef.current?.appendChild(salesPlot);

    // 6. Price Trends
    const pricePlot = Plot.plot({
      style: commonStyle,
      marks: [
        Plot.lineY(data.priceTrends, {
          x: d => new Date(d.date),
          y: "price",
          stroke: "var(--accent-color)",
          marker: "circle",
          tip: true
        }),
        Plot.areaY(data.priceTrends, {
          x: d => new Date(d.date),
          y: "price",
          fill: "var(--accent-color)",
          fillOpacity: 0.1
        }),
        Plot.ruleY([0])
      ],
      x: { label: "Date →", grid: true },
      y: { label: "↑ Price / Gram ($)", grid: true },
      width: priceRef.current?.clientWidth || 800,
      height: 300
    });
    priceRef.current?.appendChild(pricePlot);

    // 7. Race Demographics
    const racePlot = Plot.plot({
      style: commonStyle,
      marks: [
        Plot.barY(data.raceData, {
          x: "race",
          y: "total",
          fill: "var(--accent-color)",
          sort: { x: "-y" },
          tip: true
        }),
        Plot.ruleY([0])
      ],
      x: { label: null, tickRotate: -45 },
      y: { label: "↑ Total Agents", grid: true },
      width: raceRef.current?.clientWidth || 400,
      height: 350,
      marginBottom: 100
    });
    raceRef.current?.appendChild(racePlot);

    // 8. Gender Demographics
    const genderPlot = Plot.plot({
      style: commonStyle,
      marks: [
        Plot.barY(data.genderData, {
          x: "gender",
          y: "total",
          fill: "var(--accent-color)",
          sort: { x: "-y" },
          tip: true
        }),
        Plot.ruleY([0])
      ],
      x: { label: null, tickRotate: -45 },
      y: { label: null, grid: true },
      width: genderRef.current?.clientWidth || 400,
      height: 350,
      marginBottom: 100
    });
    genderRef.current?.appendChild(genderPlot);

    return () => {
      velocityPlot.remove();
      typePlot.remove();
      sharePlot.remove();
      segmentPlot.remove();
      salesPlot.remove();
      pricePlot.remove();
      racePlot.remove();
      genderPlot.remove();
    };
  }, [data]);

  return (
    <div class="stats-grid">
      <section class="stat-card">
        <h3>Price Trends <span class="mono">(Statewide Avg Retail Price/Gram)</span></h3>
        <div ref={priceRef} class="plot-container"></div>
      </section>

      <div class="stat-row">
        <section class="stat-card">
          <h3>Workforce Race/Ethnicity <span class="mono">(Self-Reported)</span></h3>
          <div ref={raceRef} class="plot-container"></div>
        </section>

        <section class="stat-card">
          <h3>Workforce Gender <span class="mono">(Self-Reported)</span></h3>
          <div ref={genderRef} class="plot-container"></div>
        </section>
      </div>

      <section class="stat-card">
        <h3>Market Segment Split <span class="mono">(Monthly Revenue)</span></h3>
        <div ref={segmentRef} class="plot-container"></div>
      </section>

      <section class="stat-card">
        <h3>Product Category Trends <span class="mono">(Adult-Use Monthly Revenue)</span></h3>
        <div ref={salesRef} class="plot-container"></div>
      </section>

      <section class="stat-card">
        <h3>Market Composition <span class="mono">(By License Type)</span></h3>
        <div ref={typeRef} class="plot-container"></div>
      </section>

      <section class="stat-card">
        <h3>License Velocity <span class="mono">(Commence Operations)</span></h3>
        <div ref={velocityRef} class="plot-container"></div>
      </section>

      <style>{`
        .stats-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
          padding: var(--space-4) 0;
        }
        .stat-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: var(--space-8);
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
