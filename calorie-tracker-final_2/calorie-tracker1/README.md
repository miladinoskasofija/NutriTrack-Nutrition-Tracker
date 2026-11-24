# Calorie Tracker - Целосна апликација

Веб апликација за следење калориски внес со AI-базиран асистент за нутритивни совети.

- **Backend**: Spring Boot (Java) + H2 база + JWT автентикација + USDA FoodData Central API + Claude API
- **Frontend**: React (Vite) + Tailwind CSS

## Чекор 1: Земи ги API клучевите

1. **USDA FoodData Central**: https://fdc.nal.usda.gov/api-key-signup (бесплатно, инстант на email)
2. **Claude API**: https://console.anthropic.com → Settings → API Keys (потребен billing/кредит)

## Чекор 2: Конфигурирај го backend-от

Отвори `calorie-tracker-backend/src/main/resources/application.properties` и замени:

```properties
usda.api.key=ТВОЈОТ_РЕАЛЕН_USDA_KEY
claude.api.key=ТВОЈОТ_РЕАЛЕН_CLAUDE_KEY
```

## Чекор 3: Стартувај го backend-от (IntelliJ)

1. Отвори ја папката `calorie-tracker-backend` во IntelliJ
2. Чекај Maven да ги превземе dependencies
3. Стартувај `CalorieTrackerBackendApplication.java` (зелена play копче)
4. Провери на http://localhost:8080/api/health

## Чекор 4: Стартувај го frontend-от (VS Code / терминал)

```
cd calorie-tracker-frontend
npm install
npm run dev
```

Отвори http://localhost:5173

## Чекор 5: Тестирај го целиот флоу

1. Оди на http://localhost:5173/register и направи профил
2. Автоматски ќе бидеш најавен и однесен на Dashboard
3. Кликни "+" за да додадеш храна (пребарува преку USDA)
4. Кликни "Прашај го AI асистентот" за AI совети (преку Claude)
5. Провери Историја и Профил

## Архитектура - endpoints

| Метод | Патека | Опис |
|---|---|---|
| POST | /api/auth/register | Регистрација, враќа JWT |
| POST | /api/auth/login | Логирање, враќа JWT |
| GET | /api/users/me | Профил на најавен корисник |
| PUT | /api/users/me | Ажурирање нутритивни цели |
| GET | /api/foods/search?query= | Пребарување намирници (USDA) |
| POST | /api/food-entries | Внес на оброк |
| GET | /api/food-entries | Сите оброци (историја) |
| GET | /api/food-entries/today | Денешни оброци |
| POST | /api/chat | Прашање до AI асистентот (Claude) |

Сите endpoints освен `/api/auth/**` и `/api/health` бараат `Authorization: Bearer <token>` header - фронтендот тоа веќе автоматски го прави преку `src/api/client.js`.

## Познати ограничувања / следни чекори

- H2 е фајлова база (`calorie-tracker-backend/data/`) - добро за развој, за продукција би требало PostgreSQL/MySQL
- Нема email верификација или reset на лозинка
- AI асистентот нема тркалезна (streaming) конверзација - секој одговор чека целосен Claude одговор
