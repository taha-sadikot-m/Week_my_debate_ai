export const DUMMY_ANALYSIS_DATA = {
  overallScore: 75,
  performanceMetrics: {
    argumentation: { 
      score: 72, 
      strengths: ["Clear main points", "Logical structure"], 
      weaknesses: ["Lack of supporting evidence", "Weak rebuttal to counter-arguments"], 
      improvement: "Try to include more statistical evidence or expert opinions to back up your claims." 
    },
    clarity: { 
      score: 85, 
      strengths: ["Excellent articulation", "Good pacing"], 
      weaknesses: ["Occasional filler words"], 
      improvement: "Practice pausing instead of using filler words like 'um' or 'uh'." 
    },
    engagement: { 
      score: 78, 
      strengths: ["Confident tone", "Good volume"], 
      weaknesses: ["Could use more rhetorical questions"], 
      improvement: "Engage the audience more by asking rhetorical questions." 
    },
    criticalThinking: { 
      score: 70, 
      strengths: ["Identified key issues"], 
      weaknesses: ["Surface level analysis of opponent's points"], 
      improvement: "Dig deeper into the implications of the opponent's arguments." 
    },
    communication: { 
      score: 80, 
      strengths: ["Professional language", "Respectful tone"], 
      weaknesses: [], 
      improvement: "Maintain this high standard of professional communication." 
    }
  },
  keyStrengths: [
    "Clear and articulate delivery",
    "Logical organization of arguments",
    "Professional and respectful tone"
  ],
  areasForImprovement: [
    "Deepening the analysis of counter-arguments",
    "Providing more concrete evidence",
    "Reducing filler words"
  ],
  specificFeedback: {
    content: { 
      analysis: "Your arguments were logical but would benefit from more concrete examples.", 
      suggestion: "Prepare 2-3 specific examples or case studies for your next debate." 
    },
    delivery: { 
      analysis: "You speak clearly and at a good pace, which makes you easy to understand.", 
      suggestion: "Work on varying your pitch to emphasize key points." 
    },
    strategy: { 
      analysis: "You stuck to your main points well but didn't adapt enough to the opponent's attacks.", 
      suggestion: "Practice 'steel-manning' the opponent's argument to better dismantle it." 
    }
  },
  improvementPlan: {
    shortTerm: [
      { action: "Evidence Gathering", description: "Spend 10 mins researching facts before debating", timeframe: "Next 3 debates" },
      { action: "Filler Word Elimination", description: "Record yourself and count filler words", timeframe: "1 week" }
    ],
    mediumTerm: [
      { action: "Rebuttal Drills", description: "Practice responding to random arguments instantly", timeframe: "1 month" }
    ],
    longTerm: [
      { action: "Complex Topics", description: "Tackle more abstract or philosophical topics", timeframe: "3 months" }
    ]
  },
  motivationalInsights: {
    progressHighlights: "You've shown great improvement in clarity!",
    confidenceBuilders: "Your delivery is your strongest asset.",
    encouragement: "You have the raw skills of a great debater. Keep refining your content!"
  },
  nextSteps: [
    "Review the 'Evidence Gathering' technique",
    "Practice a 1-minute speech without filler words",
    "Challenge another user to a debate"
  ]
};
