/**
 * INGREDIENTS — Browse, search, filter & favorite ingredients from Supabase
 */

const Ingredients = (() => {
  let allIngredients = [];
  let userFavoriteIds = new Set();
  let currentTab = 'all'; // 'all' | 'favorites'
  let currentUser = null;

  async function init() {
    // Check auth
    try {
      currentUser = await Auth.getUser();
    } catch (e) {
      currentUser = null;
    }

    await loadIngredients();
    if (currentUser) await loadFavorites();
    search();
  }

  async function loadIngredients() {
    try {
      const { data, error } = await sb
        .from('ingredients')
        .select('*')
        .order('category')
        .order('name_en');

      if (error) throw error;
      allIngredients = data || [];
    } catch (e) {
      console.error('[Ingredients] Load error:', e.message);
      allIngredients = [];
    }
  }

  async function loadFavorites() {
    if (!currentUser) return;
    try {
      const { data, error } = await sb
        .from('user_favorites')
        .select('ingredient_id')
        .eq('user_id', currentUser.id);

      if (error) throw error;
      userFavoriteIds = new Set((data || []).map(f => f.ingredient_id));
    } catch (e) {
      console.error('[Ingredients] Favorites error:', e.message);
    }
  }

  function search() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const category = document.getElementById('filter-category').value;
    const proteinClass = document.getElementById('filter-class').value;
    const diet = document.getElementById('filter-diet').value;
    const lang = I18n.getLang();

    let filtered = allIngredients;

    // Tab filter
    if (currentTab === 'favorites') {
      filtered = filtered.filter(ing => userFavoriteIds.has(ing.id));
    }

    // Text search
    if (query) {
      filtered = filtered.filter(ing => {
        const name = lang === 'es' ? ing.name_es : ing.name_en;
        return name.toLowerCase().includes(query) ||
          ing.name_en.toLowerCase().includes(query) ||
          ing.name_es.toLowerCase().includes(query);
      });
    }

    // Category filter
    if (category) {
      filtered = filtered.filter(ing => ing.category === category);
    }

    // Protein class filter
    if (proteinClass) {
      filtered = filtered.filter(ing => ing.protein_class === proteinClass);
    }

    // Diet filter
    if (diet === 'vegan') {
      filtered = filtered.filter(ing => ing.is_vegan);
    } else if (diet === 'vegetarian') {
      filtered = filtered.filter(ing => ing.is_vegetarian);
    }

    renderList(filtered);
  }

  function renderList(items) {
    const container = document.getElementById('ingredient-list');
    const countEl = document.getElementById('results-count');
    const lang = I18n.getLang();

    countEl.textContent = `${items.length} ${lang === 'es' ? 'ingredientes' : 'ingredients'}`;

    if (items.length === 0) {
      container.innerHTML = `<div class="empty-state">${lang === 'es' ? 'No se encontraron ingredientes' : 'No ingredients found'}</div>`;
      return;
    }

    container.innerHTML = items.map(ing => {
      const name = lang === 'es' ? ing.name_es : ing.name_en;
      const isFav = userFavoriteIds.has(ing.id);
      const classColor = getClassColor(ing.protein_class);
      const categoryLabel = getCategoryLabel(ing.category, lang);

      return `
        <div class="ingredient-card" id="ing-${ing.id}" onclick="Ingredients.toggle('${ing.id}')">
          <div class="ing-top">
            <div>
              <div class="ing-name">${escapeHtml(name)}</div>
              <div class="ing-category">${categoryLabel}</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              ${ing.protein_class ? `<span class="class-badge" style="background:${classColor}15;color:${classColor}">${ing.protein_class}</span>` : ''}
              ${isFav ? '<span style="color:var(--amber)">&#9733;</span>' : ''}
            </div>
          </div>
          <div class="ing-macros">
            <span><span class="macro-dot" style="background:var(--green)"></span>${ing.protein_g}g prot</span>
            <span><span class="macro-dot" style="background:var(--amber)"></span>${ing.carbs_g}g carb</span>
            <span><span class="macro-dot" style="background:var(--orange)"></span>${ing.fat_g}g fat</span>
            <span>${ing.kcal} kcal</span>
          </div>
          <div class="ing-detail">
            <div class="detail-grid">
              <div><span class="label">${lang === 'es' ? 'Leucina' : 'Leucine'}:</span> ${ing.leucine_g || 0}g</div>
              <div><span class="label">${lang === 'es' ? 'Fibra' : 'Fiber'}:</span> ${ing.fiber_g || 0}g</div>
              <div><span class="label">${lang === 'es' ? 'Absorcion' : 'Absorption'}:</span> ${ing.absorption || '-'}</div>
              <div><span class="label">${lang === 'es' ? 'Clase' : 'Class'}:</span> ${ing.protein_class || 'N'} — ${getClassName(ing.protein_class, lang)}</div>
              ${ing.calcium_mg ? `<div><span class="label">Calcium:</span> ${ing.calcium_mg}mg</div>` : ''}
              ${ing.iron_mg ? `<div><span class="label">${lang === 'es' ? 'Hierro' : 'Iron'}:</span> ${ing.iron_mg}mg</div>` : ''}
              ${ing.zinc_mg ? `<div><span class="label">Zinc:</span> ${ing.zinc_mg}mg</div>` : ''}
              ${ing.omega3_g ? `<div><span class="label">Omega-3:</span> ${ing.omega3_g}g</div>` : ''}
            </div>
            <div style="margin-top:8px;font-size:11px;color:var(--muted)">
              ${ing.is_vegan ? (lang === 'es' ? 'Vegano' : 'Vegan') + ' · ' : ''}${ing.is_vegetarian ? (lang === 'es' ? 'Vegetariano' : 'Vegetarian') + ' · ' : ''}${ing.is_gluten_free ? (lang === 'es' ? 'Sin gluten' : 'Gluten-free') : ''}
            </div>
            <div class="ing-actions">
              <button class="btn-fav ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); Ingredients.toggleFav('${ing.id}')">
                ${isFav ? '&#9733; ' : '&#9734; '}${lang === 'es' ? (isFav ? 'Favorito' : 'Agregar favorito') : (isFav ? 'Favorite' : 'Add favorite')}
              </button>
              <button class="btn-add-meal" onclick="event.stopPropagation(); Ingredients.addToMeal('${ing.id}')">
                + ${lang === 'es' ? 'Agregar a comida' : 'Add to meal'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function toggle(id) {
    const card = document.getElementById('ing-' + id);
    if (card) card.classList.toggle('expanded');
  }

  async function toggleFav(ingredientId) {
    if (!currentUser) {
      window.location.href = 'auth.html';
      return;
    }

    const isFav = userFavoriteIds.has(ingredientId);

    try {
      if (isFav) {
        await sb.from('user_favorites')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('ingredient_id', ingredientId);
        userFavoriteIds.delete(ingredientId);
      } else {
        await sb.from('user_favorites')
          .insert({ user_id: currentUser.id, ingredient_id: ingredientId });
        userFavoriteIds.add(ingredientId);
      }
    } catch (e) {
      console.error('[Ingredients] Favorite toggle error:', e.message);
    }

    search(); // re-render
  }

  function addToMeal(ingredientId) {
    // Store selected ingredient in sessionStorage and redirect to meals page
    const pending = JSON.parse(sessionStorage.getItem('pendingMealIngredients') || '[]');
    if (!pending.includes(ingredientId)) {
      pending.push(ingredientId);
      sessionStorage.setItem('pendingMealIngredients', JSON.stringify(pending));
    }
    window.location.href = 'meals.html?add=' + ingredientId;
  }

  function switchTab(tab) {
    currentTab = tab;
    document.getElementById('tab-all').classList.toggle('active', tab === 'all');
    document.getElementById('tab-favorites').classList.toggle('active', tab === 'favorites');
    search();
  }

  function render() {
    // Re-render after language change
    search();
    translateStatic();
  }

  function translateStatic() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = i18n(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = i18n(el.dataset.i18nPlaceholder);
    });
  }

  // Helpers
  function getClassColor(cls) {
    const colors = { A: '#4FFFB0', B: '#7B9EFF', C: '#FFD700', D: '#98FF6E', E: '#FF9EAA', N: '#A0A0B0' };
    return colors[cls] || '#A0A0B0';
  }

  function getClassName(cls, lang) {
    const names = {
      A: { en: 'Fast (Whey)', es: 'Rapida (Whey)' },
      B: { en: 'Slow (Casein)', es: 'Lenta (Caseina)' },
      C: { en: 'Leucine', es: 'Leucina' },
      D: { en: 'Plant', es: 'Vegetal' },
      E: { en: 'Collagen', es: 'Colageno' },
      N: { en: 'Balanced', es: 'Balanceado' }
    };
    return (names[cls] && names[cls][lang]) || (names[cls] && names[cls].en) || '-';
  }

  function getCategoryLabel(cat, lang) {
    const labels = {
      meat: { en: 'Meat', es: 'Carne' },
      poultry: { en: 'Poultry', es: 'Ave' },
      fish: { en: 'Fish', es: 'Pescado' },
      dairy: { en: 'Dairy', es: 'Lacteo' },
      eggs: { en: 'Eggs', es: 'Huevos' },
      legumes: { en: 'Legumes', es: 'Legumbres' },
      grains: { en: 'Grains', es: 'Cereales' },
      vegetables: { en: 'Vegetables', es: 'Vegetales' },
      fruits: { en: 'Fruits', es: 'Frutas' },
      nuts_seeds: { en: 'Nuts & Seeds', es: 'Frutos secos' },
      supplements: { en: 'Supplements', es: 'Suplementos' },
      oils_fats: { en: 'Oils & Fats', es: 'Aceites y grasas' },
      beverages: { en: 'Beverages', es: 'Bebidas' },
      other: { en: 'Other', es: 'Otro' }
    };
    return (labels[cat] && labels[cat][lang]) || cat;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Get ingredient data by ID (used by meals.js)
  function getById(id) {
    return allIngredients.find(ing => ing.id === id) || null;
  }

  function getAll() {
    return allIngredients;
  }

  // Init on load
  document.addEventListener('DOMContentLoaded', init);

  return { search, toggle, toggleFav, addToMeal, switchTab, render, getById, getAll };
})();
