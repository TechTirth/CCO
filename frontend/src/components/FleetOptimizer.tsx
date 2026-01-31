import React, { useState } from 'react';
import { FleetRequest, App, Component, Provider } from '../types';
import { fleetAPI } from '../services/api';
import ComponentForm from './ComponentForm';
import LoadingSpinner from './LoadingSpinner';
import Results from './Results';

const FleetOptimizer: React.FC = () => {
  const [provider, setProvider] = useState<Provider>('AWS');
  const [os, setOs] = useState<'linux' | 'windows'>('linux');
  const [payment, setPayment] = useState<'Spot' | 'onDemand'>('Spot');
  const [region, setRegion] = useState<string>('all');
  const [apps, setApps] = useState<App[]>([
    {
      app: 'App1',
      share: true,
      components: [
        { name: '', vCPUs: 0, memory: 0, network: 0 },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addApp = () => {
    setApps([
      ...apps,
      {
        app: `App${apps.length + 1}`,
        share: true,
        components: [{ name: '', vCPUs: 0, memory: 0, network: 0 }],
      },
    ]);
  };

  const removeApp = (index: number) => {
    if (apps.length > 1) {
      setApps(apps.filter((_, i) => i !== index));
    }
  };

  const updateApp = (index: number, app: App) => {
    const newApps = [...apps];
    newApps[index] = app;
    setApps(newApps);
  };

  const addComponent = (appIndex: number) => {
    const newApps = [...apps];
    newApps[appIndex].components.push({ name: '', vCPUs: 0, memory: 0, network: 0 });
    setApps(newApps);
  };

  const updateComponent = (appIndex: number, compIndex: number, component: Component) => {
    const newApps = [...apps];
    newApps[appIndex].components[compIndex] = component;
    setApps(newApps);
  };

  const removeComponent = (appIndex: number, compIndex: number) => {
    const newApps = [...apps];
    if (newApps[appIndex].components.length > 1) {
      newApps[appIndex].components = newApps[appIndex].components.filter((_, i) => i !== compIndex);
      setApps(newApps);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    // Validate
    const hasEmptyComponents = apps.some(app =>
      app.components.some(comp => !comp.name || comp.vCPUs === 0 || comp.memory === 0)
    );

    if (hasEmptyComponents) {
      setError('Please fill in all required component fields');
      setLoading(false);
      return;
    }

    const request: FleetRequest = {
      selectedOs: os,
      payment: payment,
      region: region,
      apps: apps.map((app, index) => ({
        ...app,
        app: `App${index + 1}`,
        components: app.components.filter(comp => comp.name && comp.vCPUs > 0 && comp.memory > 0),
      })),
    };

    try {
      const data = await fleetAPI.optimize(provider, request);
      setResults(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Fleet Optimization</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cloud Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as Provider)}
              className="input-field"
            >
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
              <option value="Hybrid">Hybrid (AWS + Azure)</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Model</label>
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value as 'Spot' | 'onDemand')}
              className="input-field"
            >
              <option value="Spot">Spot Instances (Cheaper)</option>
              <option value="onDemand">On-Demand (Stable)</option>
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

        <div className="space-y-4">
          {apps.map((app, appIndex) => (
            <div key={appIndex} className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">{app.app}</h3>
                {apps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeApp(appIndex)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove App
                  </button>
                )}
              </div>

              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={app.share}
                    onChange={(e) => updateApp(appIndex, { ...app, share: e.target.checked })}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Can share instances with other apps
                  </span>
                </label>
              </div>

              <div className="space-y-4">
                {app.components.map((component, compIndex) => (
                  <ComponentForm
                    key={compIndex}
                    component={component}
                    index={compIndex}
                    onChange={(idx, comp) => updateComponent(appIndex, idx, comp)}
                    onRemove={(idx) => removeComponent(appIndex, idx)}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => addComponent(appIndex)}
                className="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
              >
                + Add Component
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addApp}
            className="btn-primary bg-gray-500 hover:bg-gray-600"
          >
            + Add App
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? 'Optimizing...' : 'Optimize Fleet'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {results.length > 0 && <Results results={results} type="fleet" />}
    </div>
  );
};

export default FleetOptimizer;