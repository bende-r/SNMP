import React, { useState, useEffect } from "react";
import axios from "axios";
import "../static/css/SNMPMonitor.css";

type OIDOption = {
  name: string;
  oid: string;
};

type SNMPData = {
  oid: string;
  value: string | number;
};

const SNMPMonitor = () => {
  const [ip, setIp] = useState("");
  const [savedIps, setSavedIps] = useState<string[]>([]);
  const [oidOptions, setOidOptions] = useState<OIDOption[]>([]);
  const [selectedOid, setSelectedOid] = useState("");
  const [data, setData] = useState<SNMPData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newIp, setNewIp] = useState("");
  const [newOidName, setNewOidName] = useState("");
  const [newOid, setNewOid] = useState("");
  const [showDeletePanel, setShowDeletePanel] = useState(false);

  // Валидация IP-адреса
  const isValidIP = (ip: string): boolean => {
    const ipPattern =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipPattern.test(ip);
  };

  // Валидация OID
  const isValidOID = (oid: string): boolean => {
    const oidPattern = /^\.?(\d+\.)*\d+$/;
    return oidPattern.test(oid);
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchSavedData();
  }, []);

  // Загрузка сохраненных IP и OID
  const fetchSavedData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/data");
      setSavedIps(response.data.ips);
      setOidOptions(response.data.oids);
      if (response.data.oids.length > 0) {
        setSelectedOid(response.data.oids[0].oid);
      }
    } catch (err) {
      console.error("Ошибка при загрузке данных:", err);
    }
  };

  // Добавление IP
  const addIp = async () => {
    if (!newIp) {
      setError("Поле IP не может быть пустым");
      return;
    }

    if (!isValidIP(newIp)) {
      setError("Неверный формат IP-адреса");
      return;
    }

    try {
      await axios.post("http://localhost:8000/add-ip", { ip: newIp });
      setNewIp("");
      setError(null);
      fetchSavedData();
    } catch (err) {
      console.error("Ошибка при добавлении IP:", err);
      setError("Ошибка при добавлении IP");
    }
  };

  // Удаление IP
  const removeIp = async (ipToRemove: string) => {
    try {
      await axios.post("http://localhost:8000/remove-ip", { ip: ipToRemove });
      fetchSavedData();
    } catch (err) {
      console.error("Ошибка при удалении IP:", err);
    }
  };

  // Добавление OID
  const addOid = async () => {
    if (!newOidName || !newOid) {
      setError("Поля имени и OID не могут быть пустыми");
      return;
    }

    if (!isValidOID(newOid)) {
      setError("Неверный формат OID");
      return;
    }

    try {
      await axios.post("http://localhost:8000/add-oid", {
        name: newOidName,
        oid: newOid,
      });
      setNewOidName("");
      setNewOid("");
      setError(null);
      fetchSavedData();
    } catch (err) {
      console.error("Ошибка при добавлении OID:", err);
      setError("Ошибка при добавлении OID");
    }
  };

  // Удаление OID
  const removeOid = async (oidToRemove: string) => {
    try {
      await axios.post("http://localhost:8000/remove-oid", {
        oid: oidToRemove,
      });
      fetchSavedData();
    } catch (err) {
      console.error("Ошибка при удалении OID:", err);
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
      {error && <div className="error-text">{error}</div>}
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

          <button
            onClick={() => setShowDeletePanel(!showDeletePanel)}
            className="delete-panel-toggle"
          >
            {showDeletePanel ? "Скрыть удаление" : "Управление элементами"}
          </button>
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
      {showDeletePanel && (
        <div className="delete-panel">
          <h3>Управление элементами</h3>
          <div className="delete-section">
            <h4>Сохраненные IP</h4>
            {savedIps.map((savedIp) => (
              <div key={savedIp} className="ip-item">
                <span>{savedIp}</span>
                <button
                  onClick={() => removeIp(savedIp)}
                  className="remove-btn"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
          <div className="delete-section">
            <h4>Сохраненные OID</h4>
            {oidOptions.map(({ name, oid }) => (
              <div key={oid} className="oid-item">
                <span>{name}</span>
                <button onClick={() => removeOid(oid)} className="remove-btn">
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SNMPMonitor;
