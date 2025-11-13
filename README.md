# Kezekshi Dashboard

Современная система управления школами с аналитикой и отчетностью.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## 🚀 Особенности

- **📊 Аналитика**: Интерактивные графики и визуализация данных с использованием ECharts
- **📝 Отчеты**: Подробные отчеты по школам с фильтрацией и экспортом
- **🔒 Безопасность**: Защита от XSS, валидация входных данных, CSP headers
- **⚡ Производительность**: Оптимизация с Vite, lazy loading, code splitting
- **🎨 Современный UI**: Tailwind CSS 4 + FlyonUI компоненты
- **📱 Адаптивность**: Полностью адаптивный дизайн для всех устройств

## 📋 Требования

- Node.js 18+ 
- npm 9+

## 🛠️ Установка

```bash
# Клонировать репозиторий
git clone https://github.com/pharrabeia1120-ai/Kezekshi-Dashboard.git

# Перейти в директорию
cd Kezekshi-Dashboard

# Установить зависимости
npm install

# Создать файл окружения
cp .env.example .env.development
```

## ⚙️ Конфигурация

Создайте `.env.development` файл на основе `.env.example`:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_GEOLOCATION=false
```

## 🚀 Запуск

```bash
# Development режим
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 📁 Структура проекта

```
├── src/
│   ├── main.js              # Точка входа
│   ├── config.js            # Конфигурация приложения
│   ├── security.js          # Модуль безопасности
│   ├── api.js               # API клиент
│   ├── logger.js            # Логирование
│   ├── error-handler.js     # Обработка ошибок
│   ├── navigation.js        # Навигация
│   ├── charts.js            # ECharts графики
│   ├── reports-data.js      # Данные отчетов
│   └── style.css            # Стили
└── public/                  # Статические файлы
    ├── pages/
    │   ├── home.html        # Главная страница
    │   ├── analytics.html   # Аналитика
    │   └── reports.html     # Отчеты
    └── components/
        ├── header.html      # Шапка
        └── sidebar.html     # Боковое меню
```

## 🔐 Безопасность

- ✅ XSS защита через sanitizeHTML
- ✅ Валидация всех входных данных
- ✅ CSP (Content Security Policy)
- ✅ Безопасная работа с localStorage
- ✅ Rate limiting для API запросов
- ✅ Удаление console.log в production

Подробнее: [SECURITY.md](./SECURITY.md)

## 🌐 API Интеграция

Проект готов к интеграции с backend API. Спецификация API: [BACKEND_API.md](./BACKEND_API.md)

## 📦 Production Deployment

Полное руководство: [README_PRODUCTION.md](./README_PRODUCTION.md)

Чеклист: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

## 🛠️ Технологии

- **Build Tool**: Vite 7.2.2
- **CSS Framework**: Tailwind CSS 4.1.17
- **UI Components**: FlyonUI 2.4.1
- **Charts**: ECharts 6.0.0
- **JavaScript**: ES Modules (vanilla JS)

## 📝 Скрипты

```bash
npm run dev          # Запуск dev сервера
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Просмотр production build
npm run clean        # Очистка кеша
```

## 🤝 Контрибьюция

1. Fork проекта
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](./LICENSE) для деталей.

## 👤 Автор

**Kezekshi Team**

## 🙏 Благодарности

- ECharts за отличную библиотеку визуализации
- Tailwind CSS за мощный CSS фреймворк
- Vite за быстрый build tool

---

Создано с ❤️ для образования Казахстана
