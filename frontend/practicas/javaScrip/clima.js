const API_KEY = 'e044ae1a7d4cf772bd60a0171f329fd4';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const elements = {
    loading: document.getElementById('loading'),
    weatherContent: document.getElementById('weather-content'),
    error: document.getElementById('error'),
    cityName: document.getElementById('city-name'),
    weatherIcon: document.getElementById('weather-icon'),
    temperature: document.getElementById('temperature'),
    description: document.getElementById('description'),
    feelsLike: document.getElementById('feels-like'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('wind-speed'),
    visibility: document.getElementById('visibility'),
};

// Oculta todos los elementos
function hideAllElements() {
    elements.loading.style.display = 'none';
    elements.weatherContent.style.display = 'none';
    elements.error.style.display = 'none';
}

// Mostrar error
function showError(message) {
    hideAllElements();
    elements.error.style.display = 'block';
    document.getElementById('error-message').textContent = message;
}

// Obtener clima por lat/lon
async function fetchWeatherData(lat, lon) {
    try {
        hideAllElements();
        elements.loading.style.display = 'block';
        elements.loading.querySelector('p').textContent = 'Obteniendo clima...';
        
        const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`);
        
        if (!response.ok) throw new Error('Error al obtener datos del clima');
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
    }
}

// Mostrar clima en la página
function displayWeather(data) {
    hideAllElements();
    elements.weatherContent.style.display = 'block';
    
    const select = document.getElementById('city-select');
    elements.cityName.textContent = select.options[select.selectedIndex].textContent;
    
    const weather = data.weather[0];
    elements.weatherIcon.innerHTML = `<i class="fas ${getWeatherIcon(weather.id)}"></i>`;
    elements.temperature.textContent = `${Math.round(data.main.temp)}°C`;
    elements.description.textContent = weather.description;
    elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    elements.humidity.textContent = `${data.main.humidity}%`;
    elements.windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    elements.visibility.textContent = `${(data.visibility / 1000)} km`;
    
    updateBackground(weather.id);
}

// Iconos según ID de OpenWeather
function getWeatherIcon(id) {
    if (id >= 200 && id < 300) return 'fa-bolt';
    if (id >= 300 && id < 600) return 'fa-cloud-rain';
    if (id >= 600 && id < 700) return 'fa-snowflake';
    if (id >= 700 && id < 800) return 'fa-smog';
    if (id === 800) return 'fa-sun';
    if (id > 800) return 'fa-cloud';
    return 'fa-cloud';
}

// Cambiar fondo según clima
function updateBackground(id) {
    document.body.className = '';
    if (id === 800) document.body.classList.add('sunny');
    else if (id > 800) document.body.classList.add('cloudy');
    else if (id >= 600 && id < 700) document.body.classList.add('snowy');
    else document.body.classList.add('rainy');
}

// Buscar por selección
function searchBySelect() {
    const select = document.getElementById('city-select');
    const [lat, lon] = select.value.split(',').map(Number);
    fetchWeatherData(lat, lon);
}

// Función para reintentar (usada por el botón de error)
function initializeApp() {
    searchBySelect();
}

// Inicializar app con la primera ciudad
window.addEventListener('load', () => {
    searchBySelect(); // carga la ciudad por defecto
});