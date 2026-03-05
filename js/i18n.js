/**
 * INTERNATIONALIZATION MODULE
 * Supports English (en) and Spanish (es)
 */

const I18n = (() => {

  const TRANSLATIONS = {
    en: {
      // ── Landing ──
      heroEyebrow: 'Chrono-Nutrition Science',
      heroSub: 'Your body has an internal clock that controls when protein becomes muscle. Stop guessing. Start timing. Get a personalized plan based on your chronotype, training schedule, and the latest science.',
      buildProtocol: 'Build My Protocol',
      seeScience: 'See the Science',
      featureChronotype: 'Chronotype-Personalized',
      featureChronotypeDesc: 'Morning bird or night owl? Your circadian rhythm shifts every protein window. We calculate the optimal schedule for YOUR biology.',
      featureLeucine: 'Leucine Threshold Check',
      featureLeucineDesc: 'Every meal shows whether you\'ve hit the 2-3g leucine minimum to activate mTORC1 — the master switch for muscle protein synthesis.',
      featureSleep: 'Sleep Recovery Protocol',
      featureSleepDesc: 'Pre-sleep protein raises overnight muscle synthesis by +22%. We tell you exactly what type, how much, and when — based on YOUR bedtime.',
      featureCatabolic: 'Catabolic/Anabolic Windows',
      featureCatabolicDesc: 'See the exact metabolic cascade from final rep to full recovery. Know when your body is destroying muscle vs. building it.',
      featurePlant: 'Plant-Based Ready',
      featurePlantDesc: 'Vegan or vegetarian? We map complementary protein combinations and auto-flag when leucine fortification is needed.',
      featureClasses: '5 Protein Classes',
      featureClassesDesc: 'Not all protein is equal. We classify into Fast (whey), Slow (casein), Plant, Leucine-boosted, and Structural (collagen).',
      evidenceFooter: 'Evidence-informed, not guesswork. Built on 113 scientific references (2006-2026). Updated March 2026.',
      disclaimer: 'ChronoProtein is a science education platform. Consult a healthcare professional before making dietary changes.',

      // ── Onboarding ──
      buildYourProtocol: 'BUILD YOUR PROTOCOL',
      stepsDescription: '5 steps to your personalized protein schedule',
      yourBody: 'YOUR BODY',
      bodyDesc: 'We need a few numbers to calculate your targets',
      bodyWeight: 'Body weight (kg)',
      age: 'Age',
      sex: 'Sex',
      male: 'Male',
      female: 'Female',
      bodyFat: 'Body fat % (optional — leave blank if unknown)',
      back: 'Back',
      next: 'Next',
      yourChronotype: 'YOUR CHRONOTYPE',
      chronoDesc: '3 questions to determine your circadian profile',
      yourGoal: 'YOUR GOAL',
      goalDesc: 'This determines your daily protein target range',
      wellness: 'Wellness',
      maintenance: 'Maintenance',
      muscleGain: 'Muscle Gain',
      recomposition: 'Recomposition',
      endurance: 'Endurance',
      seniorHealth: 'Healthy Aging',
      activityDiet: 'ACTIVITY & DIET',
      activityDietDesc: 'How active are you and what do you eat?',
      activityLevel: 'Activity level',
      sedentary: 'Sedentary (desk job, no exercise)',
      light: 'Light (walks, casual activity)',
      moderate: 'Moderate (3x/week training)',
      active: 'Active (5x/week serious training)',
      veryActive: 'Very Active (daily intense training)',
      dietType: 'Diet type',
      omnivore: 'Omnivore',
      vegetarian: 'Vegetarian',
      vegan: 'Vegan',
      trainingDays: 'Training days per week',
      trainingTime: 'Usual training time',
      yourProfile: 'YOUR PROFILE',
      profileDesc: 'Review and generate your personalized protocol',
      generateProtocol: 'Generate My Protocol',
      weight: 'Weight',
      chronotype: 'Chronotype',
      goal: 'Goal',
      activity: 'Activity',
      diet: 'Diet',
      dailyProteinTarget: 'Daily Protein Target',
      proteinPerKg: 'Protein per kg',
      mealsPerDay: 'Meals per day',
      leucineThresholdMeal: 'Leucine threshold/meal',

      // ── Dashboard ──
      myPlan: 'MY PLAN',
      trainingDay: 'Training Day',
      restDay: 'Rest Day',
      editProfile: 'Edit Profile',
      dailyTargets: 'DAILY TARGETS',
      dailyTargetsDesc: 'Your personalized numbers based on your profile',
      timeline24h: '24H TIMELINE',
      timelineDesc: 'Your protein windows across the day',
      proteinWindows: 'PROTEIN WINDOWS',
      windowsDesc: 'Tap any window for food suggestions and leucine check',
      noProtocol: 'NO PROTOCOL YET',
      noProtocolDesc: 'Complete the onboarding to generate your personalized protein schedule.',
      dailyTarget: 'Daily Target',
      proteinMeals: 'Protein Meals',
      leucineMinMeal: 'Leucine/meal min',
      bodyWeightLabel: 'Body Weight',
      leanMass: 'Lean Mass (est.)',
      leucineOk: 'Leucine OK',
      leucineLow: 'Leucine LOW',
      needed: 'needed',
      ofDaily: 'of daily',
      foodExamples: 'FOOD EXAMPLES',
      wake: 'Wake',
      sleep: 'Sleep',

      // ── Chronotype quiz ──
      q1: 'What time do you naturally wake up without an alarm on a free day?',
      q1o1: 'Before 06:00', q1o2: '06:00 - 07:00', q1o3: '07:00 - 08:30', q1o4: '08:30 - 10:00', q1o5: 'After 10:00',
      q2: 'When do you feel most mentally sharp and productive?',
      q2o1: '06:00 - 09:00', q2o2: '09:00 - 11:00', q2o3: '11:00 - 14:00', q2o4: '14:00 - 17:00', q2o5: 'After 17:00',
      q3: 'If you could choose freely, when would you prefer to exercise?',
      q3o1: '06:00 - 08:00', q3o2: '08:00 - 10:00', q3o3: '10:00 - 14:00', q3o4: '14:00 - 18:00', q3o5: 'After 18:00',

      // ── Chronotype labels ──
      morningType: 'Morning Type',
      intermediateType: 'Intermediate Type',
      eveningType: 'Evening Type'
    },

    es: {
      // ── Landing ──
      heroEyebrow: 'Ciencia de la Crono-Nutricion',
      heroSub: 'Tu cuerpo tiene un reloj interno que controla cuando la proteina se convierte en musculo. Deja de adivinar. Empieza a sincronizar. Obtene un plan personalizado basado en tu cronotipo, horario de entrenamiento y la ciencia mas reciente.',
      buildProtocol: 'Crear Mi Protocolo',
      seeScience: 'Ver la Ciencia',
      featureChronotype: 'Personalizado por Cronotipo',
      featureChronotypeDesc: 'Alondra matutina o buho nocturno? Tu ritmo circadiano mueve cada ventana de proteina. Calculamos el horario optimo para TU biologia.',
      featureLeucine: 'Control de Umbral de Leucina',
      featureLeucineDesc: 'Cada comida muestra si llegaste al minimo de 2-3g de leucina para activar mTORC1 — el interruptor maestro de la sintesis de proteina muscular.',
      featureSleep: 'Protocolo de Recuperacion Nocturna',
      featureSleepDesc: 'La proteina pre-sueno aumenta la sintesis muscular nocturna en +22%. Te decimos exactamente que tipo, cuanto y cuando — segun TU hora de dormir.',
      featureCatabolic: 'Ventanas Catabolica/Anabolica',
      featureCatabolicDesc: 'Ve la cascada metabolica exacta desde la ultima repeticion hasta la recuperacion completa. Sabe cuando tu cuerpo destruye musculo vs. lo construye.',
      featurePlant: 'Listo para Plant-Based',
      featurePlantDesc: 'Vegano o vegetariano? Mapeamos combinaciones complementarias de proteinas y senalamos cuando se necesita fortificacion con leucina.',
      featureClasses: '5 Clases de Proteina',
      featureClassesDesc: 'No toda la proteina es igual. Clasificamos en Rapida (whey), Lenta (caseina), Vegetal, Potenciada con Leucina, y Estructural (colageno).',
      evidenceFooter: 'Basado en evidencia, no en suposiciones. Construido con 113 referencias cientificas (2006-2026). Actualizado marzo 2026.',
      disclaimer: 'ChronoProtein es una plataforma de educacion cientifica. Consulta a un profesional de salud antes de hacer cambios dieteticos.',

      // ── Onboarding ──
      buildYourProtocol: 'CREA TU PROTOCOLO',
      stepsDescription: '5 pasos para tu plan personalizado de proteinas',
      yourBody: 'TU CUERPO',
      bodyDesc: 'Necesitamos algunos numeros para calcular tus objetivos',
      bodyWeight: 'Peso corporal (kg)',
      age: 'Edad',
      sex: 'Sexo',
      male: 'Masculino',
      female: 'Femenino',
      bodyFat: '% de grasa corporal (opcional — deja en blanco si no sabes)',
      back: 'Atras',
      next: 'Siguiente',
      yourChronotype: 'TU CRONOTIPO',
      chronoDesc: '3 preguntas para determinar tu perfil circadiano',
      yourGoal: 'TU OBJETIVO',
      goalDesc: 'Esto determina tu rango objetivo de proteina diaria',
      wellness: 'Bienestar',
      maintenance: 'Mantenimiento',
      muscleGain: 'Ganar Musculo',
      recomposition: 'Recomposicion',
      endurance: 'Resistencia',
      seniorHealth: 'Envejecimiento Saludable',
      activityDiet: 'ACTIVIDAD Y DIETA',
      activityDietDesc: 'Que tan activo sos y que comes?',
      activityLevel: 'Nivel de actividad',
      sedentary: 'Sedentario (trabajo de escritorio, sin ejercicio)',
      light: 'Ligero (caminatas, actividad casual)',
      moderate: 'Moderado (3x/semana entrenamiento)',
      active: 'Activo (5x/semana entrenamiento serio)',
      veryActive: 'Muy Activo (entrenamiento intenso diario)',
      dietType: 'Tipo de dieta',
      omnivore: 'Omnivoro',
      vegetarian: 'Vegetariano',
      vegan: 'Vegano',
      trainingDays: 'Dias de entrenamiento por semana',
      trainingTime: 'Hora habitual de entrenamiento',
      yourProfile: 'TU PERFIL',
      profileDesc: 'Revisa y genera tu protocolo personalizado',
      generateProtocol: 'Generar Mi Protocolo',
      weight: 'Peso',
      chronotype: 'Cronotipo',
      goal: 'Objetivo',
      activity: 'Actividad',
      diet: 'Dieta',
      dailyProteinTarget: 'Objetivo Diario de Proteina',
      proteinPerKg: 'Proteina por kg',
      mealsPerDay: 'Comidas por dia',
      leucineThresholdMeal: 'Umbral leucina/comida',

      // ── Dashboard ──
      myPlan: 'MI PLAN',
      trainingDay: 'Dia de Entrenamiento',
      restDay: 'Dia de Descanso',
      editProfile: 'Editar Perfil',
      dailyTargets: 'OBJETIVOS DIARIOS',
      dailyTargetsDesc: 'Tus numeros personalizados segun tu perfil',
      timeline24h: 'LINEA DE TIEMPO 24H',
      timelineDesc: 'Tus ventanas de proteina a lo largo del dia',
      proteinWindows: 'VENTANAS DE PROTEINA',
      windowsDesc: 'Toca cualquier ventana para ver sugerencias de alimentos',
      noProtocol: 'AUN SIN PROTOCOLO',
      noProtocolDesc: 'Completa el onboarding para generar tu plan personalizado de proteinas.',
      dailyTarget: 'Objetivo Diario',
      proteinMeals: 'Comidas Proteicas',
      leucineMinMeal: 'Leucina/comida min',
      bodyWeightLabel: 'Peso Corporal',
      leanMass: 'Masa Magra (est.)',
      leucineOk: 'Leucina OK',
      leucineLow: 'Leucina BAJA',
      needed: 'necesario',
      ofDaily: 'del diario',
      foodExamples: 'EJEMPLOS DE COMIDA',
      wake: 'Despertar',
      sleep: 'Dormir',

      // ── Chronotype quiz ──
      q1: 'A que hora te despertas naturalmente sin alarma en un dia libre?',
      q1o1: 'Antes de las 06:00', q1o2: '06:00 - 07:00', q1o3: '07:00 - 08:30', q1o4: '08:30 - 10:00', q1o5: 'Despues de las 10:00',
      q2: 'Cuando te sentis mas alerta y productivo mentalmente?',
      q2o1: '06:00 - 09:00', q2o2: '09:00 - 11:00', q2o3: '11:00 - 14:00', q2o4: '14:00 - 17:00', q2o5: 'Despues de las 17:00',
      q3: 'Si pudieras elegir libremente, cuando preferis hacer ejercicio?',
      q3o1: '06:00 - 08:00', q3o2: '08:00 - 10:00', q3o3: '10:00 - 14:00', q3o4: '14:00 - 18:00', q3o5: 'Despues de las 18:00',

      // ── Chronotype labels ──
      morningType: 'Tipo Matutino',
      intermediateType: 'Tipo Intermedio',
      eveningType: 'Tipo Vespertino'
    }
  };

  let currentLang = localStorage.getItem('chronoLang') || 'en';

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('chronoLang', lang);
  }

  function getLang() {
    return currentLang;
  }

  function t(key) {
    return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key])
      || (TRANSLATIONS.en[key])
      || key;
  }

  return { setLang, getLang, t, TRANSLATIONS };

})();

/** Global shorthand */
function i18n(key) {
  return I18n.t(key);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18n;
}
