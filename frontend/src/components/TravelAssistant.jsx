'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TravelAssistant() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a question');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:8000/query', {
        question: query,
      });
      setResponse(res.data.response);
      setHistory(prev => [{ question: query, answer: res.data.response }, ...prev.slice(0, 4)]);
      setQuery('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseResponse = () => {
    setResponse('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-2">
            ✈️ Travel Document Assistant
          </h1>
          <p className="text-gray-600">
            Get instant information about required travel documents worldwide
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Input Section */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Travel Question
                </label>
                <textarea
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., What documents do I need to travel from Kenya to Ireland?"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  rows={4}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg text-white font-semibold shadow-md transition-all duration-200 ${
                  isLoading
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Get Travel Information'
                )}
              </button>
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  ⚠️ {error}
                </div>
              )}
            </form>
          </div>

          {/* Response Section */}
          {response && (
            <div className="p-6 md:p-8 bg-gray-50 relative">
              <button 
                onClick={handleCloseResponse}
                className="absolute top-6 right-6 p-1 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Close response"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                  Travel Information
                </h2>
                <div className="prose prose-indigo max-w-none">
                  <div className="whitespace-pre-wrap space-y-2">
                    {response.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Section */}
          {history.length > 0 && (
            <div className="p-6 md:p-8 border-t border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Queries</h3>
              <div className="space-y-3">
                {history.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Q:</span> {item.question}
                    </p>
                    <p className="text-sm text-gray-800 line-clamp-2">
                      <span className="font-medium">A:</span> {item.answer.split('\n')[0]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need more help? Contact our support team.</p>
        </div>
      </div>
    </div>
  );
}