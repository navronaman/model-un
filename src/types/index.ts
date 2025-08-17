// Represents a single delegate
export interface Delegate {
  id: string;
  delegationName: string;
  delegateName: string;
  votingHistory: { motionId: string; vote: 'yay' | 'nay' }[];
  speakingHistory: { motionId: string; motionType: string }[];
}

// Represents the currently active motion
export interface ActiveMotion {
  type: 'speakers_list' | 'moderated_caucus' | 'unmoderated_caucus';
  proposer: Delegate['id'];
  totalTime?: number; // in seconds
  speakingTime?: number; // in seconds
  speakerCount?: number;
}

// Represents the overall session state
export interface SessionState {
  status: 'setup' | 'awaiting_motion' | 'in_motion';
  delegates: Delegate[];
  activeMotion: ActiveMotion | null;
  proposedMotions: ProposedMotion[];
}

// Represents a proposed motion
export interface ProposedMotion {
  id: string;
  type: 'speakers_list' | 'moderated_caucus' | 'unmoderated_caucus';
  proposer: Delegate['id'];
  totalTime?: number; // in seconds
  speakingTime?: number; // in seconds
  speakerCount?: number;
  yayVotes: number;
  nayVotes: number;
}
