import { useEffect, useRef } from 'preact/hooks';
import * as Plot from '@observablehq/plot';

interface StatsDashboardProps {
  licenses: any[];
  sales: any[];
  prices: any[];
  raceData: any[];
  genderData: any[];
}

export default function StatsDashboard({ licenses, sales, prices, raceData, genderData }: StatsDashboardProps) {
  const velocityRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const salesRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!licenses.length || !velocityRef.current) return;

    const commonStyle = {
      backgroundColor: "transparent",
      color: "var(--text-base)",
      fontFamily: "var(--font-mono)",
      fontSize: "10px"
    };

    // 1. License Velocity
    const velocityData = licenses
      .filter(d => d.COMMENCE_OPERATIONS_DATE)
      .map(d => ({
        date: new Date(d.COMMENCE_OPERATIONS_DATE),
        type: d.LICENSE_TYPE
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const velocityPlot = Plot.plot({
      style: commonStyle,
      marks: [
        Plot.rectY(velocityData, Plot.binX({y: "count"}, {x: "date", thresholds: "month", fill: "var(--accent-color)", tip: true})),
        Plot.ruleY([0])
      ],
      x: { label: "Date →", grid: true },
      y: { label: "↑ New Licenses", grid: true },
      width: velocityRef.current.clientWidth,
      height: 300
    });
    velocityRef.current.appendChild(velocityPlot);

    // 2. Market Composition
    const typePlot = Plot.plot({
      style: commonStyle,
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

    // 3. Price Trends
    const priceData = prices.map(d => ({
      date: new Date(d.YEARMONTH + "-01"),
      price: parseFloat(d.AVERAGERETAILPRICEPERGM)
    }));

    const pricePlot = Plot.plot({
      style: commonStyle,
      marks: [
        Plot.lineY(priceData, {x: "date", y: "price", stroke: "var(--accent-color)", marker: "circle", tip: true}),
        Plot.areaY(priceData, {x: "date", y: "price", fill: "var(--accent-color)", fillOpacity: 0.1}),
        Plot.ruleY([0])
      ],
      x: { label: "Date →", grid: true },
      y: { label: "↑ Price / Gram ($)", grid: true },
      width: priceRef.current?.clientWidth || 600,
      height: 300
    });
    priceRef.current?.appendChild(pricePlot);

    // 4. Sales Trends (Aggregate by month/category)
    const salesData = sales.map(d => ({
      date: new Date(d.SaleDate),
      total: parseFloat(d["TOTAL_$"]),
      category: d.ProductCategoryName
    })).filter(d => !isNaN(d.total));

    const salesPlot = Plot.plot({
      style: commonStyle,
      marks: [
        Plot.areaY(salesData, Plot.stackY(Plot.binX({y: "sum"}, {x: "date", y: "total", fill: "category", thresholds: "month", tip: true}))),
        Plot.ruleY([0])
      ],
      x: { label: "Date →", grid: true },
      y: { label: "↑ Monthly Revenue ($)", grid: true, tickFormat: "$.0s" },
      color: { scheme: "tableau10", legend: true },
      width: salesRef.current?.clientWidth || 600,
      height: 400,
      marginBottom: 40
    });
    salesRef.current?.appendChild(salesPlot);

    // 5. Workforce Demographics (Race)
    const racePlot = Plot.plot({
      style: commonStyle,
      marks: [
        Plot.barY(raceData, {x: "RACE_ETHNICITY", y: "TOTAL", fill: "var(--accent-color)", sort: {x: "-y"}, tip: true}),
        Plot.ruleY([0])
      ],
      x: { label: null, tickRotate: -45 },
      y: { label: "↑ Count", grid: true },
      width: demoRef.current?.clientWidth || 600,
      height: 300,
      marginBottom: 100
    });
    demoRef.current?.appendChild(racePlot);

    return () => {
      velocityPlot.remove();
      typePlot.remove();
      pricePlot.remove();
      salesPlot.remove();
      racePlot.remove();
    };
  }, [licenses, sales, prices, raceData, genderData]);

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

      <div class="stat-row">
        <section class="stat-card">
          <h3>Price Trends <span class="mono">(Statewide Avg Retail Price/Gram)</span></h3>
          <div ref={priceRef} class="plot-container"></div>
        </section>

        <section class="stat-card">
          <h3>Workforce Demographics <span class="mono">(Self-Reported Race/Ethnicity)</span></h3>
          <div ref={demoRef} class="plot-container"></div>
        </section>
      </div>

      <section class="stat-card">
        <h3>Sales Performance <span class="mono">(Monthly Revenue by Category)</span></h3>
        <div ref={salesRef} class="plot-container"></div>
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
