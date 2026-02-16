# Smart Wardrobe

## Overview

**Smart Wardrobe** is a full-stack web application that helps users manage their wardrobe, create outfit combinations, and plan packing for trips based on weather forecasts. It provides a digital closet experience with features like categorizing clothing items, building outfits from existing pieces, and receiving packing recommendations based on destination weather data.

The application serves both guests (landing page) and authenticated users who can access the full functionality. Admin users have additional capabilities to manage news content.

---

## Features

### Guest Features
- **Landing Page** – Modern SaaS-style hero with background image, glassmorphism cards, and call-to-action buttons
- **News** – Browse published news articles (public access)
- **Authentication** – Register and login with username/password

### Authenticated User Features
- **Home Dashboard** – Welcome screen with quick links to Wardrobe, Outfits, and Trips
- **Wardrobe** – Add, edit, delete, and browse clothing items by category (Tops, Bottoms, Dresses, Outerwear, Shoes, Accessories, Other)
- **Clothing Attributes** – Name, category, color, season, style, size, material, warmth level, image upload
- **Outfits** – Create and manage outfit combinations by selecting items from the wardrobe
- **Trips** – Plan trips with destination, dates, and preferences
- **Trip Packing** – Weather-based packing recommendations using Open-Meteo API (temperature, rain, suggested clothing from wardrobe)
- **Weather Check** – Query current weather and forecasts for any destination before or during trip planning
- **Statistics** – Charts for clothes by category, most worn items, color distribution, and seasonal usage (Recharts)

### Admin Features
- **News Management** – CRUD operations for news articles (create, edit, delete, publish/unpublish)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, React Router v6, Tailwind CSS |
| **Backend** | Node.js, Express |
| **Database** | SQLite3 |
| **Auth** | JWT (jsonwebtoken), bcryptjs, js-cookie |
| **File Upload** | Multer |
| **Charts** | Recharts |
| **External API** | Open-Meteo (geocoding, weather forecast, current weather) |

---

## Architecture

```
┌─────────────────┐         HTTP/REST          ┌─────────────────┐
│                 │  ◄──────────────────────►  │                 │
│  React Client   │   JSON + JWT in headers    │  Express Server │
│  (port 3000)    │                            │  (port 3001)    │
│                 │                            │                 │
└────────┬────────┘                            └────────┬────────┘
         │                                              │
         │                                              │
         ▼                                              ▼
  js-cookie (token)                            SQLite (wardrobe.db)
  Local state (auth)                           Open-Meteo API
```

- **Client**: Single-page application with React Router. Auth state is stored via `js-cookie` and verified on load against `/api/auth/verify-token`.
- **Server**: REST API with Express. Protected routes use `authenticateToken` middleware; admin routes use `requireAdmin`.
- **Database**: SQLite file (`wardrobe.db`) with tables for users, clothes, outfits, outfit_items, trips, news, and wears (usage tracking).

---

## Project Structure

```
NTIP-main/
├── client/                     # React frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── pozadina.jpg        # Landing background image
│   │   └── ...                 # Category placeholder images
│   ├── src/
│   │   ├── api.js              # Centralized fetch helper (token, base URL)
│   │   ├── App.js              # Root layout, auth state, Header/Footer
│   │   ├── index.js
│   │   ├── styles.css          # Tailwind imports, base styles, btn-primary, etc.
│   │   ├── components/
│   │   │   ├── body/Body.js    # Layout wrapper for main content
│   │   │   ├── footer/Footer.js
│   │   │   └── header/Header.js
│   │   ├── pages/
│   │   │   ├── landing/Landing.js       # Guest home
│   │   │   ├── home/LoggedInHome.js     # Logged-in home
│   │   │   ├── login/Login.js
│   │   │   ├── register/Register.js
│   │   │   ├── news/NewsDashboard.js, NewsDetail.js
│   │   │   ├── wardrobe/WardrobeMain.js, WardrobeCategory.js
│   │   │   ├── clothes/AddCloth.js, EditCloth.js, ClothCard.js
│   │   │   ├── outfits/Outfits.js, AddOutfit.js, EditOutfit.js
│   │   │   ├── trips/Trips.js, AddTrip.js, EditTrip.js, TripPacking.js
│   │   │   ├── stats/Stats.js
│   │   │   └── admin/AdminNews.js, AddNews.js, EditNews.js
│   │   ├── routes/routesList.js
│   │   └── utils/               # dateFormat, wardrobeSearch, weatherIcons
│   ├── tailwind.config.js
│   └── package.json
│
├── server/
│   ├── server.js               # Entry point, listens on 3001
│   ├── app.js                  # Express app, CORS, routes, static uploads
│   ├── config.js               # SECRET_KEY (create from config.example.js)
│   ├── config.example.js
│   ├── wardrobe.db             # SQLite database (created on init)
│   ├── uploads/                # Uploaded clothing images
│   ├── controllers/            # auth, clothes, news, outfits, stats, trips
│   ├── middlewares/
│   │   ├── authMiddleware.js   # JWT verification
│   │   └── roleMiddleware.js   # requireAdmin, optionalAuth
│   ├── models/                 # user, clothes, outfits, trips, news, wears
│   ├── routes/                 # auth, clothes, outfits, trips, news, adminNews, stats, users
│   ├── services/
│   │   └── weatherService.js   # Open-Meteo integration
│   ├── db/
│   │   ├── database.js         # SQLite connection
│   │   ├── seed.js             # Seed admin + sample news
│   │   └── schemes/            # Schema definitions
│   └── scripts/
│       └── initDb.js           # Create tables
│
└── README.md
```

---

## Installation Guide

### Prerequisites
- Node.js (v16+)
- npm

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd NTIP-main

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure the backend

```bash
cd server
cp config.example.js config.js
# Edit config.js and set a secure SECRET_KEY for JWT
```

### 3. Initialize the database

```bash
cd server
node scripts/initDb.js
node db/seed.js
```

This creates all tables and seeds an admin user (`admin` / `admin123`) plus sample news.

### 4. Run the application

**Terminal 1 – Backend:**
```bash
cd server
npm start
```
Server runs on `http://localhost:3001`.

**Terminal 2 – Frontend:**
```bash
cd client
npm start
```
Client runs on `http://localhost:3000`.

### 5. Optional: Add background image

Place `pozadina.jpg` in `client/public/` for the landing page background. If missing, the layout still works but the background will not display.

---

## Database

### Type
SQLite3 (file: `server/wardrobe.db`)

### Tables

| Table | Purpose |
|-------|---------|
| `users` | id, username (UNIQUE), password (bcrypt hash), role (USER/ADMIN) |
| `clothes` | Clothing items: name, category, color, season, style, size, material, warmthLevel, imagePath, ownerId |
| `outfits` | Outfit definitions: name, occasion, season, ownerId |
| `outfit_items` | Junction table: outfitId, clothingId (many-to-many) |
| `trips` | Trips: destination, dateFrom, dateTo, preferences, ownerId |
| `news` | News articles: title, content, imagePath, tags, publishedAt, isPublished |
| `wears` | Usage tracking: clothingId, wornAt, ownerId (for stats) |

### Initialization
- Run `node scripts/initDb.js` to create tables
- Run `node db/seed.js` to add admin user and sample news

---

## API Overview

### Auth (`/api/auth`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login, returns JWT |
| POST | `/verify-token` | Yes | Verify JWT, return user info |

### News (`/api/news`) – Public
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | No | Get published news |
| GET | `/:id` | No | Get single news by ID |

### Clothes (`/api/clothes`) – Protected
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Get all clothes for user |
| GET | `/:id` | Get single cloth |
| POST | `/` | Create cloth (multipart/form-data for image) |
| PUT | `/:id` | Update cloth |
| DELETE | `/:id` | Delete cloth |

### Outfits (`/api/outfits`) – Protected
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Get all outfits |
| GET | `/:id` | Get outfit with items |
| POST | `/` | Create outfit |
| PUT | `/:id` | Update outfit |
| DELETE | `/:id` | Delete outfit |

### Trips (`/api/trips`) – Protected
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Get all trips |
| GET | `/:id` | Get trip by ID |
| GET | `/:id/packing` | Get packing recommendation (weather + suggested clothes) |
| GET | `/weather` | Get forecast (query: destination, dateFrom, dateTo) |
| GET | `/weather/current` | Get current weather (query: destination) |
| POST | `/` | Create trip |
| PUT | `/:id` | Update trip |
| DELETE | `/:id` | Delete trip |

### Stats (`/api/stats`) – Protected
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | All stats combined |
| GET | `/by-category` | Clothes count by category |
| GET | `/most-worn` | Most used items in outfits |
| GET | `/color-distribution` | Color distribution |
| GET | `/seasonal-usage` | Seasonal usage |

### Admin News (`/api/admin/news`) – Admin only
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | All news (incl. unpublished) |
| GET | `/:id` | Get news |
| POST | `/` | Create news |
| PUT | `/:id` | Update news |
| DELETE | `/:id` | Delete news |

### Users (`/api/users`) – Admin only
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | List all users |

---

## Authentication

### Flow
1. User registers or logs in via `/api/auth/register` or `/api/auth/login`.
2. Server returns a JWT (stored in `data.user.token`).
3. Client saves the token in a cookie (`authData`) via js-cookie.
4. On app load, client calls `POST /api/auth/verify-token` with `Authorization: <token>`.
5. If valid, auth state is set; otherwise user is redirected to login.

### Middleware
- **authenticateToken**: Verifies JWT from `Authorization` header; 401/403 on failure.
- **requireAdmin**: Ensures `req.user.role === 'ADMIN'`; used for admin news and users.

### Protected Routes
- Clothes, Outfits, Trips, Stats require a valid JWT.
- Admin News and Users require JWT + ADMIN role.

---

## External Services

### Open-Meteo API
- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search` – Resolve destination to coordinates.
- **Forecast**: `https://api.open-meteo.com/v1/forecast` – Daily min/max temperature, weather codes.
- **Current Weather**: Same forecast API with `current` and `hourly` parameters.

Used for:
- Trips weather check (before adding or on Trips page)
- Trip packing recommendations (weather + wardrobe items filtered by warmth/season)

No API key required (public Open-Meteo).

---

## How the System Works

### Data Flow Example: Adding a Trip and Getting Packing Recommendations

1. **User creates trip**  
   Frontend: `POST /api/trips` with `{ destination, dateFrom, dateTo, preferences }` and JWT.  
   Backend: `tripsController.create` → `Trips.create` → insert into DB.

2. **User opens packing view**  
   Frontend: `GET /api/trips/:id/packing` with JWT.  
   Backend: `tripsController.getPackingRecommendation`:
   - Fetches trip from DB
   - Calls `weatherService.geocode(destination)` → Open-Meteo
   - Calls `weatherService.getForecast(lat, lon, dateFrom, dateTo)` → Open-Meteo
   - Computes warmth range from temps
   - `Clothes.getByOwnerForPacking(ownerId, season, warmthMin, warmthMax)` → DB
   - Filters and limits items by category
   - Returns `{ trip, weather, packingTips, recommendedClothes }`

3. **Frontend**  
   Renders trip details, weather card, packing tips, and recommended clothes from the user’s wardrobe.

### Auth Flow

1. Login → Server validates credentials, returns JWT.
2. Client stores JWT in cookie.
3. Every API call (via `api.js`) includes `Authorization: <token>`.
4. Protected routes use `authenticateToken` to attach `req.user`.

---

## Tutorial Section

### Adding a New Feature

1. **Backend**: Add model method in `server/models/`, controller in `server/controllers/`, route in `server/routes/`.
2. **Frontend**: Add page in `client/src/pages/`, route in `client/src/routes/routesList.js`.
3. Use `api.js` for authenticated requests: `import { api } from '../api';` then `api('/your-path', { method: 'POST', body: data })`.

### Adding a New Route

**Backend:**
```javascript
// server/routes/yourRoute.js
const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();
router.use(authenticateToken);
router.get('/', (req, res) => { /* ... */ });
module.exports = router;
```
```javascript
// server/app.js
const yourRoutes = require('./routes/yourRoute');
app.use('/api/your-resource', yourRoutes);
```

**Frontend:**
```javascript
// client/src/routes/routesList.js
<Route path="your-path" element={<YourComponent />} />
```

### Extending the System

- **New clothing fields**: Add columns in `initDb.js`, update model/controller, update AddCloth/EditCloth forms.
- **New stats**: Add controller method in `statsController.js`, new route, new chart in `Stats.js`.
- **New external API**: Add service in `server/services/`, call from controller.

---

## Future Improvements

- Password reset / email verification
- Social login (Google, Facebook)
- Outfit suggestions based on occasion/weather
- Calendar view for outfit planning
- Mobile app (React Native) or PWA
- Dark/light theme toggle
- Export/import wardrobe data
- Image recognition for automatic clothing categorization

---

## Author

Student project – NTIP (Napredne tehnike izrade programske potpore / Advanced Software Engineering Techniques).

Suitable for university coursework and GitHub portfolio.
