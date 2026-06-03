# ✈️ JourneyNest | Premium Travel Booking Platform

A stunning, state-of-the-art interactive travel platform built with premium **2025 aesthetics**, dynamic transitions, and a secure full-stack Node.js backend.

---

## ✨ Features

### 📅 1. 3D Calendar Page-Flip Navigation
*   An elegant, high-fidelity **3D page-flip effect** on the top navigation bar items (**Home, Destinations, Experiences, Contact, About**).
*   When clicked, the link text curls upwards and lifts forward like a sheet of paper being turned on a calendar, complete with realistic 3D perspective and shifting shadows.

### 🎥 2. Dynamic Video Backgrounds
*   The **Login** and **Signup** pages feature fully integrated, immersive 4K YouTube video backgrounds showcasing breathtaking global landmarks and the **7 Wonders of the World**.
*   Videos are meticulously timed (skipping introductions) and styled with semi-transparent overlays for optimal form readability.

### 🔐 3. Full-Stack User Authentication
*   Fully functional, secure **User Registration & Login** system powered by a custom **Node.js/Express.js** REST API.
*   User credentials are securely encrypted and hashed using **Bcrypt** before being stored safely in **MongoDB**.

### 🎨 4. Curated Color Palette & Interactive Themes
*   Built on a harmonious, sophisticated theme consisting of **Mocha** (`#A1785F`), **Ethereal Blue** (`#A9C4EB`), and **Warm Greys** (`#F2F0EA`).
*   Features a responsive **Light & Dark Mode** switching system (using `localStorage` state retention) adjusting layout variables, backgrounds, borders, and typography colors smoothly.

---

## 📂 File Architecture

*   **`server.js`**: Core Express.js Node server handling API routes (`/signup`, `/login`), MongoDB connection, and static file routing.
*   **`models/User.js`**: Mongoose Schema defining the secure data structure for storing user accounts.
*   **`index.html`**: The stunning public landing page supporting fluid responsiveness and grid-based galleries.
*   **`login.html` & `signup.html`**: Authentication portals equipped with looping cinematic video backgrounds.
*   **`home.html`**: The secure internal dashboard/portal users are redirected to upon successful login.
*   **`style.css` & `home.css`**: Pure vanilla CSS containing core color systems, typography tokens, media queries, and premium custom 3D keyframe animations.
*   **`script.js` & `home.js`**: Vanilla JavaScript handling frontend logic, API `fetch()` requests, page scroll states, and custom intersection observers.

---

## 🛠️ Technologies Used

### Frontend
*   **Structure**: HTML5 (Semantic elements)
*   **Styling**: CSS3 (Vanilla custom variables, 3D CSS Transforms, Keyframe Animations)
*   **Behavior**: Vanilla JavaScript (ES6+), Fetch API
*   **Icons & Fonts**: Google Fonts (Montserrat & Roboto), FontAwesome 6

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB & Mongoose
*   **Security**: bcrypt (Password Hashing), cors
*   **Environment**: dotenv

---

## 🚀 How to Run Locally

1. Clone the repository to your local machine.
2. Install the necessary backend dependencies:
   ```bash
   npm install
   ```
3. Ensure your `.env` file is configured with your `MONGO_URI`.
4. Start the Node development server:
   ```bash
   node server.js
   ```
5. Navigate to `http://localhost:5000` in your web browser!
