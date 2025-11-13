# Backend Integration Guide

## Описание

Этот документ описывает требования к backend API для интеграции с Kezekshi Dashboard.

## Базовый URL

```
Production: https://api.kezekshi.kz/api
Development: http://localhost:3000/api
```

## Аутентификация

Все запросы должны включать JWT токен в заголовке:
```
Authorization: Bearer <token>
```

## API Endpoints

### 1. User Profile
**GET** `/user/profile`

Получение профиля текущего пользователя.

**Response:**
```json
{
  "id": 1,
  "name": "Devid Milinear",
  "email": "admin@example.com",
  "role": "admin",
  "avatar": "/avatar.jpg"
}
```

---

### 2. Detect City
**GET** `/geo/detect-city`

Определение города пользователя по IP адресу.

**Response:**
```json
{
  "city": "Астана",
  "country": "Kazakhstan",
  "ip": "1.2.3.4"
}
```

---

### 3. Get Schools
**GET** `/schools?city={city}&ids={comma-separated-ids}`

Получение списка школ по городу.

**Query Parameters:**
- `city` (required): Название города
- `ids` (optional): Список ID школ через запятую

**Response:**
```json
[
  {
    "id": 1,
    "name": "Школа №15",
    "city": "Алматы",
    "address": "ул. Абая 123"
  }
]
```

---

### 4. Get Home Data
**GET** `/home`

Получение данных для главной страницы.

**Response:**
```json
{
  "stats": {
    "totalSchools": 45,
    "totalStudents": 12500,
    "totalStaff": 2300,
    "attendanceRate": 95.2
  },
  "recentActivity": [
    {
      "id": 1,
      "type": "attendance",
      "school": "Школа №15",
      "timestamp": "2025-11-13T10:30:00Z",
      "message": "Посещаемость обновлена"
    }
  ]
}
```

---

### 5. Get Analytics Data
**GET** `/analytics?city={city}&schoolIds={ids}&period={period}&startDate={ISO}&endDate={ISO}`

Получение аналитических данных.

**Query Parameters:**
- `city` (required): Город
- `schoolIds` (optional): ID школ через запятую
- `period` (optional): day | yesterday | week | month
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Response:**
```json
{
  "summary": {
    "total": 1234,
    "attended": 1045,
    "nutrition": 987,
    "nutrition14": 456,
    "nutrition511": 531,
    "savings": 124567
  },
  "period": "day",
  "dateRange": {
    "start": "2025-11-13T00:00:00Z",
    "end": "2025-11-13T23:59:59Z"
  }
}
```

---

### 6. Get Attendance Data
**GET** `/analytics/attendance?city={city}&schoolIds={ids}&period={period}&startDate={ISO}&endDate={ISO}`

Получение данных о посещаемости для графиков.

**Response:**
```json
{
  "pie": [
    {
      "value": 456,
      "name": "1-4 классы",
      "color": "#0075F6"
    },
    {
      "value": 350,
      "name": "5-11 классы",
      "color": "#84cc16"
    },
    {
      "value": 280,
      "name": "Персонал",
      "color": "#fb923c"
    }
  ],
  "bar": {
    "categories": ["1-4 классы", "5-11 классы", "Персонал"],
    "present": [69, 56, 63],
    "absent": [31, 44, 37]
  }
}
```

---

### 7. Get Nutrition Data
**GET** `/analytics/nutrition?city={city}&schoolIds={ids}&period={period}&startDate={ISO}&endDate={ISO}`

Получение данных о питании для графиков.

**Response:**
```json
{
  "pie": [
    {
      "value": 410,
      "name": "1-4 классы",
      "color": "#0075F6"
    },
    {
      "value": 320,
      "name": "5-11 классы",
      "color": "#84cc16"
    }
  ],
  "bar": {
    "categories": ["1-4 классы", "5-11 классы"],
    "received": [75, 62],
    "notReceived": [25, 38]
  }
}
```

---

### 8. Get Library Data
**GET** `/analytics/library?city={city}&schoolIds={ids}&period={period}&startDate={ISO}&endDate={ISO}`

Получение данных о посещении библиотеки.

**Response:**
```json
{
  "pie": [
    {
      "value": 320,
      "name": "1-4 классы",
      "color": "#0075F6"
    },
    {
      "value": 280,
      "name": "5-11 классы",
      "color": "#84cc16"
    },
    {
      "value": 150,
      "name": "Персонал",
      "color": "#fb923c"
    }
  ],
  "bar": {
    "categories": ["1-4 классы", "5-11 классы", "Персонал"],
    "visited": [65, 58, 52],
    "notVisited": [35, 42, 48]
  }
}
```

---

### 9. Get Reports Data
**GET** `/reports?city={city}&schoolIds={ids}&startDate={ISO}&endDate={ISO}&category={category}`

Получение данных для отчётов/статистики по школам.

**Query Parameters:**
- `city` (required): Город
- `schoolIds` (optional): ID школ через запятую
- `startDate` (optional): Начальная дата
- `endDate` (optional): Конечная дата
- `category` (optional): attendance | cafeteria | library

**Response:**
```json
[
  {
    "id": 1,
    "name": "Школа №15",
    "system": {
      "students14": 380,
      "students511": 550,
      "totalStudents": 930,
      "staff": 55
    },
    "attended": {
      "students14": 350,
      "students511": 510,
      "staff": 52,
      "percentage": 92.5
    },
    "nutrition14": {
      "received": 320,
      "notReceived": 30,
      "percentage": 91.4
    },
    "nutrition511": {
      "received": 480,
      "notReceived": 30,
      "percentage": 94.1
    }
  }
]
```

---

## Error Responses

Все ошибки возвращаются в следующем формате:

```json
{
  "error": true,
  "message": "Описание ошибки",
  "code": "ERROR_CODE",
  "status": 400
}
```

### HTTP Status Codes:
- `200` - Успешный запрос
- `400` - Неверные параметры
- `401` - Не авторизован
- `403` - Доступ запрещён
- `404` - Данные не найдены
- `500` - Ошибка сервера

---

## Rate Limiting

API должен поддерживать rate limiting:
- 100 запросов в минуту для авторизованных пользователей
- 20 запросов в минуту для неавторизованных

Headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699876543
```

---

## CORS

Backend должен разрешать CORS для:
- Production: `https://kezekshi.kz`
- Development: `http://localhost:5173`

---

## Security Requirements

1. **HTTPS только** - весь API должен работать через HTTPS
2. **JWT токены** - использовать короткие токены (15 мин) с refresh токенами
3. **SQL Injection защита** - использовать prepared statements
4. **Rate limiting** - защита от DDoS
5. **Input validation** - валидация всех входных данных
6. **CORS правильно настроен**
7. **Helmet.js** или аналог для Express.js

---

## Рекомендуемый Tech Stack

### Backend:
- **Node.js** + Express.js / Fastify
- **PostgreSQL** / MySQL для БД
- **Redis** для кэширования и rate limiting
- **JWT** для аутентификации
- **Helmet** для security headers
- **express-validator** для валидации

### Deployment:
- Docker контейнеры
- Nginx reverse proxy
- PM2 для процесс-менеджмента
- SSL сертификаты (Let's Encrypt)

---

## Примеры интеграции

Frontend уже готов к интеграции. Все запросы идут через `src/api.js`.

### Как использовать:

```javascript
import { api } from './api.js';

// Получить школы
const schools = await api.getSchools('Астана', [1, 2, 3]);

// Получить аналитику
const analytics = await api.getAnalytics({
  city: 'Астана',
  schoolIds: [1, 2, 3],
  period: 'day'
});

// Все ошибки обрабатываются автоматически через error-handler.js
```

---

## Testing

Для тестирования можно использовать mock сервер:

```bash
npm install -D json-server
```

Создать `db.json` с тестовыми данными и запустить:
```bash
json-server --watch db.json --port 3000
```
