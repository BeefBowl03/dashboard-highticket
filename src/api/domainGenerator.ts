// Domain Generator API functions - Frontend calls backend server
// Backend server handles Name.com API calls to avoid CORS issues

export interface Competitor {
  name: string;
  domain: string;
  url: string;
}

export interface DomainPatterns {
  patterns?: {
    averageLength?: number;
    wordCount?: string;
  };
  recommendations?: {
    optimalLength?: string;
    brandPositioning?: string;
  };
  nicheKeywords?: string[];
}

export interface DomainOption {
  domain: string;
  price: number;
  available: boolean;
}

export interface DomainGeneratorResponse {
  competitors: Competitor[];
  patterns: DomainPatterns;
  recommendation: DomainOption;
  alternatives: DomainOption[];
  totalGenerated: number;
  totalAvailable: number;
}

// Backend API base URL - use relative URLs for serverless deployment
const API_BASE_URL = ''; // Always use relative URLs for Vercel serverless functions

// Main function to generate domains for a niche using backend API
export async function generateDomainsForNiche(niche: string): Promise<DomainGeneratorResponse> {
  try {
    console.log(`🚀 Starting domain generation for niche: "${niche}"`);
    
    const response = await fetch(`${API_BASE_URL}/api/generate-domains`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ niche })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Received response from backend:`, data);
    
    return data;
  } catch (error) {
    console.error('❌ Error generating domains for niche:', error);
    
    // Fallback response if backend is not available
    if (error instanceof Error && error.message.includes('fetch')) {
      console.warn('⚠️ Backend server not available, using fallback response');
      return {
        competitors: [
          { name: `${niche} Pro`, domain: `${niche}pro.com`, url: `https://${niche}pro.com` },
          { name: `${niche} Elite`, domain: `${niche}elite.com`, url: `https://${niche}elite.com` },
          { name: `${niche} Premium`, domain: `${niche}premium.com`, url: `https://${niche}premium.com` },
          { name: `${niche} Solutions`, domain: `${niche}solutions.com`, url: `https://${niche}solutions.com` },
          { name: `${niche} Hub`, domain: `${niche}hub.com`, url: `https://${niche}hub.com` }
        ],
        patterns: {
          patterns: {
            averageLength: 14,
            wordCount: '2 words'
          },
          recommendations: {
            optimalLength: '7 - 20 characters',
            brandPositioning: `Should sound premium and trustworthy for high-ticket ${niche} customers`
          },
          nicheKeywords: [niche, 'pro', 'elite', 'premium', 'solutions']
        },
        recommendation: {
          domain: `${niche}pro.com`,
          price: 99,
          available: false
        },
        alternatives: [],
        totalGenerated: 0,
        totalAvailable: 0
      };
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate domains for "${niche}". Please try again. Error: ${errorMessage}`);
  }
}

// Generate additional domains avoiding duplicates
export async function generateMoreDomains(niche: string, excludeDomains: string[]): Promise<DomainOption[]> {
  try {
    console.log(`🔄 Generating more domains for niche: "${niche}", excluding: ${excludeDomains.join(', ')}`);
    
    const response = await fetch(`${API_BASE_URL}/api/generate-domains`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        niche,
        excludeDomains,
        generateMore: true 
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.alternatives || [];
  } catch (error) {
    console.error('❌ Error generating more domains:', error);
    return [];
  }
}

// Check if backend server is available
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.warn('⚠️ Backend server not available:', error);
    return false;
  }
}