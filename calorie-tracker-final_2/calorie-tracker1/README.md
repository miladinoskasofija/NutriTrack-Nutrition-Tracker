# NutriTrack – Full-Stack Calorie Tracking Application

A full-stack web application for tracking daily calorie intake, featuring an AI-powered assistant that provides personalized nutrition advice.

- **Backend:** Spring Boot (Java) + H2 Database + JWT Authentication + USDA FoodData Central API + Claude API
- **Frontend:** React (Vite) + Tailwind CSS

## Step 1: Obtain API Keys

1. **USDA FoodData Central:** https://fdc.nal.usda.gov/api-key-signup (Free API key delivered via email)
2. **Claude API:** https://console.anthropic.com → Settings → API Keys (Billing or API credits required)

## Step 2: Configure the Backend

Open `calorie-tracker-backend/src/main/resources/application.properties` and replace the placeholder values with your actual API keys:

```properties
usda.api.key=YOUR_ACTUAL_USDA_KEY
claude.api.key=YOUR_ACTUAL_CLAUDE_KEY
```

**Security Note:** Never commit real API keys to GitHub. Use environment variables or a local configuration file excluded from version control.

## Step 3: Run the Backend (IntelliJ IDEA)

1. Open the `calorie-tracker-backend` folder in IntelliJ IDEA.
2. Wait for Maven to download and resolve the project dependencies.
3. Run `CalorieTrackerBackendApplication.java` using the green Run button.
4. Verify that the backend is running by visiting:

   http://localhost:8080/api/health

## Step 4: Run the Frontend (VS Code / Terminal)

Open a terminal and execute:

```bash
cd calorie-tracker-frontend
npm install
npm run dev
```

Open the application in your browser:

http://localhost:5173

## Step 5: Test the Complete Application Flow

1. Navigate to http://localhost:5173/register and create a new account.
2. After registration, you will be automatically logged in and redirected to the Dashboard.
3. Click the **"+"** button to add food items using the USDA FoodData Central search.
4. Click **"Ask AI Assistant"** to receive AI-powered nutrition advice through Claude.
5. Explore the **History** and **Profile** sections to review meals and manage your nutritional goals.

## API Architecture & Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user and return a JWT |
| POST | `/api/auth/login` | Authenticate a user and return a JWT |
| GET | `/api/users/me` | Retrieve the authenticated user's profile |
| PUT | `/api/users/me` | Update nutritional goals |
| GET | `/api/foods/search?query=` | Search food items using the USDA API |
| POST | `/api/food-entries` | Add a new food entry |
| GET | `/api/food-entries` | Retrieve all food entries (history) |
| GET | `/api/food-entries/today` | Retrieve today's food entries |
| POST | `/api/chat` | Send a question to the AI nutrition assistant (Claude) |

### Authentication & Security

All API endpoints require JWT authentication, except:

- `/api/auth/**`
- `/api/health`

Protected requests must include the following HTTP header:

```http
Authorization: Bearer <token>
```

The frontend automatically attaches the JWT to authenticated requests through `src/api/client.js`.

## Known Limitations & Future Improvements

### Database

The application currently uses an **H2 file-based database**, stored in:

`calorie-tracker-backend/data/`

This is suitable for local development and testing. For production deployment, migrating to **PostgreSQL** or **MySQL** is recommended.

### Authentication

The application currently does not support:

- Email verification
- Password reset functionality

These features could be implemented to improve account security and user experience.

### AI Assistant

The AI-powered nutrition assistant uses the Claude API to generate responses.

Currently, responses are returned only after the complete API response has been generated.

A potential improvement would be to implement **streaming responses** for a more interactive, real-time chat experience.

---

## Technology Stack

| Category | Technologies |
|---|---|
| Backend | Java, Spring Boot |
| Frontend | React, Vite, Tailwind CSS |
| Database | H2 |
| Authentication | JWT |
| Nutrition Data | USDA FoodData Central API |
| AI Integration | Claude API |
| Build Tools | Maven, npm |
| Development Tools | IntelliJ IDEA, VS Code |

---

## Project Summary

**NutriTrack** demonstrates full-stack web development by combining a Java Spring Boot backend with a modern React frontend.

The application integrates secure JWT-based authentication, nutritional data retrieval through an external API, meal tracking, user profile management, and an AI-powered nutrition assistant.

The project showcases practical experience in **REST API development, frontend-backend integration, database management, authentication, and third-party API integration**.
