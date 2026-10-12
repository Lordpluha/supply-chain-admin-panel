# PRODUCT.md — Supply Chain admin panel

## What this is

An operations panel that answers one question well:

> **Where is this product made, how much of it, and how has that changed?**

It renders production on a world map for any year range between **2010 and 2026**, and lets an
operator arrive at the answer from either direction — pick a country and see what it makes, or
pick a product and see who makes it.

Around that core sit the reference data the map is built from, the access control that decides
who may change it, and the trail that records who did.

## Why it exists

The business behind it builds batteries. A battery is the end of a long chain: lithium from a brine in
Chile, cobalt from Kolwezi, nickel from Sulawesi, cathode powder in Finland, cells in Ningde,
packs in Gliwice. Somebody has to be able to look at that chain and see where a dependency is
concentrated, where it moved, and where it is thin.

That is a map question. A table of 700 rows does not answer it; a map with the totals on it
does.

## Who uses it

| Role | Why they open it |
|---|---|
| **Supply analyst** | Keeps the dataset true. Adds a facility, corrects a year's output, checks a product's footprint before a sourcing decision. |
| **Auditor** | Reads everything and the activity log. Changes nothing. Answers "who changed this, and when". |
| **Viewer** | Looks at the map and the reference data. Read-only, no administration. |
| **Admin** | All of the above, plus who gets to be any of them. |

## The core flow

1. **Choose a starting point.** Either a country or a product. Nothing else is required.
2. **The other list narrows.** Pick Germany and the product list shows only what Germany
   actually produces. Pick NMC 811 and the country list shows only who produces it. This is
   the requirement that shapes the data model — the join runs through facilities and
   production records, so the narrowing is real rather than hard-coded.
3. **Set the years.** A range, anywhere inside 2010–2026.
4. **Read the map.** One dot per producing country, sized by output. Hover for the number,
   click to pin the summary to that country.
5. **Read the summary.** Totals, the peak year, the change across the range, and the
   breakdown by product and by country.
6. **Take it away.** Export exactly what is on screen — the same filters, the same rows —
   choosing between `.xlsx`, `.xls` and `.csv` in the export dialog.
7. **Follow a row.** Every country, product, facility, production record and user has its own
   page, reached from the list or from any link that names it, showing the record and what
   hangs off it.

### Export formats

The export dialog offers three, and they are not equivalent:

| Format | What is actually written | When to pick it |
|---|---|---|
| `.xlsx` | A real OOXML workbook, via `write-excel-file`. Column widths and cell types survive. | The default. |
| `.xls` | **SpreadsheetML 2003** — Microsoft's documented XML dialect, not the binary BIFF format the extension originally meant. | A tool that refuses anything but `.xls`. |
| `.csv` | UTF-8 with a byte order mark and CRLF line endings, RFC 4180 quoting. | Anything that reads text. Carries no formatting. |

The `.xls` choice is worth stating plainly: writing genuine BIFF in the browser needs a
heavyweight dependency for a format Microsoft itself has deprecated. SpreadsheetML opens in
Excel 2003 and every version since, and in LibreOffice, but some Excel builds show a one-off
"the file format and extension don't match" prompt. That is the cost, and it is a better trade
than the alternative.

Whatever the format, the export is **exactly what the table is showing** — same filters, same
sort, same order, same page. It never re-queries: an export that disagrees with the screen is
worse than no export at all.

### Mixed units, handled honestly

Lithium is measured in tonnes, cells in millions of units, separator film in km². When more
than one product is in scope, a single grand total would be a lie, so the panel does not show
one: it reports `mixed`, shows the per-product breakdown instead, and sizes the map dots by a
**normalised intensity** — each product's contribution scaled against its own maximum before
summing. With one product selected that formula reduces to `total / max`, which is what you
would have written anyway.

## The data model

```
Country ──< Facility ──< ProductionRecord >── Product
             (lat/lng)      (year, value)
```

- **Country** — name, ISO-2/3/numeric, region, and the coordinates its map dot sits on.
- **Product** — SKU, name, category, unit.
- **Facility** — a plant, refinery or mine. Belongs to a country, has its own coordinates,
  a nameplate capacity and a status (`active`, `planned`, `idle`).
- **ProductionRecord** — the fact table. One facility's output of one product in one year.

Facilities are what make the map a *supply chain* map rather than a choropleth: the dots are
real sites, not country centroids, and a country's total is the sum of what its sites made.

Alongside those sit **User**, **Role** and **AuditEntry**, which govern and record access.

## Scope

### In

- World map with per-country dots, hover and click.
- Bidirectional country/product filtering, either order.
- Year range filter across 2010–2026.
- Summary: totals, series, peak, growth, breakdown by product and by country.
- Export of the filtered set as `.xlsx`, `.xls` or `.csv`.
- A record page for every country, product, facility, production record and user.
- Full CRUD for all seven entities, each with search, sort, filter and pagination.
- Login, roles, permissions, and a read-only activity log.
- Four languages: English, German, French, Polish.
- Three themes: light (default), dark, dim.
- WCAG 2.2 AA.

### Out, deliberately

- **A real backend.** Every request is served by Mock Service Worker from an in-memory,
  deterministically seeded dataset. State resets on reload — that is the documented behaviour,
  not a defect.
- **Real authentication.** Passwords are compared in plain text in the mock. The seeded
  operator's credentials are pre-filled on the login form, because the point is to get to the
  map, not to demonstrate a login.
- **Multi-tenancy, approvals, versioning of the dataset, forecasting.** None of it is needed
  to answer the question above.

## Definition of done

The prototype is done when an operator can, without being told how:

1. Land on the map and understand what they are looking at.
2. Narrow to one product in one decade and read a number they can defend.
3. Correct a wrong figure and see it reflected on the map and in the log.
4. Do all of it in Polish, in dim, on a keyboard, at 360 px.
