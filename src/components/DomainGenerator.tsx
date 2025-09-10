import React, { useState } from 'react';
import { Search, Globe, Star, List, Plus, Store, AlertTriangle } from 'lucide-react';

interface Competitor {
  domain: string;
  name: string;
  description?: string;
}

interface DomainSuggestion {
  domain: string;
  price: string;
  available: boolean;
  score?: number;
}

interface DomainPatterns {
  averageLength: string;
  lengthRange: string;
  wordCount: string;
  nicheKeywords: string;
  structurePatterns: string;
  brandPositioning: string;
}

interface DomainGeneratorResults {
  competitors: Competitor[];
  patterns: DomainPatterns;
  recommendation: DomainSuggestion;
  alternatives: DomainSuggestion[];
  totalGenerated: number;
  totalAvailable: number;
}

const mockResults: DomainGeneratorResults = {
  competitors: [
    { domain: 'saunahavenusa.com', name: 'Sauna Haven USA', description: 'High-end saunas' },
    { domain: 'backyardoasis.net', name: 'Backyard Oasis', description: 'Luxury outdoor living' },
    { domain: 'firepitparadise.com', name: 'Fire Pit Paradise', description: 'Premium fire pits' },
    { domain: 'porchperfect.co', name: 'Porch Perfect', description: 'Stylish porch furniture' },
    { domain: 'grillmasters.store', name: 'Grill Masters Store', description: 'High-quality grills' },
  ],
  patterns: {
    averageLength: '14 characters',
    lengthRange: '7 - 20 characters',
    wordCount: '2 words',
    nicheKeywords: 'bbq, fire, porch, barbecue',
    structurePatterns: 'single word, two-word combination',
    brandPositioning: 'Should sound premium and trustworthy for high-ticket customers',
  },
  recommendation: { domain: 'EliteBackyard.com', price: '$12.99', available: true, score: 95 },
  alternatives: [
    { domain: 'LuxuryOutdoorLiving.com', price: '$14.99', available: true, score: 90 },
    { domain: 'PremiumPatio.store', price: '$9.99', available: true, score: 88 },
    { domain: 'GardenSanctuary.co', price: '$11.99', available: true, score: 85 },
    { domain: 'OutdoorElegance.net', price: '$13.99', available: true, score: 82 },
    { domain: 'TheBackyardPro.com', price: '$10.99', available: true, score: 80 },
  ],
  totalGenerated: 50,
  totalAvailable: 12,
};

const DomainGenerator: React.FC = () => {
  const [nicheInput, setNicheInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<DomainGeneratorResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usedDomains, setUsedDomains] = useState<Set<string>>(new Set());

  const generateDomains = async () => {
    if (!nicheInput.trim()) {
      setError('Please enter a niche to generate domains.');
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    setUsedDomains(new Set());

    try {
      // Call our API route - use relative path for same-domain deployment
      const apiUrl = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001');
      const response = await fetch(`${apiUrl}/api/generate-domains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ niche: nicheInput })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate domains');
      }

      // Transform the API response to match our interface
      const transformedResults: DomainGeneratorResults = {
        competitors: data.competitors || [],
        patterns: {
          averageLength: data.patterns?.averageLength || 12,
          lengthRange: data.patterns?.lengthRange || '8 - 16 characters',
          wordCount: data.patterns?.wordCount || '2 words',
          nicheKeywords: data.patterns?.nicheKeywords || [],
          structurePatterns: data.patterns?.structurePatterns || 'compound words',
          brandPositioning: data.patterns?.brandPositioning || 'Premium positioning'
        },
        recommendation: data.recommendation || {
          domain: `${nicheInput.toLowerCase()}elite.com`,
          price: 12.99,
          available: true,
          description: 'Premium positioning with niche focus'
        },
        alternatives: data.alternatives || [],
        totalGenerated: data.totalGenerated || 0,
        totalAvailable: data.totalAvailable || 0
      };

      setResults(transformedResults);
      
      // Track used domains
      const newUsedDomains = new Set<string>();
      newUsedDomains.add(transformedResults.recommendation.domain);
      transformedResults.alternatives.forEach(domain => {
        newUsedDomains.add(domain.domain);
      });
      setUsedDomains(newUsedDomains);

    } catch (error) {
      console.error('Error generating domains:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to generate domains: ${errorMessage}. Please check if the backend server is running on port 3001.`);
    } finally {
      setLoading(false);
    }
  };

  const generateMoreDomains = async () => {
    const currentNiche = nicheInput;
    if (!currentNiche) return;

    setLoading(true);
    setError(null);

    try {
      // Call API for more domains - use relative path for same-domain deployment
      const apiUrl = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001');
      const response = await fetch(`${apiUrl}/api/generate-domains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          niche: currentNiche,
          excludeDomains: Array.from(usedDomains)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate more domains');
      }

      const moreAlternatives: DomainSuggestion[] = data.alternatives || [];

      if (results) {
        setResults({
          ...results,
          alternatives: [...results.alternatives, ...moreAlternatives]
        });
        
        // Update used domains
        const newUsedDomains = new Set(usedDomains);
        moreAlternatives.forEach(domain => {
          newUsedDomains.add(domain.domain);
        });
        setUsedDomains(newUsedDomains);
      }

    } catch (error) {
      console.error('Error generating more domains:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to generate more domains: ${errorMessage}. Please check if the backend server is running on port 3001.`);
    } finally {
      setLoading(false);
    }
  };

  const resetAndRetry = () => {
    setNicheInput('');
    setResults(null);
    setError(null);
    setLoading(false);
    setUsedDomains(new Set());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
          Find the Perfect Domain for Your High-Ticket Dropshipping Store
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            id="nicheInput"
            placeholder="e.g., backyard, marine, horse riding, smart home..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
            value={nicheInput}
            onChange={(e) => setNicheInput(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') generateDomains(); }}
          />
          <button
            id="generateBtn"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-500 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
            onClick={generateDomains}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Search className="w-5 h-5" />
            )}
            Generate Domains
          </button>
        </div>
      </div>

      {/* Loading Section */}
      {loading && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <div className="spinner animate-spin h-12 w-12 text-blue-500 mx-auto mb-4">
            <Globe className="w-full h-full" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Domains...</h3>
          <p className="text-gray-600">Finding the perfect domains for your high-ticket dropshipping store</p>
        </div>
      )}

      {/* Error Section */}
      {error && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={resetAndRetry}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-500 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results Section */}
      {results && !loading && (
        <div className="space-y-8">
          {/* Popular Stores */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Store className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Popular Stores in Your Niche</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.competitors.map((comp, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{comp.name}</p>
                  <p className="text-sm text-gray-600">{comp.domain}</p>
                  {comp.description && <p className="text-xs text-gray-500 mt-1">{comp.description}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Domain Patterns */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Domain Patterns Found</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Average Length:</span>
                <span className="font-medium text-gray-900">{results.patterns.averageLength}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Length Range:</span>
                <span className="font-medium text-gray-900">{results.patterns.lengthRange}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Most Common Word Count:</span>
                <span className="font-medium text-gray-900">{results.patterns.wordCount}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Niche Keywords:</span>
                <span className="font-medium text-gray-900">{results.patterns.nicheKeywords}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Structure Patterns:</span>
                <span className="font-medium text-gray-900">{results.patterns.structurePatterns}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Brand Positioning:</span>
                <span className="font-medium text-gray-900">{results.patterns.brandPositioning}</span>
              </div>
            </div>
          </div>

          {/* Best Domain */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-900">Our Top Recommendation</h3>
            </div>
            {results.recommendation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-blue-700">{results.recommendation.domain}</p>
                  <p className="text-sm text-blue-600">Price: {results.recommendation.price}</p>
                </div>
                {results.recommendation.available ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Available</span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">Taken</span>
                )}
              </div>
            )}
          </div>

          {/* Alternative Domains */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <List className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Alternative Options</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {results.alternatives.map((domain, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{domain.domain}</p>
                    <p className="text-sm text-gray-600">Price: {domain.price}</p>
                  </div>
                  {domain.available ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Available</span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">Taken</span>
                  )}
                </div>
              ))}
            </div>
            <button
              id="generateMoreBtn"
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
              onClick={generateMoreDomains}
              disabled={loading}
            >
              <Plus className="w-5 h-5" />
              Generate 5 More Options
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainGenerator;
