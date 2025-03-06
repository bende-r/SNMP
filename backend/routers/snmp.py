import json
import re
from fastapi import APIRouter, HTTPException
from pysnmp.hlapi import *

router = APIRouter()

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

@router.get("/snmp/")
def get_snmp_data(ip: str, oid: str):
    """API-метод для получения данных с SNMP-агента"""
    response = snmp_get(ip, oid)
    if "error" in response:
        raise HTTPException(status_code=400, detail=response["error"])
    return response
