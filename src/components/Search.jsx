import React, { useState, useEffect, useCallback, useRef } from "react";
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

const Search = ({ onItemSelected }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(`http://localhost:3000/api/items?q=${query}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

  useEffect(() => {
    if (searchQuery) {
      debouncedFetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, debouncedFetchSuggestions]);

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (onItemSelected) {
      onItemSelected(suggestion);
    }
    // Navigate to the main content route and pass the selected item as state
    navigate(`/item/${suggestion.id}`);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  const hoverStyle = {
    textDecoration: `underline`,
    cursor: `pointer`
  };

  return (
    <div className="form-inline">
      <div className="search-container" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Search items"
          value={searchQuery}
          onChange={handleChange}
          className="form-control"
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="list-group">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="list-group-item"
                onClick={() => handleSuggestionClick(suggestion)}
                style={hoverStyle}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
