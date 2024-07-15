import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { IconButton } from "@mui/material";
import debounce from 'lodash.debounce';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ConstructionOutlined } from "@mui/icons-material";

const Tracker = ({ userId }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [tracklist, setTracklist] = useState([]);
    const [formStatus, setFormStatus] = useState(false);
    const [itemTrack, setItemTrack] = useState('');
    const [buyPrice, setBuyPrice] = useState('');
    const [buyAmount, setBuyAmount] = useState('');
    const [itemId, setItemId] = useState('')
    const [itemDetails, setItemDetails] = useState([]);
    const dropdownRef = useRef(null);
    
    useEffect(() => {
      fetchTracklist();
      
    },[userId]);
        
      const fetchTracklist = async () => {
          if (userId) {
            try {
              const response = await axios.get(`/api/user/${userId}/tracker`);
              setTracklist(response.data);
              
              // response.data.forEach(async (item) => {
              //   const itemResponse = await axios.get(`/extra/${itemId}`);
              //   const data = itemResponse.data.data
              //   setItemDetails(data);
              // })

            } catch (error) {
              console.error('Error fetching watchlist', error);
            }
            
          }
        }
    
       
    
    
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
    setItemTrack(suggestion.name);
    setItemId(suggestion.id);
    console.log(itemTrack);
    console.log(itemId);
    
    
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


    const handleItemTrack = (e) => {
      setItemTrack(e.target.value);
    }
    
    const handleBuyPrice = (e) =>{
      const value = e.target.value;
      const numericValue = value.replace(/,/g, ''); // Remove commas
      setBuyPrice(numericValue);
    }

    const handleBuyAmount = (e) => {
      setBuyAmount(e.target.value);
    }
    
    const handleFormStatus = () => {
      if ( formStatus === false ) {
        setFormStatus(true);
      }
      if ( formStatus === true ) {
        setFormStatus(false);
      }
    } 
    
    const handleFormSubmit = () => {
      axios.post(`/api/user/${userId}/tracker`, { 
        itemTrack: itemTrack, 
        buyPrice: buyPrice, 
        buyAmount: buyAmount,
        itemId: itemId
      })
      .then(response => {
        console.log(response.data);
        setFormStatus(false);
        fetchTracklist();
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
      
    };
   

  // const fetchItemDetails = async () => {
  //   try {
  //     const response = await axios.get(`/extra/${itemId}`);
  //     const data = response.data.data;
  //     console.log(data);
  //   } catch (error) {
  //     console.error("Error fetching item Details", error);
  //   }
  // }

  return (
    <div>
      
      <div>
  <h2 style={{ color: '#90ee90', position: 'absolute', left: '35%', marginTop: '10px', marginBottom: '10px' }}>P/L tracker</h2>
</div>

<div className='form-button-track' style={{ position: 'absolute', top: '20%'  }}>
        
        <button onClick={handleFormStatus} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <AddCircleOutlineIcon /> 
          <p style={{ margin: 0 }}>Add an item to track</p>
        </button> 
</div>

{formStatus && 
  <div className='tracker-form' style={{ position: 'absolute', top: '24%', display: 'flex', gap: '10px', borderStyle: 'solid', borderColor: 'salmon', padding: '10px' }}>
    <div className="search-container" ref={dropdownRef} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Search items"
        value={searchQuery}
        onChange={handleChange}
        className="form-control"
        style={{ width: '150px' }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="list-group" style={{ position: 'absolute', top: '100%', left: '0', width: '150px', zIndex: '1000' }}>
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
    <input 
      type='text'
      placeholder='Item'
      value={itemTrack}
      readOnly
      onChange={handleItemTrack}
      style={{ width: '200px' }}
    />
    <input 
      type='number'
      step='0.01'
      placeholder='Buy price (xxx.xx)'
      value={buyPrice}
      onChange={handleBuyPrice}
      style={{ width: '200px' }}
      required
    />
    <input 
      type='number'
      placeholder='Quantity'
      value={buyAmount}
      onChange={handleBuyAmount}
      style={{ width: '100px' }}
      required
    />
    <button onClick={handleFormSubmit} >Track!</button>
  </div>
}
      <div className="Tracker-list">
        
      {tracklist && tracklist.length > 0 && (
  <table className="Tracker-table" style={{ width: '80%', borderCollapse: 'collapse', position: 'absolute', top: '40%' }}>
    <thead>
      <tr>
        <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Item</th>
        <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Price bought at</th>
        <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Quantity bought</th>
        <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Average cost basis</th>
        <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Current price</th>
        <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Quantity sold</th>
        <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Unrealized P/L </th>
      </tr>
    </thead>
    <tbody>
      {tracklist.map((item) => (
        <tr key={item.id}>
          <td style={{ border: '1px solid #ccc', padding: '8px', display: 'flex', alignItems: 'center' }}>
            <Link style={{ color: '#e4daa2', textDecoration: 'underline', marginLeft: '8px' }}>
              {item.item_name}
            </Link>
          </td>
          <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>
            {Number(item.price_bought_at).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gp
          </td>
          <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>{item.quantity_bought}</td>
          <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>gp</td>
          <td style={{ color: 'green', border: '1px solid #ccc', padding: '8px' }}>gp</td>
          <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>lorum ipsum</td>
          <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>lorem ipsum</td>
        </tr>
      ))}
    </tbody>
  </table>
)}
      </div>
    </div>
  );
};

export default Tracker;
