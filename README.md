# Galaxy Weather

A modern weather application that displays current weather conditions and a 5-day forecast. Built with React and powered by the OpenWeather API.

Una aplicación meteorológica moderna que muestra las condiciones climáticas actuales y el pronóstico de 5 días. Desarrollada con React y alimentada por la API de OpenWeather.


## Prerequisites / Requisitos

Before you begin, ensure you have the following installed:
Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Node.js** (v16 or higher / v16 o superior)  
(https://nodejs.org/)

- **npm** (Node.js package manager / gestor de paquetes de Node.js)  
(https://www.npmjs.com/)

- **OpenWeather API Key** (Clave de API de OpenWeather)  
(https://openweathermap.org/api)

## Installation / Instalación

### 1. Clone the repository / Clonar el repositorio

```bash
git clone https://github.com/jvvdix/GalaxyWeather.git
cd GalaxyWeather
```

### 2. Install dependencies / Instalar dependencias

```bash
npm install
```

### 3. Configure environment variables / Configurar variables de entorno

1. Rename `.env.example` to `.env` / Renombra `.env.example` a `.env`
2. Replace `my_api_key` with your actual OpenWeather API key / Reemplaza `my_api_key` con tu clave real de la API de OpenWeather

```env
VITE_API_KEY=your_actual_api_key_here
```

### 4. Run the application / Ejecutar la aplicación

```bash
npm run dev
```

### 5. Open your browser / Abrir el navegador

Navigate to [http://localhost:5173](http://localhost:5173)
Ve a [http://localhost:5173](http://localhost:5173)

## Project Structure / Estructura del Proyecto

```
GalaxyWeather/
├── index.html             # Main HTML file - Archivo HTML principal
├── public/                # Static files - Archivos estáticos
├── src/                   # Source code - Código fuente
│   ├── components/        # UI components - Componentes UI
│   ├── services/          # API calls - Llamadas a la API
│   └── App.jsx            # Main component - Componente principal
├── .env.example           # Environment variables example - Ejemplo de variables de entorno
├── package.json           # Dependencies and scripts - Dependencias y scripts
├── vite.config.js         # Vite configuration - Configuración de Vite
└── README.md              # Project documentation - Documentación del proyecto
```

