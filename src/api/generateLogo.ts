// API endpoint for generating logos - Updated
export const generateLogo = async (params: {
  storeName: string;
  niche: string;
  mode: 'normal' | 'remix' | 'new';
  instructions?: string;
}): Promise<{imageUrl: string, storeName: string, niche: string | null, mode: string, instructions?: string}> => {
  try {
    const { storeName, niche, mode, instructions } = params;
    const apiKey = 'AIzaSyCM10TnAG19r1uEpS2Ht5GQ1aunImzCmDc';
    const removeBgKey = 'MPUPRny35humJawDkMh6vX8t';
    
    // Build text prompt
    let prompt = `
    Create a professional LOGO for a store called "${storeName}".
    - The niche of this store is: "${niche || "infer from name"}".
    - Icon LEFT, text "${storeName}" RIGHT, same height as icon.
    - Style: clean, modern, vector-style with sharp lines.
    - Colors: choose 1–3 professional colors that suit the niche.
    - Background: must be 100% TRANSPARENT (real alpha channel).
    - Do NOT include any white, black, gray, or checkerboard backgrounds.
    - The output must be a clean PNG with alpha transparency only.
    - Tightly cropped, sharp, high-resolution, suitable as a real company logo.
    `;

    if (mode === "remix") {
      if (instructions) {
        prompt += `\nFollow these specific remix instructions strictly: ${instructions}`;
      } else {
        prompt += "\nNow generate a variation of the previous design.";
      }
    }

    if (mode === "new") {
      prompt += "\nNow ignore the previous design and create a fresh new concept.";
      if (instructions) {
        prompt += `\nAdditionally, follow these specific instructions: ${instructions}`;
      }
    }

    // Build contents for Gemini API
    const contents: any[] = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${encodeURIComponent(apiKey)}`;

    const genRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.6 },
      }),
    });

    if (!genRes.ok) {
      const body = await genRes.text();
      throw new Error(`Gemini HTTP ${genRes.status}: ${body}`);
    }

    const genJson = await genRes.json();
    const parts = genJson?.candidates?.[0]?.content?.parts ?? [];
    const imagePart =
      parts.find((p: any) => p?.inlineData?.data) ||
      parts.find((p: any) => p?.inline_data?.data);

    const base64: string | undefined =
      imagePart?.inlineData?.data || imagePart?.inline_data?.data;
    let mime: string =
      imagePart?.inlineData?.mimeType ||
      imagePart?.inline_data?.mime_type ||
      "image/png";

    if (!base64) {
      const textMsg = parts.find((p: any) => p?.text)?.text;
      throw new Error(textMsg || "No image returned from Gemini");
    }

    // Always strip backgrounds with remove.bg
    let finalBase64 = base64;

    if (removeBgKey) {
      const fd = new FormData();
      fd.append("image_file_b64", base64);
      fd.append("size", "auto");
      fd.append("format", "png");

      const rbRes = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": removeBgKey },
        body: fd,
      });

      if (rbRes.ok) {
        const arrayBuf = await rbRes.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuf);
        finalBase64 = btoa(String.fromCharCode(...uint8Array));
        mime = "image/png";
      } else {
        const errText = await rbRes.text();
        console.warn("remove.bg error (keeping Gemini image):", errText);
      }
    }

    const dataUrl = `data:${mime};base64,${finalBase64}`;
    return {
      imageUrl: dataUrl,
      storeName,
      niche: niche || null,
      mode,
      instructions
    };

  } catch (error) {
    console.error('Error generating logo:', error);
    throw new Error('Failed to generate logo');
  }
};
