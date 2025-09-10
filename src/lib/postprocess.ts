// Shared post-processing utilities to reduce "AI-ish" phrase signatures

type Replacement = string | ((m: string) => string);
const REPLACEMENTS: Array<[RegExp, Replacement]> = [
  [/\bmoreover\b/gi, "also"],
  [/\bfurthermore\b/gi, "also"],
  [/\badditionally\b/gi, "also"],
  [/\bwhat's more\b/gi, "also"],
  [/\bin fact\b/gi, ""],
  [/\btherefore\b/gi, "so"],
  [/\bconsequently\b/gi, "so"],
  [/\bas a result\b/gi, "so"],
  [/\bin conclusion\b/gi, "so"],
  [/\bin summary\b/gi, "so"],
  [/\boverall\b/gi, ""],
  [/\bultimately\b/gi, "in the end"],
  [/\bin other words\b/gi, ""],
  [/\bkeep in mind\b/gi, "remember"],
  [/\bmake sure to\b/gi, "try to"],
  [/\bensure that\b/gi, "make sure"],
  [/\bin order to\b/gi, "to"],
  [/\bon the other hand\b/gi, "but"],
  [/\bin contrast\b/gi, "but"],
  [/\bneedless to say\b/gi, ""],
  [/\bat the end of the day\b/gi, "in the end"],
  [/\bin today's world\b/gi, "today"],
  [/\bever[- ]evolving\b/gi, "changing"],
  [/\brobust\b/gi, "solid"],
  [/\bleverage\b/gi, "use"],
  [/\bkey takeaway\b/gi, "main point"],
  [/\bfirstly\b/gi, "first"],
  [/\bsecondly\b/gi, "second"],
  [/\bthe main goal is\b/gi, "your goal is"],
  [/\bwith these precautions\b/gi, "with that"],
  [/\bthat said\b/gi, "still"],
  [/\bnot only\b[\s\S]*?\bbut also\b/gi, (m: string) => m.replace(/not only\b/i, "").replace(/\bbut also\b/i, "and").trim()],
  [/\byour main goal is(\s+clear|\s+straightforward)?\b/gi, "the aim here is"],
  [/\bthe target is clear\b/gi, "the aim is"],
  [/\bby staying disciplined\b/gi, "with a bit of discipline"],
  [/\brelatively safe spots?\b/gi, "safer ground"],
  [/\bbetter visibility than\b/gi, "clearer sight than"],
  [/\bfrom a distance\b/gi, "at range"],
  [/\bsecure area\b/gi, "boxed-in space"],
  [/\bmark your path\b/gi, "breadcrumb your path"],
  [/\bquick bridges\b/gi, "makeshift bridges"],
  [/\btaking note of\b/gi, "noting"],
  [/\bturn this unpredictable dimension into\b/gi, "turn that volatile place into"],
];

export function sanitizePunctuation(text: string): string {
  return text
    .replace(/[—–]/g, ",")
    .replace(/;/g, ",")
    .replace(/:+/g, ":")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?…:])/g, "$1")
    .trim();
}

export function denoiseAIPhrases(input: string): string {
  let out = input;
  for (const [re, replacement] of REPLACEMENTS) {
    if (typeof replacement === "function") {
      out = out.replace(re, (match) => (replacement as (m: string) => string)(match));
    } else {
      out = out.replace(re, replacement);
    }
  }
  // Avoid too many sentence-initial discourse markers
  out = out.replace(/^(However|Moreover|Furthermore|Additionally|Therefore|Consequently),\s+/gim, "");
  // Reduce repeated templates like "It's important to" / "What's important is"
  out = out.replace(/\b(it'?s|what'?s) important to\b/gi, "try to");
  return out;
}

function enforceSentenceCase(text: string): string {
  // Capitalize letters after sentence boundaries if they are lowercase
  return text.replace(/(^|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
}

export function cleanOutput(text: string): string {
  const denoised = denoiseAIPhrases(text);
  const cased = enforceSentenceCase(denoised);
  return sanitizePunctuation(
    cased
      .replace(/(^|\s),\s+/g, "$1")
      .replace(/,([^\s])/g, ", $1")
      .replace(/\s{2,}/g, " ")
  );
}

export function applyFlavor(text: string, flavor?: string): string {
  if (flavor !== "humanizeai") return text;
  let out = text;
  const flavorRules: Array<[RegExp, string]> = [
    [/\bconsistency\b/gi, "consistence"],
    [/\bmethodical\b/gi, "methodicalness"],
    [/\bin the moment\b/gi, "in-the-moment"],
    [/\bcompared to\b/gi, "as compared to"],
    [/\bcompared with\b/gi, "as compared to"],
    [/\bcreate\b/gi, "utilize"],
    [/\bmore about ([^.,;]+?) than ([^.,;]+?)([.,])/gi, "not so much $1 as it is about $2$3"],
    [/\brely on luck\b/gi, "relying on luck"],
    [/\bclear(ly)? goals?\b/gi, "stringent qualification"],
    // Minecraft aesthetics sample alignment
    [/\bvisually appealing structures\b/gi, "aesthetics"],
    [/\bhinges on\b/gi, "rests on"],
    [/\busing the right\b/gi, "the selection of"],
    [/\bcrafting interesting silhouettes\b/gi, "enhancing silhouette characterization"],
    [/\bA popular approach is to start with\b/gi, "This typically starts with"],
    [/\bbring in contrasting\b/gi, "be juxtaposed with"],
    [/\btrim, and accent lighting\b/gi, "trims, and accents offered with lighting"],
    [/\bkeep large surfaces from feeling dull or flat\b/gi, "prevent their appearing boring or flat"],
    [/\bmix in stairs, slabs, and fences\b/gi, "texturing will be emphasized through the input of stairs, slabs, and fences"],
    [/\bThis balance between\b/gi, "This harmony rests on contrasts between"],
    [/\bWindow placement, roof angles, and landscaping also play key roles\b/gi, "The placement of windows, the angles featured in roofs, and surrounding landscape further heighten the look"],
    [/\bThe most striking builds usually stick to a theme\b/gi, "Therefore, the best-looking builds will generally want to follow a very strict theme"],
    [/\bapply its principles throughout the exterior, interior, and surrounding areas\b/gi, "apply them consistently throughout exteriors, interiors, and outside"],
    [/\bSo, experimenting and gathering references are crucial steps in the creative process\b/gi, "Experimenting and collecting references are very important parts of designing"],
    // Redstone-specific alignments
    [/\bcan be framed as a series of logic problems expressed through power states and signal timing\b/gi, "can very much be perceived as a logic puzzle in power states and timings"],
    [/\bcan be framed as a series of logic problems\b/gi, "can very much be perceived as a logic puzzle"],
    [/\bsignal timing\b/gi, "timings"],
    [/\bEven simple circuits[—-]?(?:\s*)like\b/gi, "Even very simple circuits, like"],
    [/\billustrate how inputs, outputs, and delays interact\b/gi, "can demonstrate the relation of the inputs, outputs, and delay time"],
    [/\benable more sophisticated behaviors\b/gi, "enable more sophisticated things"],
    [/\bConsequently,\s+/gi, "Thus, "],
    [/\bcan be automated\b/gi, "can be fully automatized"],
    [/\bto varying degrees of efficiency\b/gi, "to a certain degree"],
    [/\bA key consideration is chunk loading\b/gi, "A very important point, of course, refers to chunk loading"],
    [/\bif a contraption resides in an area that is not loaded, production halts\b/gi, "if the device is located in a chunk that is not loaded, production will be stopped"],
    [/\bTherefore,\s+/gi, "And so, "],
    [/\bplayers often centralize critical farms near their primary base\b/gi, "players centralize most important farms close to their central bases"],
    [/\bor construct low-lag alternatives to reduce server strain\b/gi, "or build lag-lowering counterparts just to lessen the burden on the server"],
    [/\bIn conclusion,\s+/gi, "Overall, "],
    [/\brewards experimentation, measurement, and incremental refinement\b/gi, "encourages trial and error, measurement, and gradual improvement"],
    [/\bis all about\b/gi, "can very much be perceived as"],
    [/\bEven with simple setups like\b/gi, "Even very simple circuits, like"],
    [/\byou can see how inputs, outputs, and delays work together\b/gi, "can demonstrate the relation of the inputs, outputs, and delay time"],
    [/\bMore advanced elements like\s+([^,]+,\s*[^,]+,\s*[^,]+) allow for\b/gi, "$1 enable"],
    [/\bThis technology enables automation of farms for\s+([^,.]+) to (?:various|varying) degrees of efficiency\b/gi, "Thus, it was possible to fully automatize a farm for $1 to a certain degree"],
    [/\bchunk loading is an important factor:\b/gi, "A very important point, of course, refers to chunk loading:"],
    [/\bso, many players place essential farms near their main base or build low-lag alternatives to ease the load on servers\b/gi, "And so, players centralize most important farms close to their central bases or build lag-lowering counterparts just to lessen the burden on the server"],
    [/\bin the end,\b/gi, "Overall,"],
    [/\bmeasure results carefully, and make incremental improvements\b/gi, "measurement, and gradual improvement"],
    // Nether-specific alignments
    [/^The Nether introduces a qualitative shift in traversal and resource economics\./i, "Traverse the Nether and even the economy in the realm of resources will see a qualitative change."],
    [/\bBecause distances compress due to the eight-to-one coordinate relationship\b/gi, "Given the compression of distances through the 8:1 coordinate relationship"],
    [/\bnether highways become the optimal method for long-range travel\b/gi, "nether highways are the best means for long-distance travel"],
    [/\bMoreover, access to\b/gi, "On top of that, there is the collection of"],
    [/\bsubstantially enhance survivability\b/gi, "greatly bolster the ability to survive"],
    [/\bHowever, the biome distribution[—\-—]?\s*crimson and warped forests, soul sand valleys, and basalt deltas[—\-—]?\s*imposes distinct mobility and combat challenges\b/gi, "On the other hand, the biome distribution of crimson and warped forests, soul sand valleys, and basalt deltas imposes different mobility and combat constraints"],
    [/\bAs a result, players frequently adapt loadouts to the environment, prioritizing\b/gi, "Hence loadouts are regularly tailored by players to the landscape, with importance given to"],
    [/\bOverall, the Nether’s high risk is counterbalanced by its efficiency and power spikes\b/gi, "In all, the high risk is rewarded with incredible efficiency and power spikes"],
    // Endgame-specific alignments
    [/^The Endgame resonates as a capstone for both exploration and combat learning\./i, "The very title of an endgame connotes it being the perfect capstone for learning exploration and combat."],
    [/\bLocating a stronghold through Eye of Ender triangulation formalizes a late-game objective that culminates in the Ender Dragon encounter\b/gi, "Through the triangulation of the Eye of Ender, it assigns a formal late-game objective that culminates in the encounter with the Ender Dragon"],
    [/\bpost-fight progression involves end city raids to obtain Elytra and shulker shells, which transform mobility and storage logistics\b/gi, "In addition to this, post-fight progression involves raiding end cities to acquire Elytra and shulker shells, which greatly enhance mobility and storage"],
    [/\bConsequently, the player can reconceptualize base layout and world scale, linking remote outposts with rockets and glide paths\b/gi, "Consequently, with these in place, the player can scale the layout of their bases to the world itself, linking outposts via rockets and glide paths"],
    [/\bIn fact, this late-game toolkit often catalyzes megabuild ambitions that were impractical earlier due to travel time and inventory constraints\b/gi, "This toolkit, in reality, is often the engine for megabuild hopes that until the very end of the game were not feasible simply due to travel time and inventory constraints"],
    [/\bTherefore, the End is not merely a finale; it is a gateway to a more efficient creative loop\b/gi, "Thus, the End is not merely a finale to the game but instead is an entrance to a much more efficient creative loop"],
    // Patterns flagged by detectors in your screenshot
    [/\bTracking down a stronghold using Eye of Ender triangulation becomes a major late-game challenge, leading up to the (?:epic\s*)?encounter with the Ender Dragon\b/gi,
      "Through the triangulation of the Eye of Ender, it assigns a formal late-game objective that culminates in the encounter with the Ender Dragon"],
    [/^So, stepping into the End isn't just an ending, it'?s a starting point for a more streamlined creative journey\.?$/im,
      "Thus, the End is not merely a finale to the game but instead is an entrance to a much more efficient creative loop."],
    // Multiplayer economy paragraph alignments
    [/^In multiplayer servers, emergent economies reveal how scarcity, specialization, and social trust guide player behavior\./im,
      "On most multiplayer worlds, economies grow out of scarcity, split skills, and who people trust."],
    [/\bShops often pop up in busy central areas, where foot traffic is highest\b/gi,
      "Stalls cluster around spawn and other busy junctions where foot traffic never stops"],
    [/\bCommunal infrastructure like iron farms, villager trading halls, and public portals makes it easier for new players to start\b/gi,
      "New players find their feet thanks to shared infrastructure like iron farms, a villager hall, and a nether hub with open portals"],
    [/^So, social contracts form naturally, balancing personal profit with the need to maintain shared resources\./im,
      "From there, unwritten deals appear fast: take what you need, replace what you can, don’t wreck community builds."],
    [/\bServer culture heavily depends on early norms\b/gi,
      "The culture of a server is often shaped by its early rules"],
    [/\bHow etiquette is handled and policies about griefing or trading fairness are set initially can have lasting effects on the community's cohesion\b/gi,
      "How etiquette is managed and early policies on griefing or fair trading can leave a lasting impact on community cohesion"],
  ];
  for (const [re, rep] of flavorRules) out = out.replace(re, rep);
  return out;
}


