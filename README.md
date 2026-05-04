# Mass Cannabis Archive

The authoritative open record of the Massachusetts cannabis market. This project serves as a permanent, version-controlled archive of data from the Cannabis Control Commission (CCC).

**[Browse the Data Archive →](https://knowuh.github.io/mass-cannabis-archive/)**

---

## Mission
The Massachusetts cannabis market evolves rapidly, and public data snapshots are often overwritten or lost. This archive preserves the longitudinal history of:
- **Licenses & Applications:** Ownership, equity status, and operational milestones.
- **Market Performance:** Adult-use, medical, and delivery sales volumes.
- **Pricing Trends:** Average monthly retail price per gram.
- **Workforce Demographics:** Aggregate race and gender data for cannabis agents.

## Direct Data Downloads
For researchers and data scientists, current snapshots are available in raw JSON and CSV formats:

| Dataset | JSON | CSV |
| :--- | :--- | :--- |
| **Licenses** | [Download](./data/ccc/current/licenses.json) | [Download](./data/ccc/current/licenses.csv) |
| **Sales (Adult-Use)** | [Download](./data/ccc/current/sales-adult-use.json) | [Download](./data/ccc/current/sales-adult-use.csv) |
| **Sales (Medical)** | [Download](./data/ccc/current/sales-medical.json) | [Download](./data/ccc/current/sales-medical.csv) |
| **Sales (Delivery)** | [Download](./data/ccc/current/sales-delivery.json) | [Download](./data/ccc/current/sales-delivery.csv) |
| **Average Prices** | [Download](./data/ccc/current/prices.json) | [Download](./data/ccc/current/prices.csv) |
| **Plant Activity** | [Download](./data/ccc/current/plant-activity.json) | [Download](./data/ccc/current/plant-activity.csv) |

## The Archive Pipeline
This repository is the destination for the **WeedHunter** pipeline. Scraping and differencing logic is handled in a private repository; every commit here represents a point-in-time snapshot of the market.
- **`data/ccc/current/`**: The latest full snapshot for each dataset.
- **`data/changelog/`**: Append-only event logs tracking field-level changes over time.
- **`data/test-results/`**: Annual laboratory test result CSVs (Tracked via Git LFS).

## Data Caveat
This archive aggregates public data published by the CCC. Data is self-reported by licensees; this project serves as a record of what was published and does not independently validate the accuracy of self-reported fields.

---
*Maintained by [Knowuh](https://github.com/knowuh).*
