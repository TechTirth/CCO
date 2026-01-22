# Cloud Cost Optimizer - Quick Reference Guide

## Quick Start

```bash
# 1. Activate virtual environment
source venv/bin/activate

# 2. Edit input file
nano input_fleet.json

# 3. Run optimizer
python3 CCO.py

# 4. Check results
cat fleet_results.json
```

## Common Commands

### Run Optimizer
```bash
python3 CCO.py
```

### Start Web Server
```bash
python3 app.py
# Server runs on http://localhost:5000
```

### Test Single Instance Search
```python
from get_spot import SpotCalculator

calc = SpotCalculator()
results = calc.get_spot_estimations(
    payment="spot",
    provider="AWS",
    os="linux",
    v_cpus=4,
    memory=8,
    storage_size=0,
    region="us-east-1"
)
print(results[0])  # Cheapest option
```

## Configuration Quick Settings

### Fast Results (Development)
```json
{
    "Data Extraction (always / onceAday)": "onceAday",
    "Provider (AWS / Azure / Hybrid)": "AWS",
    "Brute Force": "False",
    "Time per region": 5,
    "Verbose": "True"
}
```

### Best Quality (Production)
```json
{
    "Data Extraction (always / onceAday)": "always",
    "Provider (AWS / Azure / Hybrid)": "AWS",
    "Brute Force": "False",
    "Time per region": 60,
    "Verbose": "False"
}
```

### Small Workload (<7 components)
```json
{
    "Brute Force": "True"
}
```

## Input File Template

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
                    "name": "Component1",
                    "memory": 8,
                    "vCPUs": 4,
                    "network": 0
                }
            ]
        }
    ]
}
```

## Output Interpretation

### Best Configuration
```json
{
    "price": 0.275,           // Total hourly cost
    "region": "us-east-2",   // Best region
    "instances": [...]        // VM instances used
}
```

### Instance Details
- `typeName`: Instance type (e.g., "a1.2xlarge")
- `spot_price`: Hourly spot price
- `discount`: Discount percentage
- `components`: Components on this instance

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| No results | Reduce resource requirements or change region |
| Too slow | Set `"Brute Force": "False"` and reduce `"Time per region"` |
| Module errors | Run `pip install -r requirements.txt` |
| Permission denied | Use `source venv/bin/activate` (not direct execution) |

## Algorithm Selection

- **<7 components**: Use `"Brute Force": "True"` (optimal solution)
- **≥7 components**: Use `"Brute Force": "False"` (faster, approximate)

## Region Options

- `"all"`: Search all regions (slower)
- `"us-east-1"`: Single region (faster)
- `["us-east-1", "eu-west-1"]`: Multiple specific regions

## Payment Models

- `"spot"`: Up to 90% cheaper, can be interrupted
- `"onDemand"`: More expensive, guaranteed availability

## Component Sharing

- `"share": true`: Can share VMs with other apps
- `"share": false`: Only shares within same app

## Affinity Rules

```json
{
    "name": "Comp1",
    "affinity": "Comp2"        // Must be on same VM
}
```

```json
{
    "name": "Comp1",
    "anti-affinity": "Comp2"   // Must be on different VMs
}
```

## Interruption Frequency

- `0`: <5% risk (most stable)
- `1`: 5-10% risk
- `2`: 10-15% risk
- `3`: 15-20% risk
- `4`: >20% risk (cheapest)

## Web API Endpoints

```
POST /getAWSFleet        - Optimize AWS fleet
POST /getAzureFleet      - Optimize Azure fleet
POST /getHybridCloudFleet - Optimize hybrid cloud
POST /getAWSPrices       - Single instance (AWS)
POST /getAzurePrices     - Single instance (Azure)
POST /getHybridPrices    - Single instance (Hybrid)
```

## File Locations

- **Input**: `input_fleet.json`
- **Config**: `config_file.json`
- **Output**: `fleet_results.json`
- **AWS Data**: `AWSData/ec2_data_Linux.json`
- **Azure Data**: `AzureData/Azure_data_v2.json`

## Performance Tips

1. Use `"onceAday"` for data extraction during development
2. Specify regions instead of `"all"` for faster results
3. Use Local Search for large workloads
4. Reduce `"Time per region"` if results are needed quickly

## Validation

```bash
# Validate JSON format
python3 -m json.tool input_fleet.json

# Check Python syntax
python3 -m py_compile CCO.py
```

---

For detailed information, see `COMPREHENSIVE_DOCUMENTATION.md`
