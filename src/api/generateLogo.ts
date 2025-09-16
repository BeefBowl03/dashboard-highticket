// Function to select the best logo using GPT analysis
const selectBestLogo = async (imageUrls: string[], storeName: string, niche: string | null, apiKey: string): Promise<string> => {
  try {
    console.log('🤖 Using GPT to analyze and select the best logo...');
    
    const analysisPrompt = `You are a professional logo design expert. I have generated logo options for "${storeName}"${niche ? ` (${niche} industry)` : ''}. 

The first 2 logos are from DALL-E 2 (better text rendering, single logo design).
The last logo is from DALL-E 3 (higher quality but might be a collage with multiple elements).

Please analyze these logos and select the BEST ONE based on:
1. Professional appearance and brand suitability
2. Clean, modern design (STRONGLY prefer single logo over collage)
3. Good contrast and readability
4. Appropriate for business use
5. Best represents the brand identity
6. CRITICAL: Avoid collages, multiple variations, or side-by-side comparisons
7. Choose logos that show ONLY ONE isolated logo design
8. Reject any logo that shows multiple versions or layouts

If any logo shows multiple variations, collages, or side-by-side comparisons, DO NOT select it. Prefer DALL-E 2 logos (first 2) over DALL-E 3 logos (last 1) if the DALL-E 3 logo is a collage.

Return ONLY the number (1, 2, or 3) of the best logo. No explanation needed.`;

    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: analysisPrompt },
              ...imageUrls.map((url, index) => ({
                type: 'image_url',
                image_url: { url: url }
              }))
            ]
          }
        ],
        max_tokens: 10,
        temperature: 0.1
      }),
    });

    if (!gptResponse.ok) {
      console.log('⚠️ GPT analysis failed, using first logo as fallback');
      return imageUrls[0];
    }

    const gptData = await gptResponse.json();
    const selectedIndex = parseInt(gptData.choices[0].message.content.trim()) - 1;
    
    if (selectedIndex >= 0 && selectedIndex < imageUrls.length) {
      console.log(`✅ GPT selected logo #${selectedIndex + 1}`);
      return imageUrls[selectedIndex];
    } else {
      console.log('⚠️ Invalid GPT response, using first logo as fallback');
      return imageUrls[0];
    }
  } catch (error) {
    console.log('⚠️ GPT analysis error, using first logo as fallback:', error);
    return imageUrls[0];
  }
};

// API endpoint for generating logos using OpenAI DALL-E 3
export const generateLogo = async (params: {
  storeName: string;
  niche: string;
  mode: 'normal' | 'remix' | 'new';
  instructions?: string;
}): Promise<{imageUrl: string, storeName: string, niche: string | null, mode: string, instructions?: string}> => {
  try {
    const { storeName, niche, mode, instructions } = params;
    
    console.log('🚀 OPENAI GPT-IMAGE-1 LOGO GENERATION STARTING...');
    console.log('�� Store Name:', storeName);
    console.log('�� Niche:', niche);
    console.log('🎨 Mode:', mode);
    
    // Get OpenAI API key from environment variable
    const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found. Please set REACT_APP_OPENAI_API_KEY environment variable.');
    }
    
    console.log('🔑 OpenAI API Key configured:', openaiApiKey ? 'YES' : 'NO');
    
    // Build custom prompt optimized for DALL-E 3 with transparent background
    let prompt = `Create a professional logo for "${storeName}". `;
    
    if (niche) {
      prompt += `The business is in the ${niche} industry. `;
    }
    
    prompt += `Clean, modern, minimalist design. Professional color scheme (2-3 colors max). Icon or symbol on the left, company name "${storeName}" on the right. Vector-style with sharp, clean lines. High contrast and readable. Suitable for business cards, websites, and marketing materials. CRITICAL: Generate with a completely transparent background. No solid colors, patterns, or textures behind the logo. The logo should be designed to work on any background color. 

ABSOLUTELY FORBIDDEN: Multiple logo variations, collages, banners, side-by-side comparisons, or any layout showing more than one logo design. Generate EXACTLY ONE single, isolated logo design only. The entire image should contain just one logo centered in the frame. NO multiple versions, NO comparisons, NO additional elements. 1024x1024 pixels, high resolution.`;

    if (mode === "remix") {
      if (instructions) {
        prompt += `\n\nModification instructions: ${instructions}`;
      } else {
        prompt += `\n\nCreate a variation of this logo design with different colors or styling.`;
      }
    }

    if (mode === "new") {
      prompt += `\n\nCreate a completely new logo concept for this business.`;
      if (instructions) {
        prompt += `\n\nAdditional requirements: ${instructions}`;
      }
    }

    console.log('📋 Generated prompt:', prompt);
    console.log('🌐 CALLING OPENAI GPT-IMAGE-1 API...');

    // Generate logo using GPT-IMAGE-1
    console.log('🎨 Generating logo with GPT-IMAGE-1...');
    
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: '1024x1024'
      }),
    });

    console.log('📡 OpenAI API Response Status:', openaiResponse.status);

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('❌ OpenAI API Error:', errorData);
      throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const openaiData = await openaiResponse.json();
    console.log('✅ OpenAI API Success! Received image data');
    
    // Extract image data - check different possible response structures
    let imageData;
    if (openaiData.data && openaiData.data[0]) {
      // Check various possible data properties in the data array
      const firstItem = openaiData.data[0];
      if (firstItem.url) {
        imageData = firstItem.url;
        console.log('🖼️ Image URL received:', imageData);
      } else if (firstItem.b64_json) {
        // Convert base64 to data URL
        imageData = `data:image/png;base64,${firstItem.b64_json}`;
        console.log('🖼️ Image received as base64, converted to data URL');
      } else if (firstItem.image_url) {
        imageData = firstItem.image_url;
        console.log('🖼️ Image URL received:', imageData);
      } else if (firstItem.image) {
        imageData = firstItem.image;
        console.log('🖼️ Image received:', imageData);
      } else {
        console.log('❌ Data item structure:', firstItem);
        throw new Error('No image data found in data array');
      }
    } else if (openaiData.url) {
      imageData = openaiData.url;
      console.log('🖼️ Image URL received:', imageData);
    } else if (openaiData.image_url) {
      imageData = openaiData.image_url;
      console.log('🖼️ Image URL received:', imageData);
    } else {
      console.log('❌ Response structure:', openaiData);
      throw new Error('Unexpected response structure from OpenAI');
    }

    if (!imageData) {
      throw new Error('No image data returned from OpenAI');
    }

    console.log('✅ Using image data directly (no download needed)');

    // Use the image data directly (either URL or base64 data URL)
    const dataUrl = imageData;
    
    console.log('🎉 LOGO GENERATION COMPLETE! OpenAI GPT-IMAGE-1 generated logo');
    console.log('🔗 Image URL:', dataUrl);
    console.log('💡 To download: Right-click the image and "Save image as..."');

    console.log('🎉 LOGO GENERATION COMPLETE! OpenAI GPT-IMAGE-1 generated logo');
    console.log('�� Image URL:', dataUrl);

    return {
      imageUrl: dataUrl,
      storeName,
      niche: niche || null,
      mode,
      instructions
    };

  } catch (error) {
    console.error('❌ Error generating logo:', error);
    throw new Error(`Failed to generate logo: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};