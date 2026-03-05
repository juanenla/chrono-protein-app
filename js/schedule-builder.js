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

    let html = '<div class="tl-label-row mono"><span>Wake</span><span>Sleep</span></div>';
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
        ? `<span class="badge badge-anabolic">Leucine OK (${w.leucineEstimateG}g)</span>`
        : `<span class="badge badge-catabolic">Leucine LOW (${w.leucineEstimateG}g / ${w.leucineThreshold}g needed)</span>`;

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
            <span class="badge badge-transition">${Math.round(w.share * 100)}% of daily</span>
          </div>
          ${w.suggestion ? `<div style="padding:0 20px 14px;font-size:12px;color:var(--amber)">⚠️ ${w.suggestion}</div>` : ''}
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
      { value: `${t.dailyTotalG}g`,      unit: 'Daily Target',        color: 'var(--green)' },
      { value: `${t.proteinPerKg}`,       unit: 'g/kg/day',           color: 'var(--teal)' },
      { value: `${t.mealsPerDay}`,        unit: 'Protein Meals',      color: 'var(--amber)' },
      { value: `${t.leucinePerMealG}g`,   unit: 'Leucine/meal min',   color: 'var(--orange)' },
      { value: `${p.weightKg}kg`,         unit: 'Body Weight',        color: 'var(--sub)' },
      { value: `${p.lbm}kg`,             unit: 'Lean Mass (est.)',   color: 'var(--sub)' }
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

  return {
    renderTimeline,
    renderWindowCards,
    renderSummary,
    CLASS_COLORS,
    WINDOW_ICONS
  };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScheduleBuilder;
}
