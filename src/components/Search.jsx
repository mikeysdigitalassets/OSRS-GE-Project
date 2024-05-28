import react, { useState, useEffect, useCallback } from "react";
import debounce from 'lodash.debounce';



const Search = ({onItemSelected}) =>  {

    const [searchQuery, setSearchQuery] = useState("")
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSuggestions = async (query) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/items?q=${query}`);
            if (!response.ok){
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setSuggestions(data);
            setLoading(false);
                   
        } catch (error) {
            console.error(error.message);
            setLoading(false);
        }
        
    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

        useEffect(() => {
            if (searchQuery) {
                debouncedFetchSuggestions(searchQuery);
            } else {
                setSuggestions([])
            }
        }, [searchQuery, debouncedFetchSuggestions]);

    const handleChange = (event) => {
        setSearchQuery(event.target.value);
        
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.name);
        setSuggestions([]);
        if (onItemSelected) {
            onItemSelected(suggestion);
        }
    }

    return (
        <div className="search-container">
            <input 
            type="text"
            placeholder="Search item"
            value={searchQuery}
            onChange={handleChange}
            className="form-control mr-sm-2"
            />
            {loading && <div> Loading...</div>}
            {suggestions.length > 0 && (
                <ul className="list-group">
                    {suggestions.map((suggestion) => (
                        <li 
                            key={suggestion.id}
                            className="list-group-item"
                            onClick={() => handleSuggestionClick(suggestion )}
                        >
                            {suggestion.name}
                            </li>
                    ))}
                </ul>    
            )}
        </div>    
    )
};

export default Search;