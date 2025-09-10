// Simplified domain generator with better error handling
const OpenAI = require('openai');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { niche } = req.body;
    
    if (!niche) {
      return res.status(400).json({ error: 'Niche is required' });
    }
    
    console.log(`🚀 Generating domains for niche: "${niche}"`);
    
    // Initialize OpenAI if available
    let openai = null;
    if (process.env.OPENAI_API_KEY) {
      try {
        openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });
      } catch (error) {
        console.error('OpenAI initialization error:', error);
      }
    }
    
    // Generate domains
    let domains = [];
    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ 
            role: "user", 
            content: `Generate 10 premium domain names for a high-ticket dropshipping store in the "${niche}" niche. Return only domain names, one per line, without explanations.` 
          }],
          max_tokens: 200,
          temperature: 0.8
        });
        
        domains = response.choices[0].message.content
          .split('\n')
          .map(d => d.trim())
          .filter(d => d && !d.includes('http'))
          .map(d => d.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com')
          .slice(0, 10);
      } catch (error) {
        console.error('OpenAI error:', error);
      }
    }
    
    // Fallback domains if OpenAI fails
    if (domains.length === 0) {
      domains = [
        `${niche}pro.com`,
        `${niche}elite.com`,
        `${niche}premium.com`,
        `${niche}direct.com`,
        `${niche}hub.com`,
        `${niche}zone.com`,
        `${niche}co.com`,
        `${niche}store.com`,
        `${niche}shop.com`,
        `${niche}market.com`
      ];
    }
    
    // Mock availability data
    const availableDomains = domains.map((domain, index) => ({
      domain,
      price: 99 + (index * 10),
      available: Math.random() > 0.3
    }));
    
    const competitors = [
      { name: `${niche} Pro`, domain: `${niche}pro.com`, url: `https://${niche}pro.com` },
      { name: `${niche} Elite`, domain: `${niche}elite.com`, url: `https://${niche}elite.com` },
      { name: `${niche} Premium`, domain: `${niche}premium.com`, url: `https://${niche}premium.com` }
    ];
    
    const result = {
      competitors,
      patterns: {
        patterns: {
          averageLength: 12,
          wordCount: '1-2 words'
        },
        recommendations: {
          optimalLength: '7 - 20 characters',
          brandPositioning: 'Should sound premium and trustworthy for high-ticket customers'
        },
        nicheKeywords: [niche, 'pro', 'elite', 'premium', 'direct']
      },
      recommendation: availableDomains[0] || { domain: `${niche}pro.com`, price: 99, available: false },
      alternatives: availableDomains.slice(1, 6),
      totalGenerated: domains.length,
      totalAvailable: availableDomains.filter(d => d.available).length
    };
    
    console.log('✅ Successfully generated domains:', result);
    res.status(200).json(result);
    
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate domains', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
