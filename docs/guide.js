'use strict';
const root = document.documentElement;
const sizeButton = document.getElementById('text-size');
const allButton = document.getElementById('all-details');
const details = Array.from(document.querySelectorAll('details'));
const status = document.getElementById('status');
function setTextSize(large) {
  root.classList.toggle('large-text', large);
  sizeButton.setAttribute('aria-pressed', String(large));
  sizeButton.textContent = large ? 'Standard text' : 'Larger text';
}
try { setTextSize(localStorage.getItem('guide-large-text') === 'true'); } catch { setTextSize(false); }
sizeButton.addEventListener('click', () => {
  const large = !root.classList.contains('large-text');
  setTextSize(large);
  try { localStorage.setItem('guide-large-text', String(large)); } catch { /* Reading controls still work without storage. */ }
  status.textContent = large ? 'Larger text enabled.' : 'Standard text enabled.';
});
function syncDetailsControl() {
  const allOpen = details.every(detail => detail.open);
  allButton.textContent = allOpen ? 'Hide all details' : 'Show all details';
  allButton.setAttribute('aria-expanded', String(allOpen));
}
allButton.addEventListener('click', () => {
  const open = !details.every(detail => detail.open);
  details.forEach(detail => { detail.open = open; });
  syncDetailsControl();
  status.textContent = open ? 'All details are shown.' : 'All details are hidden.';
});
details.forEach(detail => detail.addEventListener('toggle', syncDetailsControl));
let printState = null;
window.addEventListener('beforeprint', () => {
  if (printState === null) printState = details.map(detail => detail.open);
  details.forEach(detail => { detail.open = true; });
});
window.addEventListener('afterprint', () => {
  if (printState !== null) details.forEach((detail, index) => { detail.open = printState[index]; });
  printState = null;
  syncDetailsControl();
});
document.getElementById('print').addEventListener('click', () => window.print());
