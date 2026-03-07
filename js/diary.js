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
    const todayLogBody = logs[todayKey] || {};

    let html = '';
    entries.forEach(([key, w]) => {
        const isFree = w.share === 0;
        const targetProt = w.grams;
        const loggedData = todayLogBody[key];

        // Support both old logs (number) and new logs (object {grams, desc})
        let loggedProt, loggedDesc;
        if (typeof loggedData === 'object' && loggedData !== null) {
            loggedProt = loggedData.grams !== undefined ? loggedData.grams : (isFree ? 0 : targetProt);
            loggedDesc = loggedData.desc || '';
        } else if (typeof loggedData === 'number') {
            loggedProt = loggedData;
            loggedDesc = '';
        } else {
            loggedProt = isFree ? 0 : targetProt;
            loggedDesc = '';
        }

        html += `
      <div class="meal-row">
        <div class="meal-info">
          <div style="display:flex; align-items:center">
            <div class="meal-icon">${getIcon(key)}</div>
            <div>
              <div style="font-weight:600; color:var(--text); font-size:14px">${I18n.t('wl_' + key) || key}</div>
              <div style="color:var(--muted); font-size:11px">${w.time} — ${isFree ? 'Libre' : `Meta: ${targetProt}g`}</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px">
            <input type="number" id="grams-${key}" value="${loggedProt}" onchange="updateMacrosFromInputs()" min="0">
            <span style="color:var(--sub); font-size:12px">g prot</span>
          </div>
        </div>
        <div class="meal-logging">
          <input type="text" id="desc-${key}" value="${loggedDesc}" placeholder="¿Qué comiste? (Ej: Milanesa con puré)" list="frequent-foods">
        </div>
      </div>
    `;
    });

    container.innerHTML = html;
    loadFrequentFoods();
}

function loadFrequentFoods() {
    const frequent = JSON.parse(localStorage.getItem('frequentFoods') || '[]');
    const datalist = document.getElementById('frequent-foods');
    datalist.innerHTML = frequent.map(f => `<option value="${f}">`).join('');
}

function updateMacrosFromInputs() {
    const gramInputs = document.querySelectorAll('input[id^="grams-"]');
    let totalProt = 0;
    gramInputs.forEach(input => {
        totalProt += parseInt(input.value) || 0;
    });

    document.getElementById('consumed-prot').textContent = totalProt;
    const target = parseInt(document.getElementById('target-prot').textContent);
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

    const pct = Math.min(100, Math.max(0, (totalProt / target) * 100)) || 0;
    document.getElementById('prot-fill').style.width = pct + '%';
    document.getElementById('prot-fill').style.background = pct < 100 ? 'var(--amber)' : 'var(--green)';

    // Update calories (simplified logic: protein windows + baseline)
    const kcalTarget = parseInt(document.getElementById('target-kcal').textContent);
    const consumedKcal = Math.round((totalProt / target) * kcalTarget); // Simplified ratio
    document.getElementById('consumed-kcal').textContent = consumedKcal;
    const kPct = Math.min(100, (consumedKcal / kcalTarget) * 100);
    document.getElementById('kcal-fill').style.width = kPct + '%';
}

function updateMacros(plan) {
    let targetTotalGrams = 0;
    Object.values(plan.windows).forEach(w => targetTotalGrams += w.grams);

    document.getElementById('target-prot').textContent = targetTotalGrams;
    document.getElementById('target-kcal').textContent = plan.summary.estimatedKcal;

    updateMacrosFromInputs();
}

function saveDiary() {
    const gramInputs = document.querySelectorAll('input[id^="grams-"]');
    const todayLogBody = {};
    const frequent = JSON.parse(localStorage.getItem('frequentFoods') || '[]');

    gramInputs.forEach(input => {
        const key = input.id.replace('grams-', '');
        const descInput = document.getElementById(`desc-${key}`);
        const desc = descInput.value.trim();

        todayLogBody[key] = {
            grams: parseInt(input.value) || 0,
            desc: desc
        };

        if (desc && !frequent.includes(desc)) {
            frequent.unshift(desc);
        }
    });

    // Keep only last 20 frequent foods
    const updatedFrequent = [...new Set(frequent)].slice(0, 20);
    localStorage.setItem('frequentFoods', JSON.stringify(updatedFrequent));

    const todayKey = new Date().toISOString().split('T')[0];
    const logs = JSON.parse(localStorage.getItem('dailyLogs') || '{}');
    logs[todayKey] = todayLogBody;
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
