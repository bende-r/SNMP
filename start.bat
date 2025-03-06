@echo off
echo 🚀 Запуск SNMP Monitoring System...

:: Запуск Backend
cd backend
call venv\Scripts\activate
start "Backend" cmd /k uvicorn main:app --host 0.0.0.0 --port 8000 --reload
cd ..

:: Запуск Frontend
cd frontend
start "Frontend" cmd /k npm run dev
cd ..

echo ✅ Проект запущен!
pause

