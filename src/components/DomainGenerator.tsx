import React, { useState } from 'react';
import { Globe, Search, Star, List, Plus, AlertTriangle } from 'lucide-react';
import { generateDomainsForNiche, generateMoreDomains as generateMoreDomainsAPI, DomainGeneratorResponse } from '../api/domainGenerator';
import './DomainGenerator.css';

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
    <div className="main">
      <div className="container">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-card">
            <h2>Enter Your Niche</h2>
            <div className="input-group">
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Enter your niche (e.g., backyard furniture, luxury watches, fitness equipment)"
                onKeyPress={(e) => e.key === 'Enter' && generateDomains()}
              />
              <button
                onClick={generateDomains}
                disabled={loading}
                className="btn-primary"
              >
                <Search size={20} />
                Generate Domains
              </button>
            </div>
          </div>
        </div>

        {/* Loading Section */}
        {loading && (
          <div className="loading-section">
            <div className="loading-card">
              <div className="spinner"></div>
              <h3>Generating Domains...</h3>
              <p>Finding the perfect domains for your high-ticket dropshipping store</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && !loading && (
          <div className="results-section">
            {/* Popular Stores */}
            <div>
              <h3>
                <Globe size={24} />
                Popular Stores in Your Niche
              </h3>
              <div className="competitors-list">
                {results.competitors.slice(0, 4).map((competitor, index) => (
                  <div key={index} className="competitor-item">
                    <a
                      href={competitor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {competitor.name}
                    </a>
                    <div className="domain">{competitor.domain}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Domain Patterns */}
            <div className="patterns-found-card">
              <h3>
                <Search size={24} />
                Domain Patterns Found:
              </h3>
              <div className="patterns-found-content">
                <div className="pattern-row">
                  <span className="pattern-label">Average Length:</span>
                  <span className="pattern-value">{results.patterns.patterns?.averageLength || 15} characters</span>
                </div>
                <div className="pattern-row">
                  <span className="pattern-label">Length Range:</span>
                  <span className="pattern-value">{results.patterns.recommendations?.optimalLength || '15-25 characters'}</span>
                </div>
                <div className="pattern-row">
                  <span className="pattern-label">Most Common Word Count:</span>
                  <span className="pattern-value">{results.patterns.patterns?.wordCount || '2-3 words'}</span>
                </div>
                <div className="pattern-row">
                  <span className="pattern-label">Niche Keywords:</span>
                  <span className="pattern-value">{results.patterns.nicheKeywords?.join(', ') || 'backyard, yard, patio, deck, outdoor, garden space, courtyard'}</span>
                </div>
                <div className="pattern-row">
                  <span className="pattern-label">Structure Patterns:</span>
                  <span className="pattern-value">prefix + niche keyword + suffix | niche keyword + descriptive word</span>
                </div>
                <div className="pattern-row">
                  <span className="pattern-label">Brand Positioning:</span>
                  <span className="pattern-value">{results.patterns.recommendations?.brandPositioning || 'Domains should convey sophistication, quality, and a sense of exclusivity to attract high-ticket customers.'}</span>
                </div>
              </div>
            </div>

            {/* Top Recommendation */}
            <div>
              <h3>
                <Star size={24} />
                Our Top Recommendation
              </h3>
              <div className="domain-recommendation">
                <div className="domain-name">{results.recommendation.domain}</div>
                <div className="domain-price">${results.recommendation.price}/year</div>
              </div>
            </div>

            {/* Alternative Options */}
            <div>
              <h3>
                <List size={24} />
                Alternative Options
              </h3>
              <div>
                {results.alternatives.map((domain, index) => (
                  <div key={index} className="domain-item">
                    <div className="domain-name">{domain.domain}</div>
                    <div className="domain-price">${domain.price}/year</div>
                  </div>
                ))}
              </div>
              <button
                onClick={generateMoreDomains}
                disabled={loading}
                className="btn-secondary"
              >
                <Plus size={20} />
                + Generate 5 More Options
              </button>
            </div>
          </div>
        )}

        {/* Error Section */}
        {error && !loading && (
          <div className="error-card">
            <AlertTriangle size={48} />
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button
              onClick={resetAndRetry}
              className="btn-primary"
              id="retryBtn"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainGenerator;