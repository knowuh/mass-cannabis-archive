# Mass Cannabis Archive

The authoritative open record of the Massachusetts cannabis market — licenses, sales, pricing, and workforce demographics.

**[Browse the Data Archive →](https://knowuh.github.io/mass-cannabis-archive/)**

---

## Mission
The Massachusetts cannabis market evolves rapidly. This project preserves the longitudinal history of the market to ensure transparency and accessibility for researchers, advocates, and the public.

## Direct Data Downloads
Current snapshots from the Cannabis Control Commission (CCC) are available in raw JSON and CSV formats.

| Dataset | JSON | CSV |
| :--- | :--- | :--- |
| **Licenses & Applications** | [Download](./data/ccc/current/licenses.json) | [Download](./data/ccc/current/licenses.csv) |
| **Sales (Adult-Use)** | [Download](./data/ccc/current/sales-adult-use.json) | [Download](./data/ccc/current/sales-adult-use.csv) |
| **Sales (Medical)** | [Download](./data/ccc/current/sales-medical.json) | [Download](./data/ccc/current/sales-medical.csv) |
| **Sales (Delivery)** | [Download](./data/ccc/current/sales-delivery.json) | [Download](./data/ccc/current/sales-delivery.csv) |
| **Average Retail Prices** | [Download](./data/ccc/current/prices.json) | [Download](./data/ccc/current/prices.csv) |
| **Plant Activity & Volume** | [Download](./data/ccc/current/plant-activity.json) | [Download](./data/ccc/current/plant-activity.csv) |
| **Workforce: Race/Ethnicity** | [Download](./data/ccc/current/agents-race.json) | [Download](./data/ccc/current/agents-race.csv) |
| **Workforce: Gender** | [Download](./data/ccc/current/agents-gender.json) | [Download](./data/ccc/current/agents-gender.csv) |

## For Researchers
### Changelog Structure
The archive maintains per-license JSONL files in `data/changelog/by-license/`. Each line represents a detected change event (status change, relocation, ownership transfer, or new sales record).

### Annual Test Results
Detailed product testing history (THC%, contaminants) is available in `data/test-results/`. These files are large and tracked via **Git LFS**.

## Data Attribution & Caveat
All data is sourced from the [Massachusetts Cannabis Control Commission](https://masscannabiscontrol.com/open-data/data-catalog/).
**Caveat:** Data is self-reported by licensees. This archive records what was published by the Commission; it does not independently validate the accuracy of self-reported fields.

## Public Health & Safety
If you or someone you know is struggling with substance use, help is available:
- **MA Substance Use Helpline:** 800-327-5050
- **Crisis Text Line:** Text HOME to 741741

---
*Last Updated: 2026-05-04*  
*Maintained by [Knowuh](https://github.com/knowuh).*
