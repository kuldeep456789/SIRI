import React, { useState, useEffect, useCallback } from 'react';
import { SmartHomeState, ChatMessage } from './types';
import { generateAssistantResponse } from './services/geminiService';
import { Visualizer } from './components/Visualizer';
import { DeviceCard } from './components/DeviceCard';
import { StatusLog } from './components/StatusLog';
import { Lightbulb, Thermometer, Lock, Music, Mic, MicOff } from 'lucide-react';

const App: React.FC = () => {
  // 1. Application State
  const [homeState, setHomeState] = useState<SmartHomeState>({
    lights: false,
    temperature: 72,
    isLocked: true,
    musicPlaying: false,
    activeScene: 'none',
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // 2. Speech Synthesis (TTS)
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      // Try to find a natural sounding voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en')) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // 3. Function Call Handlers (Executed by Gemini)
  const handleSmartCommand = async (command: string, args: any): Promise<string> => {
    console.log(`Executing ${command} with`, args);
    
    switch (command) {
      case 'toggle_lights':
        setHomeState(prev => ({ ...prev, lights: args.state }));
        return `Lights turned ${args.state ? 'ON' : 'OFF'}.`;
        
      case 'set_temperature':
        setHomeState(prev => ({ ...prev, temperature: args.temperature }));
        return `Thermostat set to ${args.temperature} degrees.`;
        
      case 'toggle_lock':
        setHomeState(prev => ({ ...prev, isLocked: args.locked }));
        return `Front door ${args.locked ? 'LOCKED' : 'UNLOCKED'}.`;
        
      case 'toggle_music':
        setHomeState(prev => ({ ...prev, musicPlaying: args.playing }));
        return `Music ${args.playing ? 'playing' : 'paused'}.`;
        
      default:
        return "Command not recognized.";
    }
  };

  // 4. Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onstart = () => setIsListening(true);
      recog.onend = () => setIsListening(false);
      
      recog.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleUserMessage(transcript);
        }
      };

      setRecognition(recog);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
  };

  // 5. Main Interaction Loop
  const handleUserMessage = async (text: string) => {
    // Add user message to chat
    const userMsg: ChatMessage = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    // Call Gemini
    const responseText = await generateAssistantResponse(text, homeState, handleSmartCommand);

    setIsProcessing(false);

    // Add AI response to chat
    const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, aiMsg]);

    // Speak response
    speak(responseText);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
          <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-orange-400">
            OMNIHOME <span className="font-light text-slate-400 text-sm">AI</span>
          </h1>
        </div>
        <div className="text-xs font-mono text-slate-500">
          SYSTEM_STATUS: ONLINE
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        
        {/* Left Col: Device Status */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <DeviceCard 
              title="Smart Lights"
              value={homeState.lights ? "ON" : "OFF"}
              isActive={homeState.lights}
              icon={Lightbulb}
              colorClass="text-green-400"
              onClick={() => handleUserMessage(homeState.lights ? "Turn off lights" : "Turn on lights")}
            />
            <DeviceCard 
              title="Climate"
              value={`${homeState.temperature}°F`}
              isActive={true}
              icon={Thermometer}
              colorClass="text-orange-400"
              onClick={() => handleUserMessage("Set temperature to 72")}
            />
            <DeviceCard 
              title="Security"
              value={homeState.isLocked ? "SECURE" : "UNLOCKED"}
              isActive={homeState.isLocked}
              icon={Lock}
              colorClass="text-green-500"
              onClick={() => handleUserMessage(homeState.isLocked ? "Unlock the door" : "Lock the door")}
            />
            <DeviceCard 
              title="Media System"
              value={homeState.musicPlaying ? "PLAYING" : "PAUSED"}
              isActive={homeState.musicPlaying}
              icon={Music}
              colorClass="text-purple-400"
              onClick={() => handleUserMessage(homeState.musicPlaying ? "Stop music" : "Play some jazz")}
            />
          </div>

          {/* AI Visualizer Area */}
          <div className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
            <div className="absolute top-4 left-4 text-xs text-slate-500 uppercase tracking-widest">Voice Interface</div>
            
            <Visualizer isActive={isListening || isProcessing} isSpeaking={isProcessing} />
            
            <div className="mt-6 text-center">
              <p className="text-slate-400 h-6 text-lg font-light transition-opacity duration-300">
                {isListening ? "Listening..." : isProcessing ? "Processing..." : "Ready for command"}
              </p>
            </div>

            {/* Mic Button */}
            <button
              onClick={toggleListening}
              className={`mt-8 p-6 rounded-full transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 group
                ${isListening 
                  ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
                  : 'bg-gradient-to-r from-orange-500 to-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'}
              `}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </button>
          </div>

        </div>

        {/* Right Col: Activity Log */}
        <div className="glass-panel rounded-3xl flex flex-col overflow-hidden h-[500px] lg:h-auto">
          <div className="p-4 border-b border-slate-700 bg-slate-800/50">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">System Log</h3>
          </div>
          <div className="flex-1 overflow-hidden relative">
             <StatusLog messages={messages} />
          </div>
        </div>

      </main>
      
      <footer className="p-4 text-center text-slate-600 text-xs">
        OmniHome v1.0 • Powered by Google Gemini 2.5 Flash • Voice Control Enabled
      </footer>
    </div>
  );
};

export default App;
