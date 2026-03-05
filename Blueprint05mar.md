# CHRONO-NUTRITION PROTEIN OPTIMIZER — BLUEPRINT 05 MARCH 2026
### Personalized Protein Timing, Metabolic Window Intelligence & Wearable Monitoring Platform

*Builds on: Blueprint04mar.md | Author: Project Lead + Claude Code*
*Science updated: References through February 2026 | Status: ACTIVE PLANNING DOCUMENT*

---

## EXECUTIVE SUMMARY

This blueprint defines the full architecture of a **Chrono-Nutrition Protein Optimization Platform** — a system that combines:

1. **Personalized protein scheduling** aligned to circadian chronotype
2. **Protein subclassification** (casein / whey+leucine / plant / collagen / EAAs) matched to windows
3. **Real-time metabolic state detection** via measurable biophysical parameters during and after exercise
4. **A wearable device concept** that reads metabolic stage and triggers contextual nutritional guidance
5. **A web/mobile UI** anchored on the Catabolic/Anabolic window visualization (see metabolic-windows.html)

The goal: replace guesswork with a science-grounded, real-time system that tells a person **what to eat, which protein, how much, and exactly when** — based on who they are and what their body is doing at that moment.

---

## PART 1 — SCIENTIFIC FOUNDATION UPDATE (2024–2026)

### 1.1 What Has Changed Since 2020 — The Scientific Shift

The foundation papers from Blueprint04mar remain valid. What the 2024–2026 literature adds is critical:

#### NEW TIER-1 REFERENCES (2024–2026)

**[N1] ⭐⭐⭐⭐ Negri M et al. (2025)**
"Effects of Chrono-Exercise and Chrono-Nutrition on Muscle Health: Understanding the Molecular Mechanisms Activated by Timed Exercise and Consumption of Proteins and Carbohydrates."
*Nutrition Reviews*, 83(8), 1571–1593.
- The KEY 2025 review paper (one of the two downloaded PDFs)
- Confirms: mTORC1, UPS, and autophagy are all clock-regulated
- Confirms: protein synthesis exhibits circadian rhythmicity — peaks in early active phase (ZT1–ZT7)
- New: Identifies MYOD1, BMAL1, PER2 as direct muscle regeneration clock genes (Table 1)
- New: Late-afternoon physical activity is more effective for muscle strength AND circadian synchronization
- New: Clock gene disruption (shift work, social jetlag) → impaired GLUT4 → glucose intolerance → muscle wasting pathway confirmed

**[N2] ⭐⭐⭐⭐ Trommelen J et al. (2023 — Sports Medicine 53:1445–1455)**
"Pre-sleep Protein Ingestion Increases Mitochondrial Protein Synthesis Rates During Overnight Recovery from Endurance Exercise: A Randomized Controlled Trial."
- The second downloaded PDF — landmark RCT
- KEY FINDING: Pre-sleep protein (45g) increases BOTH myofibrillar AND mitochondrial protein synthesis
- KEY FINDING: Whey = Casein for overnight recovery (no significant difference in FSR)
- Challenges the "casein only at night" dogma — whey works too via different kinetics
- First study showing exercise-induced mitochondrial protein synthesis is modulated by protein ingestion

**[N3] ⭐⭐⭐⭐ MDPI Nutrients (2025 — DOI: 10.3390/nu17132070)**
"Does Protein Ingestion Timing Affect Exercise-Induced Adaptations? A Systematic Review with Meta-Analysis."
- 2025 meta-analysis: protein timing (before vs. after) does NOT significantly alter lean mass gains
- Timing DOES show differential effects on upper vs. lower limb strength
- Conclusion: TOTAL DAILY PROTEIN remains the primary driver; timing is secondary optimization layer
- Supports our platform's hierarchy: total intake first, then window optimization

**[N4] ⭐⭐⭐ MDPI Nutrients (Jan 2026)**
"Identifying Chronotype for the Preservation of Muscle Mass, Quality and Strength."
- Evening chronotypes: higher risk of sarcopenia, obesity, and metabolic dysfunction
- Clock gene disruption (BMAL1, PER2, CRY1) directly affects protein synthesis and insulin sensitivity
- Integrated chrono-strategies (meal timing + sleep + exercise timing) are the intervention
- Validates our three-chronotype personalization approach

**[N5] ⭐⭐⭐ Frontiers in Neuroscience (2025)**
"Exercise, Circadian Rhythms, and Muscle Regeneration: A Path to Healthy Aging."
- Late afternoon/evening aligns with peak peripheral muscle clock gene expression (glycolysis, mitochondrial function, contractility genes)
- Chronic exercise stabilizes circadian rhythm expression in muscle tissue
- Timed exercise functions as a non-photic zeitgeber — resynchronizes peripheral clocks independently of light

**[N6] ⭐⭐⭐ Frontiers in Nutrition (2024 — DOI: 10.3389/fnut.2024.1397090)**
"Timing Matters? The Effects of Two Different Timing of High Protein Diets on Body Composition, Muscular Performance, and Biochemical Markers in Resistance-Trained Males."
- Confirms protein distribution matters in trained athletes
- Morning-concentrated high protein shows trend toward better muscle CSA
- Leucine threshold 2-3g confirmed per meal for mTORC1 activation

**[N7] ⭐⭐⭐ Frontiers in Nutrition (2024 — DOI: 10.3389/fnut.2024.1388986)**
"Impacts of Protein Quantity and Distribution on Body Composition."
- Total quantity is primary; distribution is secondary optimization
- Even distribution across 3-4 meals outperforms skewed distribution
- Older adults (>60y): leucine threshold rises to 2.8–3.5g per meal

**[N8] ⭐⭐⭐ PMC (2023 — Leucine systematic review)**
"Association of Postprandial Post-Exercise Muscle Protein Synthesis Rates with Dietary Leucine."
- Leucine dose-response quantified: 2–3g for young adults; 3–4g for older adults
- Leucine content is predictive of MPS response more reliably than protein quantity alone
- Supports leucine subclassification in our protein type system

**[N9] ⭐⭐⭐ Wearable Sweat Biosensors — Multiple 2024–2025 Reviews**
Sources: ACS Sensors 2023, Frontiers Physiology 2024, PMC 11674680, Nature Biomedical Engineering 2022
- Current wearable sweat sensors reliably detect: Na+, K+, Cl-, lactate (2–30 mM), glucose (10–200 μM), cortisol (0.1–25 ng/mL), uric acid, pH
- Lactate is the leading real-time metabolic fatigue marker
- Market growing 11.8% CAGR, projected $13.5B by 2034
- AI-integrated IoT sensors enabling real-time personalized nutrition triggers — this IS the device concept

**[N10] ⭐⭐⭐ StressFit / Hybrid Wearable (Nature Scientific Reports, 2024)**
"StressFit: A Hybrid Wearable Physicochemical Sensor Suite for Simultaneously Measuring Electromyogram and Sweat Cortisol."
- First simultaneous EMG + sweat cortisol measurement in wearable form
- Real-time catabolic state detection feasibility confirmed

---

### 1.2 The Updated Evidence Hierarchy (What We Can Claim with High Confidence)

| Claim | Evidence Level | Key Sources | Platform Use |
|---|---|---|---|
| Total protein 1.6–2.2 g/kg/day for active adults | ⭐⭐⭐⭐ HIGH | Morton 2018, ISSN 2017, N3 2025 | Primary target calculation |
| Even distribution across 3–4 meals > skewed | ⭐⭐⭐⭐ HIGH | Mamerow 2014, N7 2024 | Meal distribution algorithm |
| Leucine 2–3g per meal to activate mTORC1 | ⭐⭐⭐⭐ HIGH | Norton 2006, N8 2023 | Protein subtype selector |
| Pre-sleep protein (any type) increases overnight MPS | ⭐⭐⭐⭐ HIGH | Res 2012, Snijders 2015, N2 2023 | Sleep window recommendation |
| Whey = Casein for overnight MPS | ⭐⭐⭐ MODERATE-HIGH | N2 2023 (Trommelen) | Updated pre-sleep options |
| Late afternoon = peak muscle performance | ⭐⭐⭐ MODERATE-HIGH | N1 2025, N5 2025, Facer-Childs 2015 | Training window recommendation |
| Chronotype modulates optimal meal timing windows | ⭐⭐⭐ MODERATE | N4 2026, Vitale 2017 | Core personalization driver |
| Circadian disruption causes muscle wasting | ⭐⭐⭐⭐ HIGH | N1 2025 (BMAL1, PER2 evidence) | Health risk framing |
| Sweat lactate = real-time metabolic fatigue marker | ⭐⭐⭐ MODERATE-HIGH | N9 multiple 2024–2025 | Device sensor target |
| Real-time cortisol wearable feasibility | ⭐⭐ EMERGING | N10 2024 | Future device roadmap |

---

## PART 2 — PROTEIN SUBCLASSIFICATION SYSTEM

This is the core innovation over generic "eat protein" advice. The platform distinguishes FIVE protein classes by their functional role and optimal window assignment.

### 2.1 The Five Protein Classes

#### CLASS A — FAST ANABOLIC (Whey / Leucine-Rich)
- **Absorption speed:** Rapid — plasma amino acid peak at 60–90 min
- **Leucine content:** HIGH (~11% of protein = ~2.5g per 23g serving)
- **mTORC1 trigger:** Fast, strong, short-duration (~3–5h)
- **Optimal windows:** Immediately post-workout (0–90 min) | Morning cortisol reversal
- **Best sources:** Whey protein concentrate/isolate, egg white protein
- **Avoid:** Pre-sleep (clears too fast for nocturnal GH period)
- **Dose (70kg):** 25–40g per serving

#### CLASS B — SLOW SUSTAINED (Casein / Micellar)
- **Absorption speed:** Slow — sustained aminoacidemia for 7+ hours
- **Leucine content:** MODERATE (~9.2% of protein)
- **mTORC1 trigger:** Sustained, lower peak, longer duration
- **Optimal windows:** Pre-sleep (primary) | Any window requiring slow-release
- **Best sources:** Micellar casein, cottage cheese, Greek yogurt, quark
- **Note:** Per N2 (Trommelen 2023): overnight MPS = whey for endurance; casein traditional for resistance
- **Dose (70kg):** 30–45g pre-sleep

#### CLASS C — LEUCINE AMPLIFIED (Mixed protein + leucine supplement)
- **Use case:** When protein source is sub-threshold for leucine (plant-based, low-quality mixed meal)
- **Strategy:** Add 2–5g free leucine to reach the 2–3g threshold
- **Optimal windows:** Any meal where leucine content is uncertain or <2g
- **Best sources:** Added free leucine, BCAA blend (2:1:1 ratio), leucine-enriched plant blends
- **Evidence:** Churchward-Venne 2012, N8 2023 — leucine fortification closes gap between plant and animal protein
- **App logic:** Flag meals below leucine threshold → suggest leucine add-on

#### CLASS D — PLANT PROTEIN (Slow / Incomplete → completable)
- **Absorption speed:** Variable; generally slower than whey
- **Leucine content:** LOW unless fortified (soy = ~7.8%; pea = ~8%; rice = ~8.3%)
- **Limitation:** Lower leucine, often incomplete essential amino acid profile
- **Strategy:** Blend pea + rice (complementary EAA profile) + leucine fortification
- **Optimal windows:** Any meal when animal protein unavailable; NOT ideal for primary post-workout unless EAA-complete
- **Best sources:** Pea protein + rice protein blend (70:30), soy isolate, hemp
- **Evidence:** Plant-leucine fortified blends approach whey in MPS response (N9 context, 2024–2025)
- **Dose (70kg):** 30–45g to compensate for lower bioavailability

#### CLASS E — STRUCTURAL / CONNECTIVE (Collagen / Hydrolyzed)
- **Mechanism:** Does NOT activate mTORC1 for myofibrillar synthesis (lacks tryptophan; low leucine)
- **Role:** Connective tissue repair, tendon/ligament health, joint recovery
- **Optimal windows:** 30–60 min BEFORE exercise (to prime collagen synthesis during loading) or post-workout alongside vitamin C
- **Dose:** 15–20g with 50mg vitamin C (Shaw et al. 2017 protocol)
- **Not a substitute for:** Any muscle-building protein window

### 2.2 Protein Window Assignment Matrix

| Time Window | Primary Class | Secondary Class | Avoid |
|---|---|---|---|
| Morning (cortisol peak) | A (Whey) | B (Casein — if pre-workout skipped) | E alone |
| Pre-workout (-30 to -60 min) | A or C | E (collagen) | B (too slow to mobilize) |
| Post-workout (0–90 min) | A (Whey) | C (Leucine-amplified) | B alone (if fasted training) |
| Midday / Anchor meal | A or D | C | — |
| Afternoon snack | A or D | C | B (wastes slow kinetics) |
| Evening meal | B or A | D | — |
| Pre-sleep (30 min before bed) | B (Casein) | A (Whey — per N2) | E |
| Post-sleep (break fast) | A | C | — |

---

## PART 3 — PERSONALIZATION DRIVERS

These are the input variables that drive the platform's personalized output. Each driver modifies the protein schedule, amount, and type.

### 3.1 Core Personalization Variables (Onboarding Data)

#### DRIVER 1 — BODY METRICS
- Body weight (kg) — primary scaling factor for protein targets
- Body fat % (estimated via bioimpedance or DEXA reference) — for lean mass calculation
- Lean Body Mass (LBM) in kg — actual protein target base
- Age group: <30 | 30–50 | 50–65 | 65+
  - Age modifies leucine threshold: young=2g, middle=2.5g, older=3–4g

#### DRIVER 2 — CHRONOTYPE
- Assessed via: MEQ score (Horne-Ostberg 1976) OR 3 simple questions
- Quick 3-question proxy:
  1. What time do you naturally wake without an alarm?
  2. What time do you feel mentally sharpest?
  3. What time do you prefer to exercise?
- Output: Morning (M) | Intermediate (I) | Evening (E)
- This shifts ALL clock times in the schedule by the chronotype offset

#### DRIVER 3 — ACTIVITY LEVEL & TYPE
- Sedentary / Light active (walks, casual) → 1.2–1.4 g/kg
- Moderate active (recreational, 3x/week strength or cardio) → 1.6–1.8 g/kg
- Highly active (5+ sessions/week, competitive) → 1.8–2.2 g/kg
- Body recomposition / caloric deficit → 2.2–2.4 g/kg
- Exercise type modifies post-workout protein class:
  - Strength → Class A (whey) post-workout emphasis
  - Endurance → Class A + pre-sleep mitochondrial emphasis (per N2)
  - Mixed → Both

#### DRIVER 4 — TRAINING SCHEDULE
- Days and times of workout sessions entered
- Rest days get different distribution (lower total, fewer meals, no post-workout spike needed)
- Training day vs. rest day protocols are distinct

#### DRIVER 5 — DIETARY PREFERENCE / RESTRICTIONS
- Omnivore / Vegetarian / Vegan / Lactose-intolerant
- Determines protein class availability (shifts toward Class D and leucine fortification)

#### DRIVER 6 — GOAL
- Muscle gain (hypertrophy): maximize total intake + even distribution
- Body recomposition: high protein + caloric deficit context
- Endurance performance: carbohydrate co-ingestion emphasis + mitochondrial protein
- Injury recovery: Class E (collagen) integration + anti-inflammatory nutrition
- Healthy aging / sarcopenia prevention: higher leucine threshold + breakfast anchor

#### DRIVER 7 — SLEEP QUALITY & DURATION (optional advanced)
- Sleep < 7h = flag: MPS reduced ~18% (Saner et al. 2020)
- Shift worker mode: rotates schedule based on current shift
- Social jetlag score: if high (>2h), recommend circadian anchoring strategies

---

## PART 4 — PLATFORM ARCHITECTURE (APP / WEB)

### 4.1 Interface Hierarchy

```
LEVEL 0 — LANDING (metabolic-windows.html style)
  Catabolic/Anabolic window visual
  "What happens in your body right now"
  CTA → "Build My Personal Protocol"

LEVEL 1 — ONBOARDING WIZARD (5 screens)
  Screen 1: Body metrics (weight, age, goal)
  Screen 2: Chronotype quiz (3 questions or full MEQ)
  Screen 3: Activity type and training schedule
  Screen 4: Diet preferences and restrictions
  Screen 5: Summary → show daily protein target + chronotype label

LEVEL 2 — MY DAILY PLAN (Main dashboard)
  Timeline view (24h) showing all protein windows
  Color-coded by window type (catabolic=red, anabolic=green, sleep=teal)
  Each window shows: time, amount, protein class, food examples
  Exercise block shown with pre/post windows highlighted

LEVEL 3 — WINDOW DETAIL (tap any window)
  Exact protein class recommendation
  Food examples with portion sizes
  Leucine content displayed per food option
  Option: "Log this meal" → tracking mode

LEVEL 4 — PROTEIN LIBRARY
  Searchable database of protein sources
  Filters: Class (A/B/C/D/E), Source (animal/plant), Budget
  Each entry: Protein/100g | Leucine/100g | Absorption speed | Best window

LEVEL 5 — PROGRESS / INSIGHTS (weekly)
  Adherence to window timing
  Total protein hit rate (% of days at target)
  Training day vs rest day compliance
  Recommendation adjustments
```

### 4.2 Calculation Engine

```
INPUT:
  weight_kg, age, goal, chronotype, activity_level,
  training_days[], training_times[], diet_type

CALCULATE:
  lbm_kg = weight_kg * (1 - bodyfat_fraction)  [or weight_kg * 0.82 if no BF data]
  protein_target_gkg = goal_multiplier[goal]  [1.4–2.4 g/kg range]
  daily_total_g = weight_kg * protein_target_gkg

  leucine_threshold_g = age < 50 ? 2.5 : age < 65 ? 3.0 : 3.5

  window_times = chronotype_offset[chronotype] + base_windows[]

  per_window_allocation:
    morning_meal = daily_total_g * 0.28
    post_workout = daily_total_g * 0.30  [training days]
    midday = daily_total_g * 0.17
    evening = daily_total_g * 0.17
    pre_sleep = daily_total_g * 0.08

  rest_day_allocation:
    morning = 0.30, midday = 0.22, afternoon = 0.22, evening = 0.18, pre_sleep = 0.08

  protein_class_selector:
    post_workout → A (or C if plant-based)
    pre_sleep → B (or A if endurance per N2)
    morning → A (if previous night casein), else B
    other → D or A based on diet_type
```

### 4.3 File Structure (Initial Build)

```
APP-PROT-NUTRI-CHRONO/
├── index.html                    [landing page — metabolic windows concept]
├── metabolic-windows.html        [EXISTING — catabolic/anabolic visual]
├── onboarding.html               [personalization wizard]
├── dashboard.html                [daily plan view — main app]
├── window-detail.html            [per-window protein recommendations]
├── protein-library.html          [searchable protein database]
├── js/
│   ├── calculator.js             [protein target + window allocation engine]
│   ├── chronotype.js             [MEQ scoring + chronotype offset logic]
│   ├── protein-classes.js        [protein type database + leucine data]
│   └── schedule-builder.js      [timeline construction]
├── css/
│   └── design-system.css        [tokens from metabolic-windows.html]
├── data/
│   ├── protein-foods.json        [protein sources database with leucine content]
│   └── chronotype-schedules.json [base windows per chronotype]
└── docs/
    ├── Blueprint04mar.md
    ├── Blueprint05mar.md         [THIS FILE]
    └── science/
        ├── s40279-023-01822-3.pdf    [Trommelen 2023]
        └── chrono nutrition nuaf007.pdf  [Negri 2025]
```

---

## PART 5 — METABOLIC MONITORING DEVICE CONCEPT

This is the highest-ambition component: a wearable or portable device that reads the person's metabolic state in real time and outputs contextual nutritional guidance.

### 5.1 The Core Problem Being Solved

A person exercising does not know:
- When they are entering true glycogen depletion (vs. just tired)
- Whether they are burning fat, carbohydrates, or beginning to catabolize muscle protein
- Whether their hydration + electrolyte status is affecting performance
- Whether post-exercise recovery requires urgent carbohydrate intervention or protein is the priority
- What their actual catabolic/anabolic state is at any given moment

The device provides this information in real time, enabling precision nutritional interventions rather than guesswork or generic "eat within 30 minutes" rules.

### 5.2 The Metabolic State Model

We define 5 METABOLIC STATES that the device detects and responds to:

```
STATE 0 — RESTING (Pre-exercise)
  Markers: low lactate (<2 mM), normal glucose, low cortisol
  Recommendation: scheduled nutrition per chronotype plan

STATE 1 — AEROBIC ZONE (Light-moderate exercise)
  Markers: lactate 2–4 mM (lactate threshold 1), rising HR, normal pH
  Fuel: primarily fat oxidation + glycogen
  Recommendation: hydration only; no protein intervention needed

STATE 2 — GLYCOLYTIC ZONE (Moderate-high exercise)
  Markers: lactate 4–8 mM (crossing LT2), rising core temperature,
           Na+ loss >1g/h via sweat
  Fuel: predominantly glycogen; protein catabolism risk begins
  Recommendation: carbohydrate + electrolyte intervention (30–60g carbs/h)
                  water + sodium (500–750 mg Na/h)

STATE 3 — HIGH INTENSITY / LACTATE ACCUMULATION
  Markers: lactate >8 mM, high cortisol, pH drop, elevated sweat rate
  Fuel: maximal glycolysis; significant cortisol elevation
  Recommendation: URGENT carbohydrate intake; prepare post-exercise protein

STATE 4 — POST-EXERCISE CATABOLIC (0–30 min post)
  Markers: lactate normalizing, cortisol still elevated, glycogen depleted
           (estimated from duration + intensity data)
  Recommendation: URGENT: fast carbs (0.8–1g/kg) + water + electrolytes
                  Then: Class A protein within 60 min

STATE 5 — RECOVERY / ANABOLIC WINDOW (30 min – 6h post)
  Markers: cortisol declining, lactate normalized, glucose stable
  Recommendation: Class A or B protein meal (30–45g) + complex carbs
                  Leucine check → if subthreshold, add Class C
```

### 5.3 Parameters to Measure — Sensor Suite

#### TIER 1 — Essential (Minimum Viable Device)

| Parameter | Sensor Type | Range | What It Tells Us |
|---|---|---|---|
| **Sweat Lactate** | Electrochemical (enzyme-based) | 2–30 mM | Metabolic zone / fatigue state / LT1/LT2 crossing |
| **Heart Rate** | Optical PPG | 40–220 bpm | Exercise intensity proxy; zone calculator |
| **Sweat Rate / Volume** | Microfluidic impedance | mL/h | Dehydration rate; fluid replacement calculation |
| **Skin Temperature** | Thermistor | 30–42°C | Core temp proxy; heat stress indicator |
| **Movement / Accelerometry** | 3-axis IMU | 0–16g | Activity type, intensity, caloric expenditure proxy |

#### TIER 2 — Advanced (Full Metabolic Picture)

| Parameter | Sensor Type | Range | What It Tells Us |
|---|---|---|---|
| **Sweat Sodium (Na+)** | Ion-selective electrode | 10–100 mM | Electrolyte loss; rehydration protocol |
| **Sweat Potassium (K+)** | Ion-selective electrode | 1–10 mM | Electrolyte loss complementary |
| **Sweat Glucose** | Enzymatic electrochemical | 10–200 μM | Correlate with blood glucose trend |
| **Sweat pH** | Potentiometric | pH 4.5–8 | Acid-base state; lactatemia confirmation |
| **Cortisol (sweat)** | Immunoassay / aptasensor | 0.1–25 ng/mL | Real-time catabolic hormonal state |
| **SpO2** | Optical (red/IR LED) | 85–100% | Oxygen delivery; altitude / fitness context |

#### TIER 3 — Future / Research Grade

| Parameter | Technology | Status |
|---|---|---|
| **Interstitial fluid glucose** | Continuous glucose monitor (CGM) patch | Available (Libre, Dexcom) |
| **Blood lactate (optical)** | Near-infrared spectroscopy | Research phase |
| **Muscle oxygenation (SmO2)** | NIRS wristband | Available (Moxy, Humon) |
| **HRV (Heart Rate Variability)** | ECG or PPG-derived | Available in smartwatches |
| **EMG + Sweat Cortisol** | Hybrid (StressFit 2024) | Research demonstrated |

### 5.4 Device Logic — Metabolic State Algorithm

```
INPUT (real-time, every 30 seconds):
  lactate_mM, hr_bpm, sweat_rate_mL_h, skin_temp_C,
  movement_g, na_mM, glucose_uM, ph, duration_min

METABOLIC STATE DETERMINATION:
  if duration = 0 and hr < 100:
    state = RESTING

  elif lactate < 2 and hr < 130:
    state = AEROBIC_ZONE

  elif lactate 2–4 or hr 130–160:
    state = GLYCOLYTIC_ZONE
    → trigger: hydration + electrolyte alert

  elif lactate 4–8 or hr 160–175:
    state = HIGH_INTENSITY
    → trigger: carbohydrate intake alert (priority)

  elif lactate > 8 or (lactate was high AND now falling post-exercise):
    state = POST_EXERCISE_CATABOLIC
    → trigger: URGENT nutrition protocol

  recovery_timer starts at exercise_end
  state = ANABOLIC_WINDOW when recovery_timer < 360 min

FLUID LOSS CALCULATION:
  water_deficit_mL = sweat_rate_mL_h * duration_h
  sodium_lost_mg = na_mM * sweat_rate_mL_h * 23 * duration_h / 1000
  rehydration_target = water_deficit * 1.5 (overcompensate for ongoing losses)

PROTEIN WINDOW TRIGGER:
  post_exercise_flag = True
  priority_1 = carbohydrate_g = weight_kg * 0.8 (if state was HIGH_INTENSITY)
  priority_2 = protein_class_A_g = weight_kg * 0.4
  timing_window = 60 min (if fasted training) OR 240 min (if fed within 2h pre)
```

### 5.5 Device Form Factor Options

| Option | Form | Sensors Included | Use Case |
|---|---|---|---|
| MVP Patch | Adhesive chest/arm patch | Lactate + HR + Temp + Accel | Training sessions |
| Wristband | Watch-format | Full Tier 1 + partial Tier 2 | Daily wear + training |
| Smart Bottle | Connected water bottle | Hydration + temperature + GPS + HR via phone | Endurance athletes |
| Clip Sensor | Clip to clothing | Lactate (sweat) + HR + IMU | Minimum friction option |

### 5.6 Real-Time Notification System

The device connects to the app via Bluetooth LE. Notifications are contextual and actionable:

```
[STATE 2 — 25 min into workout]
"GLYCOLYTIC ZONE: You're burning glycogen fast.
 Drink 400 mL water + electrolytes now.
 Est. sodium lost: 380 mg — use sports drink or add Na tab."

[STATE 4 — 3 min post-workout]
"CATABOLIC WINDOW OPEN.
 Cortisol elevated. Glycogen at ~40% depleted.
 Step 1 (NOW): 1 banana + 500 mL water + electrolytes
 Step 2 (within 60 min): 35g whey protein + complex carbs"

[STATE 5 — 90 min post-workout]
"ANABOLIC WINDOW ACTIVE (4h remaining).
 Good job on the post-workout meal.
 Next protein window: 3h from now.
 Tonight's pre-sleep: 35g casein at 22:30"
```

---

## PART 6 — BUILD PLAN (PHASED ROADMAP)

### PHASE 1 — FOUNDATION HTML/JS (Weeks 1–2)
Goal: Static personalization tool that outputs a daily plan

**Tasks:**
- [x] metabolic-windows.html — DONE (catabolic/anabolic visual)
- [ ] Onboarding wizard (5-screen form collecting all Driver 1–7 inputs)
- [ ] JavaScript calculation engine (protein target + window allocation)
- [ ] Dashboard view — 24h timeline with protein windows
- [ ] Protein Library JSON database (50+ foods with leucine content)
- [ ] Chronotype schedule builder (3 chronotypes × training/rest day variants)
- [ ] Window detail page with food examples and leucine display

**Deliverables:** Functional static web app, no backend required
**Science display:** Each window shows evidence tier badge + source

---

### PHASE 2 — PROTEIN SUBCLASSIFICATION UI (Weeks 3–4)
Goal: Add protein CLASS logic to all recommendations

**Tasks:**
- [ ] Protein class (A/B/C/D/E) selector and explainer screens
- [ ] Leucine threshold calculator per meal
- [ ] Leucine flag: "This meal is below threshold — add leucine or swap source"
- [ ] Pre-sleep protein option: Casein vs Whey toggle (per N2 new evidence)
- [ ] Plant-based mode: Class D + C combinations with completeness check
- [ ] Evidence panel: expandable science behind each recommendation

**Deliverables:** Complete protein subclassification system in UI

---

### PHASE 3 — METABOLIC STATE SIMULATOR (Weeks 5–6)
Goal: Simulate the wearable device in software (phone-based proxy)

**Tasks:**
- [ ] Manual metabolic state input (user selects: resting / active zone / post-workout)
- [ ] Duration + intensity input (mimics what sensor would read)
- [ ] Real-time recommendation engine based on metabolic state model
- [ ] Hydration + electrolyte calculator from sweat rate estimate
- [ ] Post-exercise countdown timer (anabolic window 4h clock)
- [ ] Notification system (web push or in-app alerts)

**Deliverables:** Software-only metabolic monitoring without hardware

---

### PHASE 4 — PERSONALIZATION REFINEMENT (Weeks 7–8)
Goal: Improve accuracy via user feedback loop

**Tasks:**
- [ ] Meal logging (did you eat? what? how much?)
- [ ] Adherence tracking and weekly protein summary
- [ ] Schedule adjustment based on logged training times
- [ ] Social jetlag detection (actual wake time vs. natural wake time)
- [ ] Special modes: injury recovery (collagen window), caloric deficit, older adult mode

---

### PHASE 5 — DEVICE INTEGRATION SPEC (Months 3–4)
Goal: Hardware specification document + prototype test

**Tasks:**
- [ ] Sensor selection and procurement (Tier 1 minimum)
- [ ] Bluetooth LE app integration protocol
- [ ] Real lactate + HR real-time feed → state determination
- [ ] Clinical validation protocol (compare device state vs. blood reference)
- [ ] Feedback loop: device data → personalization engine refinement

---

## PART 7 — KEY SCIENTIFIC GAPS (Research Priorities)

The following gaps should be acknowledged in the app AND represent future study opportunities:

1. **No direct RCT** testing chronotype-personalized protein timing vs. standard distribution
   — Our platform is extrapolating from three independent evidence pillars (circadian + protein + chronotype)

2. **Female-specific data remains limited** — menstrual cycle phase affects protein metabolism significantly; most RCTs used male subjects exclusively

3. **Older adult (>65) protein timing** — leucine threshold rises (3–4g); pre-sleep dose may need to be 40–50g; most evidence from younger populations

4. **Plant protein + chronotype interaction** — no studies have examined whether leucine-fortified plant blends perform differently across chronotypes

5. **Real-time sweat cortisol reliability** — N10 (StressFit 2024) demonstrates feasibility; clinical validation in athletes not yet published

6. **Mitochondrial vs. myofibrillar optimization** — N2 (Trommelen 2023) shows these may have different optimal windows and protein sources; endurance athletes have different needs from strength athletes

7. **Individual circadian period variation** — ~±30 min variation in endogenous period affects all timing recommendations; currently undetectable without rigorous chronobiology assessment

---

## PART 8 — DAILY REFERENCE CHEAT SHEET

### For 70 kg Active Adult | Intermediate Chronotype | 1.8 g/kg target = 126g/day

| Window | Time | Amount | Class | Source | Leucine |
|---|---|---|---|---|---|
| Breakfast | 08:30 | 32g | A | Whey + eggs | 3.2g ✓ |
| Post-workout | 13:00 | 38g | A | Whey shake + chicken | 3.8g ✓ |
| Afternoon | 16:30 | 22g | A or D | Greek yogurt / pea protein | 2.2g ✓ |
| Dinner | 19:30 | 28g | B or A | Cottage cheese / fish | 2.6g ✓ |
| Pre-sleep | 22:30 | 36g | B or A | Casein / whey (per N2) | 3.1g ✓ |
| **TOTAL** | — | **156g** | — | — | **14.9g** |

*Training days: increase post-workout by +5–10g; reduce afternoon by equivalent*
*Rest days: reduce post-workout window; redistribute evenly across 4 meals*

### Protein Quick-Scale Formula
- **Daily target:** weight_kg × 1.8 (range: ×1.6 minimum, ×2.2 maximum)
- **Per meal minimum:** weight_kg × 0.4 (never below this)
- **Leucine per meal:** 2g minimum (young) / 3g minimum (50+)
- **Pre-sleep:** 30–45g any high-quality protein (casein or whey are equivalent overnight)

---

## PART 9 — DESIGN SYSTEM (Inheriting from metabolic-windows.html)

The visual language is already established. Inherit and extend:

```css
/* Existing tokens to reuse */
--red:    #FF3B2F    /* catabolic state, urgent */
--orange: #FF7A1A   /* critical window, warning */
--amber:  #FFAC0A   /* transition zone */
--green:  #00C27C   /* anabolic state, optimal */
--teal:   #00B4D8   /* sleep / recovery phase */
--dark:   #0D0D0F   /* background */
--card:   #141418   /* card surface */

/* New tokens to add */
--class-A: #4FFFB0   /* Class A protein — fast/whey */
--class-B: #7B9EFF   /* Class B protein — casein/slow */
--class-C: #FFD700   /* Class C protein — leucine amp */
--class-D: #98FF6E   /* Class D protein — plant */
--class-E: #FF9EAA   /* Class E protein — collagen */
--state-0: #6B6B75   /* resting metabolic state */
--state-1: #00B4D8   /* aerobic zone */
--state-2: #FFAC0A   /* glycolytic zone */
--state-3: #FF7A1A   /* high intensity */
--state-4: #FF3B2F   /* post-exercise catabolic */
--state-5: #00C27C   /* anabolic recovery window */
```

Typography, card patterns, timeline bars, and pill components from metabolic-windows.html are the baseline UI — no redesign needed.

---

## APPENDIX A — UPDATED FULL REFERENCE LIST

*(Existing 100 references from Blueprint04mar.md are carried forward. New additions below.)*

101. ⭐⭐⭐⭐ **Negri M et al.** (2025). Effects of Chrono-Exercise and Chrono-Nutrition on Muscle Health. *Nutr Rev*, 83(8), 1571–1593. [N1]

102. ⭐⭐⭐⭐ **Trommelen J et al.** (2023). Pre-sleep Protein Ingestion Increases Mitochondrial Protein Synthesis. *Sports Med*, 53, 1445–1455. [N2]

103. ⭐⭐⭐⭐ **MDPI Nutrients** (2025). Does Protein Ingestion Timing Affect Exercise-Induced Adaptations? Systematic Review + Meta-Analysis. DOI: 10.3390/nu17132070. [N3]

104. ⭐⭐⭐ **MDPI Nutrients** (Jan 2026). Identifying Chronotype for the Preservation of Muscle Mass, Quality and Strength. DOI: 10.3390/nu18020221. [N4]

105. ⭐⭐⭐ **Frontiers Neuroscience** (2025). Exercise, Circadian Rhythms, and Muscle Regeneration: A Path to Healthy Aging. DOI: 10.3389/fnins.2025.1633835. [N5]

106. ⭐⭐⭐ **Frontiers Nutrition** (2024). Timing Matters? Effects of Protein Diet Timing on Body Composition in Resistance-Trained Males. DOI: 10.3389/fnut.2024.1397090. [N6]

107. ⭐⭐⭐ **Frontiers Nutrition** (2024). Impacts of Protein Quantity and Distribution on Body Composition. DOI: 10.3389/fnut.2024.1388986. [N7]

108. ⭐⭐⭐ **PMC** (2023). Association of Postprandial Post-Exercise MPS Rates with Dietary Leucine: Systematic Review. PMC10400406. [N8]

109. ⭐⭐⭐ **MDPI Biosensors** (Dec 2024). Advanced Wearable Devices for Monitoring Sweat Biochemical Markers in Athletic Performance. PMC11674680. [N9]

110. ⭐⭐ **Nature Scientific Reports** (2024). StressFit: Hybrid Wearable for EMG + Sweat Cortisol. DOI: 10.1038/s41598-024-81042-5. [N10]

111. ⭐⭐⭐ **ACS Sensors** (2023). Fully Integrated Wearable Device for Continuous Sweat Lactate Monitoring in Sports. DOI: 10.1021/acssensors.3c00708. [N11]

112. ⭐⭐⭐ **Frontiers Physiology** (2024). Wearable Device for Continuous Sweat Lactate Monitoring in Sports: Narrative Review. PMC11025537. [N12]

113. ⭐⭐⭐ **Frontiers Bioengineering** (2025). Sweat, Tears, and Beyond: Advanced Wearable Sensors for Personalized Health and Athletic Performance. PMC12698657. [N13]

---

## APPENDIX B — OPEN QUESTIONS FOR NEXT SESSION

1. Should the MVP be a pure HTML/JS static app, or should we build a minimal backend (Supabase/localStorage) for user profile persistence?
2. What is the target device size — phone app first, or web-first responsive?
3. Should the protein library be hand-curated (~100 foods) or use a nutrition API (USDA FoodData Central)?
4. For the metabolic state model — do we simulate with manual input first, or integrate immediately with Apple Health / Google Fit HR data as Phase 1 data source?
5. What is the minimum hardware budget for the device prototype (Tier 1 sensors)?

---

*Blueprint05mar.md | Created: March 5, 2026*
*Next session: Begin Phase 1 HTML/JS build — start with onboarding.html or calculator.js?*
*Previous blueprint: Blueprint04mar.md (100 references, 3-chronotype daily schedules)*
