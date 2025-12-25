// script.js

// DOM Elements
const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const errorContainer = document.getElementById('error-container');
const loading = document.getElementById('loading');
const weatherContainer = document.getElementById('weather-container');
const forecastContainer = document.getElementById('forecast-container');
const hourlyContainer = document.getElementById('hourly-container');
const themeToggle = document.getElementById('theme-toggle');
const favBtn = document.getElementById('fav-btn');
const favoritesBar = document.getElementById('favorites-bar');

const loadMoreForecastBtn = document.getElementById('loadMoreForecastBtn');
const forecastSort = document.getElementById('forecast-sort');

// --- FORECAST PAGINATION ---
let forecastData = [];
let forecastPage = 1;
const FORECAST_PAGE_SIZE = 2;

function resetForecastPagination() {
  forecastPage = 1;
}

function getPaginatedForecast() {
  return forecastData.slice(0, forecastPage * FORECAST_PAGE_SIZE);
}

function showLoadMoreForecast() {
  if (forecastData.length > forecastPage * FORECAST_PAGE_SIZE) {
    loadMoreForecastBtn.style.display = 'inline-block';
  } else {
    loadMoreForecastBtn.style.display = 'none';
  }
}

if (loadMoreForecastBtn) {
  loadMoreForecastBtn.onclick = function() {
    forecastPage++;
    renderForecastCards();
    showLoadMoreForecast();
  };
}
// --- FAVORITES (localStorage) ---
function getFavorites() {
  return JSON.parse(localStorage.getItem('weather_favorites') || '[]');
}
function setFavorites(favs) {
  localStorage.setItem('weather_favorites', JSON.stringify(favs));
}
function renderFavoritesBar() {
  const favs = getFavorites();
  favoritesBar.innerHTML = favs.map(city => `<span class="favorite-city" data-city="${city}">${city}</span>`).join('');
  // Add click event
  document.querySelectorAll('.favorite-city').forEach(el => {
    el.onclick = () => {
      cityInput.value = el.dataset.city;
      form.dispatchEvent(new Event('submit'));
    };
  });
}
function updateFavBtn(city) {
  const favs = getFavorites();
  if (favs.includes(city)) {
    favBtn.classList.add('favorited');
    favBtn.title = 'Remove from Favorites';
  } else {
    favBtn.classList.remove('favorited');
    favBtn.title = 'Add to Favorites';
  }
}
favBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (!city) return;
  let favs = getFavorites();
  if (favs.includes(city)) {
    favs = favs.filter(c => c !== city);
  } else {
    favs.push(city);
  }
  setFavorites(favs);
  updateFavBtn(city);
  renderFavoritesBar();
});

// Utility: Show loading spinner/message
function setLoading(isLoading) {
  loading.classList.toggle('hidden', !isLoading);
  searchBtn.disabled = isLoading;
}

// Utility: Show error message
function showError(msg) {
  errorContainer.textContent = msg;
}

// Utility: Clear error
function clearError() {
  errorContainer.textContent = '';
}

// Utility: Validate input
function validateInput(city) {
  if (!city.trim()) return 'Please enter a city name.';
  if (!/^[a-zA-Z\s-]+$/.test(city)) return 'Invalid characters in city name.';
  return '';
}

// API: Fetch current weather
async function fetchWeather(city) {
  // API call for current weather
  const url = `${BASE_URL}weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('City not found.');
  return res.json();
}

// API: Fetch 5-day forecast
async function fetchForecast(city) {
  // API call for 5-day forecast
  const url = `${BASE_URL}forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Forecast not found.');
  return res.json();
}

// DOM: Render current weather card
function renderWeather(data) {
  const { name, main, weather } = data;
  weatherContainer.innerHTML = `
    <div class="weather-card">
      <div>
        <h2>${name}</h2>
        <p>${weather[0].main} <span style="color:#888;font-size:0.95em;">(${weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1)})</span></p>
        <div class="weather-main-row">
          <span>🌡️ ${Math.round(main.temp)}°C</span>
          <span>💧 Humidity: ${main.humidity}%</span>
        </div>
      </div>
    </div>
  `;
  // Animate
  setTimeout(() => {
    const card = document.querySelector('.weather-card');
    if (card) card.style.opacity = 1;
  }, 10);
}

// DOM: Render 5-day forecast cards
function renderForecast(data) {
  // Always show only 5 days, but paginated
  forecastData = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);
  resetForecastPagination();
  renderForecastCards();
  showLoadMoreForecast();
}

if (forecastSort) {
  forecastSort.addEventListener('change', () => {
    renderForecastCards();
  });
}

function renderForecastCards() {
  let daily = getPaginatedForecast();
  // Sorting
  if (forecastSort) {
    const sortVal = forecastSort.value;
    if (sortVal === 'temp-asc') {
      daily = [...daily].sort((a, b) => a.main.temp - b.main.temp);
    } else if (sortVal === 'temp-desc') {
      daily = [...daily].sort((a, b) => b.main.temp - a.main.temp);
    } else {
      // Default: sort by date
      daily = [...daily].sort((a, b) => new Date(a.dt_txt) - new Date(b.dt_txt));
    }
  }
  forecastContainer.innerHTML = `
    <h3>5-Day Forecast</h3>
    <div class="forecast-list">
      ${daily.map(day => {
        const dt = new Date(day.dt_txt);
        // Manually format: Wed, Dec 24
        const weekday = dt.toLocaleDateString(undefined, { weekday: 'short' });
        const month = dt.toLocaleDateString(undefined, { month: 'short' });
        const dayNum = dt.getDate();
        const dateStr = `${weekday}, ${month} ${dayNum}`;
        return `
        <div class="forecast-card">
          <div>
            <strong>${dateStr}</strong>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].main}">
            <p>${day.weather[0].main} <span style=\"color:#888;font-size:0.95em;\">(${day.weather[0].description.charAt(0).toUpperCase() + day.weather[0].description.slice(1)})</span></p>
            <p>${Math.round(day.main.temp)}°C</p>
            <p>💧${day.main.humidity}%</p>
          </div>
        </div>
        `;
      }).join('')}
    </div>
  `;
  // Animate
  setTimeout(() => {
    document.querySelectorAll('.forecast-card').forEach(card => card.style.opacity = 1);
  }, 10);
}

// DOM: Render 4-hourly forecast bar with temperature differences
function renderHourlyBar(data) {
  // Always show the next 6 4-hour intervals from now, using the closest forecast for each
  const now = new Date();
  const segments = [];
  let prevTemp = null;
  for (let i = 1; i <= 6; i++) {
    // Target time: now + i*4 hours
    const target = new Date(now.getTime() + i * 4 * 60 * 60 * 1000);
    // Find the forecast entry closest to this target time
    let closest = null;
    let minDiff = Infinity;
    for (const entry of data.list) {
      const entryTime = new Date(entry.dt_txt);
      const diff = Math.abs(entryTime - target);
      if (diff < minDiff) {
        minDiff = diff;
        closest = entry;
      }
    }
    if (closest) segments.push(closest);
  }
  hourlyContainer.innerHTML = `
    <div class="hourly-bar">
      ${segments.map((seg, idx) => {
        const dt = new Date(seg.dt_txt);
        const hour = dt.getHours().toString().padStart(2, '0') + ':00';
        const temp = Math.round(seg.main.temp);
        let diff = '';
        if (prevTemp !== null) {
          const d = temp - prevTemp;
          diff = d === 0 ? '0°' : (d > 0 ? `+${d}°` : `${d}°`);
        }
        prevTemp = temp;
        return `
          <div class="hourly-segment">
            <span class="hour">${hour}</span>
            <img src="https://openweathermap.org/img/wn/${seg.weather[0].icon}.png" alt="${seg.weather[0].main}">
            <span class="temp">${temp}°</span>
            <span class="diff">${idx === 0 ? '' : diff}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// DOM: Clear results
function clearResults() {
  weatherContainer.innerHTML = '';
  forecastContainer.innerHTML = '';
  hourlyContainer.innerHTML = '';
}

// Theme: Toggle dark/light mode
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// Main: Handle form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();
  clearResults();
  const city = cityInput.value.trim();
  const error = validateInput(city);
  if (error) {
    showError(error);
    return;
  }
  setLoading(true);
  try {
    const [weather, forecast] = await Promise.all([
      fetchWeather(city),
      fetchForecast(city)
    ]);
    renderWeather(weather);
    renderHourlyBar(forecast);
    renderForecast(forecast);
    updateFavBtn(city);
    showLoadMoreForecast();
  } catch (err) {
    showError(err.message || 'Failed to fetch weather.');
  } finally {
    setLoading(false);
  }
});

// Optional: Enter key disables button while loading
cityInput.addEventListener('input', () => {
  searchBtn.disabled = false;
});

// On load: set theme icon and render favorites
document.addEventListener('DOMContentLoaded', () => {
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  renderFavoritesBar();
});
