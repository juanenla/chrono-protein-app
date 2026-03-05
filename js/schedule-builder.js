/**
 * SCHEDULE BUILDER
 * Takes calculator output → renders the visual 24h timeline + window cards
 */

const ScheduleBuilder = (() => {

  const CLASS_COLORS = {
    A: { color: '#4FFFB0', bg: 'rgba(79,255,176,0.12)',  label: 'Whey / Fast' },
    B: { color: '#7B9EFF', bg: 'rgba(123,158,255,0.12)',  label: 'Casein / Slow' },
    C: { color: '#FFD700', bg: 'rgba(255,215,0,0.12)',     label: 'Leucine Boost' },
    D: { color: '#98FF6E', bg: 'rgba(152,255,110,0.12)',   label: 'Plant' },
    E: { color: '#FF9EAA', bg: 'rgba(255,158,170,0.12)',   label: 'Collagen' }
  };

  /**
   * Food examples per window type and protein class, with portion sizes
   * Each entry: { food, portionG, proteinG, note }
   */
  const FOOD_EXAMPLES = {
    breakfast: {
      A: [
        { food: '3 whole eggs + 2 egg whites', proteinG: 30, note: 'scrambled or omelette' },
        { food: 'Greek yogurt 200g + whey scoop', proteinG: 32, note: 'with berries' },
        { food: 'Protein oatmeal (40g oats + 1 scoop whey)', proteinG: 28, note: 'add banana' },
        { food: '2 eggs + 150g cottage cheese', proteinG: 30, note: 'on toast' }
      ],
      B: [
        { food: '250g Greek yogurt + 30g nuts', proteinG: 28, note: 'slow release' },
        { food: '200g cottage cheese + fruit', proteinG: 24, note: 'casein-rich' }
      ],
      D: [
        { food: 'Tofu scramble (200g firm tofu) + seeds', proteinG: 22, note: 'add leucine' },
        { food: 'Pea protein smoothie + oats + banana', proteinG: 30, note: 'blend with soy milk' }
      ]
    },
    brunch: {
      A: [
        { food: '3 eggs + avocado toast + turkey 50g', proteinG: 30, note: 'balanced brunch' },
        { food: 'Protein smoothie (whey + banana + milk)', proteinG: 32, note: 'quick option' }
      ],
      D: [
        { food: 'Tempeh bowl 150g + rice + vegetables', proteinG: 28, note: 'add leucine' }
      ]
    },
    postWorkout: {
      A: [
        { food: '1 scoop whey (30g) + banana', proteinG: 25, note: 'take within 60 min' },
        { food: '150g chicken breast + rice (200g)', proteinG: 35, note: 'complete meal' },
        { food: '1.5 scoops whey + oats', proteinG: 38, note: 'shake + carbs' },
        { food: '200g tuna + sweet potato', proteinG: 40, note: 'fast protein + complex carbs' },
        { food: '150g salmon + quinoa', proteinG: 35, note: 'omega-3 bonus' }
      ],
      D: [
        { food: 'Pea-rice protein shake (40g) + banana', proteinG: 32, note: 'add 3g leucine' },
        { food: 'Lentil bowl 250g + rice + tofu 100g', proteinG: 30, note: 'complete aminos' }
      ]
    },
    lunch: {
      A: [
        { food: '150g chicken breast + salad + rice', proteinG: 35, note: 'lean & complete' },
        { food: '150g salmon + vegetables + potato', proteinG: 32, note: 'omega-3 rich' },
        { food: '200g lean beef stir-fry + noodles', proteinG: 38, note: 'iron-rich' },
        { food: '150g tuna salad + whole grain bread', proteinG: 35, note: 'quick prep' }
      ],
      D: [
        { food: 'Chickpea curry 300g + rice + tofu 100g', proteinG: 28, note: 'add leucine' },
        { food: 'Black bean bowl + tempeh 100g + quinoa', proteinG: 30, note: 'complete aminos' }
      ]
    },
    afternoon: {
      A: [
        { food: '200g Greek yogurt + 20g whey', proteinG: 30, note: 'quick snack' },
        { food: '2 hard-boiled eggs + 30g almonds', proteinG: 20, note: 'portable' },
        { food: 'Protein bar (check label: 20g+ protein)', proteinG: 22, note: 'convenience' },
        { food: 'Tuna can (120g) + crackers', proteinG: 28, note: 'no prep needed' }
      ],
      D: [
        { food: 'Edamame 200g + hummus + carrots', proteinG: 22, note: 'plant snack' },
        { food: 'Soy protein shake + handful nuts', proteinG: 28, note: 'add leucine if <2g' }
      ]
    },
    eveningSnack: {
      A: [
        { food: '200g Greek yogurt + honey', proteinG: 20, note: 'light option' },
        { food: 'Protein shake (1 scoop)', proteinG: 25, note: 'quick' }
      ],
      D: [
        { food: 'Soy yogurt 200g + granola', proteinG: 16, note: 'add protein powder' }
      ]
    },
    dinner: {
      A: [
        { food: '150g grilled fish + vegetables', proteinG: 30, note: 'light dinner' },
        { food: '120g chicken + salad + olive oil', proteinG: 28, note: 'lean & balanced' }
      ],
      B: [
        { food: '200g cottage cheese + tomato + seeds', proteinG: 24, note: 'casein pre-sleep transition' },
        { food: '150g fish + 100g Greek yogurt dessert', proteinG: 30, note: 'slow + fast combo' }
      ],
      D: [
        { food: 'Tofu stir-fry 200g + vegetables + rice', proteinG: 22, note: 'add leucine' }
      ]
    },
    preSleep: {
      B: [
        { food: '250g cottage cheese', proteinG: 28, note: '7h slow release' },
        { food: '1 scoop casein powder + water', proteinG: 30, note: 'micellar casein ideal' },
        { food: '200g Greek yogurt + 1 scoop casein', proteinG: 38, note: 'maximum overnight MPS' },
        { food: '300g quark + cinnamon', proteinG: 35, note: 'thick & satisfying' }
      ],
      A: [
        { food: '1 scoop whey + water', proteinG: 25, note: 'Trommelen 2023: whey = casein overnight' },
        { food: '200g skyr', proteinG: 22, note: 'Icelandic dairy, high protein' }
      ],
      D: [
        { food: 'Soy protein shake (40g powder)', proteinG: 34, note: 'best plant option for sleep' },
        { food: 'Pea casein-style shake + soy milk', proteinG: 30, note: 'slower plant combo' }
      ]
    }
  };

  /**
   * Get food suggestions for a window
   */
  function getFoodSuggestions(windowKey, proteinClass, targetGrams) {
    const windowFoods = FOOD_EXAMPLES[windowKey] || FOOD_EXAMPLES.lunch;
    const classFoods = windowFoods[proteinClass] || windowFoods['A'] || [];

    // Return up to 3 suggestions, preferring those close to the target grams
    return classFoods
      .slice()
      .sort((a, b) => Math.abs(a.proteinG - targetGrams) - Math.abs(b.proteinG - targetGrams))
      .slice(0, 3);
  }

  const WINDOW_ICONS = {
    breakfast:    '🍳',
    brunch:       '🍳',
    postWorkout:  '💪',
    lunch:        '🥗',
    afternoon:    '🥤',
    dinner:       '🍽️',
    eveningSnack: '🥣',
    preSleep:     '🌙',
    preWorkout:   '⚡'
  };

  /**
   * Convert "HH:MM" to minutes from midnight for positioning
   */
  function timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  /**
   * Build the 24h timeline bar showing all windows
   */
  function renderTimeline(plan, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const windows = plan.windows;
    const entries = Object.entries(windows).sort((a, b) =>
      timeToMinutes(a[1].time) - timeToMinutes(b[1].time)
    );

    // Calculate total minutes span (wake to sleep + 30)
    const firstMin = timeToMinutes(entries[0][1].time);
    const lastMin = timeToMinutes(entries[entries.length - 1][1].time);
    const spanMin = lastMin - firstMin + 60; // +60 for pre-sleep padding

    let html = `<div class="tl-label-row mono"><span>${i18n('wake')}</span><span>${i18n('sleep')}</span></div>`;
    html += '<div class="timeline-bar">';

    entries.forEach(([key, w]) => {
      const offset = timeToMinutes(w.time) - firstMin;
      const pct = (offset / spanMin) * 100;
      const widthPct = Math.max(100 / entries.length - 1, 12);
      const cls = CLASS_COLORS[w.proteinClass] || CLASS_COLORS.A;

      html += `
        <div class="tl-window" style="
          position:absolute; left:${pct}%; width:${widthPct}%;
          height:100%; top:0;
          background:${cls.bg}; border-left:2px solid ${cls.color};
          display:flex; flex-direction:column; justify-content:center;
          padding:4px 6px; cursor:pointer;
        " data-window="${key}" title="${w.label} — ${w.grams}g ${cls.label}">
          <span style="font-size:12px">${WINDOW_ICONS[key] || '🍽️'}</span>
          <span class="mono" style="font-size:8px; color:${cls.color}">${w.time}</span>
        </div>`;
    });

    html += '</div>';

    // Time markers
    html += '<div class="tl-markers mono" style="display:flex;justify-content:space-between;margin-top:6px;font-size:10px;color:var(--muted)">';
    entries.forEach(([, w]) => {
      html += `<span>${w.time}</span>`;
    });
    html += '</div>';

    container.innerHTML = html;
  }

  /**
   * Build window cards — the main visual per meal
   */
  function renderWindowCards(plan, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const entries = Object.entries(plan.windows).sort((a, b) =>
      timeToMinutes(a[1].time) - timeToMinutes(b[1].time)
    );

    let html = '';

    entries.forEach(([key, w], i) => {
      const cls = CLASS_COLORS[w.proteinClass] || CLASS_COLORS.A;
      const icon = WINDOW_ICONS[key] || '🍽️';
      const leucineStatus = w.leucineOk
        ? `<span class="badge badge-anabolic">${i18n('leucineOk')} (${w.leucineEstimateG}g)</span>`
        : `<span class="badge badge-catabolic">${i18n('leucineLow')} (${w.leucineEstimateG}g / ${w.leucineThreshold}g ${i18n('needed')})</span>`;

      html += `
        <div class="card animate-up" style="animation-delay:${i * 0.08}s; margin-bottom:12px; border-color:${cls.color}22">
          <div style="padding:18px 20px; display:flex; align-items:center; gap:14px; border-bottom:1px solid var(--border)">
            <div style="width:44px;height:44px;border-radius:12px;background:${cls.bg};
                        display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">
              ${icon}
            </div>
            <div style="flex:1">
              <div class="mono" style="color:${cls.color};margin-bottom:2px">${w.label}</div>
              <div style="font-weight:600;font-size:15px">${w.grams}g protein</div>
            </div>
            <div style="text-align:right">
              <div style="font-family:var(--font-display);font-size:28px;color:${cls.color};line-height:1">${w.time}</div>
              <span class="badge" style="background:${cls.bg};color:${cls.color}">Class ${w.proteinClass}</span>
            </div>
          </div>
          <div style="padding:14px 20px; display:flex; flex-wrap:wrap; gap:8px; align-items:center">
            ${leucineStatus}
            <span class="badge" style="background:${cls.bg};color:${cls.color}">${cls.label}</span>
            <span class="badge badge-transition">${Math.round(w.share * 100)}% ${i18n('ofDaily')}</span>
          </div>
          ${w.suggestion ? `<div style="padding:0 20px 14px;font-size:12px;color:var(--amber)">⚠️ ${w.suggestion}</div>` : ''}
          ${renderFoodSuggestions(key, w.proteinClass, w.grams)}
        </div>`;
    });

    container.innerHTML = html;
  }

  /**
   * Render summary stats bar
   */
  function renderSummary(plan, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const t = plan.targets;
    const p = plan.profile;

    const stats = [
      { value: `${t.dailyTotalG}g`,      unit: i18n('dailyTarget'),        color: 'var(--green)' },
      { value: `${t.proteinPerKg}`,       unit: 'g/kg/day',                color: 'var(--teal)' },
      { value: `${t.mealsPerDay}`,        unit: i18n('proteinMeals'),      color: 'var(--amber)' },
      { value: `${t.leucinePerMealG}g`,   unit: i18n('leucineMinMeal'),    color: 'var(--orange)' },
      { value: `${p.weightKg}kg`,         unit: i18n('bodyWeightLabel'),   color: 'var(--sub)' },
      { value: `${p.lbm}kg`,             unit: i18n('leanMass'),          color: 'var(--sub)' }
    ];

    let html = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px">';
    stats.forEach(s => {
      html += `
        <div class="card-alt" style="text-align:center">
          <div style="font-family:var(--font-display);font-size:32px;color:${s.color};line-height:1">${s.value}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px">${s.unit}</div>
        </div>`;
    });
    html += '</div>';

    container.innerHTML = html;
  }

  /**
   * Render food suggestions HTML for a window card
   */
  function renderFoodSuggestions(windowKey, proteinClass, targetGrams) {
    const suggestions = getFoodSuggestions(windowKey, proteinClass, targetGrams);
    if (!suggestions.length) return '';

    let html = `<div style="padding:0 20px 16px">
      <div class="mono" style="font-size:10px;color:var(--muted);margin-bottom:8px">${i18n('foodExamples')}</div>`;

    suggestions.forEach(s => {
      html += `
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px;font-size:12.5px">
          <span style="color:var(--green);flex-shrink:0;margin-top:1px">•</span>
          <span style="color:var(--sub)">
            <strong style="color:var(--text)">${s.food}</strong>
            <span style="color:var(--muted)"> — ${s.proteinG}g protein</span>
            ${s.note ? `<span style="color:var(--muted);font-style:italic"> (${s.note})</span>` : ''}
          </span>
        </div>`;
    });

    html += '</div>';
    return html;
  }

  return {
    renderTimeline,
    renderWindowCards,
    renderSummary,
    getFoodSuggestions,
    CLASS_COLORS,
    WINDOW_ICONS
  };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScheduleBuilder;
}
