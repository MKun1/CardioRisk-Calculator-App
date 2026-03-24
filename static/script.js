document.addEventListener("DOMContentLoaded", function () {
    console.log("JS loaded and DOM ready");

    
/* ═══════════════════════════════════════════════════════════════════
   CardioRisk — form.js
   Handles: slider fill tracking, progress bar, form validation,
            submit loading state.
   No external dependencies — plain ES6.
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Slider fill update ─────────────────────────────────────────────
  // Fills the left portion of each slider track with the accent colour
  // by updating a sibling .slider-track-fill element's width.

  const SLIDERS = [
    { id: 'age',          fillId: 'age-fill',          valId: 'age-val',          decimals: 0, scale: 1 },
    { id: 'bp',           fillId: 'bp-fill',           valId: 'bp-val',           decimals: 0, scale: 1 },
    { id: 'cholesterol',  fillId: 'cholesterol-fill',  valId: 'cholesterol-val',  decimals: 0, scale: 1 },
    { id: 'max_hr',       fillId: 'max_hr-fill',       valId: 'max_hr-val',       decimals: 0, scale: 1 },
    // ST depression is stored ×10 as integer (0–62) but displayed ÷10
    { id: 'st_depression',fillId: 'st_depression-fill',valId: 'st_depression-val',decimals: 1, scale: 0.1 },
    { id: 'vessels',      fillId: 'vessels-fill',      valId: 'vessels-val',      decimals: 0, scale: 1 },
  ];

  function updateSlider(cfg) {
    const slider = document.getElementById(cfg.id);
    const fill   = document.getElementById(cfg.fillId);
    const output = document.getElementById(cfg.valId);
    if (!slider || !fill || !output) return;

    function sync() {
      const min = parseFloat(slider.min);
      const max = parseFloat(slider.max);
      const val = parseFloat(slider.value);
      const pct = ((val - min) / (max - min)) * 100;

      fill.style.width = pct + '%';
      output.textContent = (val * cfg.scale).toFixed(cfg.decimals);
    }

    sync(); // initialise on load
    slider.addEventListener('input', sync);
  }

  SLIDERS.forEach(updateSlider);


  // ── Progress bar ───────────────────────────────────────────────────
  // Counts how many of the 13 named inputs have been interacted with.
  // Sliders start pre-filled, so count them as done immediately.
  // Radio groups count as done once any option in the group is selected
  // (they all have defaults so they start as done too).

  const progressBar   = document.getElementById('progress-bar');
  const progressLabel = document.getElementById('progress-label');
  const TOTAL_FIELDS  = 13;

  // Field names corresponding to the 13 model inputs
  const FIELD_NAMES = [
    'age', 'sex', 'chest_pain', 'bp', 'cholesterol',
    'fbs', 'ekg', 'max_hr', 'exercise_angina',
    'st_depression', 'slope', 'vessels', 'thallium'
  ];

  function countCompleted() {
    let done = 0;
    FIELD_NAMES.forEach(name => {
      const els = document.querySelectorAll(`[name="${name}"]`);
      if (!els.length) return;
      const type = els[0].type;

      if (type === 'range') {
        // Sliders always have a value
        done++;
      } else if (type === 'radio') {
        // Check if any radio in this group is selected
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        if (checked) done++;
      }
    });
    return done;
  }

  function updateProgress() {
    const done = countCompleted();
    const pct  = (done / TOTAL_FIELDS) * 100;
    if (progressBar)   progressBar.style.width = pct + '%';
    if (progressLabel) progressLabel.textContent = `${done} of ${TOTAL_FIELDS} fields completed`;
  }

  // Run on load (defaults already fill most fields)
  updateProgress();

  // Update whenever any input changes
  document.getElementById('risk-form')
    ?.addEventListener('change', updateProgress);
  document.getElementById('risk-form')
    ?.addEventListener('input',  updateProgress);


  // ── Form submit — loading state ────────────────────────────────────
  // Shows a spinner on the button while the POST request is in flight.
  // Flask will respond with a redirect to result.html, so the spinner
  // only shows briefly — but it prevents double-submit and feels snappy.

  const form      = document.getElementById('risk-form');
  const submitBtn = document.getElementById('submit-btn');

  form?.addEventListener('submit', function (e) {
    // Basic client-side validation
    if (!validateForm(e)) return;

    // Activate loading state
    submitBtn?.classList.add('loading');
    submitBtn && (submitBtn.disabled = true);
  });


  // ── Validation ─────────────────────────────────────────────────────
  // Checks all required radio groups have a selection.
  // Sliders always have a value so no check needed for those.

  function validateForm(e) {
    const radioGroups = ['sex', 'chest_pain', 'exercise_angina',
                         'fbs', 'ekg', 'slope', 'thallium'];
    let valid = true;

    radioGroups.forEach(name => {
      const checked = document.querySelector(`input[name="${name}"]:checked`);
      const field   = document.querySelector(`[data-field="${name}"]`);

      if (!checked) {
        valid = false;
        field?.classList.add('error');
        // Scroll to first error
        if (valid === false) {
          field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        field?.classList.remove('error');
      }
    });

    if (!valid) {
      e.preventDefault();
      return false;
    }
    return true;
  }

  // Remove error state as soon as user makes a selection
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function () {
      const field = document.querySelector(`[data-field="${this.name}"]`);
      field?.classList.remove('error');
    });
  });


  // ── Scroll-triggered field animations ─────────────────────────────
  // Each .form-group fades in slightly as it enters the viewport.
  // Uses IntersectionObserver — no library needed.

  if ('IntersectionObserver' in window) {
    const groups = document.querySelectorAll('.form-group');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    groups.forEach(group => {
      // Start hidden (override the CSS animation for scroll-triggered effect)
      group.style.opacity    = '0';
      group.style.transform  = 'translateY(16px)';
      group.style.transition = 'opacity .5s ease, transform .5s ease';
      observer.observe(group);
    });
  }

})();
});



