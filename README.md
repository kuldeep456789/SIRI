# OmniHome AI Assistant

OmniHome is a futuristic, voice-controlled smart home dashboard simulation powered by Google's Gemini 2.5 Flash model. It demonstrates the power of Large Language Models (LLMs) integrated with Function Calling to control application state.
![image alt](https://raw.githubusercontent.com/kuldeep456789/SIRI/32cb0763e82db8ab8a770ca965c3d31c29c028e4/alexa-or-siri-CONTENT-2019.webp)

## 🌟 Features

*   **Voice Control:** Uses the browser's native Web Speech API for Speech-to-Text.
*   **Smart AI:** Uses **Gemini 2.5 Flash** to understand natural language intent (e.g., "It's too dark in here" -> Turns on lights).
*   **Function Calling:** The AI autonomously decides when to trigger app functions (Lights, Lock, Temperature, Music) based on your voice.
*   **Voice Response:** Uses Text-to-Speech to reply verbally, creating a "Siri/Alexa"-like experience.
*   **Reactive UI:** A stunning Dark/Green/Orange aesthetic built with Tailwind CSS.

## 🚀 Setup

1.  Clone the repository.
2.  Create a `.env` file in the root and add your API key:
    ```
    API_KEY=your_gemini_api_key_here
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm start
    ```

## 🛠 Technologies

*   **Frontend:** React 18, TypeScript
*   **Styling:** Tailwind CSS
*   **AI Model:** @google/genai (Gemini 2.5 Flash)
*   **Icons:** Lucide React

## 🎮 How to Use

1.  Allow microphone permissions when prompted.
2.  Click the **Microphone Button** (Green/Orange gradient).
3.  Speak a command. Examples:
    *   *"Turn on the lights."*
    *   *"Set the temperature to 75 degrees."*
    *   *"Lock the front door."*
    *   *"Play some relaxing music."*
    *   *"I'm leaving for the day, secure the house."* (Might lock door + turn off lights).
4.  Watch the dashboard update instantly and listen for the audio response.

## 🎨 Design Choice

The interface utilizes a **Slate-900** dark mode base for a sleek, modern feel. 
*   **Green (#22c55e)** represents active, safe, and functional states.
*   **Orange (#f97316)** represents interaction points, warmth, and attention.
This contrast ensures high visibility and a professional "command center" aesthetic.
