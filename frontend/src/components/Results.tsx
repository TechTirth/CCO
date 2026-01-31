import React from 'react';
import { FleetResult, SingleInstanceResult } from '../types';

interface ResultsProps {
  results: FleetResult[] | SingleInstanceResult[];
  type: 'fleet' | 'single';
}

const Results: React.FC<ResultsProps> = ({ results, type }) => {
  if (results.length === 0) {
    return (
      <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
        No results found. Try adjusting your requirements.
      </div>
    );
  }

  if (type === 'fleet') {
    const fleetResults = results as FleetResult[];
    return (
      <div className="mt-6 space-y-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Optimization Results</h3>
        {fleetResults.slice(0, 10).map((result, index) => (
          <div key={index} className="bg-gradient-to-r from-primary-50 to-purple-50 p-6 rounded-lg border-2 border-primary-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-primary-700">
                  Configuration #{index + 1}
                </h4>
                <p className="text-sm text-gray-600">Region: {result.region}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600">
                  ${result.price.toFixed(4)}
                </p>
                <p className="text-sm text-gray-600">per hour</p>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-semibold text-gray-700">Instances:</h5>
              {result.instances.map((instance, instIndex) => (
                <div key={instIndex} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800">{instance.typeName}</p>
                      <p className="text-sm text-gray-600">
                        {instance.cpu} vCPUs • {instance.memory}GB RAM • {instance.network}
                      </p>
                      {instance.components && (
                        <p className="text-sm text-primary-600 mt-1">
                          Components: {instance.components.map(c => c.componentName).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        ${instance.spot_price.toFixed(4)}/hr
                      </p>
                      {instance.discount > 0 && (
                        <p className="text-xs text-green-600">
                          {instance.discount}% discount
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const singleResults = results as SingleInstanceResult[];
  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Matching Instances</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {singleResults.slice(0, 20).map((instance, index) => (
          <div key={index} className="bg-gradient-to-r from-primary-50 to-purple-50 p-4 rounded-lg border-2 border-primary-200">
            <h4 className="font-bold text-primary-700 text-lg mb-2">{instance.typeName}</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold">Region:</span> {instance.region}</p>
              <p><span className="font-semibold">vCPUs:</span> {instance.cpu}</p>
              <p><span className="font-semibold">Memory:</span> {instance.memory}GB</p>
              <p><span className="font-semibold">Network:</span> {instance.network}</p>
              <div className="pt-2 border-t border-gray-300">
                <p className="text-lg font-bold text-primary-600">
                  ${instance.total_price.toFixed(4)}/hr
                </p>
                <p className="text-xs text-gray-600">
                  Spot: ${instance.spot_price.toFixed(4)}/hr
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;