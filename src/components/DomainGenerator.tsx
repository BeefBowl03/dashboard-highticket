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
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-yellow-500 mb-6 text-center">
              Enter Your Niche
            </h2>
            <div className="flex gap-4 max-w-2xl mx-auto">
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., backyard, marine, horse riding, smart home..."
                className="flex-1 p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && generateDomains()}
              />
              <button
                onClick={generateDomains}
                disabled={loading}
                className="px-8 py-4 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 disabled:opacity-50 flex items-center gap-2"
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
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mb-4"></div>
            <h3 className="text-xl font-semibold text-yellow-500 mb-2">Generating Domains...</h3>
            <p className="text-gray-400">Finding the perfect domains for your high-ticket dropshipping store</p>
          </div>
        )}

        {/* Results Section */}
        {results && !loading && (
          <div className="space-y-8">
            {/* Competitors */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
                <Globe size={24} />
                Popular Stores in Your Niche
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.competitors.map((competitor, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <a
                      href={competitor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-yellow-400 font-medium"
                    >
                      {competitor.name}
                    </a>
                    <div className="text-gray-400 text-sm mt-1">{competitor.domain}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patterns */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
                <Search size={24} />
                Domain Patterns Found
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Average Length:</span>
                    <span className="text-white font-medium">{results.patterns.patterns?.averageLength || 14} characters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Length Range:</span>
                    <span className="text-white font-medium">{results.patterns.recommendations?.optimalLength || '7 - 20 characters'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Most Common Word Count:</span>
                    <span className="text-white font-medium">{results.patterns.patterns?.wordCount || '2 words'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-300">Niche Keywords:</span>
                    <div className="text-white font-medium mt-1">
                      {results.patterns.nicheKeywords?.join(', ') || 'No keywords found'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-300">Brand Positioning:</span>
                    <div className="text-white font-medium mt-1">
                      {results.patterns.recommendations?.brandPositioning || 'Should sound premium and trustworthy'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Best Domain */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
                <Star size={24} />
                Our Top Recommendation
              </h3>
              <div className="bg-gray-700 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-white mb-2">{results.recommendation.domain}</div>
                <div className="text-lg text-yellow-500">${results.recommendation.price}/year</div>
              </div>
            </div>

            {/* Alternatives */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
                <List size={24} />
                Alternative Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {results.alternatives.map((domain, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="text-lg font-medium text-white mb-1">{domain.domain}</div>
                    <div className="text-yellow-500">${domain.price}/year</div>
                  </div>
                ))}
              </div>
              <button
                onClick={generateMoreDomains}
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Generate 5 More Options
              </button>
            </div>
          </div>
        )}

        {/* Error Section */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-md mx-auto">
              <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-500 mb-4">Oops! Something went wrong</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                onClick={resetAndRetry}
                className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400"
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