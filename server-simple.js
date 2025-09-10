const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Simple competitors data
const COMPETITORS = {
  backyard: [
    { name: "Fire Pit Surplus", domain: "firepitsurplus.com", url: "https://firepitsurplus.com" },
    { name: "Fire Pits Direct", domain: "firepitsdirect.com", url: "https://firepitsdirect.com" },
    { name: "BBQGuys", domain: "bbqguys.com", url: "https://bbqguys.com" },
    { name: "All Things Barbecue", domain: "allthingsbarbecue.com", url: "https://allthingsbarbecue.com" },
    { name: "Outdoor Living", domain: "outdoorliving.com", url: "https://outdoorliving.com" }
  ],
  marine: [
    { name: "West Marine", domain: "westmarine.com", url: "https://westmarine.com" },
    { name: "iBoats", domain: "iboats.com", url: "https://iboats.com" },
    { name: "Wholesale Marine", domain: "wholesalemarine.com", url: "https://wholesalemarine.com" },
    { name: "Marine Depot", domain: "marinedepot.com", url: "https://marinedepot.com" },
    { name: "BoatUS", domain: "boatus.com", url: "https://boatus.com" }
  ],
  fitness: [
    { name: "Strength Warehouse USA", domain: "strengthwarehouseusa.com", url: "https://strengthwarehouseusa.com" },
    { name: "Fitness Factory", domain: "fitnessfactory.com", url: "https://fitnessfactory.com" },
    { name: "Fitness Zone", domain: "fitnesszone.com", url: "https://fitnesszone.com" },
    { name: "Gym Equipment", domain: "gymequipment.com", url: "https://gymequipment.com" },
    { name: "Fitness Direct", domain: "fitnessdirect.com", url: "https://fitnessdirect.com" }
  ]
};

// Generate domains using OpenAI
async function generateDomains(niche) {
  try {
    if (!openai) {
      throw new Error('OpenAI not configured');
    }

    const prompt = `Generate 15 premium domain names for a high-ticket dropshipping store in the "${niche}" niche.

Requirements:
- Professional, premium-sounding names
- 7-20 characters long
- Easy to remember and spell
- Avoid hyphens and numbers
- Sound trustworthy for high-ticket customers
- Include niche-relevant keywords

Return only the domain names, one per line, without explanations.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.8
    });

    const domains = response.choices[0].message.content
      .split('\n')
      .map(d => d.trim())
      .filter(d => d && !d.includes('http') && !d.includes('.'))
      .map(d => d.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com')
      .slice(0, 15);

    return domains;
  } catch (error) {
    console.error('OpenAI error:', error);
    // Fallback domains
    return [
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
}

// Check domain availability (mock for now)
function checkAvailability(domain) {
  return {
    available: Math.random() > 0.3, // 70% chance available
    price: 99 + Math.floor(Math.random() * 100)
  };
}

// Main API endpoint
app.post('/api/generate-domains', async (req, res) => {
  try {
    const { niche } = req.body;
    
    if (!niche) {
      return res.status(400).json({ error: 'Niche is required' });
    }
    
    console.log(`🚀 Generating domains for niche: "${niche}"`);
    
    // Get competitors
    const competitors = COMPETITORS[niche.toLowerCase()] || [
      { name: `${niche} Pro`, domain: `${niche}pro.com`, url: `https://${niche}pro.com` },
      { name: `${niche} Elite`, domain: `${niche}elite.com`, url: `https://${niche}elite.com` },
      { name: `${niche} Premium`, domain: `${niche}premium.com`, url: `https://${niche}premium.com` }
    ];
    
    // Generate domains
    const domains = await generateDomains(niche);
    
    // Check availability
    const availableDomains = [];
    for (const domain of domains) {
      const availability = checkAvailability(domain);
      if (availability.available) {
        availableDomains.push({
          domain,
          price: availability.price,
          available: true
        });
      }
    }
    
    const result = {
      competitors: competitors.slice(0, 5),
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
      totalAvailable: availableDomains.length
    };
    
    console.log('✅ Successfully generated domains:', result);
    res.json(result);
    
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate domains', 
      details: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Domain generator API is working',
    timestamp: new Date().toISOString()
  });
});

// Export for Vercel
module.exports = app;
