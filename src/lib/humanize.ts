/*
  Text humanization utilities.

  Notes:
  - This module performs lightweight paraphrasing and stylistic adjustments to increase
    variation (perplexity/burstiness) while preserving meaning as much as possible.
  - No algorithm can guarantee being "undetectable" as AI-generated. Use responsibly.
*/

export type HumanizeOptions = {
  creativity?: number; // 0..1 controls strength of transformations
  tone?: "neutral" | "casual" | "formal" | "friendly";
  addPersonalTouches?: boolean; // insert mild first-person framing when appropriate
  preserveFormatting?: boolean; // keep paragraph breaks
};

const DEFAULT_OPTIONS: Required<HumanizeOptions> = {
  creativity: 0.7,
  tone: "neutral",
  addPersonalTouches: false,
  preserveFormatting: true,
};

// Lightweight synonym map for frequent AI-ish phrasing
const SYNONYMS: Record<string, string[]> = {
  therefore: ["so", "as a result", "for that reason"],
  however: ["but", "that said", "still"],
  moreover: ["also", "plus", "what's more"],
  furthermore: ["also", "in addition", "on top of that"],
  additionally: ["also", "besides", "on top of that"],
  utilize: ["use"],
  demonstrates: ["shows", "illustrates"],
  consequently: ["so", "as a result"],
  significant: ["big", "notable", "meaningful"],
  optimal: ["best", "ideal"],
  numerous: ["many", "a lot of"],
  various: ["several", "a few different"],
  method: ["approach", "way"],
  objective: ["goal", "aim"],
  commence: ["begin", "start"],
  terminate: ["end", "finish"],
  obtain: ["get"],
  modify: ["change", "tweak"],
  maintain: ["keep", "preserve"],
};

const FILLERS_CASUAL = [
  "to be honest",
  "frankly",
  "if I'm being real",
  "just to keep it simple",
  "in plain words",
];

const FILLERS_FRIENDLY = [
  "to put it simply",
  "here's the gist",
  "the short version is",
  "in everyday terms",
];

const HEDGES = [
  "usually",
  "generally",
  "in many cases",
  "for the most part",
  "often",
  "sometimes",
];

const CONTRACTIONS: Record<string, string> = {
  "do not": "don't",
  "does not": "doesn't",
  "did not": "didn't",
  "can not": "cannot",
  "cannot": "can't",
  "will not": "won't",
  "is not": "isn't",
  "are not": "aren't",
  "was not": "wasn't",
  "were not": "weren't",
  "it is": "it's",
  "it has": "it's",
  "that is": "that's",
  "there is": "there's",
  "there has": "there's",
  "we are": "we're",
  "you are": "you're",
  "they are": "they're",
  "I am": "I'm",
};

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function randomChoice<T>(arr: T[], rng: () => number): T | undefined {
  if (arr.length === 0) return undefined;
  const idx = Math.floor(rng() * arr.length);
  return arr[idx];
}

function seededRng(seed: number): () => number {
  // Mulberry32
  let t = Math.floor(seed) >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function splitIntoParagraphs(text: string): string[] {
  return text.split(/\n{2,}/g).map((p) => p.trim()).filter(Boolean);
}

function splitIntoSentences(paragraph: string): string[] {
  const parts = paragraph
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'\(])/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [paragraph];
}

function maybeApplyContractions(text: string, strength: number, rng: () => number): string {
  if (strength <= 0.1) return text;
  let out = text;
  // Replace longer phrases first to avoid partial overlaps
  const entries = Object.entries(CONTRACTIONS).sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of entries) {
    out = out.replace(new RegExp(`\\b${escapeRegExp(from)}\\b`, "gi"), (m) => {
      return rng() < strength ? matchCase(to, m) : m;
    });
  }
  return out;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchCase(replacement: string, original: string): string {
  if (original.toUpperCase() === original) return replacement.toUpperCase();
  if (original[0] === original[0]?.toUpperCase())
    return replacement[0].toUpperCase() + replacement.slice(1);
  return replacement;
}

function sanitizePlainPunctuation(input: string): string {
  // Normalize whitespace; avoid leading/trailing spaces around punctuation
  // NOTE: We intentionally do NOT blanket-replace em/en dashes here.
  //       Numeric ranges are handled later; other dashes get softened in heuristics.
  return input
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?…])/g, "$1")
    .replace(/,([A-Za-z])/g, ", $1");
}

function swapSynonyms(sentence: string, strength: number, rng: () => number): string {
  const tokens = sentence.split(/(\W+)/);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const lower = token.toLowerCase();
    if (SYNONYMS[lower] && /[A-Za-z]/.test(token)) {
      if (rng() < strength * 0.8) {
        const choice = randomChoice(SYNONYMS[lower], rng);
        if (choice) tokens[i] = matchCase(choice, token);
      }
    }
  }
  return tokens.join("");
}

function rewriteSentenceHeuristics(sentence: string, strength: number, rng: () => number): string {
  let s = sentence;
  if (strength > 0.15) {
    // Tone down formal openers
    s = s.replace(/^(Additionally|Moreover|Furthermore),\s+/i, rng() < 0.7 ? "Also, " : "");
    s = s.replace(/^Consequently,\s+/i, rng() < 0.7 ? "So, " : "");
  }
  if (strength > 0.25 && rng() < strength) {
    // More conversational starts
    s = s.replace(/^In the ([A-Za-z\s]+?),\s+/i, (_m, p1) => {
      return rng() < 0.6 ? `Once you're in the ${p1}, ` : `When you're in the ${p1}, `;
    });
    s = s.replace(/^With (an? |the )/i, (m) => (rng() < 0.6 ? "Grab " : "Take "));
  }
  if (strength > 0.35) {
    // Simplify formal phrases
    s = s
      .replace(/\bin order to\b/gi, "to")
      .replace(/\bprior to\b/gi, "before")
      .replace(/\bsubsequently\b/gi, "after")
      .replace(/\bapproximately\b/gi, "about");
  }
  if (rng() < strength * 0.5) {
    // Convert numeric ranges like 6-8 or 6–8 to "around 6 to 8"
    s = s.replace(/(\d+)\s*[–-]\s*(\d+)/g, (_m, a, b) => `around ${a} to ${b}`);
  }
  // Collapse doubled spaces and fix spaces before punctuation
  s = s.replace(/\s+/g, " ").replace(/\s+([,.!?…])/g, "$1");
  return s;
}

function addHedges(sentence: string, tone: HumanizeOptions["tone"], strength: number, rng: () => number): string {
  // Conservative: add hedges rarely and mid-sentence only
  if (strength < 0.45) return sentence;
  if (rng() > 0.15) return sentence;
  const hedge = randomChoice(HEDGES, rng);
  if (!hedge) return sentence;
  const commaIndex = sentence.indexOf(",");
  if (commaIndex <= 0 || commaIndex >= sentence.length - 1) return sentence;
  const before = sentence.slice(0, commaIndex + 1);
  const after = sentence.slice(commaIndex + 1).trimStart();
  return `${before} ${hedge}, ${after}`;
}

function varyPunctuation(sentence: string, strength: number, rng: () => number): string {
  // Conservative: do not add stylized punctuation (em dashes, semicolons, colons).
  // Only normalize whitespace around existing punctuation.
  return sentence
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?…])/g, "$1");
}

function adjustSentenceLength(sentence: string, strength: number, rng: () => number): string {
  if (strength < 0.1) return sentence;
  const words = sentence.split(/\s+/);
  if (words.length < 10) return sentence;
  if (rng() < strength * 0.5) {
    // Split once at a natural comma or conjunction
    const idx = words.findIndex((w) => /,|and|but|so/i.test(w));
    if (idx > 3 && idx < words.length - 3) {
      return `${words.slice(0, idx + 1).join(" ")}. ${words.slice(idx + 1).join(" ")}`;
    }
  }
  return sentence;
}

function maybePersonalize(sentence: string, enable: boolean, rng: () => number): string {
  if (!enable) return sentence;
  if (rng() > 0.25) return sentence;
  // Mild first-person framing
  return sentence.replace(/^(.+?)$/, (m) => `From my experience, ${m}`);
}

function tuneTone(sentence: string, tone: NonNullable<HumanizeOptions["tone"]>, rng: () => number): string {
  switch (tone) {
    case "casual":
      return sentence
        .replace(/\bfor example\b/gi, rng() < 0.7 ? "like" : "for example")
        .replace(/\bsuch as\b/gi, rng() < 0.5 ? "like" : "such as");
    case "friendly":
      return sentence.replace(/\bconsider\b/gi, rng() < 0.6 ? "think about" : "consider");
    case "formal":
      return sentence
        .replace(/\bkids\b/gi, "children")
        .replace(/\bokay\b/gi, "acceptable");
    default:
      return sentence;
  }
}

function processSentence(
  sentence: string,
  options: Required<HumanizeOptions>,
  rng: () => number
): string {
  const strength = options.creativity;
  let s = sentence.trim();
  s = swapSynonyms(s, strength, rng);
  s = maybeApplyContractions(s, tonePrefersContractions(options.tone) ? strength : strength * 0.2, rng);
  s = rewriteSentenceHeuristics(s, strength, rng);
  s = addHedges(s, options.tone, strength, rng);
  s = varyPunctuation(s, strength, rng);
  s = adjustSentenceLength(s, strength, rng);
  s = maybePersonalize(s, options.addPersonalTouches, rng);
  s = tuneTone(s, options.tone, rng);
  return s;
}

function tonePrefersContractions(tone: HumanizeOptions["tone"]): boolean {
  return tone === "casual" || tone === "friendly" || tone === "neutral";
}

export function humanizeText(input: string, opts?: HumanizeOptions): { output: string } {
  const options = { ...DEFAULT_OPTIONS, ...(opts ?? {}) } as Required<HumanizeOptions>;
  const seed = Math.abs(hashString(input + JSON.stringify(options)));
  const rng = seededRng(seed);
  const cleaned = sanitizePlainPunctuation(input);
  const paragraphs = options.preserveFormatting ? splitIntoParagraphs(cleaned) : [cleaned.replace(/\n+/g, " ")];

  const transformed = paragraphs.map((p) => {
    const sentences = splitIntoSentences(p);
    // Shuffle lightly based on creativity for burstiness
    const shouldShuffle = rng() < options.creativity * 0.45;
    const shuffled = shouldShuffle ? softShuffle(sentences, rng, options.creativity) : sentences;
    const out = shuffled.map((s) => processSentence(s, options, rng));
    return joinSentences(out);
  });

  const output = options.preserveFormatting ? transformed.join("\n\n") : transformed.join(" ");
  return { output };
}

function softShuffle<T>(arr: T[], rng: () => number, strength: number): T[] {
  const result = [...arr];
  for (let i = 0; i < result.length - 1; i++) {
    if (rng() < strength * 0.2) {
      const j = Math.min(result.length - 1, Math.max(0, i + (rng() < 0.5 ? -1 : 1)));
      const tmp = result[i];
      result[i] = result[j];
      result[j] = tmp;
    }
  }
  return result;
}

function joinSentences(sentences: string[]): string {
  return sentences
    .map((s) => {
      // Ensure ending punctuation
      if (!/[.!?…]$/.test(s)) return s + ".";
      return s;
    })
    .join(" ");
}

function hashString(str: string): number {
  // Simple 32-bit hash (FNV-1a)
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h | 0;
}

export function validateOptions(options: HumanizeOptions | undefined): Required<HumanizeOptions> {
  const merged = { ...DEFAULT_OPTIONS, ...(options ?? {}) } as Required<HumanizeOptions>;
  merged.creativity = clamp01(merged.creativity);
  return merged;
}


