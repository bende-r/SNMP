import React, { useState, useEffect } from "react";
import axios from "axios";
import "../static/css/SNMPMonitor.css";

const DEFAULT_OID_OPTIONS = [
  { name: "Used Memory", oid: "1.3.6.1.2.1.25.2.3.1.6.1" },
  { name: "Total Memory", oid: "1.3.6.1.2.1.25.2.2.0" },
  { name: "Network Interfaces Count", oid: "1.3.6.1.2.1.2.1.0" },
  { name: "Inbound Traffic", oid: "1.3.6.1.2.1.2.2.1.10.1" },
  { name: "Outbound Traffic", oid: "1.3.6.1.2.1.2.2.1.16.1" },
  { name: "Power Status", oid: "1.3.6.1.4.1.19046.11.1.5.1.1.0" },
  { name: "System Uptime (hours)", oid: "1.3.6.1.4.1.19046.11.1.5.1.2.0" },
  { name: "System Reboot Count", oid: "1.3.6.1.4.1.19046.11.1.5.1.3.0" },
  { name: "Overall System Status", oid: "1.3.6.1.4.1.19046.11.1.5.1.4.0" },
  { name: "Power Consumption (W)", oid: "1.3.6.1.4.1.19046.11.1.1.10.1.10.0" },
  { name: "Temperature (°C)", oid: "1.3.6.1.4.1.19046.11.1.1.1.2.1.3.1" },
  { name: "Fan Speed (%)", oid: "1.3.6.1.4.1.19046.11.1.1.3.2.1.3.1" },
  { name: "Fan Status", oid: "1.3.6.1.4.1.19046.11.1.1.3.2.1.10.1" },
  { name: "Memory Module Status", oid: "1.3.6.1.4.1.19046.11.1.1.5.21.1.8.1" },
  { name: "Physical Disk Status", oid: "1.3.6.1.4.1.19046.11.1.1.12.2.1.3.1" },
  {
    name: "RAID Controller Battery Status",
    oid: "1.3.6.1.4.1.19046.11.1.1.13.1.2.1.24.1",
  },
  { name: "RAID Volume Status", oid: "1.3.6.1.4.1.19046.11.1.1.13.1.7.1.4.1" },
  { name: "Power Supply Status", oid: "1.3.6.1.4.1.19046.11.1.1.11.2.1.6.1" },
];

type SNMPData = {
  oid: string;
  value: string | number;
};

const SNMPMonitor = () => {
  const [ip, setIp] = useState("");
  const [savedIps, setSavedIps] = useState<string[]>([]);
  const [oidOptions, setOidOptions] = useState(DEFAULT_OID_OPTIONS);
  const [selectedOid, setSelectedOid] = useState(DEFAULT_OID_OPTIONS[0].oid);
  const [data, setData] = useState<SNMPData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newIp, setNewIp] = useState("");
  const [newOidName, setNewOidName] = useState("");
  const [newOid, setNewOid] = useState("");

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchSavedData();
  }, []);

  // Загрузка сохраненных IP и OID
  const fetchSavedData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/data");
      setSavedIps(response.data.ips);
      setOidOptions([...DEFAULT_OID_OPTIONS, ...response.data.oids]);
    } catch (err) {
      console.error("Ошибка при загрузке данных:", err);
    }
  };

  // Добавление IP
  const addIp = async () => {
    if (newIp) {
      try {
        await axios.post("http://localhost:8000/add-ip", { ip: newIp });
        setNewIp("");
        fetchSavedData(); // Обновляем данные
      } catch (err) {
        console.error("Ошибка при добавлении IP:", err);
      }
    }
  };

  // Добавление OID
  const addOid = async () => {
    if (newOidName && newOid) {
      try {
        await axios.post("http://localhost:8000/add-oid", {
          name: newOidName,
          oid: newOid,
        });
        setNewOidName("");
        setNewOid("");
        fetchSavedData(); // Обновляем данные
      } catch (err) {
        console.error("Ошибка при добавлении OID:", err);
      }
    }
  };

  // Функция для получения данных SNMP
  const fetchData = async () => {
    if (!ip || !selectedOid) return;

    setError(null);
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/snmp/?ip=${ip}&oid=${selectedOid}`
      );
      console.log("SNMP Response:", response.data);
      setData(response.data);
    } catch (err) {
      setError("Ошибка запроса");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="snmp-monitor-container">
      <h2 className="snmp-monitor-title">SNMP Мониторинг</h2>
      <div className="snmp-columns">
        <div className="snmp-left">
          <div className="input-group">
            <select
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="ip-input"
            >
              <option value="">Выберите IP</option>
              {savedIps.map((savedIp) => (
                <option key={savedIp} value={savedIp}>
                  {savedIp}
                </option>
              ))}
            </select>
            <button onClick={fetchData} className="oid-btn">
              Получить данные
            </button>
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Новый IP"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              className="ip-input"
            />
            <button onClick={addIp} className="oid-btn">
              Добавить IP
            </button>
          </div>
          <div className="input-group">
            <select
              value={selectedOid}
              onChange={(e) => setSelectedOid(e.target.value)}
              className="ip-input"
            >
              <option value="">Выберите OID</option>
              {oidOptions.map(({ name, oid }) => (
                <option key={oid} value={oid}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Имя OID"
              value={newOidName}
              onChange={(e) => setNewOidName(e.target.value)}
              className="ip-input"
            />
            <input
              type="text"
              placeholder="OID"
              value={newOid}
              onChange={(e) => setNewOid(e.target.value)}
              className="ip-input"
            />
            <button onClick={addOid} className="oid-btn">
              Добавить OID
            </button>
          </div>
        </div>
        <div className="snmp-right">
          {loading ? (
            <div className="loading-text">Загрузка...</div>
          ) : error ? (
            <div className="error-text">{error}</div>
          ) : data ? (
            <div className="sensor-card">
              <h3>Данные SNMP</h3>
              <ul className="sensor-details">
                <li>
                  <strong>OID:</strong> {data.oid}
                </li>
                <li>
                  <strong>Значение:</strong> {data.value}
                </li>
              </ul>
            </div>
          ) : (
            <div className="placeholder-text">Данные не получены</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SNMPMonitor;
