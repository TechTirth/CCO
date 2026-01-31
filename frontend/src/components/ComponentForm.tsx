import React from 'react';
import { Component } from '../types';

interface ComponentFormProps {
  component: Component;
  index: number;
  onChange: (index: number, component: Component) => void;
  onRemove: (index: number) => void;
}

const ComponentForm: React.FC<ComponentFormProps> = ({ component, index, onChange, onRemove }) => {
  const handleChange = (field: keyof Component, value: string | number | boolean) => {
    onChange(index, { ...component, [field]: value });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-gray-700">Component {index + 1}</h4>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 font-semibold"
        >
          Remove
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={component.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="input-field"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">vCPUs *</label>
          <input
            type="number"
            min="1"
            value={component.vCPUs}
            onChange={(e) => handleChange('vCPUs', parseInt(e.target.value) || 0)}
            className="input-field"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Memory (GB) *</label>
          <input
            type="number"
            min="1"
            value={component.memory}
            onChange={(e) => handleChange('memory', parseInt(e.target.value) || 0)}
            className="input-field"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Network (Gbps)</label>
          <input
            type="number"
            min="0"
            value={component.network || 0}
            onChange={(e) => handleChange('network', parseInt(e.target.value) || 0)}
            className="input-field"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Interruption Behavior</label>
          <select
            value={component.behavior || 'terminate'}
            onChange={(e) => handleChange('behavior', e.target.value as 'terminate' | 'stop' | 'hibernate')}
            className="input-field"
          >
            <option value="terminate">Terminate</option>
            <option value="stop">Stop</option>
            <option value="hibernate">Hibernate</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Interruption Frequency</label>
          <select
            value={component.frequency || 4}
            onChange={(e) => handleChange('frequency', parseInt(e.target.value))}
            className="input-field"
          >
            <option value={0}>&lt;5% (Very Low)</option>
            <option value={1}>5-10% (Low)</option>
            <option value={2}>10-15% (Moderate)</option>
            <option value={3}>15-20% (High)</option>
            <option value={4}>&gt;20% (Very High)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ComponentForm;