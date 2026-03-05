/**
 * CHRONOTYPE ASSESSMENT MODULE
 * Quick 3-question quiz that maps to Morning / Intermediate / Evening
 * Based on simplified Horne-Ostberg MEQ dimensions
 */

const ChronoQuiz = (() => {

  /**
   * The 3 questions, each with 5 options scored 1-5
   * Higher score = more morning-oriented
   */
  const QUESTIONS = [
    {
      id: 'wake',
      text: 'What time do you naturally wake up without an alarm on a free day?',
      options: [
        { label: 'Before 06:00',    value: 5 },
        { label: '06:00 - 07:00',   value: 4 },
        { label: '07:00 - 08:30',   value: 3 },
        { label: '08:30 - 10:00',   value: 2 },
        { label: 'After 10:00',     value: 1 }
      ]
    },
    {
      id: 'peak',
      text: 'When do you feel most mentally sharp and productive?',
      options: [
        { label: '06:00 - 09:00',   value: 5 },
        { label: '09:00 - 11:00',   value: 4 },
        { label: '11:00 - 14:00',   value: 3 },
        { label: '14:00 - 17:00',   value: 2 },
        { label: 'After 17:00',     value: 1 }
      ]
    },
    {
      id: 'exercise',
      text: 'If you could choose freely, when would you prefer to exercise?',
      options: [
        { label: '06:00 - 08:00',   value: 5 },
        { label: '08:00 - 10:00',   value: 4 },
        { label: '10:00 - 14:00',   value: 3 },
        { label: '14:00 - 18:00',   value: 2 },
        { label: 'After 18:00',     value: 1 }
      ]
    }
  ];

  /**
   * Score the quiz
   * Total: 3-15
   *   11-15 = Morning
   *   7-10  = Intermediate
   *   3-6   = Evening
   */
  function score(answers) {
    // answers = { wake: 4, peak: 3, exercise: 2 }
    const total = (answers.wake || 0) + (answers.peak || 0) + (answers.exercise || 0);

    let chronotype;
    if (total >= 11) {
      chronotype = 'morning';
    } else if (total >= 7) {
      chronotype = 'intermediate';
    } else {
      chronotype = 'evening';
    }

    return {
      total,
      chronotype,
      label: LABELS[chronotype],
      description: DESCRIPTIONS[chronotype]
    };
  }

  const LABELS = {
    morning:      'Morning Type',
    intermediate: 'Intermediate Type',
    evening:      'Evening Type'
  };

  const DESCRIPTIONS = {
    morning:
      'You naturally wake early and perform best in the morning. Your cortisol peaks early, making breakfast protein critical to stop overnight catabolism. Training is optimal between 08:00-11:00.',
    intermediate:
      'You fall between the extremes — the most common chronotype (~50% of people). You have flexibility in meal and training timing. Optimal performance window: 10:00-14:00.',
    evening:
      'You come alive later in the day. Your peak performance is 15:00-19:00. Never skip brunch protein — it stops the extended overnight catabolic period. Your biggest anabolic window is post-workout dinner.'
  };

  // ── Public API ──
  return {
    QUESTIONS,
    score,
    LABELS,
    DESCRIPTIONS
  };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChronoQuiz;
}
