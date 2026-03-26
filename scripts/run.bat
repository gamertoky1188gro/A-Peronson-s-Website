@echo off
setlocal enabledelayedexpansion

set DEV_OR_PREVIEW=dev
set LOCAL_RUNNING=true
set RUN_FRONTEND_BY=npm
set PORT_NGROK=
set PORT_NPM_DEV=5173
set PORT_NPM_PREVIEW=4173
set PORT_BACKEND=4000
set PORT_POSTGRE=5432

for %%A in (%*) do (
  set ARG=%%~A
  for /f "tokens=1,2 delims==" %%K in ("!ARG!") do (
    if /I "%%K"=="--dev-or-preview" set DEV_OR_PREVIEW=%%L
    if /I "%%K"=="--localrunning-or-incloud" set LOCAL_RUNNING=%%L
    if /I "%%K"=="--iwanttorunrunfrontendby" set RUN_FRONTEND_BY=%%L
    if /I "%%K"=="--port-ngrok" set PORT_NGROK=%%L
    if /I "%%K"=="--port-npm-dev" set PORT_NPM_DEV=%%L
    if /I "%%K"=="--port-npm-preview" set PORT_NPM_PREVIEW=%%L
    if /I "%%K"=="--port-backend" set PORT_BACKEND=%%L
    if /I "%%K"=="--port-postgre" set PORT_POSTGRE=%%L
  )
)

set HOST_FLAG=127.0.0.1
if /I "%LOCAL_RUNNING%"=="false" set HOST_FLAG=0.0.0.0

if "%DATABASE_URL%"=="" (
  if "%POSTGRES_USER%"=="" set POSTGRES_USER=postgres
  if "%POSTGRES_PASSWORD%"=="" set POSTGRES_PASSWORD=postgres
  if "%POSTGRES_DB%"=="" set POSTGRES_DB=gartexhub
  set DATABASE_URL=postgresql://%POSTGRES_USER%:%POSTGRES_PASSWORD%@localhost:%PORT_POSTGRE%/%POSTGRES_DB%
)

echo Mode: %DEV_OR_PREVIEW%
echo Local: %LOCAL_RUNNING%
echo Frontend by: %RUN_FRONTEND_BY%
echo Ports: dev=%PORT_NPM_DEV% preview=%PORT_NPM_PREVIEW% backend=%PORT_BACKEND% postgres=%PORT_POSTGRE%
echo SKIP_BUILD: %SKIP_BUILD%

set SKIP_BUILD_NORM=%SKIP_BUILD%
for %%Z in (TRUE True true 1 YES Yes yes Y y) do (
  if /I "%SKIP_BUILD_NORM%"=="%%Z" set SKIP_BUILD_NORM=true
)

if /I "%DEV_OR_PREVIEW%"=="dev" (
  if /I not "%RUN_FRONTEND_BY%"=="npm" (
    echo Dev mode only supports --iwanttorunrunfrontendby=npm (backend/ngrok disabled).
    exit /b 1
  )
  echo Starting Vite dev server...
  npm run dev -- --host %HOST_FLAG% --port %PORT_NPM_DEV%
  exit /b %ERRORLEVEL%
)

if /I not "%DEV_OR_PREVIEW%"=="preview" (
  echo Unknown --dev-or-preview value: %DEV_OR_PREVIEW%
  exit /b 1
)

if /I "%RUN_FRONTEND_BY%"=="npm" (
  echo Starting Vite preview...
  npm run preview -- --host %HOST_FLAG% --port %PORT_NPM_PREVIEW%
  exit /b %ERRORLEVEL%
)

set PORT=%PORT_BACKEND%

if /I "%RUN_FRONTEND_BY%"=="backend" (
  if /I not "%SKIP_BUILD_NORM%"=="true" (
    echo Building frontend and serving dist via backend...
    npm run build
    if not "%ERRORLEVEL%"=="0" exit /b %ERRORLEVEL%
  )
  set SERVE_DIST=true
  echo Starting backend server...
  npm run server
  exit /b %ERRORLEVEL%
)

if /I "%RUN_FRONTEND_BY%"=="ngrok" (
  if /I not "%SKIP_BUILD_NORM%"=="true" (
    echo Building frontend and serving dist via backend...
    npm run build
    if not "%ERRORLEVEL%"=="0" exit /b %ERRORLEVEL%
  )
  set SERVE_DIST=true
  echo Starting backend server...
  start /b npm run server
  if "%PORT_NGROK%"=="" (
    set PORT_NGROK=%PORT_BACKEND%
  )
  echo Starting ngrok tunnel for port %PORT_NGROK%...
  ngrok http %PORT_NGROK%
  exit /b %ERRORLEVEL%
)

echo Unknown --iwanttorunrunfrontendby value: %RUN_FRONTEND_BY%
exit /b 1
