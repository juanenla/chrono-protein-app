/**
 * Editable Plan Logic
 */

let basePlan = null;
let customPlan = null;

document.addEventListener('DOMContentLoaded', () => {
    initEditPlan();
});

function initEditPlan() {
    const profile = JSON.parse(localStorage.getItem('chronoProfile'));
    if (!profile) {
        window.location.href = 'onboarding.html';
        return;
    }

    // Calculate base theoretical plan (always for training day to show max meals)
    basePlan = ChronoCalculator.calculate({ ...profile, isTrainingDay: true });

    // Load custom preferences if they exist
    const customPrefs = JSON.parse(localStorage.getItem('chronoCustomPlan') || 'null');

    // Merge base with custom
    customPlan = customPrefs ? JSON.parse(JSON.stringify(customPrefs)) : JSON.parse(JSON.stringify(basePlan.windows));

    renderEditMeals();
    updateTotals();
}

function renderEditMeals() {
    const container = document.getElementById('edit-meals-container');
    // Sort by time
    const entries = Object.entries(customPlan).sort((a, b) => timeToMinutes(a[1].time) - timeToMinutes(b[1].time));

    let html = '';
    entries.forEach(([key, w]) => {
        const isFree = w.share === 0;

        html += `
      <div class="meal-row" id="row-${key}">
        <div class="meal-row-header">
          <div style="display:flex; align-items:center; gap:8px">
            <span style="font-size:20px">${getIcon(key)}</span>
            <div style="font-weight:600; color:var(--text); font-size:14px">${I18n.t('wl_' + key) || key}</div>
          </div>
          <div style="color:var(--muted); font-size:11px">${isFree ? 'Comida Libre' : 'Anclaje Proteico'}</div>
        </div>
        
        <div class="meal-controls">
          <div style="display:flex; flex-direction:column; gap:4px; flex:1">
            <label style="font-size:11px; color:var(--sub)">Hora de Comida</label>
            <input type="time" id="time-${key}" value="${w.time}" onchange="validateAndSync()">
          </div>
          
          <div style="display:flex; flex-direction:column; gap:4px">
            <label style="font-size:11px; color:var(--sub)">Meta Prot. (g)</label>
            <input type="number" id="prot-${key}" value="${w.grams || 0}" min="0" ${isFree ? 'disabled' : ''} onchange="validateAndSync()">
          </div>
        </div>
      </div>
    `;
    });

    container.innerHTML = html;
}

function validateAndSync() {
    const errorBox = document.getElementById('error-box');
    const btn = document.getElementById('save-plan-btn');
    errorBox.style.display = 'none';
    btn.disabled = false;
    btn.style.opacity = 1;

    // Sync inputs to customPlan
    const times = [];

    Object.keys(customPlan).forEach(key => {
        const timeVal = document.getElementById(`time-${key}`).value;
        const protVal = parseInt(document.getElementById(`prot-${key}`).value) || 0;

        customPlan[key].time = timeVal;
        if (customPlan[key].share > 0) {
            customPlan[key].grams = protVal;
        }

        times.push({ key, t: timeToMinutes(timeVal) });
    });

    // Sort by time to check overlaps
    times.sort((a, b) => a.t - b.t);

    // Validation Rules: Must be at least 90 mins apart (except maybe pre/post workout, but let's enforce 60 mins globally to be safe and UX friendly)
    for (let i = 0; i < times.length - 1; i++) {
        const gap = times[i + 1].t - times[i].t;
        if (gap < 60 && gap > -1) { // -1 to ignore same exact time if they are testing
            errorBox.textContent = `Error: Las comidas "${I18n.t('wl_' + times[i].key)}" y "${I18n.t('wl_' + times[i + 1].key)}" están muy juntas. Deben tener mínimo 60 mins de separación.`;
            errorBox.style.display = 'block';
            btn.disabled = true;
            btn.style.opacity = 0.5;
            break;
        }
    }

    updateTotals();
}

function updateTotals() {
    let totalProt = 0;

    Object.values(customPlan).forEach(w => {
        totalProt += (w.grams || 0);
    });

    document.getElementById('total-prot-label').textContent = totalProt;
    // We display the engine's true calculated TDEE target instead of a rough multiplier.
    document.getElementById('total-kcal-label').textContent = basePlan.summary.estimatedKcal || 2000;
}

function saveCustomPlan() {
    validateAndSync();
    const btn = document.getElementById('save-plan-btn');
    if (btn.disabled) return;

    localStorage.setItem('chronoCustomPlan', JSON.stringify(customPlan));

    btn.textContent = '¡Plan Guardado!';
    btn.style.background = 'var(--card)';
    btn.style.color = 'var(--green)';
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function resetToOptimal() {
    localStorage.removeItem('chronoCustomPlan');
    window.location.reload();
}

function getIcon(key) {
    const icons = {
        breakfast: '🍳', brunch: '🍳', postWorkout: '💪',
        lunch: '🥗', afternoon: '🥤', dinner: '🍽️',
        eveningSnack: '🥣', preSleep: '🌙', preWorkout: '⚡'
    };
    return icons[key] || '🍽️';
}

function timeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}
