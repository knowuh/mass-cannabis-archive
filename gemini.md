Role: Senior Frontend Engineer & UI Architect
Objective: Scaffold a high-performance, static SPA to browse archived Massachusetts Cannabis Control Commission (CCC) data.
Design Aesthetic: "Utilitarian Deluxe" — High-speed, high-contrast, professional.
Styling Strategy: Scoped CSS (Component-based) and Global CSS Variables. NO Tailwind CSS.

1. Stack & Environment
Framework: Astro (Static Output)

Styling: Standard CSS (Scoped <style> tags)

Typography: - UI/Body: Geist Sans

Data/Numbers: Geist Mono

Icons: Lucide-astro

Deployment: GitHub Pages

2. Directory Structure
Plaintext
mass-cannabis-archive/
├── src/
│   ├── components/
│   │   ├── ArchiveTable.astro      # Searchable data view
│   │   ├── SafetyFooter.astro      # Health resources and hotlines
│   │   ├── Navigation.astro        # Minimalist nav
│   │   └── Layout.astro            # Global frame & CSS Variables
│   ├── pages/
│   │   ├── index.astro             # Home: Project Manifesto
│   │   └── browser.astro           # Data Explorer
│   └── styles/
│       └── variables.css           # Centralized CSS Custom Properties
├── public/
│   └── data/
│       └── ccc/                    # Target for scraped JSON/CSV files
└── astro.config.mjs
3. Global CSS Variables (variables.css)
Define these in your global layout to maintain the "Utilitarian Deluxe" palette:

CSS
:root {
  --bg-color: #0e0f11;
  --surface-color: #16181a;
  --accent-color: #5a9f7a; /* Muted Sage */
  --text-base: #e2e8f0;
  --text-muted: #94a3b8;
  --border-color: #2d3135;
  
  --font-sans: 'Geist Sans', system-ui, sans-serif;
  --font-mono: 'Geist Mono', monospace;
}
4. Key Implementation Tasks
Task 1: Scoped Layout & Nav
Use Layout.astro to wrap all pages.

Apply global resets: box-sizing: border-box, background: var(--bg-color), color: var(--text-base).

Nav should be a simple horizontal list with display: flex and gap: 2rem.

Task 2: The Searchable Table (ArchiveTable.astro)
Fetch data from /data/ccc/latest.json.

Styling: Use a standard <table> element with width: 100% and border-collapse: collapse.

Use :hover states on table rows with background: var(--surface-color).

Use font-family: var(--font-mono) specifically for numeric cells and status tags.

Task 3: Public Health & Safety Footer
Fixed or absolute footer at the bottom of the page.

Clear distinction for the MA Substance Use Helpline: 800-327-5050.

Use a border-top: 1px solid var(--border-color) for separation.

Task 4: Static Site Generation
Ensure astro.config.mjs has the correct site URL for GitHub Pages.

Add the @astrojs/sitemap integration for SEO.

5. Agent Prompt for Gemini-CLI
"Agent: Scaffold the mass-cannabis-archive repository. Use Astro and component-based styling (scoped  tags). DO NOT use Tailwind CSS. Implement a high-contrast dark theme using the provided CSS variables. Create a data browser that reads from /public/data/ccc/latest.json and uses Geist Mono for table values. Ensure the SafetyFooter is on every page."

Handover Note:
By using scoped CSS, your styles remain local to the components (e.g., ArchiveTable.astro's styles won't bleed into Navigation.astro), which perfectly mimics the component-based workflow you prefer while keeping the "Lean & Elegant" technical profile.
