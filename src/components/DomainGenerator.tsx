import React, { useState } from 'react';
import { Globe, Search, Star, List, Plus, AlertTriangle } from 'lucide-react';
import { generateDomainsForNiche, generateMoreDomains as generateMoreDomainsAPI, DomainGeneratorResponse } from '../api/domainGenerator';

// Using interfaces from the API file

const DomainGenerator: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DomainGeneratorResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [usedDomains, setUsedDomains] = useState<Set<string>>(new Set());

  const generateDomains = async () => {
    if (!niche.trim()) {
      alert('Please enter a niche');
      return;
    }

    setLoading(true);
    setError('');
    setUsedDomains(new Set());

    try {
      // Call the real API
      const data = await generateDomainsForNiche(niche);
      setResults(data);
      
      // Track used domains
      const newUsedDomains = new Set([data.recommendation.domain]);
      data.alternatives.forEach(domain => newUsedDomains.add(domain.domain));
      setUsedDomains(newUsedDomains);

    } catch (error) {
      console.error('Error generating domains:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate domains. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateMoreDomains = async () => {
    if (!niche || !results) return;

    setLoading(true);

    try {
      // Call the real API for more domains
      const additionalDomains = await generateMoreDomainsAPI(niche, Array.from(usedDomains));

      setResults(prev => ({
        ...prev!,
        alternatives: [...prev!.alternatives, ...additionalDomains]
      }));

      // Track new domains
      const newUsedDomains = new Set(usedDomains);
      additionalDomains.forEach(domain => newUsedDomains.add(domain.domain));
      setUsedDomains(newUsedDomains);

    } catch (error) {
      console.error('Error generating more domains:', error);
      alert('Failed to generate more domains. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndRetry = () => {
    setError('');
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Section */}
        <div className="mb-12">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
              Enter Your Niche
            </h2>
            <div className="flex gap-4 max-w-3xl mx-auto">
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="backyard"
                className="flex-1 p-4 bg-gray-700 border border-yellow-500 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg"
                onKeyPress={(e) => e.key === 'Enter' && generateDomains()}
              />
              <button
                onClick={generateDomains}
                disabled={loading}
                className="px-8 py-4 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 disabled:opacity-50 flex items-center gap-2 text-lg"
              >
                <Search size={20} />
                Generate Domains
              </button>
            </div>
          </div>
        </div>

        {/* Loading Section */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-[#c19d44] mb-4"></div>
            <h3 className="text-xl font-semibold text-[#c19d44] mb-2">Generating Domains...</h3>
            <p className="text-[#ffffff80]">Finding the perfect domains for your high-ticket dropshipping store</p>
          </div>
        )}

        {/* Results Section */}
        {results && !loading && (
          <div className="space-y-8">
            {/* Popular Stores */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Globe size={24} className="text-yellow-500" />
                Popular Stores in Your Niche
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {results.competitors.slice(0, 4).map((competitor, index) => (
                  <div key={index} className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:border-yellow-500 transition-colors">
                    <a
                      href={competitor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-yellow-500 font-medium block text-lg"
                    >
                      {competitor.name}
                    </a>
                    <div className="text-gray-400 text-sm mt-1">{competitor.domain}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Domain Patterns */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Search size={24} className="text-yellow-500" />
                Domain Patterns Found:
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-600 pb-3">
                  <span className="text-yellow-500 font-medium">Average Length:</span>
                  <span className="text-white font-medium">{results.patterns.patterns?.averageLength || 12} characters</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-600 pb-3">
                  <span className="text-yellow-500 font-medium">Length Range:</span>
                  <span className="text-white font-medium">{results.patterns.recommendations?.optimalLength || '12-20 characters'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-600 pb-3">
                  <span className="text-yellow-500 font-medium">Most Common Word Count:</span>
                  <span className="text-white font-medium">{results.patterns.patterns?.wordCount || '2-3 words'}</span>
                </div>
                <div className="border-b border-gray-600 pb-3">
                  <span className="text-yellow-500 font-medium">Niche Keywords:</span>
                  <div className="text-white mt-2">
                    {results.patterns.nicheKeywords?.join(', ') || 'backyard, yard, patio, deck, outdoor, garden space, courtyard'}
                  </div>
                </div>
                <div className="border-b border-gray-600 pb-3">
                  <span className="text-yellow-500 font-medium">Structure Patterns:</span>
                  <div className="text-white mt-2">
                    prefix + niche keyword + suffix | niche keyword + descriptive word
                  </div>
                </div>
                <div>
                  <span className="text-yellow-500 font-medium">Brand Positioning:</span>
                  <div className="text-white mt-2">
                    {results.patterns.recommendations?.brandPositioning || 'Domains should convey elegance, quality, and exclusivity to attract high-ticket customers.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Recommendation */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Star size={24} className="text-yellow-500" />
                Our Top Recommendation
              </h3>
              <div className="bg-yellow-500 rounded-lg p-8 text-center shadow-lg">
                <div className="text-3xl font-bold text-black mb-3">{results.recommendation.domain}</div>
                <div className="text-xl text-black">${results.recommendation.price}/year</div>
              </div>
            </div>

            {/* Alternative Options */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <List size={24} className="text-yellow-500" />
                Alternative Options
              </h3>
              <div className="space-y-4 mb-8">
                {results.alternatives.map((domain, index) => (
                  <div key={index} className="bg-gray-700 border border-gray-600 rounded-lg p-4 flex justify-between items-center hover:border-yellow-500 transition-colors">
                    <div className="text-white font-medium text-lg">{domain.domain}</div>
                    <div className="text-gray-400">${domain.price}/year</div>
                  </div>
                ))}
              </div>
              <button
                onClick={generateMoreDomains}
                disabled={loading}
                className="w-full px-6 py-4 bg-gray-700 border border-gray-600 text-white rounded-lg hover:bg-gray-600 hover:border-yellow-500 disabled:opacity-50 flex items-center justify-center gap-2 transition-all text-lg"
              >
                <Plus size={20} />
                + Generate 5 More Options
              </button>
            </div>
          </div>
        )}

        {/* Error Section */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="bg-transparent rounded-2xl p-8 border border-[#333333] max-w-md mx-auto">
              <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-500 mb-4">Oops! Something went wrong</h3>
              <p className="text-[#ffffff80] mb-6">{error}</p>
              <button
                onClick={resetAndRetry}
                className="px-6 py-3 bg-[#c19d44] text-[#080808] font-semibold rounded-lg hover:bg-[#a88a3b]"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainGenerator;