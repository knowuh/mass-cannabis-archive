# Future Roadmap: Mass Cannabis Archive

## Phase 3: Researcher Tooling & Exports
The archive's primary audience includes researchers and journalists. We should provide tools that make it easier to extract "signal" from the data.

1.  **Filtered CSV Exports:** Add a "Download Current View" button to the Data Browser. This would allow users to apply complex filters (e.g., "All Active Social Equity Retailers in Worcester") and export just that slice.
2.  **Static API Endpoints:** Generate pre-filtered JSON files during the build process for common subsets (e.g., `/api/v1/licenses/active.json`, `/api/v1/cities/boston.json`).
3.  **Data Health Report:** A build-time dashboard showing data freshness, schema changes, and anomaly detection (e.g., "Significant drop in reported sales for [Dataset]").

## Phase 4: Geographic Intelligence
The "Establishment City" and "County" are high-value fields.

1.  **Market Map:** A simple, high-performance SVG or Canvas map of MA showing license density by municipality.
2.  **Municipality Profiles:** Summary pages for cities/towns (e.g., `/municipality/boston`) showing total active licenses, license types, and aggregated sales if possible.

## Phase 5: Deep Longitudinal Analysis
Utilizing the `changes.jsonl` firehose as it grows.

1.  **Ownership Web:** Visualize the relationship between "Parent Organizations" and their subsidiaries to track market concentration more effectively.
2.  **The "Closure Tracker":** A dedicated view for surrendered/expired licenses, showing the average "lifespan" of a license by type and region.
3.  **Test Results Integration:** Once the Git LFS `test-results/` data is populated, add "Quality Signals" to the Entity History page (e.g., average THC% for a cultivator over time).

## UI/UX: "Utilitarian Deluxe" Refinements
1.  **Mobile Adaptive View:** Ensure the high-density table collapses into a readable card format on small screens without losing the "Professional" feel.
2.  **Cross-Linking:** Allow users to click on a "Parent Organization" or "License Type" in the details pane to automatically apply that filter to the main table.
3.  **Keyboard Navigation:** Support `j/k` or arrow keys for navigating the license list and `Enter` to open the full history page.

## Technical Infrastructure
1.  **Automated Schema Validation:** Integrate a tool like `ajv` or `zod` to validate incoming data from the weedhunter pipeline before the build completes.
2.  **Incremental Builds:** As the number of license pages grows into the thousands, investigate Astro's hybrid rendering or incremental build strategies to keep deploy times low.
