# 🌦️ Weather App

A comprehensive weather dashboard that provides real-time weather information, air quality, and visualizations for any city.

## 🚀 Features

- **City Search**: Search for weather conditions in any city (e.g., "Baguio").
- **Current Weather**: Displays current temperature, weather condition, and location.
- **Air Quality**: Shows current Air Quality Index (AQI).
- **Sun Cycle**: Sunrise and sunset times.
- **Data Visualization**: Weather trends chart (Chart.js).
- **Theme Toggle**: Switch between Light and Dark modes.
- **Responsive Design**: Looks great on desktop and mobile.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Chart.js
- OpenWeatherMap API

## 📦 Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/David-cmd0045/Weather_API.git
   ```
2. **Navigate to the project folder**
   ```sh
   cd Elect_Final_Dave/Wheater_Api
   ```
3. **Add your OpenWeatherMap API key**
   - Open `config.js` and insert your API key as instructed in the file.
4. **Open `index.html` in your web browser**
   - Double-click `index.html` or right-click and select “Open with” > your browser.

## 🖥️ How to Use

1. Open `index.html` in your web browser.
2. Enter a city name in the search box and click **Search**.
3. View the current weather, air quality, and charts on the dashboard.
4. Toggle the theme using the moon/sun icon in the header.

## 📄 License

This project is open source and free to use.

## 🙏 Credits

Created by Mark Dave, December 2025.

---

## 📚 API Reference (OpenWeatherMap)

**Base URL:** `https://api.openweathermap.org/data/2.5`

**Endpoints:**
- `/weather` — Current weather data
- `/forecast` — 5-day weather forecast
- `/air_pollution` — Air quality data

**Required Parameters:**
- `q`: City name (e.g., "Dagupan")
- `lat` & `lon`: Latitude and Longitude (for Air Pollution)
- `appid`: Your unique API Key
- `units`: Unit of measurement (e.g., `metric`)

**Authentication:**
- API Key via query parameter (`appid=YOUR_API_KEY`)

**Sample JSON Response (Current Weather):**
```json
{
  "coord": { "lon": 120.34, "lat": 16.04 },
  "weather": [
    {
      "id": 803,
      "main": "Clouds",
      "description": "broken clouds",
      "icon": "04d"
    }
  ],
  "main": {
    "temp": 30.5,
    "feels_like": 33.2,
    "humidity": 65
  },
  "name": "Dagupan"
}
```
