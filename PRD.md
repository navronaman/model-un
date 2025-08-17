# PRD: Model UN Session Tracker

## 1. Objective
To create a single-page web application using **React** and **Vite** that allows a Model UN committee chair to set up, manage, and track a committee session in real-time. The application will handle delegate management, motion proposals, voting, and timed speaking events.

## 2. Tech Stack
- **Framework:** React with Vite
- **Language:** TypeScript (for type safety and scalability)
- **Styling:** Tailwind CSS (for modern, utility-first styling)
- **State Management:** React Hooks (`useState`, `useReducer`, `useContext`) for session state.

## 3. Core User Flows

### Flow 1: Session Setup
1.  **Landing Page:** The app loads to a "Session Setup" screen.
2.  **Enter Number of Delegates:** The user is prompted to enter a "Number of Delegates." This input should be a number between **5** and **50**.
3.  **Enter Delegate Details:** Based on the number entered, the app dynamically generates input fields for each delegate. The user must enter a **"Delegation Name"** (e.g., "France") and a **"Delegate Name"** for each one.
4.  **Store & Proceed:** After filling all names, the user clicks a "Start Session" button. This action stores the list of delegates as the primary session state and transitions the view to the "Session Dashboard."

### Flow 2: Main Session Loop (Awaiting & Voting on Motions)
1.  **Default State:** The dashboard's default state asks, **"Are there any motions on the floor?"** and shows a "Propose a Motion" button above the delegate list.
2.  **Propose Motions:**
    * Clicking the button opens a modal to propose a motion.
    * A dropdown allows the user to select the **proposing delegation**.
    * The user selects a **motion type**:
        * `Speaker's List`: Requires `{speaking time}` (with seconds/minutes toggle) and `{number of speakers}`.
        * `Moderated Caucus`: Requires `{total time}` and `{speaking time}` (both with seconds/minutes toggle). **Validation**: Speaking time must be divisible by total time (e.g., 7 minutes total with 45 seconds speaking time is invalid).
        * `Unmoderated Caucus`: Requires `{total time}` (with seconds/minutes toggle).
    * The user can submit up to **three** proposed motions.
3.  **Voting:**
    * The proposed motions are displayed on the dashboard.
    * For each motion, the chair can register **"Yay"** and **"Nay"** votes from all delegates.
    * A motion passes if it achieves a **simple majority** (more "Yay" votes than "Nay" votes).
    * Once a motion passes, the app enters the "Active Motion" state, and the other proposed motions are cleared.

### Flow 3: Active Motion Execution
The UI changes to reflect the active motion.
1.  **Speaker's List:**
    * The UI shows empty slots for the specified `{number of speakers}`.
    * The chair can select a delegation to fill each speaking slot.
    * A **reusable Timer component** is displayed for the `{speaking time}`. The chair can start, pause, and reset it for each speaker.
    * **Important**: The speaking time for each individual speaker is crucial for the motion execution.
2.  **Moderated Caucus:**
    * The number of speakers is automatically calculated (`total time` / `speaking time`).
    * The flow is identical to the Speaker's List, with each speaker getting the specified speaking time.
    * **Validation**: Total time must be divisible by speaking time to ensure equal distribution.
3.  **Unmoderated Caucus:**
    * A single main timer is displayed for the `{total time}`.
    * The chair can start, pause, and reset the timer.
4.  **End of Motion:** When the motion concludes (e.g., the final speaker finishes or the main timer ends), the app returns to the **Default State** (Flow 2) to ask for new motions.

### Flow 4: Data Tracking
* For each delegation, the app must maintain a history.
* **Voting History:** A log of which motions the delegation voted for and how (`Yay`/`Nay`).
* **Speaking History:** A log of which motions the delegation spoke in (Speaker's List or Moderated Caucus). This data should be displayed in a "Delegate Tally" section of the dashboard.

## 4. Data Structures (State Design)

Please use the following shapes for the main state variables:

```typescript
// Represents a single delegate
interface Delegate {
  id: string; // or number
  delegationName: string;
  delegateName: string;
  votingHistory: { motionId: string; vote: 'yay' | 'nay' }[];
  speakingHistory: { motionId: string; motionType: string }[];
}

// Represents the currently active motion
interface ActiveMotion {
  type: 'speakers_list' | 'moderated_caucus' | 'unmoderated_caucus';
  proposer: Delegate['id'];
  totalTime?: number; // in seconds
  speakingTime?: number; // in seconds
  speakerCount?: number;
}

// Represents the overall session state
interface SessionState {
  status: 'setup' | 'awaiting_motion' | 'in_motion';
  delegates: Delegate[];
  activeMotion: ActiveMotion | null;
}