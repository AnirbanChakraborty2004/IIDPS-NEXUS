import React, { useState, useEffect, useRef } from 'react';
import { sendVoiceCommand } from '../services/api';

const VoicePanel = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('Waiting for command...');
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        setAiResponse('Processing...');
        
        // Send to Backend NLP
        const res = await sendVoiceCommand(text);
        setAiResponse(res.response);
        
        // Speak Response
        speak(res.response);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        setAiResponse('Microphone error or access denied.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setAiResponse("Your browser does not support Voice AI.");
    }
  }, []);

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good English voice
    const voices = synth.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.lang === 'en-US');
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    synth.speak(utterance);
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setAiResponse('Listening...');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="panel">
      <h2>J.A.R.V.I.S. Command</h2>
      <div className="voice-container">
        <button 
          className={`mic-button ${isListening ? 'listening' : ''}`}
          onClick={toggleListen}
          title="Click to speak"
        >
          🎙️
        </button>
        
        <div className="voice-transcript">
          <div><strong>You:</strong> {transcript || "..."}</div>
          <div className="voice-response"><strong>AI:</strong> {aiResponse}</div>
        </div>
      </div>
    </div>
  );
};

export default VoicePanel;
