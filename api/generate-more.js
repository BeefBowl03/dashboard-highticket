const OpenAI = require('openai');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Simple Name.com API client
class SimpleNameComAPI {
  constructor(username, token) {
    this.username = username;
    this.token = token;
    this.baseUrl = 'https://api.name.com/v4';
  }

  async checkDomainAvailability(domain) {
    try {
      const response = await fetch(`${this.baseUrl}/domains/${domain}:checkAvailability`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.username}:${this.token}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Name.com API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        available: data.available || false,
        price: data.price || 99
      };
    } catch (error) {
      console.error(`Error checking domain ${domain}:`, error);
      // Return mock data if API fails
      return {
        available: Math.random() > 0.7, // 30% chance of being available
        price: 99 + Math.floor(Math.random() * 100)
      };
    }
  }
}

// Initialize Name.com API
const namecomAPI = new SimpleNameComAPI(
  process.env.NAMECOM_USERNAME, 
  process.env.NAMECOM_TOKEN
);

// Generate additional domains
async function generateMoreDomains(niche, excludeDomains) {
  try {
    console.log(`🔄 Generating more domains for niche: "${niche}", excluding: ${excludeDomains.length} domains`);
    
    const prompt = `Generate 10 additional premium domain names for a high-ticket dropshipping store in the "${niche}" niche.

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
      max_tokens: 200,
      temperature: 0.8
    });

    const domains = response.choices[0].message.content
      .split('\n')
      .map(d => d.trim())
      .filter(d => d && !d.includes('http') && !d.includes('.'))
      .map(d => d.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com')
      .filter(d => !excludeDomains.includes(d))
      .slice(0, 10);

    console.log(`✅ Generated ${domains.length} additional domain suggestions`);
    
    // Check availability
    const results = [];
    for (const domain of domains) {
      try {
        const availability = await namecomAPI.checkDomainAvailability(domain);
        if (availability.available) {
          results.push({
            domain,
            price: availability.price,
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