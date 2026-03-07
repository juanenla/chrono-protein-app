-- ═══════════════════════════════════════════════════════════════
-- CHRONOPROTEIN — Meal System Database Setup
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- AFTER running supabase-setup.sql
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- 1. INGREDIENTS — Master nutritional database (per 100g)
-- System-seeded + user-contributed
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS ingredients (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT now(),
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- NULL = system-seeded
  name_en       TEXT NOT NULL,
  name_es       TEXT NOT NULL,
  category      TEXT NOT NULL CHECK (category IN (
    'meat', 'poultry', 'fish', 'dairy', 'eggs',
    'legumes', 'grains', 'vegetables', 'fruits', 'nuts_seeds',
    'supplements', 'oils_fats', 'beverages', 'other'
  )),
  -- Macros per 100g
  protein_g     NUMERIC NOT NULL DEFAULT 0,
  carbs_g       NUMERIC NOT NULL DEFAULT 0,
  fat_g         NUMERIC NOT NULL DEFAULT 0,
  fiber_g       NUMERIC NOT NULL DEFAULT 0,
  kcal          NUMERIC NOT NULL DEFAULT 0,
  -- Protein quality
  leucine_g     NUMERIC DEFAULT 0,           -- leucine per 100g protein food
  protein_class TEXT CHECK (protein_class IN ('A','B','C','D','E','N')),
  absorption    TEXT CHECK (absorption IN ('fast','medium','slow')),
  -- Micros (key ones for chrono-nutrition)
  calcium_mg    NUMERIC DEFAULT 0,
  iron_mg       NUMERIC DEFAULT 0,
  zinc_mg       NUMERIC DEFAULT 0,
  magnesium_mg  NUMERIC DEFAULT 0,
  vitamin_d_mcg NUMERIC DEFAULT 0,
  omega3_g      NUMERIC DEFAULT 0,
  -- Diet compatibility
  is_vegan      BOOLEAN DEFAULT false,
  is_vegetarian BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT true,
  -- Status
  is_verified   BOOLEAN DEFAULT false,  -- admin-verified nutritional data
  is_system     BOOLEAN DEFAULT false   -- system-seeded ingredient (not deletable)
);

-- ═══════════════════════════════════════════════════════════════
-- 2. USER_FAVORITES — Ingredients each user actually uses/buys
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_favorites (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE NOT NULL,
  custom_name   TEXT,           -- user's own name for it (e.g., "Yogur La Serenisima")
  brand         TEXT,           -- brand name
  usual_qty_g   NUMERIC,       -- how much they typically use (grams)
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, ingredient_id)
);

-- ═══════════════════════════════════════════════════════════════
-- 3. MEALS — Meal templates (system-suggested + user-created)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS meals (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT now(),
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- NULL = system
  name_en       TEXT NOT NULL,
  name_es       TEXT NOT NULL,
  description_en TEXT,
  description_es TEXT,
  -- Meal classification
  meal_type     TEXT NOT NULL CHECK (meal_type IN (
    'breakfast', 'brunch', 'lunch', 'afternoon', 'dinner',
    'preSleep', 'postWorkout', 'preWorkout', 'snack'
  )),
  protein_class TEXT CHECK (protein_class IN ('A','B','C','D','E','N')),
  -- Calculated totals (denormalized for fast display)
  total_protein_g  NUMERIC DEFAULT 0,
  total_carbs_g    NUMERIC DEFAULT 0,
  total_fat_g      NUMERIC DEFAULT 0,
  total_kcal       NUMERIC DEFAULT 0,
  total_leucine_g  NUMERIC DEFAULT 0,
  -- Cooking info
  prep_time_min    INTEGER,
  cook_time_min    INTEGER,
  instructions_en  TEXT,
  instructions_es  TEXT,
  recipe_url       TEXT,          -- link to recipe page
  video_url        TEXT,          -- link to YouTube/video
  image_url        TEXT,          -- photo of the meal
  -- Metadata
  is_system     BOOLEAN DEFAULT false,   -- system-suggested meal
  is_public     BOOLEAN DEFAULT false,   -- visible to other users
  diet_tags     TEXT[] DEFAULT '{}'       -- e.g., {'omnivore','vegetarian'}
);

-- ═══════════════════════════════════════════════════════════════
-- 4. MEAL_INGREDIENTS — What goes into each meal (with quantity)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS meal_ingredients (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_id       UUID REFERENCES meals(id) ON DELETE CASCADE NOT NULL,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE NOT NULL,
  quantity_g    NUMERIC NOT NULL DEFAULT 100,  -- grams of this ingredient
  is_optional   BOOLEAN DEFAULT false,
  notes         TEXT,  -- e.g., "can substitute with tempeh"
  -- Calculated from ingredient * quantity (denormalized)
  protein_g     NUMERIC DEFAULT 0,
  carbs_g       NUMERIC DEFAULT 0,
  fat_g         NUMERIC DEFAULT 0,
  kcal          NUMERIC DEFAULT 0,
  leucine_g     NUMERIC DEFAULT 0
);

-- ═══════════════════════════════════════════════════════════════
-- 5. USER_MEAL_PLAN — User's customized weekly meal assignments
-- Links a meal to a specific window on a specific day
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_meal_plan (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_of_week   INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Mon
  window_key    TEXT NOT NULL,  -- e.g., 'breakfast', 'lunch', 'postWorkout'
  meal_id       UUID REFERENCES meals(id) ON DELETE SET NULL,
  is_training   BOOLEAN DEFAULT true,
  -- Custom overrides (if user adjusts portions)
  custom_qty_multiplier NUMERIC DEFAULT 1.0,  -- 1.0 = as-is, 1.5 = 50% more
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, day_of_week, window_key, is_training)
);

-- ═══════════════════════════════════════════════════════════════
-- 6. DAILY_LOG — What the user actually ate (reality tracker)
-- Replaces localStorage-based daily logs
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS daily_log (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  is_training   BOOLEAN DEFAULT false,
  -- Daily totals (auto-calculated from entries)
  total_protein_g  NUMERIC DEFAULT 0,
  total_carbs_g    NUMERIC DEFAULT 0,
  total_fat_g      NUMERIC DEFAULT 0,
  total_kcal       NUMERIC DEFAULT 0,
  -- Targets for comparison
  target_protein_g NUMERIC DEFAULT 0,
  target_kcal      NUMERIC DEFAULT 0,
  -- Notes
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, log_date)
);

-- ═══════════════════════════════════════════════════════════════
-- 7. DAILY_LOG_ENTRIES — Individual meal entries per day
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS daily_log_entries (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  log_id        UUID REFERENCES daily_log(id) ON DELETE CASCADE NOT NULL,
  window_key    TEXT NOT NULL,      -- which meal slot
  time_eaten    TIME,               -- actual time eaten
  -- What was planned
  planned_meal_id UUID REFERENCES meals(id) ON DELETE SET NULL,
  planned_protein_g NUMERIC DEFAULT 0,
  -- What was actually consumed
  actual_description TEXT,          -- free text: "Milanesa con puré"
  actual_meal_id    UUID REFERENCES meals(id) ON DELETE SET NULL,  -- if from catalog
  actual_protein_g  NUMERIC DEFAULT 0,
  actual_carbs_g    NUMERIC DEFAULT 0,
  actual_fat_g      NUMERIC DEFAULT 0,
  actual_kcal       NUMERIC DEFAULT 0,
  -- Deviation
  protein_deviation_g NUMERIC GENERATED ALWAYS AS (actual_protein_g - planned_protein_g) STORED,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_meal_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_log_entries ENABLE ROW LEVEL SECURITY;

-- Ingredients: everyone can read, users can insert (pending verification)
CREATE POLICY "Anyone can read ingredients"
  ON ingredients FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add ingredients"
  ON ingredients FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update ingredients"
  ON ingredients FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

-- User favorites: own data only
CREATE POLICY "Users manage own favorites"
  ON user_favorites FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Meals: read system + own, write own
CREATE POLICY "Users can read system and own meals"
  ON meals FOR SELECT
  USING (is_system = true OR is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create meals"
  ON meals FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  USING (created_by = auth.uid() AND is_system = false);

-- Meal ingredients: readable if meal is readable, writable if meal is own
CREATE POLICY "Read meal ingredients for accessible meals"
  ON meal_ingredients FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM meals WHERE meals.id = meal_id
    AND (meals.is_system = true OR meals.is_public = true OR meals.created_by = auth.uid())
  ));

CREATE POLICY "Users can manage ingredients of own meals"
  ON meal_ingredients FOR ALL
  USING (EXISTS (
    SELECT 1 FROM meals WHERE meals.id = meal_id AND meals.created_by = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM meals WHERE meals.id = meal_id AND meals.created_by = auth.uid()
  ));

-- User meal plan: own data only
CREATE POLICY "Users manage own meal plan"
  ON user_meal_plan FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Daily log: own data only
CREATE POLICY "Users manage own daily log"
  ON daily_log FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own log entries"
  ON daily_log_entries FOR ALL
  USING (EXISTS (
    SELECT 1 FROM daily_log WHERE daily_log.id = log_id AND daily_log.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM daily_log WHERE daily_log.id = log_id AND daily_log.user_id = auth.uid()
  ));

-- ═══════════════════════════════════════════════════════════════
-- INDEXES for performance
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category);
CREATE INDEX IF NOT EXISTS idx_ingredients_protein_class ON ingredients(protein_class);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_type ON meals(meal_type);
CREATE INDEX IF NOT EXISTS idx_meals_creator ON meals(created_by);
CREATE INDEX IF NOT EXISTS idx_meal_ingredients_meal ON meal_ingredients(meal_id);
CREATE INDEX IF NOT EXISTS idx_user_meal_plan_user ON user_meal_plan(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_log_user_date ON daily_log(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_daily_log_entries_log ON daily_log_entries(log_id);

-- ═══════════════════════════════════════════════════════════════
-- SEED: Initial ingredients from protein-foods.json
-- These are the core ingredients the app already uses
-- ═══════════════════════════════════════════════════════════════

INSERT INTO ingredients (name_en, name_es, category, protein_g, kcal, leucine_g, protein_class, absorption, is_vegetarian, is_vegan, is_system, is_verified) VALUES
-- Class A: Fast absorption
('Whey Protein Isolate', 'Proteina de suero aislada (Whey)', 'supplements', 90, 370, 10.5, 'A', 'fast', true, false, true, true),
('Whole Eggs (cooked)', 'Huevos enteros (cocidos)', 'eggs', 13, 155, 1.09, 'A', 'fast', true, false, true, true),
('Egg Whites (cooked)', 'Claras de huevo (cocidas)', 'eggs', 11, 52, 0.93, 'A', 'fast', true, false, true, true),
('Chicken Breast (grilled)', 'Pechuga/Suprema de pollo (a la plancha)', 'poultry', 31, 165, 2.41, 'A', 'medium', false, false, true, true),
('Turkey Breast', 'Pechuga de pavo', 'poultry', 29, 135, 2.17, 'A', 'medium', false, false, true, true),
('Salmon (baked)', 'Salmon (al horno)', 'fish', 25, 208, 1.87, 'A', 'medium', false, false, true, true),
('Tuna (canned in water)', 'Atun al natural (lata)', 'fish', 26, 116, 2.01, 'A', 'medium', false, false, true, true),
('Lean Beef Sirloin', 'Lomo / Bife de cuadril', 'meat', 27, 200, 2.14, 'A', 'medium', false, false, true, true),
('Beef Flank Steak', 'Entrania / Vacio', 'meat', 26, 194, 2.08, 'A', 'medium', false, false, true, true),
('Shrimp (cooked)', 'Camarones / Langostinos (cocidos)', 'fish', 24, 99, 1.84, 'A', 'medium', false, false, true, true),
('Hake Fillet', 'Filet de merluza', 'fish', 18, 90, 1.42, 'A', 'medium', false, false, true, true),
('Pork Tenderloin', 'Solomillo / Carre de cerdo', 'meat', 26, 143, 2.02, 'A', 'medium', false, false, true, true),
('Pork Ribs (lean)', 'Pechito de cerdo (magro)', 'meat', 22, 210, 1.72, 'A', 'medium', false, false, true, true),
('Beef Milanesa (oven)', 'Milanesa de peceto/nalga (al horno)', 'meat', 28, 230, 2.18, 'A', 'medium', false, false, true, true),
-- Class B: Slow absorption (casein)
('Micellar Casein Powder', 'Caseina micelar en polvo', 'supplements', 85, 360, 7.8, 'B', 'slow', true, false, true, true),
('Cottage Cheese 2%', 'Queso untable magro', 'dairy', 11, 98, 1.01, 'B', 'slow', true, false, true, true),
('Greek Yogurt 0%', 'Yogur natural firme descremado', 'dairy', 10, 59, 0.85, 'B', 'slow', true, false, true, true),
('Quark', 'Quark', 'dairy', 14, 68, 1.28, 'B', 'slow', true, false, true, true),
('Skyr', 'Skyr', 'dairy', 11, 63, 0.96, 'B', 'slow', true, false, true, true),
('Whole Milk', 'Leche entera', 'dairy', 3.3, 61, 0.30, 'B', 'slow', true, false, true, true),
('Semi-hard Cheese', 'Queso magro firme (port salut/tybo)', 'dairy', 25, 300, 2.3, 'B', 'slow', true, false, true, true),
-- Class C: Leucine/BCAA supplements
('Free L-Leucine', 'L-Leucina libre (suplemento)', 'supplements', 0, 0, 100, 'C', 'fast', true, true, true, true),
('BCAA 2:1:1 Powder', 'BCAA 2:1:1 en polvo', 'supplements', 0, 0, 50, 'C', 'fast', true, true, true, true),
('EAA Complex', 'Complejo EAA (aminoacidos esenciales)', 'supplements', 70, 280, 24, 'C', 'fast', true, true, true, true),
-- Class D: Plant protein
('Pea Protein Isolate', 'Proteina de arveja aislada', 'supplements', 80, 340, 6.6, 'D', 'medium', true, true, true, true),
('Soy Protein Isolate', 'Proteina de soja aislada', 'supplements', 85, 340, 6.7, 'D', 'medium', true, true, true, true),
('Tofu (firm)', 'Tofu firme', 'legumes', 8, 76, 0.59, 'D', 'medium', true, true, true, true),
('Tempeh', 'Tempeh', 'legumes', 19, 192, 1.40, 'D', 'medium', true, true, true, true),
('Lentils (cooked)', 'Lentejas (cocidas)', 'legumes', 9, 116, 0.65, 'D', 'slow', true, true, true, true),
('Chickpeas (cooked)', 'Garbanzos (cocidos)', 'legumes', 9, 164, 0.63, 'D', 'slow', true, true, true, true),
('Edamame', 'Edamame', 'legumes', 11, 121, 0.84, 'D', 'medium', true, true, true, true),
('Almonds', 'Almendras', 'nuts_seeds', 21, 579, 1.48, 'D', 'slow', true, true, true, true),
-- Class E: Collagen
('Collagen Peptides', 'Colageno hidrolizado', 'supplements', 90, 360, 2.7, 'E', 'fast', false, false, true, true),
-- Common Argentine ingredients (non-protein focused)
('White Rice (cooked)', 'Arroz blanco (cocido)', 'grains', 2.7, 130, 0, 'N', 'medium', true, true, true, true),
('Sweet Potato (baked)', 'Batata (al horno)', 'vegetables', 2, 90, 0, 'N', 'medium', true, true, true, true),
('Potato (boiled)', 'Papa (hervida)', 'vegetables', 2, 87, 0, 'N', 'medium', true, true, true, true),
('Pasta (cooked)', 'Fideos / Tallarines (cocidos)', 'grains', 5, 131, 0, 'N', 'medium', true, true, true, true),
('Oats', 'Avena', 'grains', 13, 389, 0, 'N', 'slow', true, true, true, true),
('Whole Wheat Bread', 'Pan integral', 'grains', 9, 247, 0, 'N', 'medium', true, true, true, true),
('Banana', 'Banana', 'fruits', 1.1, 89, 0, 'N', 'fast', true, true, true, true),
('Avocado', 'Palta', 'fruits', 2, 160, 0, 'N', 'slow', true, true, true, true),
('Olive Oil', 'Aceite de oliva', 'oils_fats', 0, 884, 0, 'N', 'slow', true, true, true, true),
('Mixed Salad', 'Ensalada mixta (lechuga/tomate/zanahoria)', 'vegetables', 1.5, 25, 0, 'N', 'fast', true, true, true, true),
('Broccoli', 'Brocoli', 'vegetables', 2.8, 34, 0, 'N', 'medium', true, true, true, true),
('Honey', 'Miel', 'other', 0.3, 304, 0, 'N', 'fast', true, true, true, true),
('Granola', 'Granola / Cereales', 'grains', 8, 450, 0, 'N', 'medium', true, true, true, true),
('Dulce de Leche', 'Dulce de leche', 'dairy', 5, 315, 0, 'N', 'medium', true, false, true, true),
('Jam', 'Mermelada', 'other', 0.3, 250, 0, 'N', 'fast', true, true, true, true)
ON CONFLICT DO NOTHING;
