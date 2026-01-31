export interface Component {
    name: string;
    vCPUs: number;
    memory: number;
    network?: number;
    behavior?: 'terminate' | 'stop' | 'hibernate';
    frequency?: number;
    storageType?: string | null;
    affinity?: string;
    'anti-affinity'?: string;
    burstable?: boolean;
  }
  
  export interface App {
    app: string;
    share: boolean;
    components: Component[];
  }
  
  export interface FleetRequest {
    selectedOs: 'linux' | 'windows';
    payment: 'Spot' | 'onDemand';
    region: string | string[];
    apps: App[];
    filterInstances?: string[];
    architecture?: string;
    type_major?: string[];
  }
  
  export interface SingleInstanceRequest {
    selectedOs: 'linux' | 'windows';
    payment: 'Spot' | 'onDemand';
    selectedRegion: string;
    vCPUs: number;
    memory: number;
    size?: number;
    iops?: number;
    throughput?: number;
    network?: number;
    behavior?: string;
    frequency?: number;
    storageType?: string | null;
    burstable?: boolean;
  }
  
  export interface Instance {
    typeName: string;
    region: string;
    cpu: string;
    memory: string;
    network: string;
    os: string;
    typeMajor: string;
    typeMinor: string;
    onDemandPrice: number;
    spot_price: number;
    discount: number;
    interruption_frequency?: string;
    priceAfterDiscount?: number;
    components?: ComponentAssignment[];
  }
  
  export interface ComponentAssignment {
    appName: string;
    componentName: string;
  }
  
  export interface FleetResult {
    price: number;
    region: string;
    instances: Instance[];
  }
  
  export interface SingleInstanceResult {
    typeName: string;
    region: string;
    cpu: string;
    memory: string;
    network: string;
    os: string;
    typeMajor: string;
    typeMinor: string;
    onDemandPrice: number;
    spot_price: number;
    discount: number;
    total_price: number;
    interruption_frequency?: string;
  }
  
  export type Provider = 'AWS' | 'Azure' | 'Hybrid';