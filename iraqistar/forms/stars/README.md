# IraqiStar forms — GitHub Pages

The forms and index are static HTML. Visitors open the hosted page directly; no command, local server, account or installation is needed.

## Location and publishing

These files now live in the marketing repository at `iraqistar/forms/stars/`.

`index.html` and the individual forms work as static GitHub Pages files. `build.py` generates a fresh index by discovering every sibling HTML/HTM form, so a Pages build can pick up added, renamed and deleted forms automatically.

The GitHub Pages workflow previously referenced by this README was not present when these files were moved. Configure the marketing repository’s deployment to run `python3 iraqistar/forms/stars/build.py --output <empty-artifact-directory>` and publish the resulting artifact. This runs in GitHub Actions; visitors need no commands or local server. No deployment was performed by the move.

The build uses the first H2, page title or filename for each card title, plus an optional description meta tag. Index, hidden files and symlinks are excluded. The checked-in index is a snapshot; automatic list updates require the deployment build step above.

## Forms

- `invite.html` — invitation.
- `how-it-works.html` — quick guide.
- `faq.html` — quick answers.

Embedded fonts and logos preserve the brand offline too. Entered names remain in the browser. Copy, print/save PDF and personalised HTML download are available in each form.

## Presentation

The index and editing controls use a light workspace. The generated document uses dark IraqiStar stationery, the original upright Ishtar/play mark as a low-opacity background watermark, a white logo, brand fonts, and branded header/footer. The same document styling is embedded in downloaded HTML and retained in the print/PDF stylesheet.

Arabic headings and copy foreground **نجم العراق**. The original **IraqiStar** Latin lockup remains intact. Colours follow the official BRAND.md/DESIGN.md palette: fixed violet `#6430f0`, ink `#0c0b16`, white and the approved neutral ramp. IBM Plex Sans Arabic and Geist remain embedded; the watermark uses the original upright Ishtar/play geometry.

Latest design: original signature stationery replaces the reference-led campaign layout. Generated documents use an actual embedded SVG watermark (the original upright Ishtar/play mark at 10.5% opacity), an ink canvas with a fine inner frame, an oversized نجم العراق masthead, open editorial sections and a restrained violet-edge commitment panel. The watermark is included in HTML downloads and print/PDF output. Light authoring controls remain unchanged.

## Chrome PDF layout

The PDF is for phone reading, using narrow 108 × 216 mm pages rather than A4. Select Save as PDF, scale 100%, margins None, background graphics on and browser headers/footers off. Keep the CSS-defined paper size; do not override it with A4 or Letter.

Every page has an edge-to-edge ink background, the original SVG watermark, logo and footer. The invitation uses 2 pages; the guide and FAQ use 4 short pages each. Text stays large and single-column. There is no forced break after the last sheet. A pre-print fitting pass measures the rendered content after fonts load and reduces overflow within the fixed sheet when necessary; downloaded HTML carries the same fitting logic.

The on-screen forms remain responsive and continuous. Static build, page grouping and JavaScript syntax were checked. Actual Chrome PDF pagination and appearance remain visually unverified because browser access to local file URLs was blocked in this session.
