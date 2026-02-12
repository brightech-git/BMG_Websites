import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X, Mic, MicOff, Clock, TrendingUp, Trash2 } from "lucide-react";
import debounce from "lodash/debounce";

const ItemSearch = () => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("jewelrySearchHistory");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [popularSearches, setPopularSearches] = useState([
    "Ring", "Necklace", "Bracelet",
    "Earrings", "Engagement Ring", "Wedding Band",
    "Pendant", "Chain", "Bangle", "Stud Earrings"
  ]);

  const navigate = useNavigate();
  const location = useLocation();
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Load search query from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setQuery(searchParam);
    }
  }, [location.search]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const localData = [
    "Ring",
    "Necklace",
    "Earrings",
    "Bracelet",
    "Gold",
    "Silver",
    "Chain",
    "Pendant",
  ];
  // Fetch suggestions from API (simulated)
  const fetchSuggestions = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoadingSuggestions(true);

      // Simulate API delay (optional)
      setTimeout(() => {
        const filtered = localData
          .filter((item) =>
            item.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 5); // Limit 5 suggestions

        setSuggestions(filtered);
        setIsLoadingSuggestions(false);
      }, 200); // 200ms delay to mimic API
    }, 300),
    []
  );

  // Update suggestions when query changes
  useEffect(() => {
    fetchSuggestions(query);
    return () => fetchSuggestions.cancel();
  }, [query, fetchSuggestions]);

  // Voice recognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setQuery("");
      setIsFocused(true);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setQuery(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);

      // User-friendly error messages
      const errorMessages = {
        'no-speech': 'No speech was detected. Please try again.',
        'audio-capture': 'No microphone was found. Ensure a microphone is installed.',
        'not-allowed': 'Microphone permission was denied. Please allow microphone access.',
        'network': 'Network error occurred. Please check your connection.',
        'aborted': 'Speech recognition was aborted.',
        'language-not-supported': 'Language not supported.'
      };

      alert(`Voice search failed: ${errorMessages[event.error] || event.error}`);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (query.trim()) {
        handleSearch(query.trim());
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [query]);

  // Save search to history
  const saveToHistory = (term) => {
    if (!term.trim()) return;

    const cleanedTerm = term.trim().toLowerCase();
    const updatedHistory = [
      { term: cleanedTerm, timestamp: Date.now() },
      ...searchHistory.filter(item => item.term !== cleanedTerm)
    ].slice(0, 10); // Keep only 10 most recent

    setSearchHistory(updatedHistory);
    try {
      localStorage.setItem("jewelrySearchHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save search history:", error);
    }
  };

  // Remove item from history
  const removeFromHistory = (term, e) => {
    e.stopPropagation();
    const updatedHistory = searchHistory.filter(item => item.term !== term);
    setSearchHistory(updatedHistory);
    localStorage.setItem("jewelrySearchHistory", JSON.stringify(updatedHistory));
  };

  // Clear entire history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("jewelrySearchHistory");
  };

  // Handle search
  const handleSearch = (searchTerm = query) => {
    const term = searchTerm?.trim();
    if (!term) return;

    saveToHistory(term);
    const params = new URLSearchParams();
    params.append("search", term);
    navigate(`/products-page?${params.toString()}`);
    setQuery("");
    setIsFocused(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleVoiceSearch = () => {
    if (!speechSupported) {
      alert("Voice search is not supported in your browser. Try Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start voice recognition:", error);
        alert("Could not start voice recognition. Please check microphone permissions.");
      }
    }
  };

  // Format timestamp for display
  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const showDropdown = isFocused && (query.trim() || searchHistory.length > 0);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative flex items-center gap-1">
        <input
          ref={inputRef}
          type="text"
          className="w-full px-4 py-3 pl-12 pr-12 text-[var(--primary-text-color)] h-[45px] bg-white border border-[var(--primary-hover-color)] rounded-md focus:outline-none focus:border-[var(--primary-hover-color)] focus:ring-2 focus:ring-[var(--primary-hover-color)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={isListening ? "🎤 Listening... Speak now" : "Search rings, necklaces..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          disabled={isListening}
          aria-label="Search products"
          style={{border:'1px solid #ddd'}}
        />

        <Search
          className="absolute left-1 text-[var(--primary-hover-color)]"
          size={16}
          aria-hidden="true"
        />

        {query && !isListening && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-20 p-1 text-[var(--primary-hover-color)] hover:text-[var(--primary-hover-color)] transition-colors duration-200"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}

        {speechSupported && (
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`absolute right-10 p-2 rounded-full transition-all duration-200 ${isListening
              ? "text-red-600 bg-red-50 animate-pulse"
              : "text-gray-400 hover:text-[var(--primary-hover-color)] hover:bg-gray-100"
              }`}
            aria-label={isListening ? "Stop listening" : "Start voice search"}
            title={isListening ? "Stop listening" : "Voice search"}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        )}

        <button
          type="button"
          onClick={() => handleSearch()}
          disabled={isListening || !query.trim()}
          className="absolute right-2 p-1 text-white bg-[var(--primary-hover-color)] rounded-full hover:bg-[var(--primary-hover-color)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-hover-color)] focus:ring-offset-2"
          aria-label="Search"
        >
          <Search size={16} />
        </button>
      </div>

      {/* Dropdown Suggestions */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
          {/* Current Suggestions */}
          {query.trim() && suggestions.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <div className="px-2 py-1 text-xs font-semibold text-[var(--primary-hover-color)] uppercase tracking-wider">
                Suggestions
              </div>
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(suggestion)}
                  className="w-full px-2 py-1 text-left text-[var(--primary-text-color)] hover:bg-[var(--primary-text-color)] hover:text-[var(--white-color)] rounded-lg transition-colors duration-150 flex items-center gap-3 h-[40px]"
                >
                  <Search size={14} className="text-gray-400" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--primary-hover-color)] uppercase tracking-wider">
                  <Clock size={12} />
                  Recent Searches
                </div>
                <button
                  onClick={clearHistory}
                  className="text-xs text-[var(--primary-hover-color)] hover:text-red-700 transition-colors duration-150 flex items-center gap-1"
                >
                  <Trash2 size={10} />
                  Clear All
                </button>
              </div>
              {searchHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors duration-150 group"
                >
                  <button
                    onClick={() => handleSearch(item.term)}
                    className="flex-1 text-left text-gray-700  h-[30px] flex items-center gap-3"
                  >
                    <Clock size={14} className="text-gray-400" />
                    <div className="flex w-full items-center justify-between ">
                      <span className="text-sm text-[var(--primary-text-color)] capitalize">{item.term}</span>
                      <span className="text-xs ">
                        {formatTimeAgo(item.timestamp)}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={(e) => removeFromHistory(item.term, e)}
                    className="p-1 text-[var(--primary-hover-color)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-150"
                    aria-label={`Remove ${item.term} from history`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {!query.trim() && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[var(--primary-hover-color)] uppercase tracking-wider">
                <TrendingUp size={12} />
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2 px-3 pb-2">
                {popularSearches.map((popular, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(popular)}
                    className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-150"
                  >
                    {popular}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoadingSuggestions && query.trim() && (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span className="ml-2 text-sm text-gray-500">Finding suggestions...</span>
            </div>
          )}

          {/* Empty State */}
          {query.trim() && !isLoadingSuggestions && suggestions.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No suggestions found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemSearch;