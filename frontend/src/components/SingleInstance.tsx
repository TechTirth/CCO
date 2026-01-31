import React, { useState } from 'react';
import { SingleInstanceRequest, Provider } from '../types';
import { singleInstanceAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import Results from './Results';

const SingleInstance: React.FC = () => {
  const [provider, setProvider] = useState<Provider>('AWS');
  const [os, setOs] = useState<'linux' | 'windows'>('linux');
  const [vCPUs, setVCPUs] = useState<number>(4);
  const [memory, setMemory] = useState<number>(8);
  const [payment, setPayment] = useState<'Spot' | 'onDemand'>('Spot');
  const [region, setRegion] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    const request: SingleInstanceRequest = {
      selectedOs: os,
      payment: payment,
      selectedRegion: region,
      vCPUs: vCPUs,
      memory: memory,
    };

    try {
      const data = await singleInstanceAPI.search(provider, request);
      setResults(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Single Instance Search</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cloud Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as Provider)}
              className="input-field"
            >
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operating System</label>
            <select
              value={os}
              onChange={(e) => setOs(e.target.value as 'linux' | 'windows')}
              className="input-field"
            >
              <option value="linux">Linux</option>
              <option value="windows">Windows</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">vCPUs *</label>
            <input
              type="number"
              min="1"
              value={vCPUs}
              onChange={(e) => setVCPUs(parseInt(e.target.value) || 0)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Memory (GB) *</label>
            <input
              type="number"
              min="1"
              value={memory}
              onChange={(e) => setMemory(parseInt(e.target.value) || 0)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Model</label>
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value as 'Spot' | 'onDemand')}
              className="input-field"
            >
              <option value="Spot">Spot</option>
              <option value="onDemand">On-Demand</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="us-east-1 or 'all'"
              className="input-field"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Searching...' : 'Find Instances'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {results.length > 0 && <Results results={results} type="single" />}
    </div>
  );
};

export default SingleInstance;