# RefrigLab

A lightweight refrigeration research workspace for EES results, experimental data, psychrometric analysis, project comparison, and report-ready figures.

## Railway deployment

1. Deploy this GitHub repository as a Railway service.
2. Add a Railway volume mounted at `/data`.
3. Set the service variable `DATA_DIR=/data`.
4. Generate a public Railway domain after the deployment succeeds.

The included `railway.toml` builds and starts the Next.js application. Custom refrigerant property tables and other stored records are written below `DATA_DIR`, so they survive deployments when the volume is attached.

## Refrigerant data

The built-in names are catalog entries, not fabricated property datasets. Import a CSV containing:

`temperature_c, pressure_bar, enthalpy_kj_kg, entropy_kj_kg_k, density_kg_m3, phase`

Each imported table is saved once in the persistent volume and is available after restarts and future deployments.

## Psychrometric imports

The chart accepts CSV or Excel data with `label`, `dry_bulb_c`, and `relative_humidity_pct`. Optional fields are `pressure_kpa`, `wet_bulb_c`, and `humidity_ratio`.
