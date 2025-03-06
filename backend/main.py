from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from typing import List, Dict

app = FastAPI()

# Разрешаем CORS-запросы
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Путь к файлу данных
DATA_FILE = "data.json"

# Модель для добавления OID
class OIDModel(BaseModel):
    name: str
    oid: str

# Модель для добавления IP
class IPModel(BaseModel):
    ip: str

# Загрузка данных из файла
def load_data() -> Dict:
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as file:
            return json.load(file)
    return {"ips": [], "oids": []}

# Сохранение данных в файл
def save_data(data: Dict):
    with open(DATA_FILE, "w") as file:
        json.dump(data, file, indent=4)

# Получить все IP и OID
@app.get("/data")
async def get_data():
    return load_data()

# Эндпоинт для добавления IP
@app.post("/add-ip")
async def add_ip(ip_data: IPModel):
    data = load_data()
    if ip_data.ip not in data["ips"]:
        data["ips"].append(ip_data.ip)
        save_data(data)
    return {"message": "IP добавлен", "data": data}
    
# Добавить OID
@app.post("/add-oid")
async def add_oid(oid: OIDModel):
    data = load_data()
    data["oids"].append({"name": oid.name, "oid": oid.oid})
    save_data(data)
    return {"message": "OID добавлен", "data": data}

# Получить данные SNMP
@app.get("/snmp/")
async def get_snmp_data(ip: str, oid: str):
    response = snmp_get(ip, oid)
    if "error" in response:
        raise HTTPException(status_code=400, detail=response["error"])
    return response

# Функция для SNMP-запроса
def snmp_get(ip: str, oid: str, community: str = "public"):
    """Функция для запроса данных по SNMP"""
    try:
        iterator = getCmd(
            SnmpEngine(),
            CommunityData(community, mpModel=0),
            UdpTransportTarget((ip, 161)),
            ContextData(),
            ObjectType(ObjectIdentity(oid))
        )

        errorIndication, errorStatus, errorIndex, varBinds = next(iterator)

        if errorIndication:
            return {"error": str(errorIndication)}
        elif errorStatus:
            return {"error": str(errorStatus)}
        else:
            raw_value = varBinds[0][1].prettyPrint()  # Преобразуем в строку
            
            # Проверка, является ли ответ Hex-STRING
            hex_match = re.match(r'\\x([0-9A-Fa-f]{2})', raw_value)
            if hex_match:
                # Преобразуем Hex-STRING в число
                decoded_value = int.from_bytes(bytes(raw_value, "latin1"), byteorder="big")
                return {"oid": oid, "value": decoded_value, "raw": raw_value}

            return {"oid": oid, "value": raw_value}

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)