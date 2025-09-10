'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, Search, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface Domain {
  domain: string;
  available: boolean;
  price?: number;
}

interface Competitor {
  name: string;
  domain: string;
  url: string;
}

interface DomainPatterns {
  patterns: {
    averageLength: number;
    wordCount: string;
  };
  recommendations: {
    optimalLength: string;
    brandPositioning: string;
  };
  nicheKeywords: string[];
}

interface DomainResult {
  competitors: Competitor[];
  patterns: DomainPatterns;
  recommendation: Domain;
  alternatives: Domain[];
  totalGenerated: number;
  totalAvailable: number;
}

export default function DomainGenerator() {
  const router = useRouter();
  const [niche, setNiche] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DomainResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateDomains = async () => {
    if (!niche.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate-domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ niche: niche.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error generating domains:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate domains');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      generateDomains();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center">
            <Globe className="text-green-600 mr-3" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Domain Generator</h1>
              <p className="text-gray-600">Find the perfect domain for your high-ticket dropshipping store</p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Enter Your Niche</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., smart home, fitness, pet care..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={generateDomains}
              disabled={isLoading || !niche.trim()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Search size={20} className="mr-2" />
                  Generate Domains
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <XCircle className="text-red-600 mr-2" size={20} />
              <span className="text-red-800 font-medium">Error:</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Competitors */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Globe className="mr-2" size={24} />
                Popular Stores in Your Niche
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.competitors.map((competitor, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{competitor.name}</h4>
                    <p className="text-gray-600 text-sm">{competitor.domain}</p>
                    <a
                      href={competitor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-2"
                    >
                      Visit Site <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Domain Patterns */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Search className="mr-2" size={24} />
                Domain Patterns Found
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Patterns</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>Average Length: {result.patterns.patterns.averageLength} characters</li>
                    <li>Length Range: {result.patterns.recommendations.optimalLength}</li>
                    <li>Most Common Word Count: {result.patterns.patterns.wordCount}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>Niche Keywords: {result.patterns.nicheKeywords.join(', ')}</li>
                    <li>Brand Positioning: {result.patterns.recommendations.brandPositioning}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recommended Domain */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Recommended Domain</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{result.recommendation.domain}</h4>
                    <div className="flex items-center mt-1">
                      {result.recommendation.available ? (
                        <>
                          <CheckCircle className="text-green-600 mr-1" size={16} />
                          <span className="text-green-600 text-sm">Available</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="text-red-600 mr-1" size={16} />
                          <span className="text-red-600 text-sm">Not Available</span>
                        </>
                      )}
                      {result.recommendation.price && (
                        <span className="text-gray-600 text-sm ml-2">
                          ${result.recommendation.price}
                        </span>
                      )}
                    </div>
                  </div>
                  {result.recommendation.available && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Register Domain
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Alternative Domains */}
            {result.alternatives.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Alternative Domains</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.alternatives.map((domain, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{domain.domain}</h4>
                          <div className="flex items-center mt-1">
                            {domain.available ? (
                              <>
                                <CheckCircle className="text-green-600 mr-1" size={16} />
                                <span className="text-green-600 text-sm">Available</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="text-red-600 mr-1" size={16} />
                                <span className="text-red-600 text-sm">Not Available</span>
                              </>
                            )}
                            {domain.price && (
                              <span className="text-gray-600 text-sm ml-2">
                                ${domain.price}
                              </span>
                            )}
                          </div>
                        </div>
                        {domain.available && (
                          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                            Register
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">Generation Summary</h4>
                  <p className="text-blue-700 text-sm">
                    Generated {result.totalGenerated} domains, {result.totalAvailable} available
                  </p>
                </div>
                <button
                  onClick={generateDomains}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Generate More
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
