# Acceptance checks

Before publication, verify at phone widths 320 and 390 pixels and desktop width 1280 pixels:
- No horizontal overflow, including with larger text enabled.
- The first viewport identifies Bob and Roberta, the decision, and a usable next action.
- Topic links reach the intended section; keyboard users can skip to the guide.
- All details open individually and with Show all details. Hide all restores the short guide.
- Text size persists after reload when storage is available. Failure of storage cannot break controls.
- The phone action uses the verified CPA number. External sources have descriptive labels.
- The five cost options, three cooling levels, battery reserve tradeoff, affordability, financing, incentives, and quote checklist remain available.
- Print output includes closed details and excludes navigation controls.
- The runtime illustration uses available energy, labels hypothetical values, and calculates 24 / 12 / 4 hours correctly.
- No user data leaves the page. No implied eligibility or property-specific recommendation.

## Verified before publication

- Browser checks passed at 320, 390, and 1280 pixels with 20 px body text.
- Larger text (24 px) passed at 320 pixels and persisted after reload.
- All interactive controls inspected were at least 44 px tall.
- Show/hide all, individual details, internal anchors, phone link, and print expansion/restoration passed.
- Keyboard focus starts on the skip link.
- Measured contrast: body 11.65:1, secondary text 6.22:1, primary action 9.51:1.
- JavaScript syntax check and prose checks passed. A fresh read corrected duplicated gas-capacity wording before publication.
- Reviewed the mobile opening, cost comparison, and desktop opening visually.

Actual use by Bob and Roberta has not yet been observed.

# Quiz acceptance plan

- Define decision rules and test them before implementing the interface.
- Low budgets cannot produce purchase recommendations for permanent equipment.
- A portable unit cannot be recommended for automatic whole-house backup, cooling, medical-device backup, or unknown/long outage duration.
- Quiet-only preferences cannot produce generator-first results.
- Unknown answers lead to an explicit assessment action, not assumed property facts.
- Medical-device answers add a direct SCE assistance action and require a device-specific backup plan; no runtime guarantee.
- Solar remains a separate financial comparison; poor/unknown roof condition cannot become solar approval.
- A long outage with no willingness to relocate must produce an extended-outage action.
- Every result includes a concrete next action, explanation tied to answers, quote scope, and saved/printable summary.
- Browser-check full quiz, missing answer, Back, answer editing, restart, copy fallback, keyboard operation, 320 px/larger-text layout, print, and no-JavaScript fallback.
