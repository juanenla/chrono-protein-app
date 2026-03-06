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
        { food: { en: 'Greek yogurt 200g + whey scoop', es: 'Yogur griego 200g + medida de whey' }, proteinG: 32, kcal: 290, portion: { en: '200g + 30g powder', es: '200g + 30g polvo' }, note: { en: 'with berries', es: 'con frutos rojos' } },
        { food: { en: 'Protein oatmeal (40g oats + 1 scoop whey)', es: 'Avena proteica (40g avena + 1 medida whey)' }, proteinG: 28, kcal: 340, portion: { en: '40g + 30g powder', es: '40g + 30g polvo' }, note: { en: 'add banana', es: 'agregar banana' } },
        { food: { en: '2 eggs + 150g cottage cheese on toast', es: '2 huevos + 150g queso cottage en tostada' }, proteinG: 30, kcal: 380, portion: { en: '2 eggs + 150g + 1 slice', es: '2 huevos + 150g + 1 rebanada' }, note: { en: 'balanced breakfast', es: 'desayuno equilibrado' } },
        { food: { en: 'Turkey ham 80g + cheese + whole wheat toast', es: 'Jamon de pavo 80g + queso + tostada integral' }, proteinG: 26, kcal: 350, portion: { en: '80g + 30g + 2 slices', es: '80g + 30g + 2 rebanadas' }, note: { en: 'quick & easy', es: 'rapido y facil' } },
        { food: { en: 'Smoothie: milk + banana + whey + peanut butter', es: 'Licuado: leche + banana + whey + mantequilla de mani' }, proteinG: 34, kcal: 420, portion: { en: '300ml + 1 + 30g + 15g', es: '300ml + 1 + 30g + 15g' }, note: { en: 'high energy', es: 'alta energia' } }
      ],
      B: [
        { food: { en: '250g Greek yogurt + 30g nuts + honey', es: '250g yogur griego + 30g frutos secos + miel' }, proteinG: 28, kcal: 350, portion: { en: '250g + 30g + 10g', es: '250g + 30g + 10g' }, note: { en: 'slow release', es: 'liberacion lenta' } },
        { food: { en: '200g cottage cheese + fruit + granola', es: '200g queso cottage + fruta + granola' }, proteinG: 24, kcal: 310, portion: { en: '200g + 100g + 30g', es: '200g + 100g + 30g' }, note: { en: 'casein-rich', es: 'rico en caseina' } }
      ],
      D: [
        { food: { en: 'Tofu scramble (200g firm tofu) + seeds', es: 'Revuelto de tofu (200g tofu firme) + semillas' }, proteinG: 22, kcal: 280, portion: { en: '200g + 15g', es: '200g + 15g' }, note: { en: 'add leucine powder', es: 'agregar polvo de leucina' } },
        { food: { en: 'Pea protein smoothie + oats + banana', es: 'Licuado de proteina de arveja + avena + banana' }, proteinG: 30, kcal: 380, portion: { en: '40g + 40g + 1', es: '40g + 40g + 1' }, note: { en: 'blend with soy milk', es: 'mezclar con leche de soja' } }
      ]
    },
    brunch: {
      A: [
        { food: { en: '3 eggs + avocado toast + turkey 50g', es: '3 huevos + tostada con palta + pavo 50g' }, proteinG: 30, kcal: 450, portion: { en: '3 + 1 slice + 50g', es: '3 + 1 rebanada + 50g' }, note: { en: 'balanced brunch', es: 'brunch equilibrado' } },
        { food: { en: 'Protein pancakes (oats + egg + whey)', es: 'Panqueques proteicos (avena + huevo + whey)' }, proteinG: 32, kcal: 420, portion: { en: '60g + 2 + 30g', es: '60g + 2 + 30g' }, note: { en: 'with maple syrup', es: 'con jarabe de arce' } }
      ],
      D: [
        { food: { en: 'Tempeh bowl 150g + rice + vegetables', es: 'Bowl de tempeh 150g + arroz + vegetales' }, proteinG: 28, kcal: 420, portion: { en: '150g + 150g + 100g', es: '150g + 150g + 100g' }, note: { en: 'add leucine', es: 'agregar leucina' } }
      ]
    },
    postWorkout: {
      A: [
        { food: { en: '1 scoop whey (30g) + banana', es: '1 medida de whey (30g) + banana' }, proteinG: 25, kcal: 220, portion: { en: '30g + 1 medium', es: '30g + 1 mediana' }, note: { en: 'take within 60 min', es: 'tomar dentro de 60 min' } },
        { food: { en: '150g chicken breast + rice (200g cooked)', es: '150g pechuga de pollo + arroz (200g cocido)' }, proteinG: 35, kcal: 480, portion: { en: '150g + 200g', es: '150g + 200g' }, note: { en: 'complete post-workout meal', es: 'comida post-entreno completa' } },
        { food: { en: '200g canned tuna + sweet potato', es: '200g atun en lata + batata' }, proteinG: 40, kcal: 420, portion: { en: '200g + 200g', es: '200g + 200g' }, note: { en: 'fast protein + complex carbs', es: 'proteina rapida + carbos complejos' } },
        { food: { en: '150g salmon + quinoa (150g cooked)', es: '150g salmon + quinoa (150g cocida)' }, proteinG: 35, kcal: 460, portion: { en: '150g + 150g', es: '150g + 150g' }, note: { en: 'omega-3 bonus', es: 'bonus de omega-3' } },
        { food: { en: '200g lean beef + pasta (150g cooked)', es: '200g carne magra + pasta (150g cocida)' }, proteinG: 42, kcal: 520, portion: { en: '200g + 150g', es: '200g + 150g' }, note: { en: 'iron-rich recovery', es: 'recuperacion rica en hierro' } }
      ],
      D: [
        { food: { en: 'Pea-rice protein shake (40g) + banana', es: 'Batido de proteina arveja-arroz (40g) + banana' }, proteinG: 32, kcal: 260, portion: { en: '40g + 1', es: '40g + 1' }, note: { en: 'add 3g leucine', es: 'agregar 3g leucina' } },
        { food: { en: 'Lentil bowl 250g + rice + tofu 100g', es: 'Bowl de lentejas 250g + arroz + tofu 100g' }, proteinG: 30, kcal: 450, portion: { en: '250g + 150g + 100g', es: '250g + 150g + 100g' }, note: { en: 'complete aminos', es: 'aminoacidos completos' } }
      ]
    },
    lunch: {
      A: [
        { food: { en: '150g chicken breast + salad + rice', es: '150g pechuga de pollo + ensalada + arroz' }, proteinG: 35, kcal: 480, portion: { en: '150g + 150g + 150g', es: '150g + 150g + 150g' }, note: { en: 'lean & complete', es: 'magra y completa' } },
        { food: { en: '150g salmon + roasted vegetables + potato', es: '150g salmon + vegetales asados + papa' }, proteinG: 32, kcal: 450, portion: { en: '150g + 200g + 150g', es: '150g + 200g + 150g' }, note: { en: 'omega-3 rich', es: 'rico en omega-3' } },
        { food: { en: '200g lean beef stir-fry + noodles', es: '200g salteado de carne magra + fideos' }, proteinG: 38, kcal: 520, portion: { en: '200g + 150g', es: '200g + 150g' }, note: { en: 'iron-rich', es: 'rico en hierro' } },
        { food: { en: '150g grilled fish + mixed salad + bread', es: '150g pescado a la plancha + ensalada mixta + pan' }, proteinG: 33, kcal: 400, portion: { en: '150g + 200g + 1 slice', es: '150g + 200g + 1 rebanada' }, note: { en: 'light & fresh', es: 'ligero y fresco' } },
        { food: { en: 'Turkey burger + whole wheat bun + salad', es: 'Hamburguesa de pavo + pan integral + ensalada' }, proteinG: 30, kcal: 440, portion: { en: '150g patty + bun + 100g', es: 'medallón 150g + pan + 100g' }, note: { en: 'meal prep friendly', es: 'facil de preparar' } },
        { food: { en: '2 eggs + 100g ham + avocado + toast', es: '2 huevos + 100g jamon + palta + tostada' }, proteinG: 32, kcal: 480, portion: { en: '2 + 100g + 50g + 2 slices', es: '2 + 100g + 50g + 2 rebanadas' }, note: { en: 'protein-packed lunch', es: 'almuerzo cargado de proteina' } }
      ],
      D: [
        { food: { en: 'Chickpea curry 300g + rice + tofu 100g', es: 'Curry de garbanzos 300g + arroz + tofu 100g' }, proteinG: 28, kcal: 480, portion: { en: '300g + 150g + 100g', es: '300g + 150g + 100g' }, note: { en: 'add leucine', es: 'agregar leucina' } },
        { food: { en: 'Black bean bowl + tempeh 100g + quinoa', es: 'Bowl de porotos negros + tempeh 100g + quinoa' }, proteinG: 30, kcal: 460, portion: { en: '200g + 100g + 150g', es: '200g + 100g + 150g' }, note: { en: 'complete aminos', es: 'aminoacidos completos' } }
      ]
    },
    afternoon: {
      A: [
        { food: { en: '200g Greek yogurt + 20g whey', es: '200g yogur griego + 20g whey' }, proteinG: 30, kcal: 250, portion: { en: '200g + 20g', es: '200g + 20g' }, note: { en: 'quick snack', es: 'merienda rapida' } },
        { food: { en: '2 hard-boiled eggs + 30g almonds', es: '2 huevos duros + 30g almendras' }, proteinG: 20, kcal: 310, portion: { en: '2 + 30g', es: '2 + 30g' }, note: { en: 'portable', es: 'portatil' } },
        { food: { en: 'Protein bar (20g+ protein)', es: 'Barra de proteina (20g+ proteina)' }, proteinG: 22, kcal: 220, portion: { en: '1 bar (60g)', es: '1 barra (60g)' }, note: { en: 'convenience option', es: 'opcion practica' } },
        { food: { en: 'Tuna can (120g) + whole wheat crackers', es: 'Lata de atun (120g) + galletitas integrales' }, proteinG: 28, kcal: 280, portion: { en: '120g + 30g', es: '120g + 30g' }, note: { en: 'no prep needed', es: 'sin preparacion' } },
        { food: { en: 'Cottage cheese 150g + apple + walnuts', es: 'Queso cottage 150g + manzana + nueces' }, proteinG: 20, kcal: 280, portion: { en: '150g + 1 + 20g', es: '150g + 1 + 20g' }, note: { en: 'satisfying snack', es: 'merienda saciante' } },
        { food: { en: 'Turkey slices 80g + cheese + crackers', es: 'Fetas de pavo 80g + queso + galletitas' }, proteinG: 22, kcal: 260, portion: { en: '80g + 30g + 30g', es: '80g + 30g + 30g' }, note: { en: 'cold snack', es: 'merienda fria' } }
      ],
      D: [
        { food: { en: 'Edamame 200g + hummus + carrots', es: 'Edamame 200g + hummus + zanahorias' }, proteinG: 22, kcal: 300, portion: { en: '200g + 60g + 100g', es: '200g + 60g + 100g' }, note: { en: 'plant snack', es: 'merienda vegetal' } },
        { food: { en: 'Soy protein shake + handful nuts', es: 'Batido de proteina de soja + puñado de frutos secos' }, proteinG: 28, kcal: 320, portion: { en: '30g powder + 30g', es: '30g polvo + 30g' }, note: { en: 'add leucine if <2g', es: 'agregar leucina si <2g' } }
      ]
    },
    eveningSnack: {
      A: [
        { food: { en: '200g Greek yogurt + honey', es: '200g yogur griego + miel' }, proteinG: 20, kcal: 200, portion: { en: '200g + 10g', es: '200g + 10g' }, note: { en: 'light option', es: 'opcion liviana' } },
        { food: { en: 'Protein shake (1 scoop) + fruit', es: 'Batido de proteina (1 medida) + fruta' }, proteinG: 25, kcal: 200, portion: { en: '30g + 100g', es: '30g + 100g' }, note: { en: 'quick', es: 'rapido' } }
      ],
      D: [
        { food: { en: 'Soy yogurt 200g + granola + seeds', es: 'Yogur de soja 200g + granola + semillas' }, proteinG: 16, kcal: 280, portion: { en: '200g + 30g + 10g', es: '200g + 30g + 10g' }, note: { en: 'add protein powder', es: 'agregar proteina en polvo' } }
      ]
    },
    dinner: {
      A: [
        { food: { en: '150g grilled fish + steamed vegetables', es: '150g pescado a la plancha + vegetales al vapor' }, proteinG: 30, kcal: 350, portion: { en: '150g + 250g', es: '150g + 250g' }, note: { en: 'light dinner', es: 'cena liviana' } },
        { food: { en: '120g chicken + mixed salad + olive oil', es: '120g pollo + ensalada mixta + aceite de oliva' }, proteinG: 28, kcal: 380, portion: { en: '120g + 200g + 10ml', es: '120g + 200g + 10ml' }, note: { en: 'lean & balanced', es: 'magra y equilibrada' } },
        { food: { en: 'Salmon 150g + baked sweet potato + broccoli', es: 'Salmon 150g + batata al horno + brocoli' }, proteinG: 32, kcal: 430, portion: { en: '150g + 200g + 150g', es: '150g + 200g + 150g' }, note: { en: 'omega-3 + fiber', es: 'omega-3 + fibra' } },
        { food: { en: 'Lean beef 150g + grilled zucchini + rice', es: 'Carne magra 150g + zapallitos grillados + arroz' }, proteinG: 34, kcal: 460, portion: { en: '150g + 200g + 100g', es: '150g + 200g + 100g' }, note: { en: 'iron-rich dinner', es: 'cena rica en hierro' } },
        { food: { en: 'Shrimp 200g + stir-fry vegetables + noodles', es: 'Camarones 200g + vegetales salteados + fideos' }, proteinG: 36, kcal: 400, portion: { en: '200g + 200g + 100g', es: '200g + 200g + 100g' }, note: { en: 'Asian-style', es: 'estilo asiatico' } },
        { food: { en: 'Turkey meatballs 150g + tomato sauce + pasta', es: 'Albondigas de pavo 150g + salsa de tomate + pasta' }, proteinG: 30, kcal: 450, portion: { en: '150g + 100g + 120g', es: '150g + 100g + 120g' }, note: { en: 'comfort dinner', es: 'cena reconfortante' } }
      ],
      B: [
        { food: { en: '200g cottage cheese + tomato + seeds', es: '200g queso cottage + tomate + semillas' }, proteinG: 24, kcal: 260, portion: { en: '200g + 100g + 15g', es: '200g + 100g + 15g' }, note: { en: 'casein pre-sleep transition', es: 'transicion caseina pre-sueno' } },
        { food: { en: '150g fish + 100g Greek yogurt dessert', es: '150g pescado + 100g postre de yogur griego' }, proteinG: 30, kcal: 340, portion: { en: '150g + 100g', es: '150g + 100g' }, note: { en: 'slow + fast combo', es: 'combo lenta + rapida' } }
      ],
      D: [
        { food: { en: 'Tofu stir-fry 200g + vegetables + rice', es: 'Salteado de tofu 200g + vegetales + arroz' }, proteinG: 22, kcal: 380, portion: { en: '200g + 200g + 150g', es: '200g + 200g + 150g' }, note: { en: 'add leucine', es: 'agregar leucina' } },
        { food: { en: 'Lentil stew 300g + whole wheat bread', es: 'Guiso de lentejas 300g + pan integral' }, proteinG: 24, kcal: 420, portion: { en: '300g + 2 slices', es: '300g + 2 rebanadas' }, note: { en: 'hearty plant dinner', es: 'cena vegetal abundante' } }
      ]
    },
    preSleep: {
      B: [
        { food: { en: '250g cottage cheese', es: '250g queso cottage' }, proteinG: 28, kcal: 230, portion: { en: '250g', es: '250g' }, note: { en: '7h slow release', es: 'liberacion lenta de 7h' } },
        { food: { en: '1 scoop casein powder + water', es: '1 medida de caseina en polvo + agua' }, proteinG: 30, kcal: 130, portion: { en: '35g + 300ml', es: '35g + 300ml' }, note: { en: 'micellar casein ideal', es: 'caseina micelar ideal' } },
        { food: { en: '200g Greek yogurt + 1 scoop casein', es: '200g yogur griego + 1 medida caseina' }, proteinG: 38, kcal: 280, portion: { en: '200g + 35g', es: '200g + 35g' }, note: { en: 'maximum overnight MPS', es: 'maxima MPS nocturna' } },
        { food: { en: '300g quark + cinnamon', es: '300g quark + canela' }, proteinG: 35, kcal: 240, portion: { en: '300g + pinch', es: '300g + pizca' }, note: { en: 'thick & satisfying', es: 'espeso y saciante' } }
      ],
      A: [
        { food: { en: '200g skyr + berries', es: '200g skyr + frutos rojos' }, proteinG: 22, kcal: 180, portion: { en: '200g + 50g', es: '200g + 50g' }, note: { en: 'Icelandic dairy, high protein', es: 'lacteo islandes, alta proteina' } }
      ],
      D: [
        { food: { en: 'Soy protein shake (40g powder)', es: 'Batido de proteina de soja (40g polvo)' }, proteinG: 34, kcal: 170, portion: { en: '40g + 300ml water', es: '40g + 300ml agua' }, note: { en: 'best plant option for sleep', es: 'mejor opcion vegetal para dormir' } },
        { food: { en: 'Pea casein-style shake + soy milk', es: 'Batido estilo caseina de arveja + leche de soja' }, proteinG: 30, kcal: 210, portion: { en: '35g + 300ml', es: '35g + 300ml' }, note: { en: 'slower plant combo', es: 'combo vegetal mas lento' } }
      ]
    }
  };

  /**
   * "Free meal" examples (no protein target — balanced nutrition)
   * Used for non-protein windows
   */
  const FREE_MEAL_EXAMPLES = {
    breakfast: [
      { food: { en: 'Oatmeal + fruit + honey', es: 'Avena + fruta + miel' }, kcal: 320, portion: { en: '60g oats + 100g fruit + 15g', es: '60g avena + 100g fruta + 15g' }, note: { en: 'energy-rich start', es: 'inicio cargado de energia' } },
      { food: { en: 'Toast + avocado + tomato + orange juice', es: 'Tostada + palta + tomate + jugo de naranja' }, kcal: 380, portion: { en: '2 slices + 50g + 1 + 200ml', es: '2 rebanadas + 50g + 1 + 200ml' }, note: { en: 'healthy fats + vitamins', es: 'grasas saludables + vitaminas' } },
      { food: { en: 'Granola + milk + banana', es: 'Granola + leche + banana' }, kcal: 350, portion: { en: '50g + 200ml + 1', es: '50g + 200ml + 1' }, note: { en: 'fiber & energy', es: 'fibra y energia' } }
    ],
    lunch: [
      { food: { en: 'Pasta with tomato sauce + olive oil + salad', es: 'Pasta con salsa de tomate + aceite de oliva + ensalada' }, kcal: 500, portion: { en: '120g dry + 100g + 10ml + 150g', es: '120g secos + 100g + 10ml + 150g' }, note: { en: 'carb-focused lunch', es: 'almuerzo basado en carbos' } },
      { food: { en: 'Rice + vegetables + avocado + seeds', es: 'Arroz + vegetales + palta + semillas' }, kcal: 480, portion: { en: '200g + 200g + 50g + 15g', es: '200g + 200g + 50g + 15g' }, note: { en: 'balanced plant meal', es: 'comida vegetal equilibrada' } },
      { food: { en: 'Vegetable soup + bread + cheese', es: 'Sopa de verduras + pan + queso' }, kcal: 420, portion: { en: '400ml + 2 slices + 30g', es: '400ml + 2 rebanadas + 30g' }, note: { en: 'warm & light', es: 'calida y liviana' } }
    ],
    afternoon: [
      { food: { en: 'Fresh fruit + handful of nuts', es: 'Fruta fresca + puñado de frutos secos' }, kcal: 200, portion: { en: '150g + 20g', es: '150g + 20g' }, note: { en: 'natural energy', es: 'energia natural' } },
      { food: { en: 'Whole wheat toast + peanut butter + jam', es: 'Tostada integral + mantequilla de mani + mermelada' }, kcal: 250, portion: { en: '1 slice + 15g + 10g', es: '1 rebanada + 15g + 10g' }, note: { en: 'quick snack', es: 'merienda rapida' } },
      { food: { en: 'Trail mix (nuts + dried fruit + dark chocolate)', es: 'Mix de frutos secos + frutas deshidratadas + chocolate negro' }, kcal: 220, portion: { en: '40g total', es: '40g total' }, note: { en: 'energy on the go', es: 'energia portatil' } }
    ],
    dinner: [
      { food: { en: 'Vegetable stir-fry + rice + soy sauce', es: 'Vegetales salteados + arroz + salsa de soja' }, kcal: 420, portion: { en: '300g + 200g + 10ml', es: '300g + 200g + 10ml' }, note: { en: 'light veggie dinner', es: 'cena de vegetales liviana' } },
      { food: { en: 'Cream soup + croutons + side salad', es: 'Sopa crema + crutones + ensalada' }, kcal: 380, portion: { en: '350ml + 30g + 100g', es: '350ml + 30g + 100g' }, note: { en: 'comforting evening meal', es: 'cena reconfortante' } },
      { food: { en: 'Pizza with vegetables + side salad', es: 'Pizza con vegetales + ensalada' }, kcal: 500, portion: { en: '2 slices + 100g', es: '2 porciones + 100g' }, note: { en: 'balanced treat', es: 'gusto equilibrado' } }
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

    let html = `<div class="tl-label-row mono"><span>${i18n('wake')}</span><span>${i18n('sleep')}</span></div>`;
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

    // Main meals to show: breakfast, lunch, afternoon (merienda), dinner
    const mealSlots = [
      { key: 'breakfast', icon: '🍳' },
      { key: 'lunch', icon: '🥗' },
      { key: 'afternoon', icon: '🥤' },
      { key: 'dinner', icon: '🍽️' }
    ];

    let html = `<div style="overflow-x:auto">`;
    html += `<table style="width:100%;border-collapse:collapse;font-size:12px">`;
    html += `<thead><tr>`;
    html += `<th style="padding:8px 6px;text-align:left;color:var(--muted);font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;border-bottom:1px solid var(--border)">${i18n('dayLabel')}</th>`;
    html += `<th style="padding:8px 6px;text-align:center;color:var(--muted);font-family:var(--font-mono);font-size:10px;border-bottom:1px solid var(--border)">${i18n('typeLabel')}</th>`;

    mealSlots.forEach(m => {
      html += `<th style="padding:8px 6px;text-align:left;color:var(--muted);font-family:var(--font-mono);font-size:10px;border-bottom:1px solid var(--border)">${m.icon} ${i18n('wl_' + m.key)}</th>`;
    });
    html += `</tr></thead><tbody>`;

    for (let d = 0; d < 7; d++) {
      const isTraining = trainingPattern.includes(d);
      const isToday = d === todayIdx;
      const dayType = isTraining ? 'training' : 'rest';
      const rowBg = isToday ? 'background:rgba(0,194,124,0.06)' : '';
      const dayBadge = isTraining
        ? `<span style="font-size:9px;padding:2px 6px;border-radius:100px;background:rgba(79,255,176,0.15);color:var(--green)">${i18n('trainingShort')}</span>`
        : `<span style="font-size:9px;padding:2px 6px;border-radius:100px;background:rgba(123,158,255,0.1);color:var(--teal)">${i18n('restShort')}</span>`;

      html += `<tr style="${rowBg};border-bottom:1px solid var(--border)">`;
      html += `<td style="padding:8px 6px;font-weight:${isToday ? '700' : '400'};color:${isToday ? 'var(--green)' : 'var(--text)'}">${isToday ? '▸ ' : ''}${tx(daysOfWeek[d])}</td>`;
      html += `<td style="padding:8px 6px;text-align:center">${dayBadge}</td>`;

      mealSlots.forEach(m => {
        // Get protein window for this meal if it exists
        const profileCopy = { ...plan.profile, isTrainingDay: isTraining };
        const dayPlan = ChronoCalculator.calculate(profileCopy);
        const w = dayPlan.windows[m.key];

        if (w && w.grams > 0) {
          const suggestions = getFoodSuggestions(m.key, w.proteinClass, w.grams, d);
          const meal = suggestions[0];
          if (meal) {
            html += `<td style="padding:8px 6px;color:var(--sub);font-size:11px">
              <div style="color:var(--text);font-weight:500">${tx(meal.food)}</div>
              <div style="color:var(--muted);font-size:10px">${meal.proteinG}g prot · ${meal.kcal} kcal</div>
            </td>`;
          } else {
            html += `<td style="padding:8px 6px;color:var(--muted);font-size:11px">—</td>`;
          }
        } else {
          // Free meal
          const freeMeals = FREE_MEAL_EXAMPLES[m.key] || FREE_MEAL_EXAMPLES.lunch;
          const meal = freeMeals[d % freeMeals.length];
          html += `<td style="padding:8px 6px;color:var(--sub);font-size:11px">
            <div style="color:var(--text);font-weight:400">${tx(meal.food)}</div>
            <div style="color:var(--muted);font-size:10px">${meal.kcal} kcal</div>
          </td>`;
        }
      });

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
