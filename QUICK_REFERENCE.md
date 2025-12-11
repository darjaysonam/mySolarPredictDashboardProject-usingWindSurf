# Quick Reference - Historical Data Feature

## Quick Start

### Using City Search (Original Method)
```
1. Enter city name → Search → Generate Forecast
```

### Using Direct Coordinates + Historical Data (NEW)
```
1. Select "Direct Coordinates"
2. Enter Latitude (e.g., 52.52) and Longitude (e.g., 13.41)
3. Select "Historical Data"
4. Pick Start Date (e.g., 2021-01-01) and End Date (e.g., 2021-12-31)
5. Click "Load Historical Data"
```

---

## Common Use Cases

### 1. Analyze Last Year's Solar Performance
```
Coordinates: Your Location
Data Type: Historical Data
Date Range: [Last Year Start] to [Last Year End]
Expected: 8,760 hourly data points
```

### 2. Compare Seasons
```
Summer (2022-06-01 to 2022-08-31)
↓ Download → Compare ↓
Winter (2022-12-01 to 2022-12-31)
```

### 3. Long-term Trend Analysis
```
Start Date: 1940-01-01 (earliest available)
End Date: Today
Expected: Decades of hourly data
```

---

## API Endpoint

**Open-Meteo Archive API:**
```
GET https://archive-api.open-meteo.com/v1/archive
  ?latitude={LAT}
  &longitude={LON}
  &start_date={YYYY-MM-DD}
  &end_date={YYYY-MM-DD}
  &hourly=temperature_2m,cloud_cover,shortwave_radiation,...
  &timezone=auto
  &wind_speed_unit=ms
```

---

## Validation Rules (Quick Checklist)

- [ ] Latitude: -90 to 90
- [ ] Longitude: -180 to 180
- [ ] Start Date ≥ 1940-01-01
- [ ] End Date ≤ Today
- [ ] Start Date < End Date
- [ ] Both dates are required for historical queries

---

## Example Coordinates

| Location | Latitude | Longitude |
|----------|----------|-----------|
| Berlin | 52.52 | 13.41 |
| New York | 40.71 | -74.01 |
| London | 51.51 | -0.13 |
| Tokyo | 35.68 | 139.69 |
| Sydney | -33.87 | 151.21 |
| São Paulo | -23.55 | -46.63 |
| Dubai | 25.20 | 55.27 |
| Singapore | 1.35 | 103.82 |

---

## Data Available

**Variables per hour:**
- Temperature (°C)
- Cloud Cover (%)
- Humidity (%)
- Wind Speed (m/s)
- Pressure (hPa)
- Precipitation (mm)
- Solar Radiation (W/m²)

**Time Coverage:**
- Historical: 1940-01-01 to Yesterday
- Forecast: Today to 7 days ahead

---

## Files Modified

```
updatedSolar/
├── components/
│   └── InputSection.tsx          ← UPDATED
├── App.tsx                       ← UPDATED
├── services/
│   └── weatherService.ts         ← (Already had fetchHistoricalWeather)
├── HISTORICAL_DATA_FEATURE.md    ← NEW
├── IMPLEMENTATION_GUIDE.md       ← NEW
└── UPDATE_SUMMARY.md             ← NEW
```

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Search city | Click "Search" button or press Enter |
| Toggle input method | Click "City Search" / "Direct Coordinates" |
| Toggle data type | Click "Real-time Forecast" / "Historical Data" |
| Submit form | Click button or press Enter |

---

## Error Messages & Solutions

| Error | Solution |
|-------|----------|
| "Latitude must be between -90 and 90" | Check latitude value |
| "Longitude must be between -180 and 180" | Check longitude value |
| "Start date must be before end date" | Swap or fix dates |
| "End date cannot be in the future" | Use today or earlier |
| "Location not found" | Try different city spelling |
| API Timeout | Check internet connection or reduce date range |

---

## Performance Tips

- **Large date ranges** (multiple years) may take longer to fetch
- **Chart rendering** is optimized for datasets up to 50,000 points
- **Use date range filters** if loading takes too long
- **Browser cache** speeds up repeat queries

---

## Browser Support

✅ Chrome/Edge (v90+)
✅ Firefox (v88+)
✅ Safari (v14+)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Getting Help

1. **Hover over labels** for input hints
2. **Read validation messages** for specific errors
3. **Check console** (F12) for detailed error logs
4. **Verify coordinates** using online tools

---

## Related Documentation

- `HISTORICAL_DATA_FEATURE.md` - Full feature documentation
- `IMPLEMENTATION_GUIDE.md` - Technical deep dive
- `UPDATE_SUMMARY.md` - Complete change summary
- `README.md` - Project overview
- `How to Run - Solar Data Access Dashboard.txt` - Setup instructions

---

## Tips & Tricks

### Tip 1: Quick Location Lookup
Use Google Maps to find coordinates:
1. Right-click on location
2. Copy latitude, longitude
3. Paste into input fields

### Tip 2: Compare Data Across Years
Load same date range for different years:
- 2020-06-01 to 2020-08-31
- 2021-06-01 to 2021-08-31
- 2022-06-01 to 2022-08-31

### Tip 3: Daily Analysis
Start Date = End Date to analyze single day:
- Date: 2022-06-21 (Summer solstice)
- Returns 24 hourly points

### Tip 4: Export Historical Data
After loading historical data:
1. Set date range in "Download Data" section
2. Click CSV or JSON button
3. Data downloads with statistics

---

## FAQ

**Q: How far back can I query?**
A: From 1940-01-01 onwards (ERA5 reanalysis dataset)

**Q: What's the accuracy?**
A: ±1-2°C for temperature, generally high for solar radiation

**Q: Do I need an API key?**
A: No, Open-Meteo free tier is used

**Q: How often is historical data updated?**
A: Daily with ~5 day delay behind actual date

**Q: Can I query real-time + historical together?**
A: No, choose one mode. Real-time auto-fetches last 7 days.

---

**Last Updated:** December 11, 2025
