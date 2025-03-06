# SNMP Monitor

📱 **SNMP Monitor** – это приложение для мониторинга устройств с использованием **протокола SNMP**. Позволяет получать данные по **OID**, управлять списком устройств и отображать метрики в удобном интерфейсе.

## 🚀 Основные функции

✅ Получение данных по **SNMP (v2c)**  
✅ Автоматическое обновление данных  
✅ Сохранение списка **IP-адресов и OID**  
✅ Гибкая настройка **настраиваемых OID**  
✅ Поддержка **мониторинга серверов Lenovo SR650**  
✅ Графический интерфейс на **React**

---

## 🛠 Установка и запуск

### 👐 Требования

- **Node.js** (ver. 16+)
- **Python** (ver. 3.8+)
- **FastAPI** (backend)
- **SNMP-Server**

### 1. Установка Backend (FastAPI)

```sh
cd backend
python -m venv venv
source venv/bin/activate  # (Linux/macOS)
venv\Scripts\activate     # (Windows)
pip install -r requirements.txt
```

Запуск Backend:

```sh
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

API: [http://localhost:8000](http://localhost:8000)

---

### 2. Установка Frontend (React)

```sh
cd frontend
npm install
```

Запуск Frontend:

```sh
npm run dev
```

Веб-панель: [http://localhost:5173](http://localhost:5173)

---

### 3. Одновременный запуск

#### Linux/macOS:

```sh
chmod +x start.sh
./start.sh
```

#### Windows:

```sh
start.bat
```

---
