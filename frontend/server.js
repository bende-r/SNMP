const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 8000;

// Путь к JSON-файлу
const dataFilePath = path.join(__dirname, "data.json");

// Middleware
app.use(cors());
app.use(express.json());

// Загрузка данных из JSON-файла
function loadData() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(
      dataFilePath,
      JSON.stringify({ ips: [], oids: [] }, null, 2)
    );
  }
  return JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
}

// Сохранение данных в JSON-файл
function saveData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Получить все данные
app.get("/data", (req, res) => {
  const data = loadData();
  res.json(data);
});

// Добавить IP
app.post("/add-ip", (req, res) => {
  const { ip } = req.body;
  if (!ip) {
    return res.status(400).json({ error: "IP is required" });
  }

  const data = loadData();
  if (!data.ips.includes(ip)) {
    data.ips.push(ip);
    saveData(data);
  }

  res.json({ success: true, ips: data.ips });
});

// Добавить OID
app.post("/add-oid", (req, res) => {
  const { name, oid } = req.body;
  if (!name || !oid) {
    return res.status(400).json({ error: "Name and OID are required" });
  }

  const data = loadData();
  data.oids.push({ name, oid });
  saveData(data);

  res.json({ success: true, oids: data.oids });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
