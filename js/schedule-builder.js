/**
 * SCHEDULE BUILDER
 * Takes calculator output → renders the visual 24h timeline + window cards
 * Full EN/ES bilingual support for all food examples
 */

const ScheduleBuilder = (() => {

  const CLASS_COLORS = {
    A: { color: '#4FFFB0', bg: 'rgba(79,255,176,0.12)', label: { en: 'Whey / Fast', es: 'Whey / Rapida' } },
    B: { color: '#7B9EFF', bg: 'rgba(123,158,255,0.12)', label: { en: 'Casein / Slow', es: 'Caseina / Lenta' } },
    C: { color: '#FFD700', bg: 'rgba(255,215,0,0.12)', label: { en: 'Leucine Boost', es: 'Refuerzo Leucina' } },
    D: { color: '#98FF6E', bg: 'rgba(152,255,110,0.12)', label: { en: 'Plant', es: 'Vegetal' } },
    E: { color: '#FF9EAA', bg: 'rgba(255,158,170,0.12)', label: { en: 'Collagen', es: 'Colageno' } },
    N: { color: '#B0B0B0', bg: 'rgba(176,176,176,0.08)', label: { en: 'Balanced', es: 'Equilibrada' } }
  };

  function classLabel(cls) {
    const c = CLASS_COLORS[cls] || CLASS_COLORS.A;
    const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
    return c.label[lang] || c.label.en;
  }

  /**
   * Bilingual text helper: { en: '...', es: '...' } → current lang string
   */
  function tx(obj) {
    if (typeof obj === 'string') return obj;
    const lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'en';
    return (obj && obj[lang]) || (obj && obj.en) || '';
  }

  /**
   * Food examples per window type and protein class
   * Each entry: { food: {en,es}, proteinG, kcal, portion: {en,es}, note: {en,es} }
   * Multiple options per category for variety/rotation
   */
  const FOOD_EXAMPLES = {
    breakfast: {
      A: [
        { food: { en: '3 whole eggs + 2 egg whites', es: '3 huevos enteros + 2 claras' }, proteinG: 30, kcal: 320, portion: { en: '~280g total', es: '~280g total' }, note: { en: 'scrambled or omelette', es: 'revueltos u omelette' } },
        { food: { en: 'Greek yogurt 200g + whey scoop', es: 'Yogur natural firme 200g + medida de whey' }, proteinG: 32, kcal: 290, portion: { en: '200g + 30g powder', es: '200g + 30g polvo' }, note: { en: 'with berries', es: 'con frutas' } },
        { food: { en: 'Protein oatmeal (40g oats + 1 scoop whey)', es: 'Avena proteica (40g avena + 1 medida whey)' }, proteinG: 28, kcal: 340, portion: { en: '40g + 30g powder', es: '40g + 30g polvo' }, note: { en: 'add banana', es: 'agregar banana' } },
        { food: { en: '2 eggs + 150g cottage cheese on toast', es: '2 huevos + 150g queso untable magro en tostada' }, proteinG: 30, kcal: 380, portion: { en: '2 eggs + 150g + 1 slice', es: '2 huevos + 150g + 1 rebanada' }, note: { en: 'balanced breakfast', es: 'desayuno equilibrado' } },
        { food: { en: 'Lean ham 80g + cheese + whole wheat toast', es: 'Jamon cocido natural 80g + queso magro + tostada' }, proteinG: 26, kcal: 350, portion: { en: '80g + 30g + 2 slices', es: '80g + 30g + 2 rebanadas' }, note: { en: 'quick & easy', es: 'rapido y facil' } }
      ],
      B: [
        { food: { en: '250g Greek yogurt + 30g nuts + honey', es: '250g yogur natural + 30g frutos secos + miel' }, proteinG: 28, kcal: 350, portion: { en: '250g + 30g + 10g', es: '250g + 30g + 10g' }, note: { en: 'slow release', es: 'liberacion lenta' } },
        { food: { en: '200g cottage cheese + fruit + granola', es: '200g queso untable magro + fruta + granola' }, proteinG: 24, kcal: 310, portion: { en: '200g + 100g + 30g', es: '200g + 100g + 30g' }, note: { en: 'casein-rich', es: 'rico en caseina' } }
      ],
      D: [
        { food: { en: 'Tofu scramble (200g firm tofu) + seeds', es: 'Revuelto de tofu (200g tofu firme) + semillas' }, proteinG: 22, kcal: 280, portion: { en: '200g + 15g', es: '200g + 15g' }, note: { en: 'add leucine powder', es: 'agregar polvo de leucina' } }
      ]
    },
    brunch: {
      A: [
        { food: { en: '3 eggs + avocado toast', es: '3 huevos revueltos + tostada con palta' }, proteinG: 30, kcal: 450, portion: { en: '3 + 1 slice', es: '3 + 1 rebanada' }, note: { en: 'balanced brunch', es: 'brunch equilibrado' } }
      ],
      D: [
        { food: { en: 'Tempeh bowl 150g + rice + vegetables', es: 'Bowl de soja/tempeh 150g + arroz + vegetales' }, proteinG: 28, kcal: 420, portion: { en: '150g + 150g + 100g', es: '150g + 150g + 100g' }, note: { en: 'add leucine', es: 'agregar leucina' } }
      ]
    },
    postWorkout: {
      A: [
        { food: { en: '1 scoop whey (30g) + banana', es: '1 medida de whey (30g) + banana' }, proteinG: 25, kcal: 220, portion: { en: '30g + 1 medium', es: '30g + 1 mediana' }, note: { en: 'take within 60 min', es: 'tomar rapido' } },
        { food: { en: '150g chicken breast + rice', es: '150g suprema de pollo + arroz (200g cocido)' }, proteinG: 35, kcal: 480, portion: { en: '150g + 200g', es: '150g + 200g' }, note: { en: 'complete post-workout', es: 'comida post-entreno completa' } },
        { food: { en: '200g canned tuna + potato', es: '200g atun al natural + papa hervida' }, proteinG: 40, kcal: 420, portion: { en: '200g + 200g', es: '200g + 200g' }, note: { en: 'fast protein + carbs', es: 'proteina rapida + carbos' } },
        { food: { en: '150g lean beef + pasta', es: '150g bife de lomo/cuadrada + fideos' }, proteinG: 42, kcal: 520, portion: { en: '150g + 150g', es: '150g + 150g' }, note: { en: 'iron-rich recovery', es: 'recuperacion rica en hierro' } }
      ],
      D: [
        { food: { en: 'Pea-rice protein shake (40g) + banana', es: 'Batido de proteina arveja-arroz (40g) + banana' }, proteinG: 32, kcal: 260, portion: { en: '40g + 1', es: '40g + 1' }, note: { en: 'add 3g leucine', es: 'agregar 3g leucina' } }
      ]
    },
    lunch: {
      A: [
        { food: { en: 'Oven baked milanesa + salad', es: 'Milanesa de peceto/nalga al horno + ensalada' }, proteinG: 35, kcal: 480, portion: { en: '150g + 200g', es: '150g (1 unidad grande) + 200g' }, note: { en: 'lean & complete', es: 'magra y nutritiva' } },
        { food: { en: 'Chicken supreme + rice', es: 'Suprema de pollo a la plancha + arroz' }, proteinG: 35, kcal: 450, portion: { en: '150g + 150g', es: '150g + 150g' }, note: { en: 'classic', es: 'clasico' } },
        { food: { en: 'Lean beef wok + noodles', es: 'Wok de carne (lomo/entraña) + fideos' }, proteinG: 38, kcal: 520, portion: { en: '150g + 150g', es: '150g + 150g' }, note: { en: 'iron-rich', es: 'rico en hierro' } },
        { food: { en: 'Grilled hake + mixed salad', es: 'Filet de merluza/abadejo a la plancha + ensalada mixta' }, proteinG: 33, kcal: 400, portion: { en: '200g + 200g', es: '200g + 200g' }, note: { en: 'light & fresh', es: 'ligero y fresco' } },
        { food: { en: 'Pork tenderloin + sweet potato', es: 'Carré o solomillo de cerdo + batata al horno' }, proteinG: 35, kcal: 460, portion: { en: '150g + 150g', es: '150g + 150g' }, note: { en: 'lean pork', es: 'cerdo magro' } }
      ],
      D: [
        { food: { en: 'Lentil stew + rice', es: 'Guiso de lentejas + arroz' }, proteinG: 28, kcal: 480, portion: { en: '300g + 150g', es: '300g + 150g' }, note: { en: 'add leucine', es: 'agregar leucina' } }
      ]
    },
    lunchPost: {
      A: [
        { food: { en: 'Oven baked milanesa + mashed potatoes', es: 'Milanesa de peceto/nalga al horno + puré de papas' }, proteinG: 35, kcal: 550, portion: { en: '150g + 250g', es: '1 unidad grande + 250g' }, note: { en: 'recovery carbs', es: 'carbohidratos de recuperacion' } },
        { food: { en: 'Chicken supreme + heavy rice', es: 'Suprema a la plancha + doble porcion de arroz' }, proteinG: 35, kcal: 580, portion: { en: '150g + 250g', es: '150g + 250g' }, note: { en: 'glycogen restore', es: 'restauracion de glucogeno' } },
        { food: { en: 'Lean beef wok + noodles', es: 'Wok de carne magra (lomo/cuadrada) + fideos' }, proteinG: 38, kcal: 600, portion: { en: '150g + 200g', es: '150g + 200g' }, note: { en: 'iron-rich', es: 'alta recuperacion' } }
      ],
      D: [
        { food: { en: 'Lentil stew + heavy rice', es: 'Guiso de lentejas + doble porcion de arroz' }, proteinG: 30, kcal: 620, portion: { en: '300g + 250g', es: '300g + 250g' }, note: { en: 'add leucine', es: 'agregar leucina' } }
      ]
    },
    breakfastPost: {
      A: [
        { food: { en: '4 whole eggs + toast + banana', es: '4 huevos revueltos + 2 tostadas + banana' }, proteinG: 30, kcal: 550, portion: { en: '4 + 2 slices + 1', es: '4 huevos + 2 rebanadas + 1 chica' }, note: { en: 'recovery breakfast', es: 'desayuno de recuperacion' } },
        { food: { en: 'Protein oatmeal (heavy)', es: 'Avena proteica reforzada (60g avena + 1.5 whey)' }, proteinG: 40, kcal: 480, portion: { en: '60g + 45g powder', es: '60g + 45g polvo' }, note: { en: 'glycogen restore', es: 'restaura glucogeno' } }
      ],
      D: [
        { food: { en: 'Pea smoothie + oats', es: 'Licuado proteina vegan + extra avena' }, proteinG: 30, kcal: 500, portion: { en: '40g + 60g oats', es: '40g + 60g avena' }, note: { en: 'add leucine', es: 'agregar leucina' } }
      ]
    },
    dinnerPost: {
      A: [
        { food: { en: 'Lean beef + mashed potatoes', es: 'Bife de lomo / Entraña + puré de papa' }, proteinG: 35, kcal: 580, portion: { en: '150g + 250g', es: '150g bife + 250g puré' }, note: { en: 'recovery dinner', es: 'cena de alta recuperacion' } },
        { food: { en: 'Oven chicken milanesa + rice', es: 'Milanesa de pollo al horno + porcion grande de arroz' }, proteinG: 32, kcal: 550, portion: { en: '150g + 250g', es: '150g + 250g' }, note: { en: 'glycogen restore', es: 'restaura glucogeno' } },
        { food: { en: 'Pork tenderloin + sweet potato mash', es: 'Bondiola magra/Carré al horno + puré de batata' }, proteinG: 32, kcal: 600, portion: { en: '150g + 250g', es: '150g + 250g' }, note: { en: 'muscle building', es: 'crecimiento muscular' } }
      ],
      D: [
        { food: { en: 'Tofu stir-fry + extra rice', es: 'Salteado de tofu + extra arroz' }, proteinG: 25, kcal: 550, portion: { en: '200g + 250g', es: '200g + 250g' }, note: { en: 'add leucine', es: 'agregar leucina' } }
      ]
    },
    afternoon: {
      A: [
        { food: { en: 'Yogurt + whey', es: 'Yogur natural firme + 20g whey' }, proteinG: 30, kcal: 250, portion: { en: '200g + 20g', es: '200g + 20g' }, note: { en: 'quick snack', es: 'merienda rapida' } },
        { food: { en: '2 hard-boiled eggs + nuts', es: '2 huevos duros + puñado de almendras' }, proteinG: 20, kcal: 310, portion: { en: '2 + 30g', es: '2 + 30g' }, note: { en: 'portable', es: 'portatil' } },
        { food: { en: 'Lean cheese + cold cuts', es: 'Porción de queso magro + fetas de jamón cocido' }, proteinG: 22, kcal: 260, portion: { en: '50g + 50g', es: '50g + 50g' }, note: { en: 'cold snack', es: 'picada proteica' } }
      ],
      D: [
        { food: { en: 'Soy protein shake', es: 'Batido proteico vegetal + frutos secos' }, proteinG: 28, kcal: 320, portion: { en: '30g powder + 30g', es: '30g polvo + 30g' }, note: { en: 'add leucine if <2g', es: 'agregar leucina si <2g' } }
      ]
    },
    eveningSnack: {
      A: [
        { food: { en: 'Yogurt + honey', es: 'Yogur + miel' }, proteinG: 20, kcal: 200, portion: { en: '200g + 10g', es: '200g + 10g' }, note: { en: 'light option', es: 'opcion liviana' } },
        { food: { en: 'Protein shake', es: 'Batido de proteina (1 medida)' }, proteinG: 25, kcal: 120, portion: { en: '30g', es: '30g' }, note: { en: 'quick', es: 'rapido' } }
      ],
      D: [
        { food: { en: 'Soy yogurt', es: 'Yogur de soja + semillas' }, proteinG: 16, kcal: 280, portion: { en: '200g + 10g', es: '200g + 10g' }, note: { en: 'add protein powder', es: 'agregar proteina en polvo' } }
      ]
    },
    dinner: {
      A: [
        { food: { en: 'Grilled fish + vegetables', es: 'Filet de pescado (ceba/merluza) a la plancha + vegetales' }, proteinG: 30, kcal: 350, portion: { en: '200g + 250g', es: '200g + 250g' }, note: { en: 'light dinner', es: 'cena liviana' } },
        { food: { en: 'Oven chicken + salad', es: 'Pollo al horno + ensalada mixta' }, proteinG: 28, kcal: 380, portion: { en: '150g muslo/pechuga + 200g', es: '150g muslo/pechuga + 200g' }, note: { en: 'lean & balanced', es: 'jugoso y equilibrado' } },
        { food: { en: 'Lean beef + broccoli + sweet potato', es: 'Bife de cuadril/entraña 150g + brocoli + batata' }, proteinG: 34, kcal: 460, portion: { en: '150g + 150g + 100g', es: '150g + 150g + 100g' }, note: { en: 'iron-rich dinner', es: 'cena rica en hierro' } },
        { food: { en: 'Healthy empanadas/tart', es: '2 Empanadas carne magra al horno / Porcion tarta atun' }, proteinG: 30, kcal: 450, portion: { en: '2 units / 1 slice', es: '2 unidades / 1 porcion' }, note: { en: 'comfort dinner', es: 'cena reconfortante' } },
        { food: { en: 'Pork meat + vegetables', es: 'Pechito de cerdo al horno + vegetales' }, proteinG: 35, kcal: 420, portion: { en: '150g + 250g', es: '150g + 250g' }, note: { en: 'lean pork', es: 'cerdo al horno' } }
      ],
      B: [
        { food: { en: 'Cottage cheese salad', es: 'Ensalada con 200g queso magro/untable + tomate' }, proteinG: 24, kcal: 260, portion: { en: '200g + 100g', es: '200g + 100g' }, note: { en: 'casein pre-sleep transition', es: 'transicion caseina pre-sueno' } }
      ],
      D: [
        { food: { en: 'Lentil stew', es: 'Guiso de lentejas o porotos + verduras' }, proteinG: 24, kcal: 420, portion: { en: '300g', es: '300g' }, note: { en: 'hearty plant dinner', es: 'cena vegetal abundante' } }
      ]
    },
    preSleep: {
      B: [
        { food: { en: 'Lean cheese', es: 'Porcion de queso magro firme o untable' }, proteinG: 20, kcal: 230, portion: { en: '80g firme / 150g untable', es: '80g firme / 150g untable' }, note: { en: '7h slow release', es: 'liberacion lenta de 7h' } },
        { food: { en: 'Casein powder + water', es: '1 medida de caseina en polvo + agua' }, proteinG: 30, kcal: 130, portion: { en: '35g + 300ml', es: '35g + 300ml' }, note: { en: 'micellar casein ideal', es: 'caseina micelar ideal' } },
        { food: { en: 'Yogurt + casein', es: 'Yogur natural + 1 medida caseina' }, proteinG: 38, kcal: 280, portion: { en: '200g + 35g', es: '200g + 35g' }, note: { en: 'maximum overnight MPS', es: 'maxima MPS nocturna' } }
      ],
      A: [
        { food: { en: 'Greek yogurt + berries', es: 'Yogur natural firme + frutos rojos' }, proteinG: 22, kcal: 180, portion: { en: '200g + 50g', es: '200g + 50g' }, note: { en: 'high protein', es: 'alta proteina' } }
      ],
      D: [
        { food: { en: 'Soy protein shake', es: 'Batido de proteina de soja (40g polvo)' }, proteinG: 34, kcal: 170, portion: { en: '40g + 300ml water', es: '40g + 300ml agua' }, note: { en: 'best plant option for sleep', es: 'mejor opcion vegetal para dormir' } }
      ]
    }
  };

  /**
   * "Free meal" examples (no protein target — balanced nutrition)
   * Used for non-protein windows
   */
  const FREE_MEAL_EXAMPLES = {
    breakfast: [
      { food: { en: 'Oatmeal + fruit + honey', es: 'Café o Mate + 2 tostadas de pan integral con queso blanco y mermelada' }, kcal: 320, portion: { en: '60g oats + 100g fruit + 15g', es: 'Taza + 2 tostadas + 30g queso + 15g mermelada' }, note: { en: 'energy-rich start', es: 'desayuno clásico' } },
      { food: { en: 'Toast + avocado + tomato + orange juice', es: 'Tostada + palta + tomate + jugo de naranja' }, kcal: 380, portion: { en: '2 slices + 50g + 1 + 200ml', es: '2 rebanadas + 50g + 1 + 200ml' }, note: { en: 'healthy fats + vitamins', es: 'grasas saludables + vitaminas' } },
      { food: { en: 'Granola + milk + banana', es: 'Yogur con cereales + mate/café' }, kcal: 350, portion: { en: '50g + 200ml + 1', es: '1 yogur + 40g cereal' }, note: { en: 'fiber & energy', es: 'fibra y energia' } }
    ],
    lunch: [
      { food: { en: 'Pasta with tomato sauce', es: 'Fideos / Tallarines con salsa fileto + queso rallado' }, kcal: 500, portion: { en: '120g dry + 100g', es: 'Plato hondo normal (80g secos)' }, note: { en: 'carb-focused lunch', es: 'almuerzo de carbos' } },
      { food: { en: 'Rice + vegetables + avocado', es: 'Arroz primavera o ensalada rusa (papa, zanahoria, arvejas)' }, kcal: 480, portion: { en: '200g + 200g + 50g', es: '200g de preparacion' }, note: { en: 'balanced plant meal', es: 'guarnicion clasica' } },
      { food: { en: 'Vegetable soup + bread', es: 'Tarta de verduras (pascualina/zapallito) + ensalada mixta' }, kcal: 420, portion: { en: '400ml + 2 slices', es: '2 porciones tarta + ensalada' }, note: { en: 'warm & light', es: 'liviano' } }
    ],
    afternoon: [
      { food: { en: 'Fresh fruit + handful of nuts', es: 'Mate o Té + 1 Fruta fresca + puñado de frutos secos' }, kcal: 200, portion: { en: '150g + 20g', es: '1 fruta mediana + 20g nueces' }, note: { en: 'natural energy', es: 'energia natural' } },
      { food: { en: 'Whole wheat toast', es: 'Café chico + 1 medialuna o tostada integral' }, kcal: 250, portion: { en: '1 slice', es: '1 porcion' }, note: { en: 'quick snack', es: 'merienda de pasada' } },
      { food: { en: 'Trail mix', es: 'Mate + galletitas de agua o salvado con queso blanco' }, kcal: 220, portion: { en: '40g total', es: '5-6 galletitas + mate' }, note: { en: 'energy on the go', es: 'merienda arg' } }
    ],
    dinner: [
      { food: { en: 'Vegetable stir-fry + rice', es: 'Vegetales al horno o salteados + arroz' }, kcal: 420, portion: { en: '300g + 200g', es: 'Medio plato vegetales + arroz' }, note: { en: 'light veggie dinner', es: 'cena liviana' } },
      { food: { en: 'Cream soup + croutons', es: 'Sopa casera de verduras + pan' }, kcal: 380, portion: { en: '350ml + 30g', es: '1 plato hondo + 2 miñones' }, note: { en: 'comforting evening meal', es: 'cena de invierno' } },
      { food: { en: 'Pizza with vegetables', es: 'Pizza de muzzarella (2 o 3 porciones)' }, kcal: 500, portion: { en: '2 slices', es: '2 o 3 porciones' }, note: { en: 'balanced treat', es: 'gusto de finde' } }
    ]
  };

  /**
   * Get food suggestions for a protein window
   * Uses day-of-week to rotate options for variety
   */
  function getFoodSuggestions(windowKey, proteinClass, targetGrams, dayIndex) {
    const windowFoods = FOOD_EXAMPLES[windowKey] || FOOD_EXAMPLES.lunch;
    const classFoods = windowFoods[proteinClass] || windowFoods['A'] || [];
    if (!classFoods.length) return [];

    // Use dayIndex to rotate which suggestions appear (for weekly variety)
    const offset = (dayIndex || 0) % classFoods.length;
    const rotated = [...classFoods.slice(offset), ...classFoods.slice(0, offset)];

    // Return up to 2 suggestions, preferring those close to the target grams
    return rotated
      .sort((a, b) => Math.abs(a.proteinG - targetGrams) - Math.abs(b.proteinG - targetGrams))
      .slice(0, 2);
  }

  /**
   * Get free meal suggestions (no protein target)
   */
  function getFreeMealSuggestions(mealType, dayIndex) {
    const meals = FREE_MEAL_EXAMPLES[mealType] || FREE_MEAL_EXAMPLES.lunch;
    const idx = (dayIndex || 0) % meals.length;
    return [meals[idx]];
  }

  const WINDOW_ICONS = {
    breakfast: '🍳',
    brunch: '🍳',
    postWorkout: '💪',
    lunch: '🥗',
    afternoon: '🥤',
    dinner: '🍽️',
    eveningSnack: '🥣',
    preSleep: '🌙',
    preWorkout: '⚡'
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

    let html = `<div class="tl-label-row mono" style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:10px; color:var(--sub)"><span>${i18n('wake')}</span><span>${i18n('sleep')}</span></div>`;
    html += '<div class="timeline-bar">';

    entries.forEach(([key, w]) => {
      const offset = timeToMinutes(w.time) - firstMin;
      const pct = (offset / spanMin) * 100;
      const widthPct = Math.max(100 / entries.length - 1, 12);
      const cls = w.grams > 0 ? (CLASS_COLORS[w.proteinClass] || CLASS_COLORS.A) : { color: '#B0B0B0', bg: 'rgba(176,176,176,0.08)' };

      html += `
        <div class="tl-window" style="
          position:absolute; left:${pct}%; width:${widthPct}%;
          height:100%; top:0;
          background:${cls.bg}; border-left:2px solid ${cls.color};
          display:flex; flex-direction:column; justify-content:center;
          padding:4px 6px; cursor:pointer;
        " data-window="${key}" title="${i18n('wl_' + key) || w.label} — ${w.grams}g ${classLabel(w.proteinClass)}">
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

    const dayIndex = new Date().getDay(); // 0-6 for weekly rotation
    let html = '';

    entries.forEach(([key, w], i) => {
      const cls = CLASS_COLORS[w.proteinClass] || CLASS_COLORS.A;
      const icon = WINDOW_ICONS[key] || '🍽️';
      const windowLabel = i18n('wl_' + key) || w.label;
      const isProteinWindow = w.grams > 0;

      if (isProteinWindow) {
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
                <div class="mono" style="color:${cls.color};margin-bottom:2px">${windowLabel}</div>
                <div style="font-weight:600;font-size:15px">${w.grams}g ${i18n('proteinLabel')}</div>
              </div>
              <div style="text-align:right">
                <div style="font-family:var(--font-display);font-size:28px;color:${cls.color};line-height:1">${w.time}</div>
                <span class="badge" style="background:${cls.bg};color:${cls.color}">${i18n('classLabel')} ${w.proteinClass}</span>
              </div>
            </div>
            <div style="padding:14px 20px; display:flex; flex-wrap:wrap; gap:8px; align-items:center">
              ${leucineStatus}
              <span class="badge" style="background:${cls.bg};color:${cls.color}">${classLabel(w.proteinClass)}</span>
              <span class="badge badge-transition">${Math.round(w.share * 100)}% ${i18n('ofDaily')}</span>
            </div>
            ${w.suggestion ? `<div style="padding:0 20px 14px;font-size:12px;color:var(--amber)">⚠️ ${i18n('addLeucine').replace('{g}', Math.ceil(w.leucineThreshold - w.leucineEstimateG))}</div>` : ''}
            ${renderFoodSuggestions(key, w.proteinClass, w.grams, dayIndex)}
          </div>`;
      } else {
        // Non-protein meal (free meal)
        html += `
          <div class="card animate-up" style="animation-delay:${i * 0.08}s; margin-bottom:12px; border-color:var(--border); opacity:0.85">
            <div style="padding:18px 20px; display:flex; align-items:center; gap:14px; border-bottom:1px solid var(--border)">
              <div style="width:44px;height:44px;border-radius:12px;background:rgba(176,176,176,0.08);
                          display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">
                ${icon}
              </div>
              <div style="flex:1">
                <div class="mono" style="color:var(--sub);margin-bottom:2px">${windowLabel}</div>
                <div style="font-weight:500;font-size:13px;color:var(--muted)">${i18n('freeMealDesc')}</div>
              </div>
              <div style="text-align:right">
                <div style="font-family:var(--font-display);font-size:28px;color:var(--sub);line-height:1">${w.time}</div>
              </div>
            </div>
            ${renderFreeMealSuggestions(key, dayIndex)}
          </div>`;
      }
    });

    container.innerHTML = html;
  }

  /**
   * Build summary stats bar
   */
  function renderSummary(plan, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const t = plan.targets;
    const p = plan.profile;

    // Estimate daily calories from protein (rough: protein * 4 cal + rest)
    const proteinKcal = t.dailyTotalG * 4;
    const estimatedDailyKcal = Math.round(proteinKcal / 0.25); // protein ~25% of total

    const stats = [
      { value: `${t.dailyTotalG}g`, unit: i18n('dailyTarget'), color: 'var(--green)' },
      { value: `${t.proteinPerKg}`, unit: 'g/kg/' + i18n('dayUnit'), color: 'var(--teal)' },
      { value: `~${estimatedDailyKcal}`, unit: i18n('estimatedKcal'), color: 'var(--amber)' },
      { value: `${t.leucinePerMealG}g`, unit: i18n('leucineMinMeal'), color: 'var(--orange)' },
      { value: `${p.weightKg}kg`, unit: i18n('bodyWeightLabel'), color: 'var(--sub)' },
      { value: `${p.lbm}kg`, unit: i18n('leanMass'), color: 'var(--sub)' }
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
   * Render food suggestions HTML for a protein window card
   */
  function renderFoodSuggestions(windowKey, proteinClass, targetGrams, dayIndex) {
    const suggestions = getFoodSuggestions(windowKey, proteinClass, targetGrams, dayIndex);
    if (!suggestions.length) return '';

    let html = `<div style="padding:0 20px 16px">
      <div class="mono" style="font-size:10px;color:var(--muted);margin-bottom:8px">${i18n('foodExamples')}</div>`;

    suggestions.forEach(s => {
      html += `
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px;font-size:12.5px">
          <span style="color:var(--green);flex-shrink:0;margin-top:1px">•</span>
          <span style="color:var(--sub)">
            <strong style="color:var(--text);font-size:13.5px">${tx(s.food)}</strong>
            <div style="margin-top:3px;display:flex;gap:6px;align-items:center;flex-wrap:wrap">
              <span class="badge" style="background:var(--card);border:1px solid var(--border);color:var(--text)">🍱 ${s.proteinG}g ${i18n('proteinLabel')}</span>
              <span class="badge" style="background:var(--card);border:1px solid var(--border);color:var(--amber)">🔥 ${s.kcal} kcal</span>
              ${s.portion ? `<span class="badge" style="background:var(--card);border:1px solid var(--border);color:var(--sub)">⚖️ ${tx(s.portion)}</span>` : ''}
              ${s.note ? `<span style="color:var(--muted);font-style:italic;font-size:11px">— ${tx(s.note)}</span>` : ''}
            </div>
          </span>
        </div>`;
    });

    html += '</div>';
    return html;
  }

  /**
   * Render free meal suggestions (non-protein windows)
   */
  function renderFreeMealSuggestions(windowKey, dayIndex) {
    // Map window keys to meal types
    const mealTypeMap = { breakfast: 'breakfast', brunch: 'breakfast', lunch: 'lunch', afternoon: 'afternoon', dinner: 'dinner', eveningSnack: 'dinner', preSleep: 'dinner' };
    const mealType = mealTypeMap[windowKey] || 'lunch';
    const suggestions = getFreeMealSuggestions(mealType, dayIndex);
    if (!suggestions.length) return '';

    let html = `<div style="padding:0 20px 16px">
      <div class="mono" style="font-size:10px;color:var(--muted);margin-bottom:8px">${i18n('mealSuggestion')}</div>`;

    suggestions.forEach(s => {
      html += `
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px;font-size:12.5px">
          <span style="color:var(--sub);flex-shrink:0;margin-top:1px">•</span>
          <span style="color:var(--sub)">
            <strong style="color:var(--text);font-size:13.5px">${tx(s.food)}</strong>
            <div style="margin-top:3px;display:flex;gap:6px;align-items:center;flex-wrap:wrap">
              <span class="badge" style="background:var(--card);border:1px solid var(--border);color:var(--amber)">🔥 ${s.kcal} kcal</span>
              ${s.portion ? `<span class="badge" style="background:var(--card);border:1px solid var(--border);color:var(--sub)">⚖️ ${tx(s.portion)}</span>` : ''}
              ${s.note ? `<span style="color:var(--muted);font-style:italic;font-size:11px">— ${tx(s.note)}</span>` : ''}
            </div>
          </span>
        </div>`;
    });

    html += '</div>';
    return html;
  }

  /**
   * Render a weekly meal guide (7 days, training + rest)
   */
  function renderWeeklyGuide(plan, containerId, trainingDaysPerWeek) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const daysOfWeek = [
      { en: 'Monday', es: 'Lunes' },
      { en: 'Tuesday', es: 'Martes' },
      { en: 'Wednesday', es: 'Miercoles' },
      { en: 'Thursday', es: 'Jueves' },
      { en: 'Friday', es: 'Viernes' },
      { en: 'Saturday', es: 'Sabado' },
      { en: 'Sunday', es: 'Domingo' }
    ];

    const tDays = trainingDaysPerWeek || 3;
    // Distribute training days (e.g., Mon/Wed/Fri for 3)
    const trainingPattern = [];
    if (tDays >= 6) trainingPattern.push(0, 1, 2, 3, 4, 5);
    else if (tDays >= 5) trainingPattern.push(0, 1, 2, 3, 4);
    else if (tDays >= 4) trainingPattern.push(0, 1, 3, 4);
    else if (tDays >= 3) trainingPattern.push(0, 2, 4);
    else if (tDays >= 2) trainingPattern.push(1, 3);
    else if (tDays >= 1) trainingPattern.push(2);

    const today = new Date().getDay(); // 0=Sun, so adjust to Mon=0
    const todayIdx = today === 0 ? 6 : today - 1;

    // Extract all unique meals possible from both training and rest plans
    const trainingPlan = ChronoCalculator.calculate({ ...plan.profile, isTrainingDay: true });
    const restPlan = ChronoCalculator.calculate({ ...plan.profile, isTrainingDay: false });

    const uniqueWindows = {};
    for (const [k, w] of Object.entries(trainingPlan.windows)) uniqueWindows[k] = w.time;
    for (const [k, w] of Object.entries(restPlan.windows)) uniqueWindows[k] = w.time;

    // Sort them chronologically to determine the columns
    const mealSlots = Object.keys(uniqueWindows)
      .sort((a, b) => timeToMinutes(uniqueWindows[a]) - timeToMinutes(uniqueWindows[b]))
      .map(key => ({ key, icon: WINDOW_ICONS[key] || '🍽️' }));

    let html = `<div style="overflow-x:auto">`;
    html += `<table style="width:100%;border-collapse:collapse;font-size:12px;min-width:800px">`;
    html += `<thead><tr>`;
    html += `<th style="padding:8px 6px;text-align:left;color:var(--muted);font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;border-bottom:1px solid var(--border)">${i18n('dayLabel')}</th>`;
    html += `<th style="padding:8px 6px;text-align:center;color:var(--muted);font-family:var(--font-mono);font-size:10px;border-bottom:1px solid var(--border)">${i18n('typeLabel')}</th>`;

    mealSlots.forEach(m => {
      html += `<th style="padding:8px 6px;text-align:left;color:var(--muted);font-family:var(--font-mono);font-size:10px;border-bottom:1px solid var(--border)">${m.icon} ${i18n('wl_' + m.key) || m.key}</th>`;
    });
    html += `<th style="padding:8px 6px;text-align:right;color:var(--text);font-family:var(--font-mono);font-size:10px;border-bottom:1px solid var(--border)">TOTAL DIARIO</th>`;
    html += `</tr></thead><tbody>`;

    for (let d = 0; d < 7; d++) {
      const isTraining = trainingPattern.includes(d);
      const isToday = d === todayIdx;
      const dayType = isTraining ? 'training' : 'rest';
      const dayPlan = isTraining ? trainingPlan : restPlan;

      let dayKcal = 0;
      let dayProt = 0;

      const rowBg = isToday ? 'background:rgba(0,194,124,0.06)' : '';
      const dayBadge = isTraining
        ? `<span style="font-size:9px;padding:2px 6px;border-radius:100px;background:rgba(79,255,176,0.15);color:var(--green)">${i18n('trainingShort')}</span>`
        : `<span style="font-size:9px;padding:2px 6px;border-radius:100px;background:rgba(123,158,255,0.1);color:var(--teal)">${i18n('restShort')}</span>`;

      html += `<tr style="${rowBg};border-bottom:1px solid var(--border)">`;
      html += `<td style="padding:8px 6px;font-weight:${isToday ? '700' : '400'};color:${isToday ? 'var(--green)' : 'var(--text)'}">${isToday ? '▸ ' : ''}${tx(daysOfWeek[d])}</td>`;
      html += `<td style="padding:8px 6px;text-align:center">${dayBadge}</td>`;

      mealSlots.forEach(m => {
        const w = dayPlan.windows[m.key];

        if (w && w.grams > 0) {
          const meal = getFoodSuggestions(m.key, w.proteinClass, w.grams, d)[0];
          if (meal) {
            dayKcal += meal.kcal || 0;
            dayProt += meal.proteinG || 0;
            html += `<td style="padding:8px 6px;color:var(--sub);font-size:11px">
              <div style="color:var(--text);font-weight:500">${tx(meal.food)}</div>
              <div style="color:var(--muted);font-size:10px">${meal.proteinG}g prot · ${meal.kcal} kcal</div>
            </td>`;
          } else {
            html += `<td style="padding:8px 6px;color:var(--muted);font-size:11px">—</td>`;
          }
        } else if (w && w.share === 0) {
          // Free meal
          const meals = FREE_MEAL_EXAMPLES[m.key] || FREE_MEAL_EXAMPLES.lunch;
          const meal = meals[d % meals.length];

          if (meal) {
            dayKcal += meal.kcal || 0;
            html += `<td style="padding:8px 6px;color:var(--sub);font-size:11px">
                <div style="color:var(--text);font-weight:400;opacity:0.8">${tx(meal.food)}</div>
                <div style="color:var(--muted);font-size:10px">${meal.kcal} kcal</div>
              </td>`;
          } else {
            html += `<td style="padding:8px 6px;color:var(--muted);font-size:11px">—</td>`;
          }
        } else {
          // Meal slot does not exist on this type of day
          html += `<td style="padding:8px 6px;color:var(--muted);font-size:11px;text-align:center">—</td>`;
        }
      });

      html += `<td style="padding:8px 6px;color:var(--sub);font-size:11px;text-align:right">
          <div style="font-weight:600;color:var(--text)">${dayProt}g</div>
          <div style="color:var(--amber);font-size:10px">${dayKcal} kcal</div>
      </td>`;
      html += `</tr>`;
    }

    html += `</tbody></table></div>`;
    container.innerHTML = html;
  }

  return {
    renderTimeline,
    renderWindowCards,
    renderSummary,
    renderWeeklyGuide,
    getFoodSuggestions,
    CLASS_COLORS,
    WINDOW_ICONS
  };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScheduleBuilder;
}
