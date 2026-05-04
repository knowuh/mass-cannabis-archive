# Project Status: mass-cannabis-archive

## Overview
Status of the Mass Cannabis Archive project relative to the [mass-cannabis-archive-spec.md](./mass-cannabis-archive-spec.md).

**Last Updated:** 2026-05-04

---

## 1. Repository Structure
| Component | Status | Notes |
| :--- | :--- | :--- |
| `data/ccc/current/` | 🟡 Partial | Some files present, but schema/naming needs audit. |
| `data/changelog/` | 🔴 Missing | `by-license/` and `changes.jsonl` not yet present. |
| `data/test-results/` | 🟡 Partial | Directory exists, but lacks Git LFS and 2024/2025 CSVs. |
| `src/pages/index.astro` | 🟢 Active | Currently serves as the License Search page. |
| `src/pages/license/` | 🔴 Missing | Dynamic routes for entity history not implemented. |
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
| **Stats Dashboard** | 🟡 In Progress | Phase 2 started: `StatsDashboard.tsx` (Observable Plot) implemented. |

## 3. Implementation Tasks
- [x] **Data Audit:** Moved/renamed files in `data/ccc/current/` to match spec.
- [x] **Component Migration:** Replace `ArchiveTable.astro` (Vanilla) with `LicenseSearch.tsx` (Preact).
- [x] **Safety Footer:** Extract public health info to standalone `SafetyFooter.astro`.
- [x] **Entity History:** Implement `src/pages/license/[license_number].astro`.
- [x] **Build Fix:** Resolved `astro:preact:opts` error by stabilizing on Astro 4.x.
- [x] **Phase 2 Init:** Installed Observable Plot and scaffolded `/stats` dashboard.
- [ ] **Data Viz:** Implement sales trend and price trend visualizations.
- [ ] **Git LFS:** Configure LFS for `data/test-results/`.
- [ ] **Manifesto/README:** Sync README with the "front door" philosophy in spec.

---

## 4. Phase 2: Data Visualization
- [ ] License velocity (Observable Plot)
- [ ] Closure tracker
- [ ] Market concentration
- [ ] Price trends
