
# ⚛️ QuantumCloud - Advanced Quantum Computing & Collaboration Platform

**QuantumCloud** is a next-generation web platform designed to democratize access to quantum computing. It combines powerful simulation tools, real-time collaboration features, educational gamification, and enterprise-grade administration into a single, cohesive ecosystem.

![QuantumCloud Banner](https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=2000)

## 🚀 Key Features

### 🖥️ Dashboard & Analytics
-   **User Dashboard**: Central hub for managing quantum jobs, viewing recent activity, and accessing tools.
-   **Admin Command Center**: specialized portal for system oversight.
    -   **Deep Analytics**: Visual metrics for user engagement, job success rates, and system health.
    -   **Resource Management**: Monitor quantum backend availability (IBM Quantum integration).
    -   **User Management**: Role-based access control and user administration.
    -   **Content & News**: CMS for platform updates and educational content.
    -   **Audit Logs**: Comprehensive security and action logging.

### 🤝 TeamCollaboration Suite
A fully integrated collaborative environment for research teams:
-   **Real-Time Workspaces**: Create public or private workspaces for projects.
-   **Live Interaction**:
    -   **Research Chat**: Persistent chat channels with file sharing.
    -   **Voice Chat**: Integrated voice communication channels.
    -   **Whiteboard**: Interactive canvas for diagramming circuits and algorithms.
    -   **Screen Sharing**: Seamless presentation capabilities.
-   **AI Copilot**:
    -   **Smart Suggestions**: AI-driven tips for circuit optimization.
    -   **Code Review**: Automated analysis of quantum circuits and code.

### 🎮 Quantum Quest (Gamification)
An interactive educational platform to master quantum concepts:
-   **Structured Learning Paths**: Levels ranging from *Quantum Fundamentals* to *Advanced Research*.
-   **Interactive Challenges**: Hands-on puzzles for Gates, Algorithms (Grover, Shor), and Error Correction.
-   **Progression System**: Points, Streaks, and Dynamic User Rankings.
-   **Achievement System**: Unlockable badges (Common to Legendary rarities).
-   **Global Leaderboard**: Compete with other quantum researchers worldwide.

### ⚙️ Technology Stack

**Frontend**
-   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Charts**: [Recharts](https://recharts.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)

**Backend**
-   **Runtime**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
-   **Real-Time**: WebSockets (for collaboration features)

**Integrations**
-   **IBM Quantum**: Integration with Qiskit Runtime for real hardware execution.
-   **OpenAI**: Powering the AI Copilot and Smart Suggestions.

---

## 🛠️ Installation & Setup

### Prerequisites
-   Node.js (v18+)
-   MongoDB (Local or Atlas)
-   IBM Quantum API Token (Optional, for real hardware)
-   OpenAI API Key (Optional, for AI features)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/quantum-dashboard.git
cd quantum-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quantum-dashboard

# Security
JWT_SECRET=your_super_secret_jwt_key

# Integrations (Optional)
IBM_QUANTUM_API_TOKEN=your_ibm_token
OPENAI_API_KEY=your_openai_key
```

### 4. Run the Application
Start both the client and server concurrently:
```bash
npm run dev
```
The application will be available at `http://localhost:5000`.

---

## 🔐 Authentication & Roles

### User Portal
-   **Sign Up/Login**: Standard email/password authentication.
-   **Access**: Full access to Dashboard, Teamwork, and Quantum Quest.

### Admin Portal
-   **Exclusive Access**: Restricted to users with the `admin` role.
-   **Login URL**: `/admin/login`
-   **Features**:
    -   **Superuser Access**: Hardcoded bypass for root administrators (e.g., `sumankumarsharma@gmail.com`).
    -   **Secure Registration**: Requires a Root Authorization Key (`QUANTUM_ADMIN_2026`) to create new admin accounts.

---

## 📂 Project Structure

```
QuantumCloud/
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components (Admin, Teamwork, Quest)
│   │   ├── hooks/          # Custom React hooks (useAuth, useTeamwork)
│   │   ├── pages/          # Main application views
│   │   │   ├── admin-dashboard.tsx
│   │   │   ├── teamwork.tsx
│   │   │   ├── quantum-quest.tsx
│   │   │   └── ...
│   │   └── lib/            # Utilities
├── server/
│   ├── routes.ts           # API Routes definition
│   ├── models/             # Mongoose schemas (User, Workspace, Job)
│   ├── services/           # Business logic (IBM, OpenAI, Collaboration)
│   └── storage.ts          # Data access layer
└── ...
```

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

*Built with ❤️ for the Quantum Computing Community.*
