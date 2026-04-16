# 🌤️ App del Clima

Aplicación web que permite consultar el **clima actual** y el **pronóstico de 5 días** de cualquier ciudad utilizando la API de Open-Meteo.
Incluye una interfaz moderna, validación de entradas, manejo de errores y visualización clara de los datos.

---

## 🚀 Características principales

* 🔍 Búsqueda de ciudades con soporte para país

  * Ej: `Santiago`, `Santiago, Chile`
* 🌡️ Visualización del clima actual
* 📅 Pronóstico extendido de **5 días**
* 🎨 Interfaz moderna y responsive (desktop + móvil)
* ⚠️ Manejo de errores y validación de entradas
* 🌍 Soporte para ciudades con acentos y espacios
* ⛅ Íconos del clima dinámicos (según condición)
* 🧠 Selección inteligente de resultados (mejor coincidencia)
* 🧹 Eliminación de datos técnicos innecesarios (ej: códigos de clima)

---

## 🧱 Estructura del proyecto

```
📁 proyecto-clima
│
├── index.html     # Estructura de la interfaz
├── styles.css     # Estilos visuales y responsive
├── app.js         # Lógica de la aplicación (frontend)
└── README.md
```

---

## ⚙️ Instalación y uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/Danazc/APP-clima.git
cd weather-app
```

### 2. Abrir la aplicación

Simplemente abre el archivo:

```bash
index.html
```

en tu navegador.

---

## 🔎 Cómo usar la app

1. Ingresa una ciudad en el campo de búsqueda
2. (Opcional) Agrega el país para mayor precisión
3. Haz clic en **Buscar**
4. Visualiza:

   * Clima actual
   * Temperatura
   * Descripción
   * Pronóstico de 5 días

---

## 🧠 Ejemplos de uso

| Entrada           | Resultado                              |
| ----------------- | -------------------------------------- |
| `Santiago`        | Puede devolver múltiples coincidencias |
| `Santiago, Chile` | Resultado preciso                      |
| `New York`        | Funciona correctamente                 |
| `São Paulo`       | Soporte para acentos                   |

---

## 📊 Estructura de datos

### Clima actual

```json
{
  "temperatura_c": 18,
  "descripcion_clima": "Cielo despejado"
}
```

### Pronóstico de 5 días

```json
[
  {
    "fecha": "2026-04-15",
    "temperatura_max_c": 24,
    "temperatura_min_c": 10,
    "descripcion_clima": "Parcialmente nublado"
  }
]
```

---

## ⚠️ Manejo de errores

La aplicación maneja distintos escenarios:

* ❌ Ciudad no encontrada
* ❌ Error de red o API
* ❌ Entrada inválida
* ⏳ Estado de carga

Ejemplo:

```text
❌ No se encontraron resultados para esa búsqueda.
```

---

## 🎨 Mejoras de diseño implementadas

* Layout centrado con tarjeta moderna
* Tipografía jerárquica (temperatura destacada)
* Grid responsive para pronóstico
* Estados visuales (error / loading)
* Input y botón mejorados
* Adaptación completa a móvil

---

## 🌐 API utilizada

* Open-Meteo

  * Geocoding API
  * Forecast API

📎 https://open-meteo.com/

---

## 🔐 Seguridad

* No se utilizan API keys (API pública)
* No se almacenan datos sensibles del usuario
* Validación de inputs en frontend

---

## 🧩 Tecnologías utilizadas

* HTML5
* CSS3 (responsive design)
* JavaScript (ES6+)
* Fetch API

---


## 👨‍💻 Autor

Desarrollado como proyecto de aprendizaje en AI Training for Software Developer Graduates v2

---

## 📄 Licencia

Uso libre para fines educativos.
