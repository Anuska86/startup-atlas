🌍 Startup Atlas

An interactive full-stack dashboard and mapping tool designed to visualize the global startup ecosystem. Built with React, Leaflet, and Express

🚀 Live Demo (https://startup-atlas-sepia.vercel.app/)

- ✨ Key Features:

- 🗺️ Interactive Global Map: Visualizes startups worldwide using Leaflet with custom tiles for Dark/Light modes.

- 📍 Smart Marker Clustering: Groups high-density startup hubs (like Silicon Valley or London) to maintain map performance and clarity.

- 🌓 Adaptive Theme Engine: Seamlessly switch between Dark and Light UI modes with persistent state.

- 🔍 Intelligence & Filtering: Search by name or filter by industry (FinTech, AI, E-commerce) and investment stage.

- ⚡ Full-Stack Architecture: Powered by a Node/Express backend with a robust frontend fallback system.

📸 Visual Tour:

🌓 Theme Support

The Startup Atlas features a fully responsive design with integrated Dark and Light mode support to ensure readability in any environment.

| Dark Mode (Dashboard)            | Light Mode (Dashboard)            |
| -------------------------------- | --------------------------------- |
| ![Home Dark](./public/HomeD.png) | ![Home Light](./public/HomeL.png) |

🗺️ Interactive Exploration

The mapping system uses Leaflet and Marker Clustering to visualize the global startup ecosystem.

- **Global Overview:** View startups distributed across continents.
- **Precision Zoom:** Deep dive into specific tech hubs with custom industry icons.

| Map View (Light)                | Detailed Hub Zoom                  |
| ------------------------------- | ---------------------------------- |
| ![Map Light](./public/MapL.png) | ![Map Zoom](./public/MapZoomL.png) |

🔍 Intelligence & Data:

The platform provides a streamlined list view for quick filtering and a comprehensive details page for deep-dives into startup leadership and mission.

| List Analytics                   | Startup Intelligence                      |
| -------------------------------- | ----------------------------------------- |
| ![List View](./public/ListL.png) | ![Startup Details](./public/DetailsD.png) |

🛠️ Tech Stack:

- Frontend: React.js, React Leaflet (Maps), React Router
- Backend: Node.js / Express (deployed separately)
- Database: Supabase (PostgreSQL)
- Icons: React Icons (Bi-prefix)
- Styling: Custom CSS3 with Dark/Light mode support

🚧 Work in Progress:

I am currently transitioning the data architecture from a static local environment to a live Supabase backend.

- [x] Initial UI/UX and Map Logic
- [x] Database Schema Design
- [ ] Final Database Synchronization (Current Focus)
- [ ] Real-time data updates

🛠️ Setup:

1. Clone the repo:
   `git clone [https://github.com/Anuska86/startup-atlas]`

2. Server Setup:
   npm install
   npm start

3. Client Setup:
   cd client
   npm install
   npm run dev

   📄 License:

   Distributed under the MIT License. See LICENSE for more information.

Developed by Ana Sappia Rey:

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ana-sappia-rey/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Anuska86)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://startup-atlas-sepia.vercel.app/)
