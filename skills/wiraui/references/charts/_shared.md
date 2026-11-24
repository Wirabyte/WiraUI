# Shared rules: charts

**Which chart?** `<wu-chart>` means two different things:
- **v3**: WiraUI's own SVG chart, no library, ~21 chart kinds, Thai-aware, export PNG/SVG/CSV. Nothing to install.
- **v1 / v2**: `<wu-chart>` is the Chart.js wrapper (same component as `<wu-chartjs>`), the app installs `chart.js`. Use `[data]` / `[options]` in Chart.js shape. The v3-only inputs below (`labels`, `series`, `format`, `variant`, ...) do not exist there.
- `<wu-chartjs>` (all majors) is the Chart.js wrapper; in v3 use it only for Chart.js plugins or kinds the own chart lacks. Both can live in one app.
