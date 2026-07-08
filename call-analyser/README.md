# Call Analyser

A browser-based platform for turning raw call-centre exports into structured analyses and management reports:

1. **Upload** any Excel or CSV sheet → columns are auto-detected and converted to a clean `name, url, date` CSV (downloadable).
2. **Analyse** each call transcript with an analysis template. Four templates are built in:
   - **Mafadi Collections (Siya)** — collections call extraction (PTPs, arrangements, disputes, escalations)
   - **Mafadi Air (Mia)** — short-term rental lead follow-up qualification
   - **Motor Finance Claims QA** — claim qualification call QA (consent, disclosure, compliance risk)
   - **Ripple Finance (Jacob)** — outcome extraction + agent protocol/NCA compliance QA

   You can also add your own templates (any prompt that returns a single JSON object; use `{{TRANSCRIPT}}` as a placeholder or let the transcript be appended automatically).
3. **Report** — one click aggregates every analysed call into stat tiles, outcome/sentiment charts, and a Claude-written management report (downloadable as Markdown, printable as PDF).

Everything runs client-side. The Anthropic API key is stored in the browser's local storage and calls go directly from the browser to the Claude API — there is no backend.

## Run locally

```sh
cd call-analyser
npm install
npm run dev        # http://localhost:5180
```

Then open **Settings** and paste an Anthropic API key (console.anthropic.com → API keys).

## Deploy

It builds to a static site, so it deploys anywhere (Vercel, Netlify, GitHub Pages):

```sh
npm run build      # output in dist/
```

On Vercel: import the repo, set the **Root Directory** to `call-analyser`, framework preset **Vite**.

## Data expectations

- Sheets can have any column names — the app auto-detects name / URL / date / transcript columns and lets you override the mapping.
- Calls need a **transcript** to be analysed. If your sheet has a transcript column it is picked up automatically; otherwise open a call on the Calls tab and paste the transcript in.
- Analysis results can be exported as a CSV (one column per extracted field) from the Calls tab.

## Notes

- Default model is Claude Opus 4.8; Sonnet 5 and Haiku 4.5 can be selected in Settings for cheaper/faster runs.
- Analyses run in parallel (configurable 1–8) with automatic retry on rate limits.
- All state (calls, results, custom templates, the last report) persists in local storage; "Clear all local data" in Settings resets it.
