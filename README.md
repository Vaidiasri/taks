Team Pulse – Ask, Answer & Insight Mini App

Overview
- Backend: Node.js (Express) with JWT auth and MongoDB Atlas (Mongoose). Insight endpoints for managers.
- Frontend: React (Vite) with routes for Login, Questions, Question Detail (answers), and Manager Dashboard.

Run locally (Windows-friendly)
1) Backend (Node.js + MongoDB Atlas)
   - Create a MongoDB Atlas cluster and get a connection string.
   - Create a `.env` file in the `api/` directory with:
     ```
     MONGODB_URI=your_mongodb_connection_string_here
     JWT_SECRET=your_jwt_secret_key_here
     ```
   - Open a terminal in `api/`
   - Install deps: `npm install`
   - Start dev: `npm run dev` (or `npm start`)
   - API runs by default at http://localhost:5000

2) Frontend
   - Open another terminal in `client/`
   - Install deps: `npm install`
   - Start dev: `npm run dev`
   - App runs at http://localhost:5173 (API at http://localhost:5000)

Usage
- Register or login from the Login page. Check "Register as Manager" to create a manager account.
- Ask Questions on the home page, view details, and post answers.
- Managers can open the Dashboard to see totals and top contributors.

Notes
- Ensure your Atlas IP access list allows your IP (or 0.0.0.0/0 for testing).
- JWT secret is a placeholder. Set a strong `JWT_SECRET` in `api/.env`.


