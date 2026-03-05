/**
 * CHRONO-PROTEIN CALCULATOR ENGINE
 * Core logic: takes user profile → outputs personalized daily protein plan
 */

const ChronoCalculator = (() => {

  // ── Goal multipliers (g protein per kg body weight) ──
  const GOAL_TARGETS = {
    wellness:       { min: 1.2, default: 1.4, max: 1.6 },
    maintenance:    { min: 1.4, default: 1.6, max: 1.8 },
    muscleGain:     { min: 1.6, default: 1.8, max: 2.2 },
    recomposition:  { min: 2.0, default: 2.2, max: 2.4 },
    endurance:      { min: 1.2, default: 1.6, max: 1.8 },
    seniorHealth:   { min: 1.2, default: 1.6, max: 2.0 }
  };

  // ── Activity level modifiers ──
  const ACTIVITY_MOD = {
    sedentary:    -0.2,
    light:        -0.1,
    moderate:      0.0,
    active:       +0.1,
    veryActive:   +0.2
  };

  // ── Leucine thresholds by age (grams per meal) ──
  function leucineThreshold(age) {
    if (age < 30)  return 2.0;
    if (age < 50)  return 2.5;
    if (age < 65)  return 3.0;
    return 3.5;
  }

  // ── Estimate Lean Body Mass if no BF% given ──
  function estimateLBM(weightKg, sex) {
    // Rough estimate: males ~82%, females ~75% lean
    return weightKg * (sex === 'female' ? 0.75 : 0.82);
  }

  /**
   * MAIN CALCULATION
   * @param {Object} profile - User profile from onboarding
   * @returns {Object} Full daily protein plan
   */
  function calculate(profile) {
    const {
      weightKg,
      age,
      sex = 'male',
      bodyFatPercent = null,
      chronotype,      // 'morning' | 'intermediate' | 'evening'
      activityLevel,   // 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'
      goal,            // key from GOAL_TARGETS
      dietType = 'omnivore', // 'omnivore' | 'vegetarian' | 'vegan'
      isTrainingDay = true,
      trainingTime = null    // 'HH:MM' or null
    } = profile;

    // 1. Calculate lean body mass
    const lbm = bodyFatPercent !== null
      ? weightKg * (1 - bodyFatPercent / 100)
      : estimateLBM(weightKg, sex);

    // 2. Determine protein target (g/kg/day)
    const goalConfig = GOAL_TARGETS[goal] || GOAL_TARGETS.maintenance;
    const actMod = ACTIVITY_MOD[activityLevel] || 0;
    const proteinPerKg = Math.min(
      goalConfig.max,
      Math.max(goalConfig.min, goalConfig.default + actMod)
    );

    // 3. Daily total
    const dailyTotalG = Math.round(weightKg * proteinPerKg);

    // 4. Per-meal minimum (0.4 g/kg — Morton 2018)
    const perMealMinG = Math.round(weightKg * 0.4);

    // 5. Leucine threshold
    const leucinePerMeal = leucineThreshold(age);

    // 6. Load chronotype schedule
    const dayType = isTrainingDay ? 'training' : 'rest';

    // 7. Build windows with gram amounts
    const windows = buildWindows(dailyTotalG, chronotype, dayType, dietType, perMealMinG, leucinePerMeal, trainingTime);

    // 8. Summary
    return {
      profile: {
        weightKg,
        age,
        sex,
        lbm: Math.round(lbm),
        bodyFatPercent,
        chronotype,
        activityLevel,
        goal,
        dietType
      },
      targets: {
        proteinPerKg,
        dailyTotalG,
        perMealMinG,
        leucinePerMealG: leucinePerMeal,
        mealsPerDay: Object.keys(windows).length
      },
      dayType,
      windows
    };
  }

  /**
   * Build individual protein windows
   */
  function buildWindows(dailyTotal, chronotype, dayType, dietType, perMealMin, leucineThresh, customTrainingTime) {
    // We'll load schedule data async later; for now use inline defaults
    const schedules = getScheduleData();
    const chrono = schedules[chronotype];
    if (!chrono) return {};

    const windowDefs = chrono.windows[dayType];
    const result = {};

    for (const [key, w] of Object.entries(windowDefs)) {
      const grams = Math.max(perMealMin, Math.round(dailyTotal * w.share));

      // Determine protein class based on diet restrictions
      let proteinClass = w.class;
      if (dietType === 'vegan' && (proteinClass === 'A' || proteinClass === 'B')) {
        proteinClass = 'D'; // shift to plant
      }
      if (dietType === 'vegetarian' && proteinClass === 'A') {
        // vegetarian can still do whey/casein, keep it
      }

      // Calculate leucine estimate for this serving
      const leucineEstimate = estimateLeucine(grams, proteinClass);
      const leucineOk = leucineEstimate >= leucineThresh;

      result[key] = {
        label: w.label,
        time: (customTrainingTime && key === 'postWorkout')
          ? adjustPostWorkoutTime(customTrainingTime)
          : w.time,
        grams,
        proteinClass,
        leucineEstimateG: Math.round(leucineEstimate * 10) / 10,
        leucineOk,
        leucineThreshold: leucineThresh,
        share: w.share,
        suggestion: leucineOk
          ? null
          : `Add ${Math.ceil(leucineThresh - leucineEstimate)}g free leucine (Class C) to reach threshold`
      };
    }

    return result;
  }

  /**
   * Estimate leucine content from protein class and grams
   * Based on average leucine% per class from protein-foods.json
   */
  function estimateLeucine(gramsProtein, proteinClass) {
    const leucinePercent = {
      'A': 0.10,   // ~10% leucine (whey)
      'B': 0.085,  // ~8.5% (casein)
      'C': 0.50,   // BCAA/leucine supplements
      'D': 0.075,  // ~7.5% (plant avg)
      'E': 0.03    // ~3% (collagen — does NOT trigger mTOR)
    };
    return gramsProtein * (leucinePercent[proteinClass] || 0.08);
  }

  /**
   * Adjust post-workout time to be 60 min after custom training end
   */
  function adjustPostWorkoutTime(trainingTime) {
    const [h, m] = trainingTime.split(':').map(Number);
    // Assume 1h training + 1h post = 2h after start
    const newH = (h + 2) % 24;
    return `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  /**
   * Return embedded schedule data (mirrors data/chronotype-schedules.json)
   * In production this would be loaded from the JSON file
   */
  function getScheduleData() {
    return {
      morning: {
        windows: {
          training: {
            breakfast:   { time: "07:00", share: 0.28, class: "A", label: "Breakfast" },
            postWorkout: { time: "11:30", share: 0.30, class: "A", label: "Post-Workout" },
            afternoon:   { time: "15:00", share: 0.17, class: "A", label: "Afternoon Snack" },
            dinner:      { time: "18:30", share: 0.17, class: "B", label: "Dinner" },
            preSleep:    { time: "21:30", share: 0.08, class: "B", label: "Pre-Sleep" }
          },
          rest: {
            breakfast:   { time: "07:00", share: 0.30, class: "A", label: "Breakfast" },
            lunch:       { time: "12:00", share: 0.22, class: "A", label: "Lunch" },
            afternoon:   { time: "15:30", share: 0.22, class: "D", label: "Afternoon Snack" },
            dinner:      { time: "18:30", share: 0.18, class: "B", label: "Dinner" },
            preSleep:    { time: "21:30", share: 0.08, class: "B", label: "Pre-Sleep" }
          }
        }
      },
      intermediate: {
        windows: {
          training: {
            breakfast:   { time: "08:30", share: 0.25, class: "A", label: "Breakfast" },
            postWorkout: { time: "13:30", share: 0.30, class: "A", label: "Post-Workout" },
            afternoon:   { time: "16:30", share: 0.17, class: "A", label: "Afternoon Snack" },
            dinner:      { time: "19:30", share: 0.20, class: "B", label: "Dinner" },
            preSleep:    { time: "22:30", share: 0.08, class: "B", label: "Pre-Sleep" }
          },
          rest: {
            breakfast:   { time: "08:30", share: 0.28, class: "A", label: "Breakfast" },
            lunch:       { time: "13:00", share: 0.24, class: "A", label: "Lunch" },
            afternoon:   { time: "16:30", share: 0.22, class: "D", label: "Afternoon Snack" },
            dinner:      { time: "19:30", share: 0.18, class: "B", label: "Dinner" },
            preSleep:    { time: "22:30", share: 0.08, class: "B", label: "Pre-Sleep" }
          }
        }
      },
      evening: {
        windows: {
          training: {
            brunch:       { time: "10:30", share: 0.19, class: "A", label: "Brunch" },
            lunch:        { time: "13:30", share: 0.23, class: "A", label: "Lunch" },
            postWorkout:  { time: "19:30", share: 0.30, class: "A", label: "Post-Workout" },
            eveningSnack: { time: "21:30", share: 0.17, class: "D", label: "Evening Snack" },
            preSleep:     { time: "00:30", share: 0.11, class: "B", label: "Pre-Sleep" }
          },
          rest: {
            brunch:       { time: "10:30", share: 0.25, class: "A", label: "Brunch" },
            lunch:        { time: "14:00", share: 0.25, class: "A", label: "Lunch" },
            afternoon:    { time: "17:30", share: 0.22, class: "D", label: "Afternoon Snack" },
            dinner:       { time: "21:00", share: 0.18, class: "B", label: "Dinner" },
            preSleep:     { time: "00:30", share: 0.10, class: "B", label: "Pre-Sleep" }
          }
        }
      }
    };
  }

  // ── Public API ──
  return {
    calculate,
    GOAL_TARGETS,
    leucineThreshold
  };

})();

// Export for module use or keep as global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChronoCalculator;
}
