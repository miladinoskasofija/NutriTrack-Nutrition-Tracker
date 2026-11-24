# Calorie Tracker - Backend

Spring Boot backend for the calorie tracking web application with AI nutrition assistant.

## Како да го отвориш проектот

1. Отпакувај го ZIP фајлот
2. Отвори IntelliJ IDEA → **Open** → избери ја папката `calorie-tracker-backend`
3. IntelliJ автоматски ќе го препознае како Maven проект и ќе ги превземе dependencies (следи прогрес бар долу десно)
4. Откако ќе заврши, отвори `CalorieTrackerBackendApplication.java` и кликни на зелената play копче до `main` методот

## Проверка дека работи

Откако ќе се стартува (гледаш "Started CalorieTrackerBackendApplication" во конзолата):

- Отвори во browser: http://localhost:8080/api/health
- Треба да видиш: `Backend е активен и работи!`

## H2 база на податоци (веб конзола)

- Отвори: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:file:./data/calorietracker`
- Username: `sa`
- Password: (празно)
- Кликни **Connect** - ќе ги видиш табелите (USERS, FOOD_ENTRIES, CHAT_MESSAGES) откако проектот еднаш ќе се стартува

## Структура на проектот

```
src/main/java/mk/finki/calorietracker/
├── entity/          # JPA ентитети (User, FoodEntry, ChatMessage)
├── repository/       # Spring Data JPA repositories
├── controller/        # REST controllers
├── service/           # Бизнис логика (сè уште празно - следен чекор)
├── dto/               # Data Transfer Objects (сè уште празно)
├── config/            # Конфигурација (Security, CORS)
└── security/           # JWT логика (сè уште празно - следен чекор)
```

## API клучеви (ВАЖНО пред да работи AI/USDA интеграцијата)

Во `src/main/resources/application.properties` замени ги placeholder вредностите:

```properties
usda.api.key=ТВОЈОТ_РЕАЛЕН_USDA_KEY
claude.api.key=ТВОЈОТ_РЕАЛЕН_CLAUDE_KEY
```

- USDA клуч: https://fdc.nal.usda.gov/api-key-signup
- Claude клуч: https://console.anthropic.com

**Никогаш не ставај ги реалните клучеви во Git репозиториум** - подобро користи environment variables или одделен `application-local.properties` фајл кој е во `.gitignore`.

## Што е готово досега

- ✅ Проект структура + Maven dependencies
- ✅ H2 база конфигурирана
- ✅ Ентитети: User, FoodEntry, ChatMessage
- ✅ Repositories за секој ентитет
- ✅ Основна Security конфигурација (привремено отворена, JWT доаѓа следно)
- ✅ Health check endpoint

## Следни чекори

1. DTO класи + AuthController (register/login + JWT)
2. FoodController - пребарување намирници преку USDA API + логирање внес
3. ChatController - интеграција со Claude API
4. Frontend (React) поврзување
