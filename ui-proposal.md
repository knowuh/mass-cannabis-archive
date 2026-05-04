# UI Proposal: Search Results & Details Panel Updates

Based on the data audit of the "Rich" license dataset, we have an opportunity to significantly increase the "signal" in our Utilitarian Deluxe UI.

## 1. Search Result Rows (Archive Table)
We should shift away from contact info (which is secondary) toward business status and equity signals.

| Column | Field | Strategy |
| :--- | :--- | :--- |
| **Business Name** | `BUSINESS_NAME` | Main identifier. Font: Sans (Bold). |
| **Location** | `ESTABLISHMENT_CITY` | Geographic context. Font: Mono. |
| **Type** | `LICENSE_TYPE` | Categorization. Font: Sans (Small). |
| **Status** | `LICENSE_STATUS` | Use color-coded tags (Active=Green, Surrendered=Red). |
| **Equity/Priority** | `DBE` / `PRIORITY_REVIEW_TYPE` | High-value signal for researchers. Font: Mono. |
| **Open** | `COMMENCE_OPS` | Binary (Yes/No) signal of actual market participation. |

## 2. Details Panel (High-Density View)
Instead of a flat list, we should use semantic grouping to help users find specific data points (like ownership or expiration) instantly.

### Group 1: License Lifecycle
- **Status Stage:** `APPROVED_LICENSE_STAGE` (e.g., Final vs Provisional)
- **Commence Date:** `COMMENCE_OPERATIONS_DATE`
- **Expiration:** `LIC_EXPIRATION_DATE`
- **Original Start:** `LIC_ORIGINAL_START_DATE`

### Group 2: Equity & Priority
- **Review Priority:** `REVIEW_PRIORITY` (Detailed priority type)
- **DBE Status:** `DBE` (Disadvantaged Business Enterprise)
- **Social Equity:** `APPROVED_SOCIAL_EQUITY`

### Group 3: Location & Contact
- **Physical Address:** `ESTABLISHMENT_ADDRESS_1`, `ESTABLISHMENT_CITY`, `ESTABLISHMENT_ZIP`
- **Direct Contact:** `BUSINESS_EMAIL`, `BUSINESS_PHONE`

### Group 4: Operational Details
- **Industry:** `INDUSTRY` (Adult-Use / Medical)
- **Cultivation Details:** `CULTIVATION_TIER`, `CULTIVATION_ENVIRONMENT` (if applicable)

## 3. Implementation Plan
1. Update `LicenseSearch.tsx` table headers and row rendering.
2. Update `LicenseDetails` sub-component in `LicenseSearch.tsx` to include grouping logic.
3. Update `TableRow.astro` template (if still used) to match the new columns.
