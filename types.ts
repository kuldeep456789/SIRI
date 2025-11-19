export interface SmartHomeState {
  lights: boolean;
  temperature: number;
  isLocked: boolean;
  musicPlaying: boolean;
  activeScene: 'morning' | 'evening' | 'party' | 'none';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface FunctionCallResult {
  functionName: string;
  result: object;
}

// Define window interface for SpeechRecognition (browser native)
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}