# API Externa - BurgUM & PizzUM

APIs REST públicas para integración con organismos externos.

## Base URL
```
http://localhost:8080/api/v1/external
```

---

## 1. API Payment System

Permite verificar la propiedad de una tarjeta de crédito.

**Endpoint:** `GET /payment/card-owner?cardNumber=NUMERO`

**URL en navegador:**
```
http://localhost:8080/api/v1/external/payment/card-owner?cardNumber=1234567890123456
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

**Response 404 Not Found:**
```json
{
  "error": "Card not found"
}
```

---

## 2. API DGI (Dirección General Impositiva)

Devuelve todos los tickets de venta para una fecha dada.

**Endpoint:** `GET /dgi/sales-tickets?date=YYYY-MM-DD`

**Response 200 OK:**
```json
{
  "date": "2025-11-20",
  "totalOrders": 2,
  "totalRevenue": 500.00,
  "tickets": [
    {
      "orderId": 123,
      "orderHash": "uuid-string",
      "orderDate": "2025-11-20T14:30:00",
      "total": 250.00,
      "status": "DELIVERED",
      "client": {
        "document": "12345678",
        "fullName": "Juan Pérez"
      },
      "items": [
        {
          "type": "CREATION",
          "name": "Pizza Personalizada",
          "quantity": 1,
          "unitPrice": 200.00,
          "subtotal": 200.00
        },
        {
          "type": "PRODUCT",
          "name": "Coca Cola",
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

**Response sin ventas:**
```json
{
  "date": "2025-11-20",
  "totalOrders": 0,
  "totalRevenue": 0.0,
  "tickets": []
}
```

**Ejemplo curl:**
```bash
curl "http://localhost:8080/api/v1/external/dgi/sales-tickets?date=2025-11-20"
```

---

## 3. API BPS (Banco de Previsión Social)

Devuelve la cantidad de funcionarios y usuarios del sistema.

**Endpoint:** `GET /bps/employee-count`

**Response 200 OK:**
```json
{
  "totalFuncionarios": 2,
  "totalUsuarios": 150
}
```

**Ejemplo curl:**
```bash
curl http://localhost:8080/api/v1/external/bps/employee-count
```

---

## Notas

- **Todas las APIs son públicas** - No requieren autenticación
- **Payment API**: Solo retorna datos si la tarjeta existe en el sistema
- **DGI API**: Solo retorna pedidos con estado `DELIVERED` para la fecha indicada
- **BPS API**: `totalFuncionarios` = administradores, `totalUsuarios` = clientes

---

**Última actualización:** 2025-11-23
**Base URL:** http://localhost:8080/api/v1/external/
