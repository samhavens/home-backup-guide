# Home backup power guide

A mobile-friendly, large-print quiz that turns Bob and Roberta’s answers into a concrete backup-power plan. The complete reading guide remains available as optional background.

Published at https://samhavens.github.io/home-backup-guide/

GitHub Pages serves the `docs/` directory from `main`. The site is static HTML, CSS, and JavaScript with no build step, analytics, or server dependencies. Quiz answers remain in page memory and are cleared on reload. They are never transmitted. The text-size preference is stored locally in the browser.

`VERIFY.md` records the acceptance checks. `PRODUCT.md` and `DESIGN.md` describe the audience and presentation decisions. Costs are planning estimates, and assistance eligibility must be confirmed directly with the program.

Run decision checks with `node --test tests/decision.test.mjs`. They include representative decision cases and invariants over 10,368 answer combinations. The browser checks in `tests/browser-check.js` use dev-browser and a local static preview on port 8791.
