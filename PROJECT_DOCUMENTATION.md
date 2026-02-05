# QuantumDashboard - Project Documentation

## 1. Architecture Overview

QuantumDashboard is a comprehensive web platform designed to democratize access to quantum computing education and collaboration. It combines a modern React frontend with a robust Node.js/Express backend to provide real-time job management, AI-assisted learning, and collaborative workspace features.

### Tech Stack
-   **Frontend**: React, Vite, Tailwind CSS, Shadcn/UI, Framer Motion, Recharts.
-   **Backend**: Node.js, Express, WebSocket (ws).
-   **Data**: In-memory storage (with simulated persistence interfaces for MongoDB/PostgreSQL).
-   **AI**: Google Gemini 2.5 Flash via `@google/generative-ai`.
-   **Integration**: IBM Quantum API (simulated/live wrapper).

---

## 2. Artificial Intelligence (AI) Engine

The AI functionalities are centralized in `server/openai-service.ts` (named legacy, but uses Gemini). This service acts as an intelligent layer between the user and raw quantum data.

### Key Functions

#### `analyzeFailedJob(job)`
-   **Trigger**: When a user views a failed job in the dashboard.
-   **Input**: Job error logs, circuit code, backend status.
-   **Process**: Sends a prompt to Gemini 2.5 Flash asking for a Root Cause Analysis.
-   **Output**: A structured JSON object containing:
    -   `possibleCauses`: e.g., "Coherence time exceeded", "Gate error rates".
    -   `suggestions`: Immediate fixes like "Reduce circuit depth".
    -   `preventionTips`: Long-term best practices.
-   **UI Component**: `client/src/components/ai/ai-failure-analysis.tsx`.

#### `generateCircuitCode(description, qubits)`
-   **Trigger**: In the Code Editor or via Chat ("Create a GHZ state circuit").
-   **Process**: Converts natural language requests into valid, runnable Qiskit/Python code.
-   **Safety**: Includes basic validation to ensure code imports necessary libraries.

#### `generateJobSuggestions(config)`
-   **Trigger**: Before job submission.
-   **Purpose**: Predictive analysis. It estimates runtime and suggests optimizations *before* the user spends credits/time on a real backend.
-   **Output**: Backend recommendations (e.g., "Switch to `ibm_brisbane` for better fidelity").

#### `chat(message)`
-   **Context**: The AI is system-prompted to act as a "Senior Quantum Researcher".
-   **Capabilities**: Can answer theoretical questions ("What is Shor's algorithm?"), explain dashboard features, or debug specific job IDs.

---

## 3. Real-Time Collaboration System

Collaboration is handled by the `RealTimeCollaborationService` (`server/real-time-collaboration-service.ts`), which manages WebSocket connections alongside the HTTP server.

### Core Mechanisms

#### Session Management
-   **Sessions**: Users join "rooms" defined by a `sessionId` and `projectId`.
-   **State**: The server maintains a simplified OT (Operational Transformation) state for document content (`documentStates` map).

#### Live Synchronization
1.  **Code Editing (`handleCodeEdit`)**:
    -   When User A types, a `code_edit` message is sent with the operation (insert/delete), position, and content.
    -   The server applies this to the canonical document state.
    -   The server broadcasts the edit to all other connected clients in that session.
2.  **Cursor Tracking (`handleCursorMove`)**:
    -   Client sends cursor coordinates (line, column).
    -   Server broadcasts these to others, rendering "ghost cursors" with the user's name/color.

#### Collaborative Features
-   **WebRTC Signaling**: The server acts as a signaling channel (`handleVoiceSignaling`) to facilitate peer-to-peer voice and screen sharing. It does *not* relay the media streams itself, preserving bandwidth.
-   **AI Suggestions**: `generateCollaborationSuggestions` analyzes activity patterns (e.g., "3 users typing at once") and suggests improved workflows ("Assign roles to avoid conflicts").

---

## 4. Gamification Service

The `GamificationService` (`server/gamification-service.ts`) drives user engagement through a comprehensive XP and achievement system.

### Structure

#### Achievements
-   **Static Definition**: Achievements are defined in code (e.g., "Quantum Einstein", "First Steps").
-   **Triggering**: The `checkAndAwardAchievements` method is called after key actions (job completion, collaboration).
-   **Logic**: It evaluates complex conditions:
    -   *Count-based*: "Run 10 jobs".
    -   *Constraint-based*: "Circuit depth < 50".
    -   *Social*: "Help 3 team members".

#### Challenges
-   **Types**:
    -   *Individual*: "VQE Mastery" (Self-paced learning).
    -   *Team*: "Hackathon 2025" (Requires forming a group).
    -   *Global*: "Optimization Challenge" (Community goal).
-   **Team Formation**: The `suggestTeamFormation` algorithm uses a greedy approach to match users based on:
    -   **Skill Complementarity**: Matching a "Qiskit Expert" with a "Math Theorist".
    -   **Experience Balance**: Mixing seniors with juniors for mentorship synergy.

#### Analytics
-   **Method**: `getUserProgressAnalytics` aggregates data to calculate a user's "Level" (e.g., Level 5 Quantum Architect).
-   **Milestones**: Predicts the next achievable goals to keep users motivated.

---

## 5. Documentation & Learning

### Interactive Docs
The platform includes an interactive documentation hub (`client/src/pages/Docs.tsx`) that indexes:
-   **Tutorials**: Step-by-step guides for beginners.
-   **API References**: Details on the backend endpoints.
-   **Concepts**: Explanations of Qubits, Superposition, Entanglement, etc.

### "Quantum Quest"
A gamified learning path (`client/src/pages/quantum-quest.tsx`) where users:
1.  Select a "Level" (e.g., "Bell States").
2.  Are presented with a challenge.
3.  Write code in the IDE.
4.  Submit for verification (simulated execution).
5.  Earn XP and unlock the next level upon success.

---

## 6. Directory Structure Summary

```text
/server
  /openai-service.ts           # AI Logic
  /real-time-collaboration.ts  # WebSocket Server
  /gamification-service.ts     # XP/Challenges
  /routes.ts                   # REST API Definition

/client/src
  /components/ai               # Failure Analysis, Chat UI
  /components/teamwork         # ProjectCollabView, ResearchChat
  /pages/teamwork.tsx          # Main Collaboration Hub
  /hooks/use-collaboration.ts  # WebSocket Client Hook
```
