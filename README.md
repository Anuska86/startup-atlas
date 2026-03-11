# 🌍 Startup Atlas

An interactive, geospatial exploration of the global startup ecosystem. This app allows users to visualize tech hubs, filter companies by industry and growth stage, and dive deep into startup data.

## 📸 Visual Tour

### 🌓 Theme Support

The Startup Atlas features a fully responsive design with integrated Dark and Light mode support to ensure readability in any environment.

| Dark Mode (Dashboard)            | Light Mode (Dashboard)            |
| -------------------------------- | --------------------------------- |
| ![Home Dark](./public/HomeD.png) | ![Home Light](./public/HomeL.png) |

### 🗺️ Interactive Exploration

Our mapping system uses Leaflet and Marker Clustering to visualize the global startup ecosystem.

- **Global Overview:** View startups distributed across continents.
- **Precision Zoom:** Deep dive into specific tech hubs with custom industry icons.

| Map View (Light)                | Detailed Hub Zoom                  |
| ------------------------------- | ---------------------------------- |
| ![Map Light](./public/MapL.png) | ![Map Zoom](./public/MapZoomL.png) |

### 🔍 Intelligence & Data

The platform provides a streamlined list view for quick filtering and a comprehensive details page for deep-dives into startup leadership and mission.

| List Analytics                   | Startup Intelligence                      |
| -------------------------------- | ----------------------------------------- |
| ![List View](./public/ListL.png) | ![Startup Details](./public/DetailsD.png) |

## 🚀 Live Demo

[Insert your Vercel URL here]

## 🛠️ Tech Stack:

- **Frontend:** React.js, React Leaflet (Maps), React Router
- **Backend:** Node.js / Express (deployed separately)
- **Database:** Supabase (PostgreSQL)
- **Icons:** React Icons (Bi-prefix)
- **Styling:** Custom CSS3 with Dark/Light mode support

## ✨ Current Features:

- **Dynamic Geospatial Mapping:** Real-time clustering and custom markers for 40+ startups.
- **Smart Filtering:** Filter by Industry, Continent, and Company Stage (Early Stage to Enterprise).
- **Hybrid Data Logic:** Implemented a robust fallback mechanism that fetches from a local `data.js` utility if the primary Supabase database connection is unavailable.
- **Interactive Popups:** Detailed views including founder information, employee count, and website links.
- **Theming:** Full support for system-preferred light and dark modes.

## 🚧 Work in Progress:

I am currently transitioning the data architecture from a static local environment to a live **Supabase** backend.

- [x] Initial UI/UX and Map Logic
- [x] Database Schema Design
- [ ] Final Database Synchronization (Current Focus)
- [ ] Real-time data updates

## 🛠️ Setup:

1. Clone the repo: `git clone [your-repo-link]`
2. Install dependencies: `npm install`
3. Start the app: `npm start`
