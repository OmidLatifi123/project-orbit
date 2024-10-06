import React, { useRef, useState, useEffect } from "react";

export default function VoiceBot() {
  const inputRef = useRef();
  const [transcript, setTranscript] = useState("");
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      let synth = window.speechSynthesis;
      let voices = synth.getVoices();
      
      if (voices.length) {
        setVoices(voices);
      } else {
        synth.onvoiceschanged = () => {
          setVoices(synth.getVoices());
        };
      }
    };

    loadVoices();
  }, []);

  const startSpeechRecognition = async (url, prompt) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();

    recognition.onstart = () => {
      console.log("Voice recognition started. Speak into the microphone.");
    };

    recognition.onspeechend = () => {
      recognition.stop();
      console.log("Voice recognition stopped.");
    };

    recognition.onresult = async (event) => {
      const transcribedText = await event.results[0][0].transcript;

      console.log("Received text: " + transcribedText);
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({ text: transcribedText }), 
      });
      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      const data = await result.json(); 
      console.log("Server response:", data);

      speakText(data.message);
    };

    recognition.start();
  };

  const speakText = (text) => {
    let synth = window.speechSynthesis;
    let utterance = new SpeechSynthesisUtterance(text);
    
    // Find Google US English or use a fallback if it's not available
    let selectedVoice = voices.find(voice => 
      voice.name === 'Google US English' || 
      voice.name.includes('Google') && voice.lang === 'en-US'
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      console.warn("Preferred voice not found, using default.");
    }

    console.log("Speaking:", text);
    synth.speak(utterance);
  };

  return (
    <div className="voicebot">
            <button
              onClick={() => {
                startSpeechRecognition("http://localhost:3001/general");
              }}
              className="btn btn-primary btn-block mb-2 wellbeing-button"
            >
              Talk to Project Orbit!
            </button>
    </div>
  );
}
