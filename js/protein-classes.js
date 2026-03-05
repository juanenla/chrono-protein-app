/**
 * PROTEIN CLASS DEFINITIONS
 * Five classes by absorption kinetics, leucine content, and optimal window
 */

const ProteinClasses = (() => {

  const CLASSES = {
    A: {
      id: 'A',
      name: 'Fast Anabolic',
      subtitle: 'Whey / Leucine-rich',
      color: '#4FFFB0',
      colorBg: 'rgba(79,255,176,0.12)',
      icon: 'zap',
      absorption: 'fast',
      absorptionPeakMin: 60,
      absorptionDurationH: 3,
      leucinePercent: 10.5,
      bestWindows: ['postWorkout', 'breakfast'],
      avoidWindows: ['preSleep'],
      description: 'Rapid amino acid delivery. Plasma peak at 60-90 min. High leucine (~10.5%) triggers strong, fast mTORC1 activation. Ideal immediately post-workout and to break overnight fast.',
      sources: ['Whey isolate', 'Whey concentrate', 'Egg whites', 'Chicken breast', 'Fish']
    },
    B: {
      id: 'B',
      name: 'Slow Sustained',
      subtitle: 'Casein / Micellar',
      color: '#7B9EFF',
      colorBg: 'rgba(123,158,255,0.12)',
      icon: 'moon',
      absorption: 'slow',
      absorptionPeakMin: 180,
      absorptionDurationH: 7,
      leucinePercent: 8.5,
      bestWindows: ['preSleep', 'dinner'],
      avoidWindows: [],
      description: 'Sustained 7+ hour amino acid release. Sustains aminoacidemia throughout sleep. Pairs perfectly with nocturnal GH pulses. Trommelen 2023: whey equals casein for overnight MPS.',
      sources: ['Micellar casein', 'Cottage cheese', 'Greek yogurt', 'Quark', 'Skyr']
    },
    C: {
      id: 'C',
      name: 'Leucine Amplified',
      subtitle: 'Leucine supplement / BCAA',
      color: '#FFD700',
      colorBg: 'rgba(255,215,0,0.12)',
      icon: 'plus-circle',
      absorption: 'fast',
      absorptionPeakMin: 30,
      absorptionDurationH: 2,
      leucinePercent: 50,
      bestWindows: ['any'],
      avoidWindows: [],
      description: 'Add-on when a meal falls below the leucine threshold (2-3g). Free leucine or BCAA 2:1:1 rapidly activates mTORC1 even with suboptimal protein. Essential for plant-based meals.',
      sources: ['Free L-leucine (2-5g)', 'BCAA 2:1:1 powder', 'EAA complex']
    },
    D: {
      id: 'D',
      name: 'Plant Protein',
      subtitle: 'Pea / Rice / Soy blends',
      color: '#98FF6E',
      colorBg: 'rgba(152,255,110,0.12)',
      icon: 'leaf',
      absorption: 'medium',
      absorptionPeakMin: 120,
      absorptionDurationH: 4,
      leucinePercent: 7.5,
      bestWindows: ['lunch', 'afternoon', 'dinner'],
      avoidWindows: [],
      description: 'Lower leucine content (~7.5%) and sometimes incomplete EAA profile. Blend pea + rice (70:30) for complementary amino acids. Add leucine (Class C) when used post-workout.',
      sources: ['Pea + rice blend', 'Soy isolate', 'Tofu', 'Tempeh', 'Lentils', 'Edamame']
    },
    E: {
      id: 'E',
      name: 'Structural / Connective',
      subtitle: 'Collagen / Gelatin',
      color: '#FF9EAA',
      colorBg: 'rgba(255,158,170,0.12)',
      icon: 'shield',
      absorption: 'fast',
      absorptionPeakMin: 60,
      absorptionDurationH: 2,
      leucinePercent: 3.0,
      bestWindows: ['preWorkout'],
      avoidWindows: ['postWorkout', 'preSleep'],
      description: 'Does NOT activate mTORC1 for muscle growth (lacks tryptophan, low leucine). Role: tendon, ligament, joint repair. Take 30-60 min BEFORE exercise with 50mg vitamin C (Shaw 2017 protocol).',
      sources: ['Collagen peptides', 'Bone broth protein', 'Gelatin']
    }
  };

  /**
   * Get the recommended class for a specific window and diet type
   */
  function recommendClass(windowKey, dietType) {
    if (windowKey === 'preSleep') return 'B';
    if (windowKey === 'preWorkout') return 'E';

    if (dietType === 'vegan') {
      if (windowKey === 'postWorkout') return 'D'; // + suggest C add-on
      return 'D';
    }

    if (windowKey === 'postWorkout' || windowKey === 'breakfast' || windowKey === 'brunch') {
      return 'A';
    }

    return 'A'; // default
  }

  /**
   * Check if a serving meets the leucine threshold
   */
  function checkLeucine(gramsProtein, classId, ageBasedThreshold) {
    const cls = CLASSES[classId];
    if (!cls) return { ok: false, leucineG: 0, deficit: ageBasedThreshold };

    const leucineG = gramsProtein * (cls.leucinePercent / 100);
    const ok = leucineG >= ageBasedThreshold;
    const deficit = ok ? 0 : ageBasedThreshold - leucineG;

    return {
      ok,
      leucineG: Math.round(leucineG * 10) / 10,
      deficit: Math.round(deficit * 10) / 10,
      suggestion: ok ? null : `Add ${Math.ceil(deficit)}g free leucine to this meal`
    };
  }

  return {
    CLASSES,
    recommendClass,
    checkLeucine
  };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProteinClasses;
}
