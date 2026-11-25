# Mini Online Test

Mini Online Test is a web application built using the MERN stack. It allows users to take online tests, submit answers, and view their results. Admins can manage tests and questions.

## Features

- User registration and login
- JWT-based authentication
- Admin and user roles
- Create and manage online tests
- Multiple-choice questions
- Submit tests and view scores
- Responsive user interface
- Protected routes

## Tech Stack

**Frontend:** React.js, Tailwind CSS, Axios

**Backend:** Node.js, Express.js

**Database:** MongoDB Atlas

**Authentication:** JWT, bcrypt

**Deployment:** Vercel and Render

## Live Demo

- Frontend: https://mini-online-test-six.vercel.app
- Backend: https://mini-online-test-backend.onrender.com

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Prashant-Gupta2/mini_online_test.git
cd mini_online_test
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server.

```bash
npm start
```

### 3. Frontend setup

Open another terminal.

```bash
cd frontend
npm install
npm run dev
```

## How It Works

1. Users register and log in to the application.
2. Admin creates tests and adds questions.
3. Users select a test and answer the questions.
4. After submission, the application calculates and displays the score.

## Future Improvements

- Test timer
- Leaderboard
- Detailed performance reports
- Random question selection
- Email notifications

## Author

**Prashant Kumar**

GitHub: https://github.com/Prashant-Gupta2
