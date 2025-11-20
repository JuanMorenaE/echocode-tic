# API Externa - BurgUM & PizzUM

Documentación de APIs REST para integración con organismos externos.

## Base URL (Local)
```
http://localhost:8080/api/v1/external
```

> **Importante:** Este proyecto corre completamente en local. Usa siempre `localhost:8080`.

## Tabla de Contenidos
1. [Autenticación](#autenticación)
2. [API Payment System](#api-payment-system)
3. [API DGI (Dirección General Impositiva)](#api-dgi)
4. [API BPS (Banco de Previsión Social)](#api-bps)
5. [Códigos de Error](#códigos-de-error)
6. [Seguridad y Auditoría](#seguridad-y-auditoría)

---

## Autenticación

Todas las APIs externas utilizan autenticación mediante **API Key**.

### Header Requerido
```
X-API-Key: your_api_key_here
```

### Obtención de API Keys
Las API keys son proporcionadas por el administrador del sistema. Cada organismo tiene su propia key:
- `PAYMENT_SYSTEM` - Para sistemas de pago
- `DGI` - Para la Dirección General Impositiva
- `BPS` - Para el Banco de Previsión Social

### Seguridad
- Las API keys están hasheadas usando BCrypt en la base de datos
- Cada acceso es registrado en un log de auditoría
- Las keys pueden tener fecha de expiración
- Las keys pueden ser desactivadas por el administrador

---

## API Payment System

### Obtener Información del Dueño de Tarjeta

Permite verificar la propiedad de una tarjeta de crédito y obtener información del titular.

**Endpoint:** `POST /card-owner`

**Headers:**
```
Content-Type: application/json
X-API-Key: your_payment_api_key
```

**Request Body:**
```json
{
  "cardNumber": "1234567890123456"
}
```

**Response 200 OK:**
```json
{
  "cardholderName": "JOHN DOE",
  "cardType": "VISA",
  "expirationDate": "12/25",
  "isValid": true,
  "client": {
    "fullName": "John Doe",
    "document": "12345678",
    "email": "john@example.com",
    "phoneNumber": "+598123456"
  }
}
```

**Campos de Respuesta:**
- `cardholderName` (string): Nombre como aparece en la tarjeta
- `cardType` (enum): Tipo de tarjeta - `VISA`, `MASTERCARD`, `AMEX`, `PREX`, `OCA`, `OTHER`
- `expirationDate` (string): Fecha de expiración en formato MM/YY
- `isValid` (boolean): Indica si la tarjeta está vigente
- `client` (object): Información del cliente dueño de la tarjeta
  - `fullName` (string): Nombre completo del cliente
  - `document` (string): Documento de identidad
  - `email` (string): Email del cliente
  - `phoneNumber` (string): Teléfono del cliente

**Errores:**
- `401 Unauthorized` - API Key inválida o no proporcionada
- `404 Not Found` - Tarjeta no encontrada en el sistema

**Response 404 Not Found:**
```json
{
  "error": "Card not found"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:8080/api/v1/external/payment/card-owner \
  -H "Content-Type: application/json" \
  -H "X-API-Key: payment_prod_2025_38ed3e40-5bcd-4a" \
  -d '{"cardNumber":"1234567890123456"}'
```

**Notas:**
- La tarjeta debe estar registrada en el sistema BurgUM & PizzUM para poder consultar su información
- Solo se retornan tarjetas activas (no eliminadas) asociadas a clientes activos

---

## API DGI

### Obtener Tickets de Venta por Fecha

Retorna todos los tickets de venta (pedidos entregados) para una fecha específica.

**Endpoint:** `GET /sales-tickets`

**Headers:**
```
X-API-Key: your_dgi_api_key
```

**Query Parameters:**
- `date` (string, requerido): Fecha en formato YYYY-MM-DD

**Request:**
```
GET /api/v1/external/dgi/sales-tickets?date=2025-11-20
```

**Response 200 OK:**
```json
{
  "date": "2025-11-20",
  "totalOrders": 150,
  "totalRevenue": 45600.00,
  "tickets": [
    {
      "orderId": 123,
      "orderHash": "550e8400-e29b-41d4-a716-446655440000",
      "orderDate": "2025-11-20T14:30:00",
      "total": 350.00,
      "status": "DELIVERED",
      "client": {
        "document": "12345678",
        "fullName": "Juan Pérez"
      },
      "items": [
        {
          "type": "CREATION",
          "name": "Pizza Personalizada",
          "quantity": 2,
          "unitPrice": 150.00,
          "subtotal": 300.00
        },
        {
          "type": "PRODUCT",
          "name": "Coca Cola 500ml",
          "quantity": 2,
          "unitPrice": 25.00,
          "subtotal": 50.00
        }
      ],
      "paymentMethod": {
        "cardType": "VISA",
        "last4Digits": "1234"
      }
    }
  ]
}
```

**Campos de Respuesta:**
- `date` (string): Fecha consultada
- `totalOrders` (integer): Cantidad total de pedidos entregados
- `totalRevenue` (double): Ingresos totales del día
- `tickets` (array): Lista de tickets de venta
  - `orderId` (integer): ID del pedido
  - `orderHash` (string): UUID único del pedido
  - `orderDate` (datetime): Fecha y hora del pedido
  - `total` (double): Total del pedido
  - `status` (string): Estado del pedido (siempre `DELIVERED`)
  - `client` (object): Datos del cliente
    - `document` (string): Documento de identidad
    - `fullName` (string): Nombre completo
  - `items` (array): Items del pedido
    - `type` (string): `CREATION` (pizza/hamburguesa personalizada) o `PRODUCT` (producto estándar)
    - `name` (string): Nombre del item
    - `quantity` (integer): Cantidad
    - `unitPrice` (double): Precio unitario
    - `subtotal` (double): Subtotal (quantity * unitPrice)
  - `paymentMethod` (object): Método de pago
    - `cardType` (string): Tipo de tarjeta
    - `last4Digits` (string): Últimos 4 dígitos de la tarjeta

**Response sin datos (fecha sin ventas):**
```json
{
  "date": "2025-11-20",
  "totalOrders": 0,
  "totalRevenue": 0.0,
  "tickets": []
}
```

**Errores:**
- `401 Unauthorized` - API Key inválida
- `400 Bad Request` - Formato de fecha inválido

**Ejemplo con curl:**
```bash
curl -X GET "http://localhost:8080/api/v1/external/dgi/sales-tickets?date=2025-11-20" \
  -H "X-API-Key: dgi_prod_2025_5eb3dc0a-af30-43"
```

**Notas:**
- Solo se retornan pedidos con estado `DELIVERED` (entregados)
- La fecha debe estar en formato ISO (YYYY-MM-DD)
- Si no hay ventas para la fecha consultada, se retorna un array vacío con totales en 0

---

## API BPS

### Obtener Cantidad de Funcionarios

Retorna el número de funcionarios (administradores) del sistema.

**Endpoint:** `GET /employee-count`

**Headers:**
```
X-API-Key: your_bps_api_key
```

**Query Parameters:**
- `asOfDate` (string, opcional): Fecha para consultas históricas en formato YYYY-MM-DD. Si no se proporciona, retorna datos actuales.

**Request:**
```
GET /api/v1/external/bps/employee-count
```

O con fecha específica:
```
GET /api/v1/external/bps/employee-count?asOfDate=2025-01-01
```

**Response 200 OK:**
```json
{
  "asOfDate": "2025-11-20",
  "totalEmployees": 25,
  "activeEmployees": 23,
  "employeeDetails": [
    {
      "document": "12345678",
      "fullName": "María González",
      "email": "maria@burgum.com",
      "role": "ADMINISTRATOR",
      "createdAt": "2024-01-15T10:00:00",
      "status": "ACTIVE"
    },
    {
      "document": "87654321",
      "fullName": "Carlos Rodríguez",
      "email": "carlos@burgum.com",
      "role": "ADMINISTRATOR",
      "createdAt": "2024-03-20T09:30:00",
      "status": "ACTIVE"
    }
  ],
  "statistics": {
    "totalAdministrators": 25,
    "totalClients": 1500,
    "deletedUsers": 2
  }
}
```

**Campos de Respuesta:**
- `asOfDate` (string): Fecha de la consulta
- `totalEmployees` (integer): Total de empleados considerando la fecha
- `activeEmployees` (integer): Empleados activos (no eliminados)
- `employeeDetails` (array): Detalles de cada empleado
  - `document` (string): Documento de identidad
  - `fullName` (string): Nombre completo
  - `email` (string): Email corporativo
  - `role` (string): Rol en el sistema (siempre `ADMINISTRATOR`)
  - `createdAt` (datetime): Fecha de ingreso al sistema
  - `status` (string): Estado - `ACTIVE` o `INACTIVE`
- `statistics` (object): Estadísticas adicionales
  - `totalAdministrators` (integer): Total de administradores en el sistema
  - `totalClients` (long): Total de clientes registrados
  - `deletedUsers` (integer): Usuarios eliminados

**Response sin empleados (sistema nuevo o filtro sin resultados):**
```json
{
  "asOfDate": "2025-11-20",
  "totalEmployees": 0,
  "activeEmployees": 0,
  "employeeDetails": [],
  "statistics": {
    "totalAdministrators": 2,
    "totalClients": 150,
    "deletedUsers": 0
  }
}
```

**Errores:**
- `401 Unauthorized` - API Key inválida
- `400 Bad Request` - Formato de fecha inválido

**Ejemplo con curl:**
```bash
# Consulta actual
curl -X GET "http://localhost:8080/api/v1/external/bps/employee-count" \
  -H "X-API-Key: bps_prod_2025_bc308015-a7ab-4d"

# Consulta histórica
curl -X GET "http://localhost:8080/api/v1/external/bps/employee-count?asOfDate=2025-01-01" \
  -H "X-API-Key: bps_prod_2025_bc308015-a7ab-4d"
```

**Notas:**
- Los empleados son usuarios con rol `ADMINISTRATOR` en el sistema
- El campo `statistics` siempre incluye totales generales del sistema
- Si se proporciona `asOfDate`, solo se incluyen empleados creados antes o en esa fecha

---

## Códigos de Error

### Códigos HTTP
- `200 OK` - Solicitud exitosa
- `400 Bad Request` - Parámetros inválidos
- `401 Unauthorized` - API Key no proporcionada o inválida
- `403 Forbidden` - API Key expirada o inactiva
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

### Formato de Error
```json
{
  "error": "Descripción del error"
}
```

---

## Seguridad y Auditoría

### Registro de Accesos (Audit Log)
Todos los accesos a las APIs externas son registrados automáticamente con:
- Sistema que realizó la solicitud (PAYMENT_SYSTEM, DGI, BPS)
- Endpoint accedido
- Método HTTP
- Parámetros de la solicitud
- Código de respuesta HTTP
- Timestamp del acceso
- Dirección IP del cliente

### Buenas Prácticas
1. **Rotar API Keys periódicamente** - Se recomienda cambiar las keys cada 90 días
2. **No compartir las keys** - Cada organismo debe mantener su key de forma segura
3. **Usar HTTPS** - Todas las comunicaciones deben ser sobre HTTPS
4. **Limitar acceso por IP** - Configurar whitelist de IPs autorizadas
5. **Monitorear uso** - Revisar logs de acceso regularmente

### Rate Limiting
Se recomienda implementar rate limiting:
- Payment System: 100 requests/minuto
- DGI: 50 requests/minuto

---

## Guía de Pruebas y Datos de Ejemplo

### Generación de API Keys

Para generar las API keys por primera vez, utiliza el endpoint de setup:

```bash
curl -X POST http://localhost:8080/api/v1/setup/generate-all-keys \
  -H "Content-Type: application/json"
```

**IMPORTANTE:** Este endpoint debe eliminarse en producción. Es solo para desarrollo y setup inicial.

### Listar API Keys Existentes

```bash
curl -X GET http://localhost:8080/api/v1/setup/list-keys
```

Retorna información sobre las keys (sin mostrar las keys en sí):
```json
{
  "count": 3,
  "keys": [
    {
      "id": 1,
      "keyName": "PAYMENT_SYSTEM",
      "active": true,
      "description": "API Key para sistema de procesamiento de pagos",
      "createdAt": "2025-11-20T10:30:00",
      "expiresAt": "2026-11-20T10:30:00",
      "lastUsedAt": "2025-11-20T14:25:30"
    }
  ]
}
```

### Datos de Prueba Necesarios

Para probar las APIs con datos reales, necesitas:

1. **Payment API**:
   - Al menos un cliente con una tarjeta registrada
   - Usa el endpoint de registro y agregar tarjeta del sistema principal

2. **DGI API**:
   - Al menos un pedido con estado `DELIVERED`
   - El pedido debe tener fecha de entrega (deliveredAt) en la fecha que quieres consultar

3. **BPS API**:
   - Al menos un usuario con rol `ADMINISTRATOR`
   - Los administradores se cuentan automáticamente

### Escenarios de Prueba Esperados

#### Caso 1: Sistema Sin Datos (esperado al inicio)
```bash
# Payment API - Tarjeta no encontrada
HTTP 404: {"error": "Card not found"}

# DGI API - Sin ventas
HTTP 200: {"date":"2025-11-20","totalOrders":0,"totalRevenue":0.0,"tickets":[]}

# BPS API - Sin empleados filtrados
HTTP 200: {"asOfDate":"2025-11-20","totalEmployees":0,"activeEmployees":0,"employeeDetails":[],"statistics":{...}}
```

#### Caso 2: Sistema Con Datos de Prueba
Después de crear datos de prueba, deberías ver respuestas completas como las documentadas en cada sección.

### Verificación de Autenticación

#### Test con API Key Válida
```bash
curl -X GET "http://localhost:8080/api/v1/external/bps/employee-count" \
  -H "X-API-Key: payment_prod_2025_38ed3e40-5bcd-4a"
```
**Esperado:** HTTP 200 con datos

#### Test con API Key Inválida
```bash
curl -X GET "http://localhost:8080/api/v1/external/bps/employee-count" \
  -H "X-API-Key: invalid_key_123"
```
**Esperado:** HTTP 401 `{"error": "Invalid API Key"}`

#### Test sin API Key
```bash
curl -X GET "http://localhost:8080/api/v1/external/bps/employee-count"
```
**Esperado:** HTTP 401 `{"error": "API Key is required"}`

### Logs de Auditoría

Todos los accesos se registran en la tabla `api_access_logs`. Consulta:
```sql
SELECT * FROM api_access_logs
ORDER BY accessed_at DESC
LIMIT 10;
```

Esto te permitirá ver:
- Qué sistema accedió (PAYMENT_SYSTEM, DGI, BPS)
- Cuándo accedió
- Qué endpoint consultó
- Qué código HTTP se retornó
- Desde qué IP se realizó la consulta

---

## Changelog

### v1.0.0 (2025-11-20)
- Implementación inicial de las 3 APIs externas
- Autenticación con API Key
- Sistema de auditoría de accesos
- Documentación completa

---

**Última actualización:** 2025-11-20
**Versión de la API:** 1.0.0
**Base URL:** http://localhost:8080/api/v1/external/
