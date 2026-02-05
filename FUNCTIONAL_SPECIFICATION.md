# Functional Specification: Modules & Working Processes

This document provides a detailed breakdown of the working processes for each function and service within the QuantumDashboard application.

---

## 1. Backend Modules (`/server`)

### **A. IBM Quantum Service (`ibm-quantum.ts`)**
Interface for communicating with IBM's real quantum cloud APIs.

*   `getConfig()`:
    *   **Process**: Reads environment variables (`IBM_QUANTUM_API_TOKEN`, etc.).
    *   **Output**: Configuration object.
*   `getBearerToken()`:
    *   **Process**: Authenticates with IBM Cloud IAM or Legacy Auth platform. Caches token to minimize requests. checks `isLegacyPlatform` to decide auth strategy.
    *   **Output**: A valid Bearer token string.
*   `makeAuthenticatedRequest(url, method, data)`:
    *   **Process**: Wraps `axios` calls with proper `Authorization` headers and `Service-CRN`. Handles 401 retries and logs errors.
    *   **Output**: Parsed JSON response from IBM.
*   `getJobs(limit)`:
    *   **Process**: Fetches the user's recent job history. Tries multiple endpoints (Cloud v1, Legacy) to ensure compatibility. Falls back to `generateSampleJobs` if API key is invalid/missing.
    *   **Output**: Array of `IBMQuantumJob`.
*   `getJob(jobId)`:
    *   **Process**: Fetches details for a single job. Tries 5+ endpoint variations. Handles 404s by constructing a "Limited Access" object if the ID looks valid but isn't found (prevents UI crashes).
    *   **Output**: Single `IBMQuantumJob`.
*   `getBackends()`:
    *   **Process**: Lists available quantum computers (QPUs). Maps complex status objects to simple `online`/`offline`/`maintenance` states.
    *   **Output**: Array of `IBMQuantumBackend`.

### **B. AI Service (`openai-service.ts`)**
INTEGRATION: Uses Google Gemini 2.5 Flash (`@google/generative-ai`) despite the filename.

*   `initializeIfNeeded()`:
    *   **Process**: Lazy loads the Gemini client. Validates the API Key format (must start with "AIza").
*   `generateJobSuggestions(config)`:
    *   **Input**: Qubits, shots, backend, circuit code.
    *   **Process**: Prompts AI to predict runtime and suggest optimizations *before* submission.
    *   **Output**: JSON with `circuitSuggestions`, `optimizationTips`, `estimatedRuntime`.
*   `analyzeFailedJob(job)`:
    *   **Input**: A job object with status 'failed'.
    *   **Process**: Feeds error logs and circuit code to AI to determine root cause.
    *   **Output**: JSON with `possibleCauses` and `circuitImprovements`.
*   `generateCircuitCode(description, qubits)`:
    *   **Input**: Natural language prompt (e.g., "Bell state").
    *   **Process**: Asks AI to write Python/Qiskit code. Cleans markdown code blocks from response.
    *   **Output**: Raw Qiskit string.

### **C. Real-Time Collaboration (`real-time-collaboration-service.ts`)**
Manages WebSockets for the live coding environment.

*   `handleConnection(ws, request)`:
    *   **Process**: Upgrades HTTP request to WebSocket. Extracts `userId`, `sessionId` from URL params. Broadcasts "User Joined" to other peers.
*   `handleMessage(client, message)`:
    *   **Process**: Routing switch for message types (`code_edit`, `cursor_move`, `chat_message`). Updates local memory state.
*   `handleCodeEdit(client, message)`:
    *   **Input**: Operation (insert/delete), position, text content.
    *   **Logic**: Applies the edit to the server's `documentState` string to keep a "Source of Truth". Broadcasts the edit to all other clients in the session.
*   `handleCursorMove(client, message)`:
    *   **Logic**: Updates client's last known position. Broadcasts to others so they can render the remote cursor.
*   `handleVoiceSignaling(client, message)`:
    *   **Process**: Relays WebRTC signaling data (Offers/Answers/ICE candidates) between clients A and B. Does not interpret the data.

### **D. Gamification Service (`gamification-service.ts`)**
Manages XP, levels, and challenges.

*   `checkAndAwardAchievements(userId, action, context)`:
    *   **Process**: Iterates through all static achievements. Checks specific requirements (e.g., `count >= 10`). Awards achievement if not already unlocked.
    *   **Output**: Array of newly unlocked `UserAchievement` objects.
*   `generateChallengeRecommendations(user)`:
    *   **Logic**: Scores active challenges against user's skills and experience.
    *   **Formula**: `Score = (SkillMatch * 15) + (DifficultyMatch * 20)`.
    *   **Output**: Sorted list of recommended challenges.

---

## 2. Frontend Components (`/client`)

### **A. `ProjectCollaborationView.tsx`** (Teamwork Page)
The main integrated workspace.

*   **State**: `code` (string), `collaborators` (array), `activeTab` (editor/results/docs).
*   **Hooks**: `useCollaboration`.
*   **Process**:
    1.  Fetches project code from database.
    2.  Establishes WebSocket connection via `useCollaboration`.
    3.  Listens for `code_edit_applied` events to update the editor content without overwriting local cursor.
    4.  Sends `cursor_move` events on local selection change.

### **B. `ResearchChat.tsx`**
The AI/Team chat interface.

*   **Modes**: `dialog` (popup) or `embedded` (sidebar).
*   **Function**: `onSendMessage`
    *   Checks if message starts with specific keywords or is normal chat.
    *   If AI is triggered (or general logic), sends payload to backend.
    *   Optimistically renders user message immediately.

### **C. `ai-failure-analysis.tsx`**
*   **Trigger**: Renders only when `job.status === 'failed'`.
*   **Function**: `handleAnalyze` calls `/api/ai/analyze-failure`.
*   **UI**: Displays 4 sections using `framer-motion` for staggered entrance animations.

---

## 3. Database Layer (`storage.ts`)

Implements the `IStorage` interface. Currently uses `MemStorage` (In-Memory Map) for speed and simplicity, but designed to be swapped for MongoDB/Postgres.

*   `createJob(job)`: Adds job to `jobs` Map. Indexing is O(1).
*   `updateJobStatus(id, status)`:
    *   Finds job.
    *   Updates status.
    *   If `status === 'completed' || 'failed'`, populates `endTime`.
*   `searchJobs(query)`:
    *   **Logic**: Performs a case-insensitive substring match on `name`, `backend`, `status`, and `tags`.
