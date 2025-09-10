const OpenAI = require('openai');
const NameComAPI = require('./namecom-api');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Name.com API
const namecomAPI = new NameComAPI(
  process.env.NAMECOM_USERNAME, 
  process.env.NAMECOM_TOKEN
);

// Generate additional domains
async function generateMoreDomains(niche, excludeDomains) {
  try {
    console.log(`🔄 Generating more domains for niche: "${niche}", excluding: ${excludeDomains.length} domains`);
    
    const prompt = `Generate 15 additional premium domain names for a high-ticket dropshipping store in the "${niche}" niche.

Exclude these domains: ${excludeDomains.join(', ')}

Requirements:
- Professional, premium-sounding names
- 7-20 characters long
- Easy to remember and spell
- Avoid hyphens and numbers
- Sound trustworthy for high-ticket customers
- Include niche-relevant keywords
- Must be different from excluded domains

Return only the domain names, one per line, without explanations.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
      temperature: 0.8
    });

    const domains = response.choices[0].message.content
      .split('\n')
      .map(d => d.trim())
      .filter(d => d && !d.includes('http'))
      .map(d => d.replace(/\.com$/, '') + '.com')
      .filter(d => !excludeDomains.includes(d))
      .slice(0, 15);

    console.log(`✅ Generated ${domains.length} additional domain suggestions`);
    
    // Check availability
    const results = [];
    for (const domain of domains) {
      try {
        const availability = await namecomAPI.checkDomainAvailability(domain);
        if (availability.available) {
          results.push({
            domain,
            price: availability.price || 99,
            available: true
          });
        }
      } catch (error) {
        console.error(`❌ Error checking ${domain}:`, error);
      }
    }
    
    console.log(`✅ Found ${results.length} available additional domains`);
    return results;
    
  } catch (error) {
    console.error('❌ Error generating more domains:', error);
    throw error;
  }
}

// Vercel serverless function
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
    const { niche, excludeDomains = [] } = req.body;
    
    if (!niche) {
      return res.status(400).json({ error: 'Niche is required' });
    }
    
    console.log(`🚀 Generating more domains for niche: "${niche}"`);
    const result = await generateMoreDomains(niche, excludeDomains);
    
    res.status(200).json(result);
    
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate more domains', 
      details: error.message 
    });
  }
};
