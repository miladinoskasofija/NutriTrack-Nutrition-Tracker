# Calorie Tracker - Frontend

React (Vite) frontend за апликацијата за следење калории со AI асистент.

## Како да го отвориш и стартуваш (VS Code)

1. Отпакувај го ZIP фајлот
2. Отвори ја папката `calorie-tracker-frontend` во **VS Code** (File → Open Folder)
3. Отвори терминал во VS Code (Terminal → New Terminal)
4. Инсталирај ги dependencies:
   ```
   npm install
   ```
   (ова ќе трае 1-2 минути првиот пат - презема React, Vite, Tailwind итн.)

5. Стартувај го dev серверот:
   ```
   npm run dev
   ```

6. Отвори во browser: **http://localhost:5173**

## Важно - backend мора да работи паралелно

Оваа frontend апликација повикува Spring Boot backend на `http://localhost:8080`. Пред да ја тестираш логин формата:

1. Стартувај го backend проектот во IntelliJ (како претходно)
2. Потоа стартувај го frontend (`npm run dev`) во посебен терминал/VS Code прозорец

И двата треба да работат **истовремено**, во посебни процеси.

## Структура

```
src/
├── pages/          # Цели страни (LoginPage.jsx, следно: Dashboard, Register...)
├── components/      # Повторно употребливи делови (сè уште празно)
├── api/              # Axios конфигурација и API повици (сè уште празно)
├── context/          # React Context за auth state (сè уште празно)
├── App.jsx            # Рутирање
├── main.jsx            # Entry point
└── index.css            # Tailwind + глобални стилови
```

## Дизајн концепт

Мобилен-стил дизајн - централна картичка со заоблени рабови, hero банер горе (заоблена крива долу), underline полиња наместо кутии, pill-shaped копче.

- **Бои**: бела картичка, светла gradient позадина за hero делот, зелена (emerald) accent боја
- **Фонт**: Inter

### Додавање сопствена фотографија на hero делот

Моментално hero делот користи decorative gradient (за да работи веднаш без надворешни зависности). За да додадеш вистинска фотографија:

1. Стави ја сликата во папката `public/` (на пр. `public/hero-food.jpg`)
2. Во `src/pages/LoginPage.jsx`, најди го `style={{ background: 'radial-gradient(...' }}` и замени со:
   ```js
   style={{
     backgroundImage: "url('/hero-food.jpg')",
     backgroundSize: 'cover',
     backgroundPosition: 'center',
     borderBottomLeftRadius: '55% 30%',
     borderBottomRightRadius: '55% 30%',
   }}
   ```

## Што е готово

- ✅ Проект структура (Vite + React + Tailwind + React Router)
- ✅ Login страна (дизајн + форма + повик кон backend `/api/auth/login`)

## Следни чекори

1. Register страна
2. Dashboard (главна страна по логин)
3. Log Food страна (пребарување намирници + внес)
4. AI Chat страна
5. Profile/Goals страна
