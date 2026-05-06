# Project Status: mass-cannabis-archive

## Overview
Status of the Mass Cannabis Archive project relative to the [mass-cannabis-archive-spec.md](./mass-cannabis-archive-spec.md).

**Last Updated:** 2026-05-04

---

## 1. Repository Structure
| Component | Status | Notes |
| :--- | :--- | :--- |
| `data/ccc/current/` | 🟢 Active | Updated with latest snapshots. |
| `data/changelog/` | 🟡 Partial | Per-license slices exist; global `changes.jsonl` pending. |
| `data/test-results/` | 🟡 Partial | Directory exists, Git LFS configured, but lacks 2024/2025 CSVs. |
| `src/pages/index.astro` | 🟢 Active | Currently serves as the License Search page. |
| `src/pages/license/` | 🟢 Active | Dynamic routes for entity history implemented. |
| `.github/workflows/deploy.yml` | 🟢 Active | Exists and configured for GitHub Pages. |
| **Build System** | 🟢 Stable | Downgraded to Astro 4.16 + Preact 3.5 for Node 22.11 compatibility. |

## 2. SPA Features
| Feature | Status | Notes |
| :--- | :--- | :--- |
| **License Search** | 🟢 Complete | Migrated to Preact `LicenseSearch.tsx` per spec. |
| **Filter Logic** | 🟢 Complete | "AND-oriented" filtering implemented. |
| **Details Pane** | 🟢 Complete | Integrated into the main search view with semantic grouping. |
| **Entity History Page** | 🟢 Complete | Dynamic route `[license_number].astro` implemented with timeline UI. |
| **Safety Footer** | 🟢 Complete | Extracted to standalone `SafetyFooter.astro`. |
| **Theme System** | 🟢 Complete | Utilitarian Deluxe light/dark mode implemented. |
| **Stats Dashboard** | 🟢 Complete | Phase 2 complete: Observable Plot charts with build-time aggregation. |
| **Sitemap** | 🟢 Complete | @astrojs/sitemap integrated for SEO. |
| **Geo Intel** | 🟡 Partial | County profiles implemented; Municipality profiles pending data enrichment. |

## 3. Implementation Tasks
- [x] **Data Audit:** Moved/renamed files in `data/ccc/current/` to match spec.
- [x] **Component Migration:** Replace `ArchiveTable.astro` (Vanilla) with `LicenseSearch.tsx` (Preact).
- [x] **Safety Footer:** Extract public health info to standalone `SafetyFooter.astro`.
- [x] **Entity History:** Implement `src/pages/license/[license_number].astro`.
- [x] **Build Fix:** Resolved `astro:preact:opts` error by stabilizing on Astro 4.x.
- [x] **Phase 2:** Fixed mangled `StatsDashboard.tsx` and implemented all Phase 2 viz.
- [x] **Build-time Aggregation:** Optimized stats page by summarizing 40MB+ of JSON at build time.
- [x] **Git LFS:** Configured LFS for `data/test-results/` CSV files.
- [x] **Manifesto/README:** Synced README with the "front door" philosophy.
- [x] **Sitemap:** Configured `@astrojs/sitemap`.
- [x] **County Profiles:** Implemented dynamic routes for all 14 MA counties.

---

## 4. Phase 2: Data Visualization
- [x] License velocity (Observable Plot)
- [x] Market concentration (Parent Entities)
- [x] Sales Trends (Category & Segment Split)
- [x] Price trends
- [x] Workforce Demographics (Race & Gender)
- [ ] Closure tracker (Pending more historical data in changelogs)
