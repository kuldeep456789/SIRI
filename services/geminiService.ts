import { GoogleGenAI, Type, FunctionDeclaration, Tool } from "@google/genai";
import { SmartHomeState } from "../types";

// Define the tools (functions) the model can use
const toggleLightsFunction: FunctionDeclaration = {
  name: 'toggle_lights',
  description: 'Turn the smart lights on or off.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      state: {
        type: Type.BOOLEAN,
        description: 'True for ON, False for OFF.',
      },
    },
    required: ['state'],
  },
};

const setTemperatureFunction: FunctionDeclaration = {
  name: 'set_temperature',
  description: 'Set the thermostat temperature in degrees Fahrenheit.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      temperature: {
        type: Type.NUMBER,
        description: 'The target temperature.',
      },
    },
    required: ['temperature'],
  },
};

const toggleLockFunction: FunctionDeclaration = {
  name: 'toggle_lock',
  description: 'Lock or unlock the front door security system.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      locked: {
        type: Type.BOOLEAN,
        description: 'True to LOCK, False to UNLOCK.',
      },
    },
    required: ['locked'],
  },
};

const toggleMusicFunction: FunctionDeclaration = {
  name: 'toggle_music',
  description: 'Play or pause the music system.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      playing: {
        type: Type.BOOLEAN,
        description: 'True to PLAY, False to PAUSE.',
      },
    },
    required: ['playing'],
  },
};

const tools: Tool[] = [{
  functionDeclarations: [
    toggleLightsFunction,
    setTemperatureFunction,
    toggleLockFunction,
    toggleMusicFunction
  ]
}];

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAssistantResponse = async (
  userPrompt: string, 
  currentHomeState: SmartHomeState,
  executeCommand: (command: string, args: any) => Promise<any>
): Promise<string> => {
  
  const systemInstruction = `
    You are OmniHome, a helpful, witty, and professional smart home assistant.
    You have control over lights, temperature, door locks, and music.
    Current Home State: ${JSON.stringify(currentHomeState)}.
    
    When a user asks to change something, use the provided tools.
    If the tool is successful, confirm it to the user in a concise, friendly manner.
    If you are just chatting, be conversational. 
    Keep responses short (under 2 sentences) as they will be spoken aloud.
    Behave like a futuristic AI assistant (think JARVIS meets Siri).
  `;

  try {
    // Initial generation (text or function call)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        tools: tools,
        temperature: 0.7,
      },
    });

    const candidate = response.candidates?.[0];
    
    // Check for function calls
    const functionCalls = candidate?.content?.parts?.filter(part => part.functionCall).map(part => part.functionCall);

    if (functionCalls && functionCalls.length > 0) {
        let finalResponseText = "";
        
        // Execute all function calls found
        for (const call of functionCalls) {
            if (call) {
                const result = await executeCommand(call.name, call.args);
                
                // Send the result back to Gemini to get the natural language confirmation
                // We need to create a new turn with the function response
                const secondResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: [
                        { role: 'user', parts: [{ text: userPrompt }] },
                        { role: 'model', parts: candidate?.content?.parts || [] }, // Previous model turn with function call
                        { 
                            role: 'function', 
                            parts: [{
                                functionResponse: {
                                    name: call.name,
                                    response: { result: result } 
                                }
                            }]
                        }
                    ],
                    config: { systemInstruction } // Maintain persona
                });
                
                finalResponseText = secondResponse.text || "Command executed.";
            }
        }
        return finalResponseText;
    }

    return response.text || "I'm sorry, I didn't catch that.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the smart home network right now.";
  }
};
