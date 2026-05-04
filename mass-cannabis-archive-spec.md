# mass-cannabis-archive — Project Spec

## Project Summary

A public-good repository that is the authoritative open record of the Massachusetts
cannabis market — licenses, sales (adult-use + medical + delivery), pricing, cultivation,
workforce demographics, and product testing history.

**The weedhunter pipeline is the engine.** All scraping, diffing, and changelog
generation happens in the weedhunter repo (self-hosted Linux box). When a pipeline
run completes, it commits and pushes data to this repo. The archive is a pure output
destination: it contains data files, changelogs, and a static SPA. It has no pipeline
code of its own.

Two audiences:
- **Public / researchers:** git history + downloadable current snapshots + JSONL changelog
- **Browser users:** static SPA for searching licenses and viewing per-entity history

**GitHub:** `github.com/knowuh/mass-cannabis-archive` (public repo)
**Hosting:** GitHub Pages (SPA auto-deploys on push to main via GitHub Actions)

---

## Guiding Principles

- **Additive only.** `data/ccc/current/` files are replaced on each push; `data/changelog/`
  files are strictly append-only. Nothing in the changelog is ever modified or deleted.
- **Git is the snapshot layer.** Every commit from the weedhunter pipeline is a
  point-in-time snapshot of `data/ccc/current/`. `git log` and `git diff` are the
  recovery and audit path. No separate snapshots directory.
- **Structured changelogs are the query layer.** Per-entity JSONL files let the SPA
  show a store's full history without traversing git.
- **Self-reported data caveat.** CCC data is self-reported by licensees. The archive
  records what was published — it does not validate accuracy.

---

## Repository Layout

```
mass-cannabis-archive/
│
├── data/
│   ├── ccc/
│   │   └── current/                   # Latest full snapshot per dataset
│   │       ├── licenses.json              # CCC Applications & Licenses
│   │       ├── licenses.csv
│   │       ├── sales-adult-use.json       # Adult-use retail sales by product category + date
│   │       ├── sales-adult-use.csv
│   │       ├── sales-medical.json         # Medical cannabis retail sales (same schema)
│   │       ├── sales-medical.csv
│   │       ├── sales-delivery.json        # Adult-use delivery operator sales (same schema)
│   │       ├── sales-delivery.csv
│   │       ├── prices.json                # Average monthly retail price per gram (adult-use)
│   │       ├── prices.csv
│   │       ├── plant-activity.json        # Plant Activity & Volume by facility type + month
│   │       ├── plant-activity.csv
│   │       ├── agents-race.json           # Cannabis workforce by race/ethnicity (aggregate)
│   │       ├── agents-race.csv
│   │       ├── agents-gender.json         # Cannabis workforce by gender (aggregate)
│   │       ├── agents-gender.csv
│   │       ├── applications-dbe.json      # Disadvantaged business enterprise application counts
│   │       └── applications-dbe.csv
│   │
│   ├── test-results/                  # Annual test result files (CSV only, Git LFS)
│   │   ├── 2024.csv                   # ~99MB — immutable once published
│   │   └── 2025.csv
│   │
│   └── changelog/
│       ├── changes.jsonl              # Global append-only event log
│       └── by-license/               # Per-entity slices (one file per license)
│           └── {LICENSE_NUMBER}.jsonl
│
├── src/                               # Astro SPA
│   ├── pages/
│   │   ├── index.astro            # License search + browse
│   │   └── license/
│   │       └── [license_number].astro  # Per-entity history page
│   └── components/
│       ├── LicenseSearch.tsx      # Preact island: search + filter table
│       └── ChangeTimeline.tsx     # Preact island: entity change history
│
├── .github/
│   └── workflows/
│       └── deploy.yml            # Astro build → GitHub Pages (triggers on push to main)
│
└── README.md
```

No `scrapers/`, no `processors/`, no `scripts/`. All pipeline logic lives in the
weedhunter repo.

---

## Data Written by the weedhunter Pipeline

The weedhunter pipeline writes into a local checkout of this repo. After writing, it commits and pushes.
GitHub Actions then triggers the SPA deploy.

### `data/ccc/current/`
Full latest snapshot for each dataset. Overwritten on every pipeline run.

All eight CCC datasets are included. Note that `sales-adult-use`, `sales-medical`, and `sales-delivery` share the same column schema.

### `data/changelog/changes.jsonl`
Append-only global event log. One JSON object per line.

### `data/changelog/by-license/{LICENSE_NUMBER}.jsonl`
Per-entity projection written at the same time as the global log. One file per
license number that has ever had a change event. These are what the SPA reads.

### `data/test-results/{YEAR}.csv`
Annual test result CSVs pushed manually (CCC publishes with ~6-month lag).
Tracked with Git LFS — files are ~99MB. JSON versions are not stored here.

---

## Changelog Format

### Change Event Schema

```typescript
type ChangeEventType =
  | 'entity_added'      // new license appeared in dataset
  | 'entity_removed'    // license no longer present in dataset
  | 'field_changed'     // a tracked field value changed
  | 'sales_record'      // new weekly/monthly sales period record
  | 'price_record'      // new monthly average price record
  | 'plant_record';     // new plant activity record

type ChangeEvent = {
  ts: string;                  // ISO8601 — when the pipeline detected the change
  dataset: string;             // "licenses" | "sales" | "prices" | "plant-activity"
  type: ChangeEventType;
  license_number: string;
  entity_name: string;         // BUSINESS_NAME at time of event
  field?: string;              // field_changed only
  old_value?: string | null;   // field_changed only
  new_value?: string | null;   // field_changed only
  record?: Record<string, unknown>; // sales_record | price_record | plant_record
};
```

### Tracked fields for license change detection

| Field | What it signals |
|---|---|
| `LICENSE_STATUS` | Active → Expired/Surrendered = closure event |
| `LIC_EXPIRATION_DATE` | Renewal |
| `BUSINESS_NAME` | Name change |
| `ESTABLISHMENT_ADDRESS`, `ESTABLISHMENT_CITY` | Relocation |
| `PARENT_ORGANIZATION_NAME` | Ownership transfer |
| `APPROVED_SOCIAL_EQUITY`, `EE_PRIORITY_STATUS` | Equity status change |
| *(entity added)* | New license issued |
| *(entity removed)* | License purged from CCC dataset |

---

## GitHub Actions: `deploy.yml`

The only workflow in this repo. Triggers on push to `main` (i.e., every time the
weedhunter pipeline pushes new data). Builds the Astro SPA and deploys to GitHub Pages.

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
        with:
          lfs: true
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci && npm run build
      - uses: actions/deploy-pages@v4
        with:
          artifact_name: github-pages
```

---

## SPA

**Stack:** Astro (static) + Preact islands.
**Hosting:** GitHub Pages.

### Pages

**`index.astro` — License Search**
- At build time: reads `data/ccc/current/licenses.json` → copies to `public/data/ccc/latest.json`
- On mount: fetches `latest.json`, renders searchable/filterable table
- Filters: license type, status, city, county, ownership type, equity status
- Columns: name, city, license type, status, opened, expires, ownership

**`license/[license_number].astro` — Entity History Page**
- At build time: reads `data/changelog/by-license/` → one static page per entity
- Shows: current license fields + change timeline (most recent first)
- Timeline entries: field that changed, old → new value, timestamp
- For sales/plant records: sparkline of monthly revenue/volume (Phase 2)

### Build-time data prep

```typescript
// src/pages/license/[license_number].astro
export async function getStaticPaths() {
  const files = await fs.readdir('./data/changelog/by-license');
  return files.map(f => ({
    params: { license_number: f.replace('.jsonl', '') },
    props: { events: parseJsonl(f) },
  }));
}
```

---

## Data Visualization (Phase 2)

Once the archive has 3–6 months of history, the following visualizations are viable.
Chart stack: **Observable Plot** (5KB, D3-based, no bundler needed).

- **License velocity:** new licenses per month (growth/saturation signal)
- **Closure tracker:** Active → Surrendered/Expired over time
- **Market concentration:** MSO vs. Independent market share over time
- **Sales trends:** gross revenue by product category — adult-use, medical, and delivery shown as stacked/grouped series
- **Market segment split:** adult-use vs. medical vs. delivery as share of total revenue over time
- **Price trends:** statewide average price/oz vs. WeedHunter 413 actuals
- **Equity capital flow:** social equity licensee share of total sales over time
- **Workforce demographics:** race/ethnicity and gender breakdown of cannabis agents (snapshot + trend if history accumulates)
- **DBE participation:** minority/disability/veteran/LGBT-owned business share of applications over time
- **Brand quality:** average THC%, contaminant pass rates from test results

---

## README Philosophy

The README is the front door for the public-good audience:
- Mission in one sentence
- Last-updated timestamp (injected by the weedhunter pipeline at push time)
- Direct download links to `data/ccc/current/` files
- Data source attribution with links to CCC
- "How to use this data" section for researchers
- Data caveat: self-reported, no accuracy guarantee
- Link to the SPA for non-technical users

---

## Build Order

This repo has no pipeline code to build — the weedhunter pipeline builds that.
The archive repo's own build order is just standing up the data destination and SPA.

1. Repo init — `README.md`, `.gitattributes` (Git LFS for `data/test-results/*.csv`),
   `.gitignore`
2. Stub `data/ccc/current/` with empty JSON files so the weedhunter pipeline has something
   to diff against on first run
3. Astro scaffold — Preact integration, same design system as WeedHunter
4. `src/pages/index.astro` — license search SPA
5. `src/pages/license/[license_number].astro` — entity history page
6. `.github/workflows/deploy.yml` — GitHub Pages deploy
7. Verify end-to-end: run weedhunter step 7 → confirm data lands + SPA deploys
8. Data viz layer (Phase 2 — after 3+ months of history accumulated)
