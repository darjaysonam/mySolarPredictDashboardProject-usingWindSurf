# Historical Data Access Feature

## Overview
The Solar Data Access Dashboard has been updated to support accessing historical weather and solar radiation data using the Open-Meteo Archive API (ERA5 dataset).

## Features Added

### 1. Direct Coordinate Input
Instead of searching for a city by name, users can now directly enter:
- **Latitude**: Range from -90 to 90 degrees
- **Longitude**: Range from -180 to 180 degrees

**Example**: Berlin
- Latitude: 52.52
- Longitude: 13.41

### 2. Historical Data Query
Users can select a date range to access historical weather data:
- **Date Range**: From 1940 onwards (ERA5 dataset coverage)
- **Data Type Toggle**: Switch between "Real-time Forecast" and "Historical Data"

### 3. API Integration
The application uses the Open-Meteo Archive API endpoint:
```
https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date={date}&end_date={date}&hourly={variables}
```

## Historical Data Variables Available
The system fetches the following variables for historical data:
- **temperature_2m**: Air temperature at 2 meters (°C)
- **relative_humidity_2m**: Relative humidity (%)
- **cloud_cover**: Cloud cover (%)
- **shortwave_radiation**: Shortwave radiation (W/m²)
- **wind_speed_10m**: Wind speed at 10 meters (m/s)
- **precipitation**: Precipitation amount (mm)
- **surface_pressure**: Surface pressure (hPa)

## How to Use

### Method 1: Search by City Name
1. Select "City Search" in the Input Method section
2. Enter a city name (e.g., "London", "Tokyo", "Berlin")
3. Click the search button to validate the location
4. Select "Real-time Forecast" to get current weather data
5. Click "Generate Forecast"

### Method 2: Direct Coordinates
1. Select "Direct Coordinates" in the Input Method section
2. Enter the latitude and longitude of the desired location
3. Select the data type:
   - **Real-time Forecast**: Current and upcoming weather data
   - **Historical Data**: Past weather data from a specific date range
4. If selecting Historical Data:
   - Choose a start date (minimum: 1940-01-01)
   - Choose an end date (cannot be in the future)
   - End date must be after start date
5. Click "Load Historical Data" or "Generate Forecast"

## API Response Example
```json
{
  "hourly": {
    "time": ["2021-01-01T00:00", "2021-01-01T01:00", ...],
    "temperature_2m": [1.7, 1.3, 1.8, 1.3, ...],
    "cloud_cover": [80, 75, 85, 90, ...],
    "shortwave_radiation": [0, 0, 0, 5, ...],
    "relative_humidity_2m": [85, 87, 88, 90, ...],
    "wind_speed_10m": [2.5, 2.3, 2.1, 2.0, ...],
    "precipitation": [0, 0, 0, 0.1, ...],
    "surface_pressure": [1013.25, 1013.30, 1013.28, 1013.20, ...]
  }
}
```

## Data Visualization
Historical data is displayed in the same chart format as real-time forecasts:
- **Solar Irradiance Chart**: Shows shortwave radiation over the time period
- **Weather Conditions**: Temperature, humidity, and cloud cover
- **Combined Analysis**: Solar output correlated with cloud cover
- **Radiation & Wind Analysis**: Raw radiation data with wind speed

## Updated Components

### InputSection.tsx
- Added input method toggle (City Search / Direct Coordinates)
- Added latitude and longitude input fields with validation
- Added data type toggle (Real-time Forecast / Historical Data)
- Added date range picker for historical queries
- Enhanced validation for coordinates and date ranges

### App.tsx
- Updated `handleDataReady()` to accept optional historical date parameters
- Added logic to fetch historical data via `fetchHistoricalWeather()`
- Converts historical data to forecast format for unified display
- Stores historical metadata in session names

### weatherService.ts
- `fetchHistoricalWeather()`: Already existed, now actively used
- `fetchRecentHistoricalWeather()`: Fetches last 7 days of data automatically

## Validation Rules

### Coordinate Validation
- Latitude must be between -90 and 90
- Longitude must be between -180 and 180
- Both values must be finite numbers

### Date Validation
- Start date must be on or after 1940-01-01
- End date must not be in the future
- Start date must be before end date
- Both dates are required for historical queries

## Error Handling
- Invalid coordinates trigger clear error messages
- Date range validation prevents API errors
- API timeouts are handled with appropriate error messages
- Users receive feedback on all validation failures

## Performance Considerations
- Historical data queries can be large (years of hourly data)
- API request timeout is set to 20 seconds for historical queries
- Data is processed client-side to minimize server load
- Charts handle large datasets efficiently with recharts library

## Notes
- Historical data comes from the ERA5 reanalysis dataset
- Data availability depends on the Open-Meteo API coverage
- Accuracy of historical data is typically high (±1-2°C for temperature)
- Free tier of Open-Meteo API applies; no API key required
