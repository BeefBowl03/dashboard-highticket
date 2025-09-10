// Heuristic scorer to pick the most "human-like" candidate among several

const PHRASE_FLAGS: RegExp[] = [
  /\bmoreover\b/gi,
  /\bfurthermore\b/gi,
  /\badditionally\b/gi,
  /\btherefore\b/gi,
  /\bconsequently\b/gi,
  /\bas a result\b/gi,
  /\bin conclusion\b/gi,
  /\bin summary\b/gi,
  /\boverall\b/gi,
  /\bultimately\b/gi,
  /\bin other words\b/gi,
  /\bmore important(ly)?\b/gi,
  /\bmake sure to\b/gi,
  /\bensure that\b/gi,
];

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function splitSentences(text: string): string[] {
  const parts = text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'\(])/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [text.trim()].filter(Boolean);
}

function stddev(nums: number[]): number {
  if (nums.length === 0) return 0;
  const m = nums.reduce((a, b) => a + b, 0) / nums.length;
  const v = nums.reduce((a, b) => a + (b - m) * (b - m), 0) / nums.length;
  return Math.sqrt(v);
}

function jaccardSimilarity(aTokens: string[], bTokens: string[]): number {
  const a = new Set(aTokens);
  const b = new Set(bTokens);
  const intersection = Array.from(a).filter((x) => b.has(x)).length;
  const union = unique(Array.from(a).concat(Array.from(b))).length;
  return union === 0 ? 0 : intersection / union;
}

export type CandidateScore = {
  score: number; // lower is better (less AI-like risk)
  components: {
    phrases: number;
    lowVariancePenalty: number;
    similarityPenalty: number;
  };
};

export function scoreCandidate(output: string, input: string): CandidateScore {
  // 1) Phrase hits
  const phraseHits = PHRASE_FLAGS.reduce((acc, re) => acc + (output.match(re)?.length ?? 0), 0);

  // 2) Sentence length variance (low variance looks AI-ish)
  const sentences = splitSentences(output);
  const lengths = sentences.map((s) => tokenize(s).length);
  const sentStd = stddev(lengths);
  const lowVariancePenalty = sentStd < 5 ? (5 - sentStd) : 0; // penalize below threshold

  // 3) Similarity to input (too close can be flagged)
  const sim = jaccardSimilarity(tokenize(output), tokenize(input));
  const similarityPenalty = sim > 0.7 ? (sim - 0.7) * 10 : 0; // mild penalty if overly similar

  const score = phraseHits * 2 + lowVariancePenalty * 1.5 + similarityPenalty;
  return {
    score,
    components: { phrases: phraseHits, lowVariancePenalty, similarityPenalty },
  };
}


