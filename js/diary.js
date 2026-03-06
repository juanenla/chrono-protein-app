/**
 * Mi Diario - Reality vs Plan Tracker
 */

document.addEventListener('DOMContentLoaded', () => {
    initDiary();
});

async function initDiary() {
    const profile = JSON.parse(localStorage.getItem('chronoProfile'));
    if (!profile) {
        window.location.href = 'onboarding.html';
        return;
    }

    // Calculate today's theoretical plan
    const plan = ChronoCalculator.calculate(profile);

    // Render Date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = new Date().toLocaleDateString(I18n.currentLang, dateOptions);

    renderDiaryMeals(plan);
    updateMacros(plan);
}

function renderDiaryMeals(plan) {
    const container = document.getElementById('diary-meals');
    const entries = Object.entries(plan.windows).sort((a, b) => {
        return timeToMinutes(a[1].time) - timeToMinutes(b[1].time);
    });

    // Load existing log if any
    const todayKey = new Date().toISOString().split('T')[0];
    const logs = JSON.parse(localStorage.getItem('dailyLogs') || '{}');
    const todayLog = logs[todayKey] || {};

    let html = '';
    entries.forEach(([key, w]) => {
        const isFree = w.share === 0;
        const targetProt = w.grams;
        const loggedProt = todayLog[key] !== undefined ? todayLog[key] : (isFree ? 0 : targetProt); // default to target for ease

        html += `
      <div class="meal-row">
        <div style="display:flex; align-items:center">
          <div class="meal-icon">${getIcon(key)}</div>
          <div>
            <div style="font-weight:600; color:var(--text); font-size:14px">${I18n.t('wl_' + key) || key}</div>
            <div style="color:var(--muted); font-size:11px">${w.time} — ${isFree ? 'Libre' : `Meta: ${targetProt}g`}</div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px">
          <input type="number" id="input-${key}" value="${loggedProt}" onchange="updateMacrosFromInputs()" min="0">
          <span style="color:var(--sub); font-size:12px">g prot</span>
        </div>
      </div>
    `;
    });

    container.innerHTML = html;
}

function updateMacrosFromInputs() {
    const inputs = document.querySelectorAll('input[type="number"]');
    let totalProt = 0;
    inputs.forEach(input => {
        totalProt += parseInt(input.value) || 0;
    });

    // Update logged state
    document.getElementById('consumed-prot').textContent = totalProt;

    // Deviation
    const targetEl = document.getElementById('target-prot');
    const target = parseInt(targetEl.textContent);

    const deviation = totalProt - target;
    const devEl = document.getElementById('deviation-metric');
    if (deviation > 0) {
        devEl.textContent = `+${deviation}g`;
        devEl.style.color = 'var(--amber)';
    } else if (deviation < 0) {
        devEl.textContent = `${deviation}g`;
        devEl.style.color = '#ff6b6b';
    } else {
        devEl.textContent = `Perfecto`;
        devEl.style.color = 'var(--green)';
    }

    // Update progress bar
    const pct = Math.min(100, Math.max(0, (totalProt / target) * 100)) || 0;
    document.getElementById('prot-fill').style.width = pct + '%';
    if (pct < 100) document.getElementById('prot-fill').style.background = 'var(--amber)';
    else document.getElementById('prot-fill').style.background = 'var(--green)';
}

function updateMacros(plan) {
    let targetTotalGrams = 0;
    Object.values(plan.windows).forEach(w => targetTotalGrams += w.grams);

    document.getElementById('target-prot').textContent = targetTotalGrams;
    document.getElementById('target-kcal').textContent = plan.summary.estimatedKcal;

    // Calculate consumed cal visually (mock ratio for now until foods chosen)
    const logs = JSON.parse(localStorage.getItem('dailyLogs') || '{}');
    const todayKey = new Date().toISOString().split('T')[0];
    const todayLog = logs[todayKey] || {};

    let consumedProt = 0;
    Object.keys(plan.windows).forEach(key => {
        consumedProt += todayLog[key] !== undefined ? todayLog[key] : plan.windows[key].grams;
    });

    document.getElementById('consumed-prot').textContent = consumedProt;

    // trigger calc
    updateMacrosFromInputs();
}

function saveDiary() {
    const inputs = document.querySelectorAll('input[type="number"]');
    const todayLog = {};
    inputs.forEach(input => {
        const key = input.id.replace('input-', '');
        todayLog[key] = parseInt(input.value) || 0;
    });

    const todayKey = new Date().toISOString().split('T')[0];
    const logs = JSON.parse(localStorage.getItem('dailyLogs') || '{}');
    logs[todayKey] = todayLog;
    localStorage.setItem('dailyLogs', JSON.stringify(logs));

    const btn = document.getElementById('save-diary');
    btn.textContent = '¡Guardado!';
    btn.style.background = 'var(--card)';
    btn.style.color = 'var(--green)';
    setTimeout(() => {
        btn.textContent = 'Guardar Progreso';
        btn.style.background = 'var(--green)';
        btn.style.color = 'black';
    }, 2000);
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
