import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Search, X, Mic, MicOff } from 'lucide-react';
import './Search.css';

const ItemSearch = () => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [browserCompatible, setBrowserCompatible] = useState(true);
  const history = useHistory();
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setBrowserCompatible(false);
      return;
    }

    try {
      setSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Update final transcript reference
        if (finalTranscript) {
          finalTranscriptRef.current += finalTranscript;
        }

        // Show speech in the input (both interim and final)
        setQuery(finalTranscriptRef.current + interimTranscript);

        // Reset silence timer whenever we get results
        resetSilenceTimer();

        // If we have final results, prepare to complete
        if (finalTranscript) {
          // Small delay to allow for additional speech
          setTimeout(() => {
            if (finalTranscriptRef.current.trim()) {
              completeVoiceSearch();
            }
          }, 500);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
        
        let errorMessage = 'Voice search failed. Please try again.';
        switch(event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Try speaking louder/closer.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone found. Please connect one.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Allow access to use voice search.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your internet.';
            break;
        }
        alert(errorMessage);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          // Auto-restart if we're still supposed to be listening
          recognitionRef.current.start();
        }
      };

    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      setSpeechSupported(false);
      setBrowserCompatible(false);
    }

    return () => {
      stopListening();
    };
  }, [history]);

  const resetSilenceTimer = () => {
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      if (finalTranscriptRef.current.trim()) {
        completeVoiceSearch();
      } else {
        stopListening();
        alert('No speech detected. Voice search stopped.');
      }
    }, 3000); // 3 seconds of silence
  };

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    clearSilenceTimer();
  };

  const completeVoiceSearch = () => {
    stopListening();
    if (finalTranscriptRef.current.trim()) {
      const searchQuery = finalTranscriptRef.current.trim();
      setQuery(searchQuery);
      const params = new URLSearchParams();
      params.append('itemName', searchQuery);
      history.push(`/shop-left?${params.toString()}`);
    }
    finalTranscriptRef.current = '';
  };

  const handleSearch = () => {
    if (query.trim() === '') return;
    const params = new URLSearchParams();
    params.append('itemName', query.trim());
    history.push(`/shop-left?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    finalTranscriptRef.current = '';
  };

  const handleVoiceSearch = () => {
    if (!speechSupported) {
      alert(
        browserCompatible 
          ? 'Voice search not supported. Use Chrome, Edge, or Safari.'
          : 'Voice search not available in this environment.'
      );
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      try {
        setIsListening(true);
        setQuery('');
        finalTranscriptRef.current = '';
        recognitionRef.current.start();
        resetSilenceTimer();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
        alert('Could not start voice search. Please try again.');
      }
    }
  };

  return (
    <div className="jewel-search-container">
      <input
        type="text"
        className="jewel-input-field"
        placeholder={isListening ? 'Listening... Speak now' : 'Search products...'}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isListening}
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
          className={`jewel-voice-button ${isListening ? 'listening' : ''}`}
          onClick={handleVoiceSearch}
          title={isListening ? 'Stop listening' : 'Start voice search'}
          aria-label={isListening ? 'Stop listening' : 'Start voice search'}
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
        onClick={handleSearch}
        title="Search"
        aria-label="Search"
        disabled={isListening}
      >
        <Search className="jewel-search-icon" size={16} />
      </button>
    </div>
  );
};

export default ItemSearch;