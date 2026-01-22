# Cloud Cost Optimizer (CCO) - Complete Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [What is Cloud Cost Optimizer?](#what-is-cloud-cost-optimizer)
3. [Key Concepts for Non-Technical Users](#key-concepts-for-non-technical-users)
4. [System Architecture](#system-architecture)
5. [Installation and Setup](#installation-and-setup)
6. [Project Structure](#project-structure)
7. [Configuration Files](#configuration-files)
8. [Input Format](#input-format)
9. [Output Format](#output-format)
10. [Core Components Explained](#core-components-explained)
11. [How It Works - Step by Step](#how-it-works---step-by-step)
12. [Algorithms Used](#algorithms-used)
13. [Usage Guide](#usage-guide)
14. [Function Reference](#function-reference)
15. [Troubleshooting](#troubleshooting)
16. [Advanced Topics](#advanced-topics)

---

## Introduction

The **Cloud Cost Optimizer (CCO)** is a sophisticated tool designed to help organizations minimize their cloud computing costs by finding the most cost-effective way to deploy complex workloads across public cloud providers (AWS and Azure). It solves a complex optimization problem that would be nearly impossible to solve manually.

### Who Should Use This?

- **DevOps Engineers**: Looking to optimize cloud infrastructure costs
- **Cloud Architects**: Planning multi-cloud deployments
- **Financial Analysts**: Analyzing cloud spending
- **Developers**: Understanding cloud pricing for applications
- **Students/Researchers**: Learning about cloud optimization algorithms

---

## What is Cloud Cost Optimizer?

### The Problem It Solves

Imagine you have a complex application with multiple components (like a web server, database, cache, etc.). Each component needs specific resources:
- **CPU (vCPUs)**: Processing power
- **Memory (RAM)**: Temporary storage for running programs
- **Network**: Data transfer capacity
- **Storage**: Permanent data storage

Cloud providers offer thousands of different virtual machine (VM) types, each with different specifications and prices. The challenge is:
1. **Which VM types** should you choose for each component?
2. **Can multiple components share** the same VM to save costs?
3. **Which cloud region** offers the best prices?
4. **Should you use spot instances** (cheaper but can be interrupted) or on-demand instances (more expensive but reliable)?

CCO automatically answers all these questions by testing millions of possible combinations and finding the cheapest solution.

### Key Features

✅ **Multi-Cloud Support**: Works with AWS, Azure, or both (Hybrid)
✅ **Spot Instance Optimization**: Finds cheapest spot instances with up to 90% savings
✅ **Component Sharing**: Intelligently groups components on shared VMs
✅ **Region Optimization**: Searches across all available regions
✅ **Affinity/Anti-Affinity Rules**: Ensures components are placed together or separately as needed
✅ **Two Algorithms**: Brute Force (for small workloads) and Local Search (for large workloads)

---

## Key Concepts for Non-Technical Users

### 1. **Virtual Machine (VM) / Instance**
Think of a VM as a computer in the cloud. Just like you can buy different computers with different specs (more RAM, faster CPU), cloud providers offer different VM types.

### 2. **Spot Instances**
Like buying airline tickets - if you're flexible, you can get much cheaper prices. Spot instances are up to 90% cheaper but can be interrupted if the cloud provider needs the capacity.

### 3. **On-Demand Instances**
Like buying a full-price airline ticket - more expensive but guaranteed availability.

### 4. **Region**
Cloud providers have data centers in different geographic locations (e.g., US East, Europe West). Prices vary by region.

### 5. **Component**
A part of your application (e.g., web server, database). Each component has specific resource needs.

### 6. **Workload**
Your entire application - all components together.

### 7. **Optimization**
Finding the best (cheapest) solution from millions of possibilities.

---

## System Architecture

### High-Level Overview

```
User Input (input_fleet.json)
    ↓
Configuration (config_file.json)
    ↓
CCO.py / app.py (Main Entry Point)
    ↓
SpotCalculator (Orchestrator)
    ↓
    ├──→ Data Extraction (AWS/Azure pricing data)
    ├──→ Single Instance Calculator (Find VMs for individual components)
    └──→ Fleet Calculator (Find optimal combinations)
            ↓
        Algorithm Selection
            ├──→ Brute Force (for <7 components)
            └──→ Local Search (for larger workloads)
    ↓
Results (fleet_results.json)
```

### Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  ┌──────────────┐          ┌──────────────┐            │
│  │   CCO.py     │          │   app.py     │            │
│  │ (CLI Mode)   │          │ (Web API)    │            │
│  └──────┬───────┘          └──────┬───────┘            │
└─────────┼──────────────────────────┼────────────────────┘
          │                          │
          └──────────┬───────────────┘
                     │
          ┌──────────▼──────────┐
          │  SpotCalculator      │
          │  (Main Controller)   │
          └──────────┬───────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼────┐    ┌──────▼──────┐  ┌─────▼──────┐
│ Data   │    │ Single      │  │ Fleet      │
│Extract │    │ Instance    │  │ Calculator │
│        │    │ Calculator  │  │            │
└────────┘    └─────────────┘  └─────┬──────┘
                                     │
                        ┌────────────┼────────────┐
                        │            │            │
                  ┌─────▼─────┐ ┌───▼────┐ ┌────▼─────┐
                  │ Brute     │ │ Local  │ │ Group    │
                  │ Force     │ │ Search │ │ Generator│
                  └───────────┘ └────────┘ └──────────┘
```

---

## Installation and Setup

### Prerequisites

- **Python 3.4 or newer** (Python 3.13.7 recommended)
- **Internet connection** (for downloading pricing data)
- **Operating System**: Windows, macOS, or Linux

### Step-by-Step Installation

#### 1. Check Python Version
```bash
python3 --version
```
Should show Python 3.4 or higher.

#### 2. Navigate to Project Directory
```bash
cd "/Users/tirth/Desktop/Final_Year_Project/CloudCostOptimizer (CCO)"
```

#### 3. Create Virtual Environment (Recommended)
```bash
python3 -m venv venv
```

#### 4. Activate Virtual Environment

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt.

#### 5. Install Required Packages
```bash
pip install requests urllib3 grequests numpy boto3 flask flask-cors
```

#### 6. Verify Installation
```bash
python3 -c "import requests, numpy, flask; print('All packages installed!')"
```

---

## Project Structure

```
CloudCostOptimizer (CCO)/
│
├── app.py                          # Web API server (Flask)
├── CCO.py                          # Command-line interface
├── config_file.json                # Configuration settings
├── input_fleet.json                # Your workload specification
├── fleet_results.json              # Output results (generated)
│
├── constants.py                    # Constants (regions, architectures)
├── external_functions.py           # Helper functions
├── fleet_classes.py                # Data classes for components/offers
├── fleet_offers.py                 # Fleet calculation logic
├── get_spot.py                     # Main calculator orchestrator
├── single_instance_calculator.py   # Single VM matching
├── group_generator.py              # Partition generation
│
├── AWSData/                        # AWS pricing data
│   ├── ec2_data_Linux.json
│   ├── ec2_data_Windows.json
│   ├── ec2_discount_Linux.json
│   └── ec2_discount_Windows.json
│
├── AzureData/                      # Azure pricing data
│   ├── Azure_data_v2.json
│   └── vm_discount.json
│
├── ExtractData/                    # Data extraction modules
│   ├── ec2_prices.py              # AWS EC2 price extraction
│   ├── aws_spot_prices.py         # AWS spot price calculation
│   └── ebs_prices.py              # EBS storage prices
│
└── LocalSearchAlgorithm/           # Optimization algorithms
    ├── comb_optimizer.py          # Local search algorithm
    ├── partitions_generator.py   # Partition generation for search
    └── Run_Statistic.sqlite3      # Algorithm statistics database
```

---

## Configuration Files

### config_file.json

This file controls how the optimizer behaves.

```json
{
    "Data Extraction (always / onceAday)": "onceAday",
    "boto3 (enable / disable)": "disable",
    "Provider (AWS / Azure / Hybrid)": "AWS",
    "Brute Force": "True",
    "Time per region": 0.1,
    "Candidate list size": 100,
    "Proportion amount node/sons": 0.005,
    "Verbose": "True"
}
```

#### Parameter Explanations

| Parameter | Values | Description |
|-----------|--------|-------------|
| **Data Extraction** | `"always"` or `"onceAday"` | When to fetch fresh pricing data. `onceAday` uses cached data if updated today. |
| **boto3** | `"enable"` or `"disable"` | Use AWS boto3 API for real-time spot prices (slower but more accurate). |
| **Provider** | `"AWS"`, `"Azure"`, or `"Hybrid"` | Which cloud provider(s) to search. |
| **Brute Force** | `"True"` or `"False"` | Use brute force algorithm. `True` for <7 components, `False` for larger workloads. |
| **Time per region** | Number (seconds) | Maximum time to search each region (Local Search only). |
| **Candidate list size** | Number | Maximum candidates to keep in search (Local Search only). |
| **Proportion amount node/sons** | 0.0-1.0 | Proportion of child nodes to explore (Local Search only). |
| **Verbose** | `"True"` or `"False"` | Print detailed progress information. |

---

## Input Format

### input_fleet.json Structure

This file describes your workload - what components you need and their requirements.

```json
{
    "selectedOs": "linux",
    "spot/onDemand": "spot",
    "region": ["eu-south-1", "eu-west-3", "us-east-2"],
    "filterInstances": ["a1", "t3a"],
    "Architecture": "all",
    "apps": [
        {
            "app": "App1",
            "share": true,
            "components": [
                {
                    "memory": 8,
                    "vCPUs": 4,
                    "network": 5,
                    "behavior": "terminate",
                    "frequency": "2",
                    "storageType": null,
                    "affinity": "Comp2",
                    "name": "Comp1"
                }
            ]
        }
    ]
}
```

### Required Parameters

#### Top-Level Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `selectedOs` | String | ✅ Yes | Operating system: `"linux"` or `"windows"` |
| `spot/onDemand` | String | ✅ Yes | Pricing model: `"spot"` or `"onDemand"` |
| `apps` | Array | ✅ Yes | List of applications |

#### App Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `app` | String | ✅ Yes | Application name |
| `share` | Boolean | ✅ Yes | `true` if components can share VMs with other apps |
| `components` | Array | ✅ Yes | List of components in this app |

#### Component Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String | ✅ Yes | Component name (unique identifier) |
| `memory` | Number | ✅ Yes | Minimum memory required (GB) |
| `vCPUs` | Number | ✅ Yes | Minimum vCPUs required |

### Optional Parameters

#### Top-Level Optional

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `region` | String/Array | `"all"` | Specific region(s) to search. Use `"all"` for all regions, or array like `["us-east-1", "eu-west-1"]` |
| `filterInstances` | Array | `[]` | Instance types to exclude (e.g., `["a1", "t3a"]`) |
| `Architecture` | String | `"all"` | CPU architecture: `"all"`, `"x86_64"`, `"arm64"`, `"i386"`, `"x86_64_mac"` |

#### Component Optional

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `network` | Number | `0` | Required network bandwidth (Gbps) |
| `behavior` | String | `"terminate"` | Spot interruption behavior: `"terminate"`, `"stop"`, `"hibernate"` |
| `frequency` | Number | `4` | Max interruption frequency: `0` (<5%), `1` (5-10%), `2` (10-15%), `3` (15-20%), `4` (>20%) |
| `storageType` | String | `null` | Storage type requirement |
| `size` | Number | `0` | Storage size (GB) |
| `iops` | Number | `0` | IOPS requirement |
| `throughput` | Number | `0` | Throughput requirement (MB/s) |
| `burstable` | Boolean | `true` | Allow burstable network performance |
| `affinity` | String | `null` | Component name(s) that MUST be on same VM (comma-separated) |
| `anti-affinity` | String | `null` | Component name(s) that MUST NOT be on same VM (comma-separated) |
| `typeMajor` | Array | `[]` | Required instance families (e.g., `["c5", "r5", "m5"]`) |
| `Category` | String | `"all"` | Instance category: `"General Purpose"`, `"Compute Optimized"`, etc. |

### Example: Complete Input

```json
{
    "selectedOs": "linux",
    "spot/onDemand": "spot",
    "region": "all",
    "Architecture": "all",
    "apps": [
        {
            "app": "WebApplication",
            "share": true,
            "components": [
                {
                    "name": "WebServer",
                    "memory": 8,
                    "vCPUs": 4,
                    "network": 5,
                    "behavior": "terminate",
                    "frequency": "2"
                },
                {
                    "name": "Cache",
                    "memory": 4,
                    "vCPUs": 2,
                    "network": 0
                }
            ]
        },
        {
            "app": "Database",
            "share": false,
            "components": [
                {
                    "name": "PostgreSQL",
                    "memory": 16,
                    "vCPUs": 8,
                    "network": 10,
                    "behavior": "stop",
                    "frequency": "1",
                    "anti-affinity": "WebServer"
                }
            ]
        }
    ]
}
```

---

## Output Format

### fleet_results.json Structure

The optimizer generates a JSON file with optimized configurations, sorted by price (cheapest first).

```json
[
    {
        "price": 0.275,
        "EC2 Type": "spot",
        "region": "us-east-2",
        "instances": [
            {
                "onDemandPrice": 0.204,
                "region": "us-east-2",
                "cpu": "8",
                "memory": "16",
                "network": "Up to 10 Gigabit",
                "os": "Linux",
                "typeMajor": "a1",
                "typeMinor": "2xlarge",
                "typeName": "a1.2xlarge",
                "spot_price": 0.0394,
                "discount": 81,
                "interruption_frequency": "<20%",
                "components": [
                    {
                        "appName": "App2",
                        "componentName": "Comp3"
                    }
                ]
            }
        ]
    }
]
```

### Output Fields Explained

#### Top-Level Fields

| Field | Description |
|-------|-------------|
| `price` | Total hourly cost for this configuration |
| `EC2 Type` | Pricing model used (`"spot"` or `"onDemand"`) |
| `region` | Cloud region where instances are deployed |
| `instances` | Array of VM instances in this configuration |

#### Instance Fields

| Field | Description |
|-------|-------------|
| `typeName` | Full instance type (e.g., `"a1.2xlarge"`) |
| `typeMajor` | Instance family (e.g., `"a1"`) |
| `typeMinor` | Instance size (e.g., `"2xlarge"`) |
| `cpu` | Number of vCPUs |
| `memory` | RAM in GB |
| `network` | Network performance |
| `onDemandPrice` | On-demand hourly price |
| `spot_price` | Spot instance hourly price |
| `discount` | Discount percentage (for spot instances) |
| `interruption_frequency` | Likelihood of interruption |
| `components` | Components deployed on this instance |

---

## Core Components Explained

### 1. CCO.py - Command-Line Interface

**Purpose**: Main entry point for command-line usage.

**Key Functions**:
- `run_optimizer()`: Orchestrates the entire optimization process
- `serialize_group()`: Converts internal data structures to JSON output
- `serialize_instance()`: Formats instance information for output

**Flow**:
1. Reads `input_fleet.json`
2. Reads `config_file.json`
3. Calls `SpotCalculator.get_fleet_offers()`
4. Writes results to `fleet_results.json`

### 2. app.py - Web API Server

**Purpose**: Provides REST API endpoints for web-based usage.

**Endpoints**:
- `POST /getAWSFleet`: Optimize AWS fleet
- `POST /getAzureFleet`: Optimize Azure fleet
- `POST /getHybridCloudFleet`: Optimize hybrid cloud
- `POST /getAWSPrices`: Single instance search (AWS)
- `POST /getAzurePrices`: Single instance search (Azure)
- `POST /getHybridPrices`: Single instance search (Hybrid)

**Usage Example**:
```bash
# Start server
python3 app.py

# In another terminal, send request
curl -X POST http://localhost:5000/getAWSFleet \
  -H "Content-Type: application/json" \
  -d @input_fleet.json
```

### 3. get_spot.py - SpotCalculator Class

**Purpose**: Main orchestrator that coordinates data fetching and optimization.

**Key Methods**:

#### `get_spot_estimations()`
Finds suitable VMs for a single component.

**Parameters**:
- `payment`: `"spot"` or `"onDemand"`
- `provider`: `"AWS"`, `"Azure"`, or `"Hybrid"`
- `os`: `"linux"` or `"windows"`
- `v_cpus`: Required vCPUs
- `memory`: Required memory (GB)
- `region`: Region to search
- `behavior`: Interruption behavior
- `frequency`: Max interruption frequency

**Returns**: List of matching instances sorted by price

#### `get_fleet_offers()`
Finds optimal configurations for entire workload.

**Parameters**:
- `user_os`: Operating system
- `region`: Region(s) to search
- `app_size`: Dictionary of app sizes
- `params`: List of component groups
- `payment`: Pricing model
- `provider`: Cloud provider
- `bruteforce`: Use brute force algorithm

**Returns**: List of optimized configurations

#### `get_ec2_from_cache()`
Fetches and caches EC2 pricing data.

**Behavior**:
- Checks if data is already cached
- Fetches from AWS API if needed
- Saves to JSON files for future use
- Respects `onceAday` setting

### 4. single_instance_calculator.py - SpotInstanceCalculator

**Purpose**: Matches individual components to suitable VM instances.

**Key Methods**:

#### `get_spot_estimations()`
Filters and ranks instances based on requirements.

**Filtering Logic**:
1. **Resource Filter**: CPU and memory must meet minimum requirements
2. **Architecture Filter**: Matches CPU architecture if specified
3. **Type Filter**: Matches instance family if specified
4. **Network Filter**: Checks network bandwidth requirements
5. **Interruption Filter**: Validates spot interruption behavior
6. **Frequency Filter**: Ensures interruption frequency is acceptable

**Returns**: Sorted list of matching instances

#### `network_filter()`
Validates network requirements.

**Logic**:
- If `network = 0`: Accepts all instances
- If `burstable = true`: Accepts instances with "Up to X Gbps"
- If `burstable = false`: Requires guaranteed bandwidth (no "Up to")

#### `interruption_filter()`
Validates spot interruption behavior.

**Behaviors**:
- `"terminate"`: All instances support this
- `"stop"`: All instances support this
- `"hibernate"`: Only certain instance types (c3, c4, m4, m5, r4) with ≤100GB RAM

### 5. fleet_offers.py - FleetCalculator Class

**Purpose**: Calculates optimal VM assignments for multiple components.

**Key Methods**:

#### `match_group()`
Finds best VM for a group of components.

**Process**:
1. Checks if combination was already calculated (caching)
2. Validates resource limits (CPU, memory)
3. Calls `SpotInstanceCalculator` to find matching instances
4. Creates `GroupedInstance` objects
5. Caches result for future use

**Returns**: List of `GroupedInstance` objects

#### `get_offers()`
Generates all possible configurations for a partition.

**Process**:
1. For each partition group, finds matching VMs
2. Generates all combinations using `partition2()`
3. Creates `Offer` objects with total prices
4. Filters by affinity/anti-affinity rules

**Returns**: List of `Offer` objects

#### `get_best_price()`
Finds single best configuration (used by Local Search).

**Returns**: Single `Offer` object with lowest price

### 6. fleet_classes.py - Data Classes

**Purpose**: Defines data structures used throughout the system.

#### Component Class
Represents a single application component.

**Attributes**:
- `memory`, `vCPUs`, `network`: Resource requirements
- `affinity`, `anti_affinity`: Placement constraints
- `behavior`, `interruption_frequency`: Spot instance preferences
- `app_index`, `app_name`, `component_name`: Identification

#### GroupedParam Class
Represents a group of components that can share a VM.

**Attributes**:
- `total_vcpus`, `total_memory`: Sum of all component requirements
- `network`: Maximum network requirement
- `behavior`: Most restrictive behavior (hibernate > stop > terminate)
- `interruption_frequency`: Minimum frequency (most restrictive)

#### GroupedInstance Class
Represents a VM instance with assigned components.

**Attributes**:
- `spot_price`, `onDemand`: Pricing information
- `discount`: Discount percentage
- `components`: List of components on this instance
- `total_price`: Calculated total price

#### Offer Class
Represents a complete configuration (all instances for all components).

**Attributes**:
- `instance_groups`: List of `GroupedInstance` objects
- `total_price`: Sum of all instance prices
- `region`: Deployment region
- `remaining_partitions`: Unassigned component groups

### 7. group_generator.py - Partition Generation

**Purpose**: Generates all possible ways to group components.

#### `partition()`
Generates all possible partitions of a list.

**Example**:
```
Input: [A, B, C]
Output:
  [[A], [B], [C]]
  [[A, B], [C]]
  [[A], [B, C]]
  [[A, C], [B]]
  [[A, B, C]]
```

#### `generate_all_selections()`
Generates all combinations from multiple sets.

**Example**:
```
Input: {{A, B}, {C, D}}
Output:
  [A, C]
  [A, D]
  [B, C]
  [B, D]
```

#### `create_groups()`
Main function that generates all possible component groupings.

**Process**:
1. For each app/group, generates all partitions
2. Combines partitions from all groups
3. Creates `Offer` objects for each combination

### 8. LocalSearchAlgorithm/comb_optimizer.py

**Purpose**: Implements Local Search algorithm for large workloads.

**Algorithm Overview**:
- Uses **Simulated Annealing** and **Stochastic Hill Climbing**
- Explores search space efficiently without checking all combinations
- Maintains candidate list of promising configurations
- Uses exploitation/exploration balance

**Key Classes**:

#### CombOptim
Main optimizer class.

**Parameters**:
- `number_of_results`: How many solutions to return
- `candidate_list_size`: Maximum candidates to track
- `time_per_region`: Maximum search time per region
- `proportion_amount_node_sons_to_develop`: How many child nodes to explore
- `exploitation_bias`: Balance between exploring new areas vs. refining current best

#### Node
Represents a configuration in the search tree.

**Methods**:
- `develop()`: Generates child configurations
- `getPrice()`: Calculates total cost
- `getDepth()`: Gets depth in search tree

#### SearchAlgorithm
Implements the search strategy.

**Modes**:
- `DevelopMode.ALL`: Explore all child nodes
- `DevelopMode.PROPORTIONAL`: Explore subset of children
- `GetNextMode.STOCHASTIC_ANNEALING`: Use simulated annealing
- `GetNextMode.GREEDY`: Always choose best option

---

## How It Works - Step by Step

### Complete Workflow

#### Step 1: Input Processing
1. **Read Configuration**: Loads `config_file.json` to determine algorithm, provider, etc.
2. **Read Workload**: Loads `input_fleet.json` to get component requirements
3. **Parse Components**: Converts JSON into `Component` objects
4. **Group by Apps**: Separates shared and non-shared apps

#### Step 2: Data Preparation
1. **Fetch Pricing Data**: 
   - If `onceAday`: Checks if cached data is fresh
   - If `always` or cache expired: Fetches from cloud provider APIs
   - Saves to JSON files for future use
2. **Filter Instances**: Removes excluded instance types
3. **Calculate Spot Prices**: Computes spot prices and discounts

#### Step 3: Algorithm Selection
1. **Count Components**: Determines total number of components
2. **Choose Algorithm**:
   - If `Brute Force = True` AND components < 7: Use Brute Force
   - Otherwise: Use Local Search

#### Step 4: Brute Force Algorithm (if selected)

```
For each region:
    1. Generate ALL possible component groupings
    2. For each grouping:
        a. Find best VM for each group
        b. Calculate total price
        c. Check affinity/anti-affinity rules
        d. Add to results if valid
    3. Sort results by price
    4. Return top 20 configurations
```

**Time Complexity**: O(2^n) where n = number of components
**Best For**: Small workloads (<7 components)

#### Step 5: Local Search Algorithm (if selected)

```
For each region:
    1. Start with initial configuration (each component on separate VM)
    2. Calculate initial price
    3. While time limit not reached:
        a. Generate child configurations (merge components, split groups)
        b. Evaluate prices of children
        c. Select next configuration using:
           - Stochastic Annealing (probabilistic selection)
           - Greedy (always best)
        d. Update best solution found
        e. Maintain candidate list
    4. Return best configurations found
```

**Time Complexity**: O(n² × time_limit)
**Best For**: Large workloads (7+ components)

#### Step 6: Result Processing
1. **Filter Results**: Removes invalid configurations
2. **Sort by Price**: Orders from cheapest to most expensive
3. **Limit Results**: Keeps top 20 configurations
4. **Serialize**: Converts to JSON format
5. **Write Output**: Saves to `fleet_results.json`

### Example: Simple Workflow

**Input**:
- Component 1: 4 vCPUs, 8GB RAM
- Component 2: 2 vCPUs, 4GB RAM
- Region: us-east-1
- Payment: spot

**Process**:
1. **Option A**: Component 1 on VM A, Component 2 on VM B
   - VM A: a1.xlarge (4 vCPU, 8GB) = $0.05/hr
   - VM B: t3.medium (2 vCPU, 4GB) = $0.02/hr
   - **Total: $0.07/hr**

2. **Option B**: Both components on VM C
   - VM C: a1.2xlarge (8 vCPU, 16GB) = $0.10/hr
   - **Total: $0.10/hr**

3. **Result**: Option A is cheaper, so it's ranked first

---

## Algorithms Used

### 1. Brute Force Algorithm

**How It Works**:
- Generates **every possible** way to group components
- Evaluates each configuration
- Returns the truly optimal solution

**Pros**:
- ✅ Guaranteed to find optimal solution
- ✅ Simple to understand
- ✅ No parameters to tune

**Cons**:
- ❌ Exponential time complexity
- ❌ Only feasible for <7 components
- ❌ Can take hours for larger workloads

**When to Use**:
- Small workloads (<7 components)
- Need guaranteed optimal solution
- Have time to wait

### 2. Local Search Algorithm

**How It Works**:
- Starts with initial solution
- Iteratively improves by exploring nearby solutions
- Uses heuristics to avoid getting stuck in local optima

**Key Techniques**:

#### Simulated Annealing
- Accepts worse solutions with decreasing probability
- Allows escaping local optima
- Probability decreases over time (like metal cooling)

#### Stochastic Hill Climbing
- Randomly selects from improving solutions
- Weighted by improvement amount
- Balances exploration vs. exploitation

**Pros**:
- ✅ Handles large workloads efficiently
- ✅ Configurable time limits
- ✅ Good balance of speed and quality

**Cons**:
- ❌ Not guaranteed optimal
- ❌ Requires parameter tuning
- ❌ More complex to understand

**When to Use**:
- Large workloads (7+ components)
- Need results quickly
- Approximate optimal is acceptable

### 3. Partition Generation

**Purpose**: Generates all ways to group components.

**Example with 3 Components (A, B, C)**:

```
All Possible Groupings:
1. [A], [B], [C]          (3 separate VMs)
2. [A, B], [C]            (A and B together)
3. [A], [B, C]            (B and C together)
4. [A, C], [B]            (A and C together)
5. [A, B, C]              (All together)
```

**Complexity**: Bell number B(n) - grows very fast!

---

## Usage Guide

### Basic Usage (Command Line)

#### 1. Prepare Your Input
Edit `input_fleet.json` with your workload:
```json
{
    "selectedOs": "linux",
    "spot/onDemand": "spot",
    "region": "all",
    "apps": [
        {
            "app": "MyApp",
            "share": true,
            "components": [
                {
                    "name": "WebServer",
                    "memory": 8,
                    "vCPUs": 4
                }
            ]
        }
    ]
}
```

#### 2. Configure Settings
Edit `config_file.json`:
```json
{
    "Provider (AWS / Azure / Hybrid)": "AWS",
    "Brute Force": "False",
    "Time per region": 10
}
```

#### 3. Run Optimizer
```bash
source venv/bin/activate
python3 CCO.py
```

#### 4. Check Results
Open `fleet_results.json` to see optimized configurations.

### Web API Usage

#### 1. Start Server
```bash
source venv/bin/activate
python3 app.py
```

Server starts on `http://localhost:5000`

#### 2. Send Request
```bash
curl -X POST http://localhost:5000/getAWSFleet \
  -H "Content-Type: application/json" \
  -d @input_fleet.json
```

#### 3. Receive Response
JSON array of optimized configurations.

### Python API Usage

```python
from get_spot import SpotCalculator
from fleet_offers import Component

# Initialize calculator
calc = SpotCalculator()

# Define components
components = [
    Component(0, "App1", {
        "name": "Comp1",
        "memory": 8,
        "vCPUs": 4
    })
]

# Get optimized configurations
results = calc.get_fleet_offers(
    user_os="linux",
    region="us-east-1",
    app_size={0: 1},
    params=[[components[0]]],
    payment="spot",
    architecture="all",
    type_major="all",
    filter_instances="NA",
    provider="AWS",
    bruteforce=False,
    time_per_region=10
)

# Process results
for config in results:
    print(f"Price: ${config.total_price}/hr")
    print(f"Region: {config.region}")
```

---

## Function Reference

### SpotCalculator Class

#### `__init__()`
Initializes the calculator and creates price fetcher.

#### `get_spot_estimations(payment, provider, os, v_cpus, memory, ...)`
Finds suitable VMs for a single component.

**Returns**: List of instance dictionaries sorted by price

#### `get_fleet_offers(user_os, region, app_size, params, payment, ...)`
Finds optimal configurations for entire workload.

**Returns**: List of `Offer` objects

#### `get_ec2_from_cache(region, os)`
Fetches and caches EC2 pricing data.

**Returns**: Dictionary of region → instance list

#### `calculate_discount(ec2_data, provider, user_os)`
Applies discount information to pricing data.

**Returns**: Updated pricing data with discounts

### SpotInstanceCalculator Class

#### `__init__(ec2)`
Initializes with EC2 pricing data.

#### `get_spot_estimations(v_cpus, memory, architecture, type_major, ...)`
Filters instances based on requirements.

**Returns**: Sorted list of matching instances

#### `get_spot_filter(v_cpus, memory, architecture, type_major, ...)`
Applies all filters to instance list.

**Returns**: Filtered instance list

#### `network_filter(network, burstable)`
Creates network bandwidth filter function.

**Returns**: Filter function

#### `interruption_filter(behavior)`
Creates interruption behavior filter function.

**Returns**: Filter function

### FleetCalculator Class

#### `__init__(ec2_calculator)`
Initializes with instance calculator.

#### `match_group(grouped_param, region, payment, ...)`
Finds best VM for a component group.

**Returns**: List of `GroupedInstance` objects

#### `get_offers(group, region, payment, ...)`
Generates all configurations for a partition.

**Returns**: List of `Offer` objects

#### `get_best_price(group, region, pricing, ...)`
Finds single best configuration.

**Returns**: `Offer` object or `None`

### Component Class

#### `__init__(app_index, app_name, component_specs)`
Creates component from specification dictionary.

#### `affinity_list(component_specs)`
Parses affinity requirements.

**Returns**: List of component names or `None`

#### `anti_affinity_list(component_specs)`
Parses anti-affinity requirements.

**Returns**: List of component names or `None`

### GroupedParam Class

#### `__init__(params, app_sizes)`
Aggregates requirements from multiple components.

**Calculates**:
- Total vCPUs (sum)
- Total memory (sum)
- Network (sum)
- Behavior (most restrictive)
- Interruption frequency (minimum)

### Offer Class

#### `__init__(partitions, app_sizes)`
Creates offer from partition configuration.

#### `copy_group()`
Creates deep copy of offer.

**Returns**: New `Offer` object

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "No matching instances found"

**Symptoms**: Results file is empty or shows "Couldn't find any match"

**Causes**:
- Resource requirements too high
- Region doesn't have required instance types
- Filters too restrictive

**Solutions**:
- Reduce memory/vCPU requirements
- Try different region or use `"all"`
- Remove `filterInstances` restrictions
- Check if architecture filter is too restrictive

#### 2. "Module not found" errors

**Symptoms**: `ImportError` or `ModuleNotFoundError`

**Solutions**:
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall packages
pip install -r requirements.txt
# OR
pip install requests urllib3 grequests numpy boto3 flask flask-cors
```

#### 3. Slow performance

**Symptoms**: Takes very long to complete

**Causes**:
- Using brute force on large workload
- Searching all regions
- Data extraction happening

**Solutions**:
- Set `"Brute Force": "False"` for >7 components
- Specify specific regions instead of `"all"`
- Set `"Data Extraction": "onceAday"` to use cache
- Reduce `"Time per region"` for Local Search

#### 4. Out of memory errors

**Symptoms**: `MemoryError` or system slowdown

**Causes**:
- Too many components (brute force)
- Too many regions

**Solutions**:
- Use Local Search algorithm
- Search fewer regions
- Increase system RAM
- Reduce `"Candidate list size"`

#### 5. Incorrect prices

**Symptoms**: Prices seem wrong or outdated

**Causes**:
- Cached data is stale
- Spot prices changed

**Solutions**:
- Set `"Data Extraction": "always"`
- Delete cached JSON files and rerun
- Enable boto3 for real-time prices (slower)

#### 6. Web server won't start

**Symptoms**: `Address already in use` or connection refused

**Solutions**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
# Edit app.py, change: app.run(port=5001)
```

#### 7. Permission denied errors

**Symptoms**: Can't write to files or activate venv

**Solutions**:
```bash
# Fix file permissions
chmod +x venv/bin/activate

# Ensure write permissions
chmod 755 AWSData AzureData

# Use source, not direct execution
source venv/bin/activate  # ✅ Correct
./venv/bin/activate       # ❌ Wrong
```

### Debugging Tips

#### Enable Verbose Mode
```json
{
    "Verbose": "True"
}
```

#### Check Logs
- Look for print statements in console
- Check for error messages
- Monitor system resources (CPU, RAM)

#### Test with Simple Input
Start with minimal workload:
```json
{
    "selectedOs": "linux",
    "spot/onDemand": "spot",
    "region": "us-east-1",
    "apps": [
        {
            "app": "Test",
            "share": false,
            "components": [
                {
                    "name": "TestComp",
                    "memory": 2,
                    "vCPUs": 1
                }
            ]
        }
    ]
}
```

#### Validate JSON
Use JSON validator to check input format:
```bash
python3 -m json.tool input_fleet.json
```

---

## Advanced Topics

### Understanding Affinity and Anti-Affinity

#### Affinity
Components with affinity **must** be placed on the same VM.

**Use Cases**:
- Components that communicate frequently
- Need low latency between components
- Share data efficiently

**Example**:
```json
{
    "name": "WebServer",
    "affinity": "Database"
}
```
WebServer and Database will always be on the same VM.

#### Anti-Affinity
Components with anti-affinity **must not** be on the same VM.

**Use Cases**:
- High availability (avoid single point of failure)
- Resource isolation
- Security separation

**Example**:
```json
{
    "name": "PrimaryDB",
    "anti-affinity": "BackupDB"
}
```
PrimaryDB and BackupDB will always be on different VMs.

### Understanding Component Sharing

#### App-Level Sharing (`share: true`)
Components from apps with `share: true` can be placed with components from other apps.

**Example**:
```json
{
    "app": "App1",
    "share": true,
    "components": [...]
}
```
App1 components can share VMs with App2, App3, etc.

#### App-Level Isolation (`share: false`)
Components from apps with `share: false` can only share VMs with components from the same app.

**Example**:
```json
{
    "app": "App2",
    "share": false,
    "components": [...]
}
```
App2 components can only share VMs with other App2 components.

### Spot Instance Interruption Behavior

#### Terminate
Instance is terminated when interrupted. Data on instance storage is lost.

**Best For**: Stateless applications, batch jobs

#### Stop
Instance is stopped (not terminated). Can be restarted later.

**Best For**: Applications that can pause and resume

#### Hibernate
Instance state is saved to disk. Can resume exactly where it left off.

**Best For**: Long-running applications, stateful services

**Limitations**: Only certain instance types support hibernation

### Interruption Frequency

| Value | Frequency | Meaning |
|-------|-----------|---------|
| 0 | <5% | Very low interruption risk |
| 1 | 5-10% | Low interruption risk |
| 2 | 10-15% | Moderate interruption risk |
| 3 | 15-20% | High interruption risk |
| 4 | >20% | Very high interruption risk |

Lower values = more stable but potentially more expensive.

### Network Requirements

#### Burstable Network (`burstable: true`)
Allows "Up to X Gbps" instances. Network performance can vary.

**Best For**: Applications with variable network needs

#### Guaranteed Network (`burstable: false`)
Requires guaranteed bandwidth. No "Up to" instances.

**Best For**: Applications requiring consistent network performance

### Hybrid Cloud Strategy

When using `"Provider": "Hybrid"`:
- Searches both AWS and Azure
- Combines results from both providers
- Can split workload across providers
- More complex but potentially cheaper

**Considerations**:
- Data transfer costs between clouds
- Latency between regions
- Management complexity

### Performance Tuning

#### For Speed
```json
{
    "Brute Force": "False",
    "Time per region": 5,
    "Candidate list size": 50,
    "Proportion amount node/sons": 0.01
}
```

#### For Quality
```json
{
    "Brute Force": "False",
    "Time per region": 60,
    "Candidate list size": 200,
    "Proportion amount node/sons": 0.05
}
```

#### For Optimal (Small Workloads)
```json
{
    "Brute Force": "True"
}
```

### Data Extraction Strategies

#### `"onceAday"`
- Uses cached data if updated today
- Faster execution
- May have slightly outdated prices
- **Recommended for**: Frequent runs, development

#### `"always"`
- Always fetches fresh data
- Slower execution
- Most up-to-date prices
- **Recommended for**: Production, final decisions

### Understanding Results

#### Price Calculation
```
Total Price = Σ(Instance Price × (1 - Discount/100))
```

For spot instances:
```
Instance Price = Spot Price × (1 - Discount/100)
```

#### Ranking
Results are sorted by total price (ascending). First result is cheapest.

#### Multiple Results
Top 20 configurations are returned. Compare to find:
- Best price
- Best region
- Best instance types
- Trade-offs (price vs. stability)

---

## Conclusion

The Cloud Cost Optimizer is a powerful tool for minimizing cloud infrastructure costs. By understanding its components, algorithms, and configuration options, you can effectively optimize your cloud deployments.

### Key Takeaways

1. **Start Simple**: Begin with basic configurations and add complexity gradually
2. **Choose Right Algorithm**: Brute Force for small workloads, Local Search for large
3. **Understand Constraints**: Affinity, anti-affinity, and sharing rules affect results
4. **Monitor Performance**: Adjust time limits and parameters based on needs
5. **Validate Results**: Always review top configurations, not just the cheapest

### Next Steps

- Experiment with different workloads
- Compare AWS vs. Azure vs. Hybrid
- Analyze trade-offs between spot and on-demand
- Optimize for your specific use case

### Getting Help

- Review this documentation
- Check example inputs in `input_fleet.json`
- Enable verbose mode for debugging
- Validate JSON format before running

---

**Documentation Version**: 1.0  
**Last Updated**: 2024  
**Project**: Cloud Cost Optimizer (CCO)
