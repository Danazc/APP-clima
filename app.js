const form = document.getElementById("form");
const resultado = document.getElementById("resultado");
const message = document.getElementById("message");
const ciudadInput = document.getElementById("ciudad");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = ciudadInput.value.trim();

  if (!query) {
    renderMessage("⚠️ Ingresa una ciudad. También puedes agregar el país, por ejemplo: Santiago, Chile.", "error");
    resultado.innerHTML = "";
    return;
  }

  clearMessage();
  renderMessage("Cargando clima...", "loading");
  resultado.innerHTML = "";

  try {
    const location = await getCoordinates(query);
    const weatherData = await getWeatherAndForecast(location.latitude, location.longitude);

    clearMessage();
    renderWeather(location, weatherData);
  } catch (error) {
    resultado.innerHTML = "";
    renderMessage(`❌ ${error.message}`, "error");
  }
});

async function getCoordinates(query) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=es&format=json`;
  const geoRes = await fetch(geoUrl);

  if (!geoRes.ok) {
    throw new Error(`No se pudo buscar la ciudad. Código HTTP: ${geoRes.status}`);
  }

  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("No se encontraron resultados para esa búsqueda.");
  }

  const chosenResult = selectBestResult(query, geoData.results);

  return {
    name: chosenResult.name,
    country: chosenResult.country || "Desconocido",
    admin1: chosenResult.admin1 || "",
    latitude: chosenResult.latitude,
    longitude: chosenResult.longitude,
  };
}

function selectBestResult(query, results) {
  const normalizedQuery = normalizeText(query);

  const exactCountryMatch = results.find((item) => {
    const fullName = normalizeText(`${item.name}, ${item.country || ""}`);
    const nameWithRegion = normalizeText(`${item.name}, ${item.admin1 || ""}, ${item.country || ""}`);
    return (
      fullName.includes(normalizedQuery) ||
      nameWithRegion.includes(normalizedQuery)
    );
  });

  return exactCountryMatch || results[0];
}

async function getWeatherAndForecast(latitude, longitude) {
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&forecast_days=5` +
    `&timezone=auto`;

  const weatherRes = await fetch(weatherUrl);

  if (!weatherRes.ok) {
    throw new Error(`No se pudo obtener el clima. Código HTTP: ${weatherRes.status}`);
  }

  const weatherData = await weatherRes.json();

  if (!weatherData.current || !weatherData.daily) {
    throw new Error("La API devolvió una respuesta incompleta.");
  }

  return weatherData;
}

function renderWeather(location, weatherData) {
  const currentCode = weatherData.current.weather_code;
  const currentDesc = interpretWeatherCode(currentCode);
  const currentIcon = getWeatherIcon(currentCode);

  const forecastItems = weatherData.daily.time.map((date, index) => {
    const code = weatherData.daily.weather_code[index];
    const desc = interpretWeatherCode(code);
    const icon = getWeatherIcon(code);

    return `
      <article class="forecast-item">
        <p class="forecast-day">${formatDate(date)}</p>
        <div class="forecast-icon">${icon}</div>
        <p class="forecast-desc">${desc}</p>
        <p class="forecast-temp">
          Máx ${Math.round(weatherData.daily.temperature_2m_max[index])}° /
          Mín ${Math.round(weatherData.daily.temperature_2m_min[index])}°
        </p>
      </article>
    `;
  }).join("");

  resultado.innerHTML = `
    <section class="weather-result">
      <div class="current-top">
        <div class="location-block">
          <h2>${location.name}</h2>
          <p class="location-meta">
            ${location.admin1 ? `${location.admin1}, ` : ""}${location.country}
          </p>
        </div>
        <div class="weather-icon" aria-hidden="true">${currentIcon}</div>
      </div>

      <div class="current-main">
        <div class="temp-panel">
          <p class="panel-label">Temperatura actual</p>
          <p class="current-temp">${Math.round(weatherData.current.temperature_2m)}°C</p>
        </div>

        <div class="desc-panel">
          <p class="panel-label">Condición</p>
          <p class="current-desc">${currentDesc}</p>
        </div>
      </div>

      <div class="forecast-section">
        <h3 class="forecast-title">Pronóstico de 5 días</h3>
        <div class="forecast-grid">
          ${forecastItems}
        </div>
      </div>
    </section>
  `;
}

function renderMessage(text, type) {
  message.innerHTML = `<div class="message ${type}">${text}</div>`;
}

function clearMessage() {
  message.innerHTML = "";
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString("es-CL", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}

function interpretWeatherCode(code) {
  const mapping = {
    0: "Cielo despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna ligera",
    53: "Llovizna moderada",
    55: "Llovizna intensa",
    61: "Lluvia débil",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    71: "Nieve ligera",
    73: "Nieve moderada",
    75: "Nieve intensa",
    80: "Chubascos ligeros",
    81: "Chubascos moderados",
    82: "Chubascos intensos",
    95: "Tormenta",
    96: "Tormenta con granizo ligero",
    99: "Tormenta con granizo fuerte"
  };

  return mapping[code] || "Condición no disponible";
}

function getWeatherIcon(code) {
  const iconMap = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    53: "🌦️",
    55: "🌧️",
    61: "🌧️",
    63: "🌧️",
    65: "🌧️",
    71: "🌨️",
    73: "🌨️",
    75: "❄️",
    80: "🌦️",
    81: "🌧️",
    82: "⛈️",
    95: "⛈️",
    96: "⛈️",
    99: "⛈️"
  };

  return iconMap[code] || "🌍";
}