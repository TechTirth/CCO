import axios from 'axios';
import { FleetRequest, SingleInstanceRequest, FleetResult, SingleInstanceResult, Provider } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fleetAPI = {
  optimize: async (provider: Provider, request: FleetRequest): Promise<FleetResult[]> => {
    let endpoint = '';
    switch (provider) {
      case 'AWS':
        endpoint = '/getAWSFleet';
        break;
      case 'Azure':
        endpoint = '/getAzureFleet';
        break;
      case 'Hybrid':
        endpoint = '/getHybridCloudFleet';
        break;
    }
    
    const response = await api.post<FleetResult[]>(endpoint, request);
    return response.data;
  },
};

export const singleInstanceAPI = {
  search: async (provider: Provider, request: SingleInstanceRequest): Promise<SingleInstanceResult[]> => {
    let endpoint = '';
    switch (provider) {
      case 'AWS':
        endpoint = '/getAWSPrices';
        break;
      case 'Azure':
        endpoint = '/getAzurePrices';
        break;
      case 'Hybrid':
        endpoint = '/getHybridPrices';
        break;
    }
    
    const response = await api.post<SingleInstanceResult[]>(endpoint, request);
    return response.data;
  },
};