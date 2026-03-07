/**
 * MEALS — Create, view, and manage custom meals from ingredients
 */

const Meals = (() => {
  let allMeals = [];
  let allIngredients = [];
  let currentUser = null;
  let builderIngredients = []; // [{ingredient, quantity_g}]
  let editingMealId = null;

  async function init() {
    try {
      currentUser = await Auth.getUser();
    } catch (e) {
      currentUser = null;
    }

    await Promise.all([loadIngredients(), loadMeals()]);
    renderMealList();

    // Check if redirected from ingredients page with ?add=
    const params = new URLSearchParams(window.location.search);
    const addId = params.get('add');
    if (addId) {
      openBuilder();
      const ing = allIngredients.find(i => i.id === addId);
      if (ing) addIngredientToBuilder(ing, 100);
    }
  }

  async function loadIngredients() {
    try {
      const { data, error } = await sb
        .from('ingredients')
        .select('*')
        .order('name_en');
      if (error) throw error;
      allIngredients = data || [];
    } catch (e) {
      console.error('[Meals] Ingredients load error:', e.message);
    }
  }

  async function loadMeals() {
    try {
      const { data, error } = await sb
        .from('meals')
        .select('*, meal_ingredients(*, ingredients(*))')
        .order('created_at', { ascending: false });
      if (error) throw error;
      allMeals = data || [];
    } catch (e) {
      console.error('[Meals] Load error:', e.message);
      allMeals = [];
    }
  }

  function renderMealList() {
    const container = document.getElementById('meal-list');
    const lang = I18n.getLang();

    if (allMeals.length === 0) {
      container.innerHTML = `<div class="empty-state">
        ${lang === 'es' ? 'No hay comidas guardadas. Crea tu primera comida.' : 'No saved meals. Create your first meal.'}
      </div>`;
      return;
    }

    container.innerHTML = allMeals.map(meal => {
      const name = lang === 'es' ? meal.name_es : meal.name_en;
      const mealIngs = meal.meal_ingredients || [];
      const typeLabel = getMealTypeLabel(meal.meal_type, lang);

      return `
        <div class="meal-card" id="meal-${meal.id}">
          <div class="meal-card-header" onclick="Meals.toggleMeal('${meal.id}')">
            <div>
              <div class="meal-card-name">${escapeHtml(name)}</div>
              <div class="meal-card-meta">
                ${typeLabel}
                ${meal.protein_class ? ' · Class ' + meal.protein_class : ''}
                ${meal.prep_time_min ? ' · ' + meal.prep_time_min + 'min prep' : ''}
                ${meal.cook_time_min ? ' · ' + meal.cook_time_min + 'min cook' : ''}
              </div>
            </div>
            <div style="text-align:right;font-family:var(--font-mono);font-size:13px">
              <div style="color:var(--green)">${Math.round(meal.total_protein_g || 0)}g prot</div>
              <div style="color:var(--sub);font-size:11px">${Math.round(meal.total_kcal || 0)} kcal</div>
            </div>
          </div>
          <div class="meal-card-body">
            ${mealIngs.map(mi => {
              const ing = mi.ingredients;
              const ingName = ing ? (lang === 'es' ? ing.name_es : ing.name_en) : '?';
              return `
                <div class="meal-ing-row">
                  <span style="color:var(--text)">${escapeHtml(ingName)}</span>
                  <span style="font-family:var(--font-mono);color:var(--sub)">
                    ${mi.quantity_g}g · ${Math.round(mi.protein_g || 0)}g prot · ${Math.round(mi.kcal || 0)} kcal
                  </span>
                </div>
              `;
            }).join('')}
            <div class="meal-totals">
              <span>${Math.round(meal.total_protein_g || 0)}g prot</span>
              <span>${Math.round(meal.total_carbs_g || 0)}g carb</span>
              <span>${Math.round(meal.total_fat_g || 0)}g fat</span>
              <span>${Math.round(meal.total_kcal || 0)} kcal</span>
              <span>${(meal.total_leucine_g || 0).toFixed(1)}g leu</span>
            </div>
            ${(meal.recipe_url || meal.video_url) ? `
              <div class="meal-links">
                ${meal.recipe_url ? `<a href="${escapeHtml(meal.recipe_url)}" target="_blank" rel="noopener">${lang === 'es' ? 'Receta' : 'Recipe'}</a>` : ''}
                ${meal.video_url ? `<a href="${escapeHtml(meal.video_url)}" target="_blank" rel="noopener">Video</a>` : ''}
              </div>
            ` : ''}
            <div style="display:flex;gap:8px;margin-top:12px">
              ${meal.created_by === (currentUser && currentUser.id) || !meal.is_system ? `
                <button class="btn btn-secondary" style="font-size:12px;padding:6px 12px" onclick="Meals.edit('${meal.id}')">
                  ${lang === 'es' ? 'Editar' : 'Edit'}
                </button>
                <button style="background:none;border:1px solid #ff6b6b;color:#ff6b6b;padding:6px 12px;border-radius:var(--radius-sm);font-size:12px;cursor:pointer" onclick="Meals.remove('${meal.id}')">
                  ${lang === 'es' ? 'Eliminar' : 'Delete'}
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function toggleMeal(id) {
    const card = document.getElementById('meal-' + id);
    if (card) card.classList.toggle('expanded');
  }

  // Builder
  function openBuilder(mealData) {
    editingMealId = null;
    builderIngredients = [];

    if (mealData) {
      editingMealId = mealData.id;
      document.getElementById('meal-name-en').value = mealData.name_en || '';
      document.getElementById('meal-name-es').value = mealData.name_es || '';
      document.getElementById('meal-type').value = mealData.meal_type || 'lunch';
      document.getElementById('meal-class').value = mealData.protein_class || '';
      document.getElementById('meal-prep-time').value = mealData.prep_time_min || '';
      document.getElementById('meal-cook-time').value = mealData.cook_time_min || '';
      document.getElementById('meal-recipe-url').value = mealData.recipe_url || '';
      document.getElementById('meal-video-url').value = mealData.video_url || '';

      // Load existing ingredients
      if (mealData.meal_ingredients) {
        mealData.meal_ingredients.forEach(mi => {
          if (mi.ingredients) {
            builderIngredients.push({ ingredient: mi.ingredients, quantity_g: mi.quantity_g });
          }
        });
      }
    } else {
      document.getElementById('meal-name-en').value = '';
      document.getElementById('meal-name-es').value = '';
      document.getElementById('meal-type').value = 'lunch';
      document.getElementById('meal-class').value = '';
      document.getElementById('meal-prep-time').value = '';
      document.getElementById('meal-cook-time').value = '';
      document.getElementById('meal-recipe-url').value = '';
      document.getElementById('meal-video-url').value = '';
    }

    renderBuilderIngredients();
    document.getElementById('builder-overlay').classList.add('active');
  }

  function closeBuilder() {
    document.getElementById('builder-overlay').classList.remove('active');
    builderIngredients = [];
    editingMealId = null;
  }

  function edit(mealId) {
    const meal = allMeals.find(m => m.id === mealId);
    if (meal) openBuilder(meal);
  }

  async function remove(mealId) {
    const lang = I18n.getLang();
    if (!confirm(lang === 'es' ? 'Eliminar esta comida?' : 'Delete this meal?')) return;

    try {
      const { error } = await sb.from('meals').delete().eq('id', mealId);
      if (error) throw error;
      allMeals = allMeals.filter(m => m.id !== mealId);
      renderMealList();
    } catch (e) {
      alert('Error: ' + e.message);
    }
  }

  // Ingredient search in builder
  function searchIngredient() {
    const query = document.getElementById('ing-search').value.toLowerCase().trim();
    const resultsEl = document.getElementById('ing-search-results');
    const lang = I18n.getLang();

    if (!query || query.length < 2) {
      resultsEl.style.display = 'none';
      return;
    }

    const existing = new Set(builderIngredients.map(bi => bi.ingredient.id));
    const matches = allIngredients
      .filter(ing => {
        if (existing.has(ing.id)) return false;
        const name = lang === 'es' ? ing.name_es : ing.name_en;
        return name.toLowerCase().includes(query) ||
          ing.name_en.toLowerCase().includes(query) ||
          ing.name_es.toLowerCase().includes(query);
      })
      .slice(0, 8);

    if (matches.length === 0) {
      resultsEl.style.display = 'none';
      return;
    }

    resultsEl.style.display = 'block';
    resultsEl.innerHTML = matches.map(ing => {
      const name = lang === 'es' ? ing.name_es : ing.name_en;
      return `
        <div class="ing-search-result" onclick="Meals.selectIngredient('${ing.id}')">
          <span>${escapeHtml(name)}</span>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--muted)">
            ${ing.protein_g}g prot / 100g
          </span>
        </div>
      `;
    }).join('');
  }

  function selectIngredient(ingId) {
    const ing = allIngredients.find(i => i.id === ingId);
    if (!ing) return;
    addIngredientToBuilder(ing, 100);
    document.getElementById('ing-search').value = '';
    document.getElementById('ing-search-results').style.display = 'none';
  }

  function addIngredientToBuilder(ingredient, qty) {
    builderIngredients.push({ ingredient, quantity_g: qty });
    renderBuilderIngredients();
  }

  function removeIngredientFromBuilder(idx) {
    builderIngredients.splice(idx, 1);
    renderBuilderIngredients();
  }

  function updateIngredientQty(idx, qty) {
    builderIngredients[idx].quantity_g = parseFloat(qty) || 0;
    updateBuilderSummary();
  }

  function renderBuilderIngredients() {
    const container = document.getElementById('builder-ingredients');
    const lang = I18n.getLang();

    container.innerHTML = builderIngredients.map((bi, idx) => {
      const name = lang === 'es' ? bi.ingredient.name_es : bi.ingredient.name_en;
      const prot = ((bi.ingredient.protein_g || 0) * bi.quantity_g / 100).toFixed(1);
      return `
        <div class="builder-ing-item">
          <button class="builder-ing-remove" onclick="Meals.removeIng(${idx})">x</button>
          <span style="flex:1;color:var(--text)">${escapeHtml(name)}</span>
          <input type="number" value="${bi.quantity_g}" min="1" onchange="Meals.updateQty(${idx}, this.value)">
          <span style="color:var(--muted);font-size:11px;width:40px;text-align:right">g</span>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--green);width:50px;text-align:right">${prot}g</span>
        </div>
      `;
    }).join('');

    updateBuilderSummary();
  }

  function updateBuilderSummary() {
    let totalProt = 0, totalCarb = 0, totalFat = 0, totalKcal = 0, totalLeu = 0;

    builderIngredients.forEach(bi => {
      const ratio = bi.quantity_g / 100;
      totalProt += (bi.ingredient.protein_g || 0) * ratio;
      totalCarb += (bi.ingredient.carbs_g || 0) * ratio;
      totalFat += (bi.ingredient.fat_g || 0) * ratio;
      totalKcal += (bi.ingredient.kcal || 0) * ratio;
      totalLeu += (bi.ingredient.leucine_g || 0) * ratio;
    });

    const sumEl = document.getElementById('builder-summary');
    sumEl.style.display = builderIngredients.length > 0 ? 'flex' : 'none';
    document.getElementById('sum-prot').textContent = Math.round(totalProt) + 'g prot';
    document.getElementById('sum-carb').textContent = Math.round(totalCarb) + 'g carb';
    document.getElementById('sum-fat').textContent = Math.round(totalFat) + 'g fat';
    document.getElementById('sum-kcal').textContent = Math.round(totalKcal) + ' kcal';
    document.getElementById('sum-leu').textContent = totalLeu.toFixed(1) + 'g leucine';
  }

  async function save() {
    if (!currentUser) {
      window.location.href = 'auth.html';
      return;
    }

    const nameEn = document.getElementById('meal-name-en').value.trim();
    const nameEs = document.getElementById('meal-name-es').value.trim();

    if (!nameEn || !nameEs) {
      alert(I18n.getLang() === 'es' ? 'Completa el nombre en ambos idiomas' : 'Fill in the name in both languages');
      return;
    }

    if (builderIngredients.length === 0) {
      alert(I18n.getLang() === 'es' ? 'Agrega al menos un ingrediente' : 'Add at least one ingredient');
      return;
    }

    // Calculate totals
    let totalProt = 0, totalCarb = 0, totalFat = 0, totalKcal = 0, totalLeu = 0;
    builderIngredients.forEach(bi => {
      const ratio = bi.quantity_g / 100;
      totalProt += (bi.ingredient.protein_g || 0) * ratio;
      totalCarb += (bi.ingredient.carbs_g || 0) * ratio;
      totalFat += (bi.ingredient.fat_g || 0) * ratio;
      totalKcal += (bi.ingredient.kcal || 0) * ratio;
      totalLeu += (bi.ingredient.leucine_g || 0) * ratio;
    });

    const mealData = {
      name_en: nameEn,
      name_es: nameEs,
      meal_type: document.getElementById('meal-type').value,
      protein_class: document.getElementById('meal-class').value || null,
      total_protein_g: Math.round(totalProt * 10) / 10,
      total_carbs_g: Math.round(totalCarb * 10) / 10,
      total_fat_g: Math.round(totalFat * 10) / 10,
      total_kcal: Math.round(totalKcal),
      total_leucine_g: Math.round(totalLeu * 100) / 100,
      prep_time_min: parseInt(document.getElementById('meal-prep-time').value) || null,
      cook_time_min: parseInt(document.getElementById('meal-cook-time').value) || null,
      recipe_url: document.getElementById('meal-recipe-url').value.trim() || null,
      video_url: document.getElementById('meal-video-url').value.trim() || null,
      created_by: currentUser.id,
      is_system: false,
      is_public: false
    };

    try {
      let mealId;

      if (editingMealId) {
        // Update existing meal
        const { error } = await sb.from('meals').update(mealData).eq('id', editingMealId);
        if (error) throw error;
        mealId = editingMealId;

        // Delete old ingredients
        await sb.from('meal_ingredients').delete().eq('meal_id', mealId);
      } else {
        // Insert new meal
        const { data, error } = await sb.from('meals').insert(mealData).select('id').single();
        if (error) throw error;
        mealId = data.id;
      }

      // Insert ingredients
      const ingRows = builderIngredients.map(bi => {
        const ratio = bi.quantity_g / 100;
        return {
          meal_id: mealId,
          ingredient_id: bi.ingredient.id,
          quantity_g: bi.quantity_g,
          protein_g: Math.round((bi.ingredient.protein_g || 0) * ratio * 10) / 10,
          carbs_g: Math.round((bi.ingredient.carbs_g || 0) * ratio * 10) / 10,
          fat_g: Math.round((bi.ingredient.fat_g || 0) * ratio * 10) / 10,
          kcal: Math.round((bi.ingredient.kcal || 0) * ratio),
          leucine_g: Math.round((bi.ingredient.leucine_g || 0) * ratio * 100) / 100
        };
      });

      const { error: ingError } = await sb.from('meal_ingredients').insert(ingRows);
      if (ingError) throw ingError;

      closeBuilder();
      await loadMeals();
      renderMealList();
    } catch (e) {
      alert('Error: ' + e.message);
      console.error('[Meals] Save error:', e);
    }
  }

  function render() {
    renderMealList();
    translateStatic();
  }

  function translateStatic() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = i18n(el.dataset.i18n);
    });
  }

  // Helpers
  function getMealTypeLabel(type, lang) {
    const labels = {
      breakfast: { en: 'Breakfast', es: 'Desayuno' },
      brunch: { en: 'Brunch', es: 'Brunch' },
      lunch: { en: 'Lunch', es: 'Almuerzo' },
      afternoon: { en: 'Snack', es: 'Merienda' },
      dinner: { en: 'Dinner', es: 'Cena' },
      preSleep: { en: 'Pre-Sleep', es: 'Pre-Sueno' },
      postWorkout: { en: 'Post-Workout', es: 'Post-Entreno' },
      preWorkout: { en: 'Pre-Workout', es: 'Pre-Entreno' },
      snack: { en: 'Snack', es: 'Colacion' }
    };
    return (labels[type] && labels[type][lang]) || type;
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Init
  document.addEventListener('DOMContentLoaded', init);

  return {
    toggleMeal,
    openBuilder,
    closeBuilder,
    edit,
    remove,
    searchIngredient,
    selectIngredient,
    removeIng: removeIngredientFromBuilder,
    updateQty: updateIngredientQty,
    save,
    render
  };
})();
