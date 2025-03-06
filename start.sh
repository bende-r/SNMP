#!/bin/bash

echo "🚀 Запуск SNMP Monitoring System..."

# Запуск Backend
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "✅ Backend запущен (PID: $BACKEND_PID)"
cd ..

# Запуск Frontend
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend запущен (PID: $FRONTEND_PID)"
cd ..

# Ожидание завершения процессов
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
