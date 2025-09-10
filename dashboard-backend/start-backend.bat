@echo off
echo Starting Domain Generator Backend...
echo.
echo Make sure to configure your API keys in .env file:
echo - OPENAI_API_KEY=your_openai_api_key_here
echo - NAMECOM_USERNAME=your_namecom_username (optional)
echo - NAMECOM_TOKEN=your_namecom_api_token (optional)
echo.
echo Backend will run on http://localhost:3001
echo Frontend should run on http://localhost:3000
echo.
pause
node server.js
