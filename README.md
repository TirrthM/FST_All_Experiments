# Pragmatic Books Store Portal 📚

Welcome to the **Pragmatic Books Store Portal**! This is a modern, full-stack web application built as part of a series of practical experiments. It demonstrates how to build a responsive, secure, and data-driven web app using the latest web technologies.

---

## 🌟 What is this project?

This project is a mock portal for a bookstore. It contains several key features that you would find in a real-world application:
- **Dashboard:** A visually appealing dashboard that can display charts and statistics (using Recharts).
- **Book Catalog:** A page to view a list of books, demonstrating how to fetch and display data.
- **Secure Social Login:** A complete authentication system that allows users to sign in using their Google or GitHub accounts (Experiment 7).
- **Database Connection:** A reliable connection manager to store and retrieve data safely in a cloud database (Experiment 6).
- **Dark/Light Mode:** A beautiful UI that automatically adjusts to your screen's theme preference.

---

## 🛠️ Tech Stack & Libraries Used

This project is built using modern, industry-standard tools:

### Frontend (What you see)
- **[Next.js 16](https://nextjs.org/):** The core framework used to build the website. It handles both the frontend UI and the backend API routes.
- **[React 19](https://react.dev/):** The library used to build interactive user interface components.
- **[Tailwind CSS v4](https://tailwindcss.com/):** A utility-first CSS framework used to style the app beautifully without writing custom CSS files.
- **[Lucide React](https://lucide.dev/):** A beautiful and consistent icon library used for the navigation and UI icons.
- **[Recharts](https://recharts.org/):** A charting library built on React components used to display data visually on the dashboard.

### Backend & Database (How it works under the hood)
- **[MongoDB Atlas](https://www.mongodb.com/atlas/database):** A cloud-based NoSQL database used to store application data (like users, sessions, and books).
- **[Mongoose](https://mongoosejs.com/):** An elegant MongoDB object modeling tool for Node.js. It helps structure the data we send to MongoDB.
- **[Better Auth](https://better-auth.com/):** A powerful, modern authentication framework for Next.js. It securely handles the OAuth 2.0 flow (Google/GitHub login) and manages user sessions in the database.

---

## 🚀 How to Run the Project Locally

Follow these simple steps to run this project on your own computer:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### 2. Install Dependencies
Open your terminal, navigate to the project folder, and run:
```bash
npm install
```
*This downloads all the external libraries (like React, Tailwind, Better Auth) required to run the code.*

### 3. Setup Environment Variables
This project requires secrets (like database passwords and Google login keys) to function. 
1. Create a file named `.env` in the root folder of the project.
2. Copy the contents of `.env.example` into your new `.env` file.
3. Update the `MONGODB_URI` with your own MongoDB Atlas connection string.
*(Note: You can leave the Google/GitHub keys as placeholder text if you only want to test the UI redirect!)*

### 4. Start the Development Server
Run the following command to start the app:
```bash
npm run dev
```

### 5. View the App
Open your web browser and go to:
👉 **http://localhost:3000**

---

## 📂 Project Structure (Where things are)

Here is a quick map of the important folders in this project:

- `/app` - Contains all the pages (Home, Dashboard, Catalog, Login) and layout files.
  - `/app/api` - Contains the backend server routes (like the database catalog fetcher and authentication handlers).
  - `/app/components` - Reusable UI pieces (like the Navigation Header).
- `/lib` - Contains core utility files (like `mongoose.ts` for database connections and `auth.ts` for Better Auth configuration).

---

*Built with ❤️ for Full Stack Technology Practicals.*
