import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Search, X, Mic, MicOff } from "lucide-react";
import "./Search.css";

const ItemSearch = () => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const history = useHistory();

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false; // listen only once
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => {
      console.log("🎤 Listening started...");
      setIsListening(true);
      setQuery(""); // reset field when listening
    };

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Show words as you speak
      setQuery(finalTranscript || interimTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      alert("Voice capture failed: " + event.error);
    };

    recognitionRef.current.onend = () => {
      console.log("🎤 Listening stopped.");
      setIsListening(false);

      // When stopped, if we got some words → search them
      if (query.trim()) {
        handleSearch(query.trim());
      }
    };
  }, [query]);

  const handleVoiceSearch = () => {
    if (!speechSupported) {
      alert("Voice search not supported in this browser. Use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSearch = (searchTerm = query) => {
    if (!searchTerm.trim()) return;
    const params = new URLSearchParams();
    params.append("itemName", searchTerm.trim());
    history.push(`/products-page?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="jewel-search-container">
      <input
        type="text"
        className="jewel-input-field"
        placeholder={isListening ? "🎤 Listening... Speak now" : "Search products..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isListening} // lock typing while capturing
      />

      {query && !isListening && (
        <X
          className="jewel-clear-icon"
          size={16}
          onClick={handleClear}
          title="Clear search"
        />
      )}

      {speechSupported && (
        <button
          type="button"
          className={`jewel-voice-button ${isListening ? "listening" : ""}`}
          onClick={handleVoiceSearch}
          title={isListening ? "Stop listening" : "Start voice search"}
        >
          {isListening ? (
            <MicOff className="jewel-voice-icon" size={16} />
          ) : (
            <Mic className="jewel-voice-icon" size={16} />
          )}
        </button>
      )}

      <button
        type="button"
        className="jewel-search-button"
        onClick={() => handleSearch()}
        title="Search"
        disabled={isListening}
      >
        <Search className="jewel-search-icon" size={16} />
      </button>
    </div>
  );
};

export default ItemSearch;
