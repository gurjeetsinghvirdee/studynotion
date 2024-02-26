# Study Notion

Study Notion is a web application aimed at providing a comprehensive platform for online learning. 
It offers a range of features including course management, user authentication, payment integration, and more.

## Technologies Used

### Frontend

- **React**: JavaScript library for building user interfaces.
- **Redux Toolkit**: State management library for managing application state.
- **React Router DOM**: Library for routing in React applications.
- **Axios**: Promise-based HTTP client for making AJAX requests.
- **React Hook Form**: Library for managing forms in React.
- **React Redux**: Official React bindings for Redux.
- **React Hot Toast**: Toast notifications for React applications.
- **Tailwind CSS**: Utility-first CSS framework for styling.

### Backend

- **Express**: Web application framework for Node.js.
- **MongoDB**: NoSQL database used for storing application data.
- **Mongoose**: MongoDB object modeling for Node.js.
- **jsonwebtoken**: JSON Web Token implementation for generating and verifying tokens.
- **bcrypt**: Library for hashing passwords.
- **nodemailer**: Module for sending emails from Node.js.
- **cloudinary**: Cloud-based image and video management service.
- **cors**: Middleware for enabling Cross-Origin Resource Sharing in Express.js.
- **dotenv**: Module for loading environment variables from a .env file.

## Getting Started

To get started with the Study Notion project, follow these steps:
1. Fork the repository.
2. Clone the repository: `git clone https://github.com/<your-github-username>/studynotion`
3. Navigate to the project directory: `cd study-notion`
4. Install dependencies for both frontend and backend:
   ```bash
   cd frontend
   npm install
   cd backend
   npm install
   ```
5. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Define environment variables such as MongoDB connection URI, JWT secret, etc.
6. Start the backend server:
   ```bash
   npm start
   ```
7. Start the frontend development server:
   ```bash
   cd ../frontend
   npm start
   ```
