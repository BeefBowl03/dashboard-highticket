// API endpoint for checking niche from store name
export const checkNiche = async (storeName: string): Promise<{hasNiche: boolean, niche: string | null}> => {
  try {
    const apiKey = 'AIzaSyCM10TnAG19r1uEpS2Ht5GQ1aunImzCmDc';
    
    const prompt = `
You are a niche checker. Analyze this business name: "${storeName}".

Rules:
- Identify the main industry/category word (e.g., "backyard", "furniture", "restaurant", "clothing").
- Ignore suffixes, slang, or filler words like "bros", "co", "shop", "store", "inc", "llc", etc.
- Only return JSON in one of these forms:

{"hasNiche": true, "niche": "<main niche word>"}
{"hasNiche": false, "niche": null}

Do NOT include markdown, code fences, or explanations.
Output ONLY one JSON object.
`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0 },
      }),
    });

    const data = await response.json();
    let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Clean up any code fences or extra text
    rawText = rawText.trim();
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/```[a-z]*\n?/gi, "").replace(/```$/, "").trim();
    }

    // Extract only JSON if wrapped
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      rawText = match[0];
    }

    let parsed = { hasNiche: false, niche: null };
    try {
      parsed = JSON.parse(rawText);
    } catch {
      console.warn("Invalid Gemini JSON after cleanup:", rawText);
    }

    return parsed;

  } catch (error) {
    console.error('Error checking niche:', error);
    return { hasNiche: false, niche: null };
  }
};
