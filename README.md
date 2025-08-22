GALAXY WEATHER

- Galaxy Weather is an app that shows the current weather and a 5-day forecast. This app has been developed using React and the OpenWeather API.
- Galaxy Weather es una aplicación que muestra el clima actual y la previsión de los próximos cinco días. La aplicación ha sido desarrollada con React y utiliza la API de OpenWeather.

REQUISITES - REQUISITOS
* Node.js (v16 or superior – v16 o superior)
https://nodejs.org/
* npm (Node.js package manager – gestor de paquetes de Node.js)
https://www.npmjs.com/
* API key for OpenWeather – Una clave de API de OpenWeather
https://openweathermap.org/api

INSTALLATION - INSTALACIÓN
1. Clone repository -- clonar repositorio
git clone https://github.com/jvvdix/GalaxyWeather.git
cd GalaxyWeather

2. Install dependencies -- instalar dependencias
npm install

3. Configurate environment variables -- configurar variables del entorno
Rename the file as .env and change my_api_key to your API key  -- renombra el archivo .env.example a .env y cambie my_api_key por clave de API:

4. Run the app -- ejecuta la aplicación
npm run dev

5. Open your browser and go to http://localhost:5173 -- abre tu navegador y ve a http://localhost:5173


PROJECT STRUCTURE - ESTRUCTURA DEL PROYECTO
GalaxyWeather/
├── index.html             # main HTML file - archivo HTML principal
├── public/                 # static files - archivos estáticos
├── src/                    # source code - código fuente
│   ├── components/         # UI components - componentes UI
│   ├── services/           # API calls - llamadas a la API
│   └── App.jsx             # main component - componente principal
├── .env.example            # environment variables example - ejemplo de variables de entorno
├── package.json            # dependencies and scripts - dependencias y scripts
└── vite.config.js          # Vite config - configuración de Vite

